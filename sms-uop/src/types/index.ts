export interface User {
  id: string;
  name: string;
  email: string;
  role: 'dean' | 'assistant_registrar' | 'vice_chancellor' | 'premises_officer' | 'student_service' | 'test_user';
  faculty?: string;
}

export interface Society {
  id: string;
  societyName: string;
  registeredDate: string;
  status: 'active' | 'pending' | 'inactive';
  seniorTreasurer: ContactInfo;
  juniorTreasurer: ContactInfo;
  president: ContactInfo;
  secretary: ContactInfo;
  editor: ContactInfo;
  jointSecretary: ContactInfo;
  vicePresident: ContactInfo;
  website?: string;
  year: number;
}

export interface ContactInfo {
  regNo?: string;
  name: string;
  address?: string;
  email: string;
  mobile: string;
  designation?: string;
  department?: string;
  title?: string;
}

export interface AdvisoryBoardMember {
  name: string;
  designation: string;
  department: string;
}

export interface CommitteeMember {
  regNo: string;
  name: string;
}

export interface Member {
  regNo: string;
  name: string;
}

export interface PlanningEvent {
  month: string;
  activity: string;
}

export interface SocietyRegistration {
  id: string;
  applicantFullName: string;
  applicantRegNo: string;
  applicantEmail: string;
  applicantFaculty: string;
  applicantMobile: string;
  societyName: string;
  aims: string;
  seniorTreasurer: ContactInfo;
  advisoryBoard: AdvisoryBoardMember[];
  bankAccount?: string;
  bankName?: string;
  president: ContactInfo;
  vicePresident: ContactInfo;
  juniorTreasurer: ContactInfo;
  secretary: ContactInfo;
  jointSecretary: ContactInfo;
  editor: ContactInfo;
  committeeMember: CommitteeMember[];
  agmDate: string;
  member: Member[];
  planningEvents: PlanningEvent[];
  status: 'pending_dean' | 'pending_ar' | 'pending_vc' | 'approved' | 'rejected';
  isDeanApproved: boolean;
  isARApproved: boolean;
  isVCApproved: boolean;
  deanComment?: string;
  arComment?: string;
  vcComment?: string;
  deanApprovalDate?: string;
  arApprovalDate?: string;
  vcApprovalDate?: string;
  approvedDate?: string;
  submittedDate: string;
  year: number;
  rejectionReason?: string;
}

export interface SocietyRenewal extends SocietyRegistration {
  previousActivities: PlanningEvent[];
  difficulties: string;
  website?: string;
}

export interface EventPermission {
  id: string;
  societyName: string;
  applicantName: string;
  applicantRegNo: string;
  applicantEmail: string;
  applicantPosition: string;
  applicantMobile: string;
  applicantFaculty: string;
  eventName: string;
  eventDate: string;
  timeFrom: string;
  timeTo: string;
  place: string;
  isInsideUniversity: boolean;
  latePassRequired: boolean;
  outsidersInvited: boolean;
  outsidersList?: string;
  firstYearParticipation: boolean;
  budgetEstimate: string;
  fundCollectionMethods: string;
  studentFeeAmount?: string;
  seniorTreasurerName: string;
  seniorTreasurerDepartment: string;
  seniorTreasurerMobile: string;
  premisesOfficerName: string;
  premisesOfficerDesignation: string;
  premisesOfficerDivision: string;
  receiptNumber?: string;
  paymentDate?: string;
  status: 'pending_dean' | 'pending_premises' | 'pending_ar' | 'pending_vc' | 'approved' | 'rejected';
  isDeanApproved: boolean;
  isPremisesApproved: boolean;
  isARApproved: boolean;
  isVCApproved: boolean;
  deanComment?: string;
  premisesComment?: string;
  arComment?: string;
  vcComment?: string;
  submittedDate: string;
  rejectionReason?: string;
}

export const FACULTIES = [
  'Faculty of Medicine',
  'Faculty of Engineering',
  'Faculty of Agriculture',
  'Faculty of Science',
  'Faculty of Arts',
  'Faculty of Management',
  'Faculty of Veterinary Medicine & Animal Science',
  'Faculty of Dental Sciences',
  'Faculty of Allied Health Sciences'
];

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  action: string;
  target: string;
  timestamp: string;
}