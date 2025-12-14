import React from 'react';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

interface EmailValidationIndicatorProps {
  email: string;
  position?: string;
  showDetails?: boolean;
}

const EmailValidationIndicator: React.FC<EmailValidationIndicatorProps> = ({
  email,
  position = 'general',
  showDetails = false
}) => {
  const getEmailStatus = () => {
    if (!email) return { status: 'empty', message: 'No email provided', color: 'gray' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { status: 'invalid', message: 'Invalid email format', color: 'red' };
    }
    
    return { status: 'valid', message: 'Valid email', color: 'green' };
  };
  
  const { status, message, color } = getEmailStatus();
  
  const getIcon = () => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'red':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };
  
  if (!showDetails && status === 'valid') {
    return (
      <div className="inline-flex items-center">
        {getIcon()}
      </div>
    );
  }
  
  return (
    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-md border text-xs ${getColorClasses()}`}>
      {getIcon()}
      {showDetails && <span>{message}</span>}
    </div>
  );
};

export default EmailValidationIndicator;