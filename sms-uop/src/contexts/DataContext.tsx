import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiService } from '../services/api';
import { Society, SocietyRegistration, SocietyRenewal, EventPermission, ActivityLog } from '../types';

interface DashboardStats {
  totalSocieties: number;
  activeSocieties: number;
  currentYearRegistrations: number;
}

interface DataContextType {
  societies: Society[];
  registrations: SocietyRegistration[];
  renewals: SocietyRenewal[];
  eventPermissions: EventPermission[];
  activityLogs: ActivityLog[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  addRegistration: (registration: any) => Promise<void>;
  addRenewal: (renewal: any) => Promise<void>;
  addEventPermission: (permission: any) => Promise<void>;
  updateRegistrationStatus: (id: string, status: string, rejectionReason?: string) => Promise<void>;
  updateRenewalStatus: (id: string, status: string, rejectionReason?: string) => Promise<void>;
  updateEventPermissionStatus: (id: string, status: string, rejectionReason?: string) => Promise<void>;
  addActivityLog: (action: string, target: string, userId: string, userName: string) => void;
  approveSociety: (registration: SocietyRegistration) => Promise<void>;
  approveRenewal: (renewal: SocietyRenewal) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [societies, setSocieties] = useState<Society[]>([]);
  // Admin Data
  const [registrations, setRegistrations] = useState<SocietyRegistration[]>([]);
  const [renewals, setRenewals] = useState<SocietyRenewal[]>([]);
  const [eventPermissions, setEventPermissions] = useState<EventPermission[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalSocieties: 0,
    activeSocieties: 0,
    currentYearRegistrations: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // --- 1. PUBLIC DATA (Always fetch) ---
      try {
        // Fetch ALL societies (size=1000 ensures we get the list for dropdowns)
        const societiesRes = await apiService.societies.getAll({ size: 1000 });
        setSocieties(societiesRes.data.content || []);

        const statsRes = await apiService.societies.getStatistics();
        setStats(statsRes.data);
      } catch (publicErr) {
        console.error("Failed to load public society list:", publicErr);
      }

      // --- 2. ADMIN DATA (Silent fail if not logged in) ---
      try {
        const eventsRes = await apiService.events.getAll();
        setEventPermissions(Array.isArray(eventsRes.data) ? eventsRes.data : []);

        const monitoringRes = await apiService.admin.getSSMonitoring();
        const allItems = monitoringRes.data;
        if (Array.isArray(allItems)) {
          setRegistrations(allItems.filter((i: any) => i.type === 'registration') as SocietyRegistration[]);
          setRenewals(allItems.filter((i: any) => i.type === 'renewal') as SocietyRenewal[]);
        }

        const logsRes = await apiService.admin.getActivityLogs();
        if(logsRes.data && logsRes.data.content) {
          setActivityLogs(logsRes.data.content);
        }
      } catch (adminErr) {
        // Expected behavior for students/public
      }

    } catch (err) {
      console.error("Critical Data Context Error:", err);
      // We don't set global error here to avoid blocking public pages if just one API fails
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actions
  const addRegistration = async (data: any) => { await apiService.societies.register(data); await fetchData(); };
  const addRenewal = async (data: any) => { await apiService.renewals.submit(data); await fetchData(); };
  const addEventPermission = async (data: any) => { await apiService.events.request(data); await fetchData(); };

  const updateRegistrationStatus = async (id: string, status: string, reason?: string) => {
    status.includes('reject') ? await apiService.admin.rejectRegistration(id, { reason: reason || '' })
        : await apiService.admin.approveRegistration(id, {});
    await fetchData();
  };

  const updateRenewalStatus = async (id: string, status: string, reason?: string) => {
    status.includes('reject') ? await apiService.renewals.reject(id, { reason: reason || '' })
        : await apiService.renewals.approve(id, {});
    await fetchData();
  };

  const updateEventPermissionStatus = async (id: string, status: string, reason?: string) => {
    status.includes('reject') ? await apiService.events.reject(id, { reason: reason || '' })
        : await apiService.events.approve(id, {});
    await fetchData();
  };

  const addActivityLog = () => {};
  const approveSociety = async () => { await fetchData(); };
  const approveRenewal = async () => { await fetchData(); };

  return (
      <DataContext.Provider value={{
        societies, registrations, renewals, eventPermissions, activityLogs, stats,
        loading, error,
        addRegistration, addRenewal, addEventPermission,
        updateRegistrationStatus, updateRenewalStatus, updateEventPermissionStatus,
        addActivityLog, approveSociety, approveRenewal, refreshData: fetchData
      }}>
        {children}
      </DataContext.Provider>
  );
};