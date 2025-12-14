// Email validation utilities for society management system

export const validateEmail = (email: string): string | undefined => {
  if (!email) return undefined;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return undefined;
};

export const validateStudentEmail = (email: string): string | undefined => {
  if (!email) return undefined;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return undefined;
};

export const validateStaffEmail = (email: string): string | undefined => {
  if (!email) return undefined;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return undefined;
};

export const validateMobile = (mobile: string): string | undefined => {
  if (!mobile) return undefined;
  
  // Sri Lankan mobile number validation
  const mobileRegex = /^(\+94|0)?[7][0-9]{8}$/;
  
  if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
    return 'Please enter a valid Sri Lankan mobile number (e.g., 0771234567)';
  }
  
  return undefined;
};

export const validateRegistrationNumber = (regNo: string): string | undefined => {
  if (!regNo) return undefined;
  
  // Registration number must contain both letters and numbers
  const hasLetters = /[a-zA-Z]/.test(regNo);
  const hasNumbers = /[0-9]/.test(regNo);
  
  if (!hasLetters || !hasNumbers) {
    return 'Registration number must contain both letters and numbers';
  }
  
  return undefined;
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return undefined;
};

export const validateDate = (date: string, fieldName: string): string | undefined => {
  if (!date) return `${fieldName} is required`;
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  if (selectedDate > today) {
    return `${fieldName} cannot be in the future`;
  }
  
  // Check if date is too old (more than 10 years ago)
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  
  if (selectedDate < tenYearsAgo) {
    return `${fieldName} seems too old. Please verify the date`;
  }
  
  return undefined;
};

export const validateFutureDate = (date: string, fieldName: string): string | undefined => {
  if (!date) return `${fieldName} is required`;
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for date comparison
  
  if (selectedDate < today) {
    return `${fieldName} must be today or in the future`;
  }
  
  return undefined;
};

// Comprehensive validation for society officials
export const validateOfficialData = (official: any, position: string): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  if (!official.name || official.name.trim() === '') {
    errors.name = `${position} name is required`;
  }
  
  if (!official.regNo || official.regNo.trim() === '') {
    errors.regNo = `${position} registration number is required`;
  } else {
    const regNoError = validateRegistrationNumber(official.regNo);
    if (regNoError) errors.regNo = regNoError;
  }
  
  if (!official.email || official.email.trim() === '') {
    errors.email = `${position} email is required`;
  } else {
    const emailError = validateStudentEmail(official.email);
    if (emailError) errors.email = emailError;
  }
  
  if (!official.mobile || official.mobile.trim() === '') {
    errors.mobile = `${position} mobile number is required`;
  } else {
    const mobileError = validateMobile(official.mobile);
    if (mobileError) errors.mobile = mobileError;
  }
  
  if (!official.address || official.address.trim() === '') {
    errors.address = `${position} address is required`;
  }
  
  return errors;
};

// Validation for senior treasurer (staff position)
export const validateSeniorTreasurerData = (treasurer: any): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  if (!treasurer.name || treasurer.name.trim() === '') {
    errors.name = 'Senior treasurer name is required';
  }
  
  if (!treasurer.title || treasurer.title.trim() === '') {
    errors.title = 'Senior treasurer title is required';
  }
  
  if (!treasurer.designation || treasurer.designation.trim() === '') {
    errors.designation = 'Senior treasurer designation is required';
  }
  
  if (!treasurer.department || treasurer.department.trim() === '') {
    errors.department = 'Senior treasurer department is required';
  }
  
  if (!treasurer.email || treasurer.email.trim() === '') {
    errors.email = 'Senior treasurer email is required';
  } else {
    const emailError = validateStaffEmail(treasurer.email);
    if (emailError) errors.email = emailError;
  }
  
  if (!treasurer.mobile || treasurer.mobile.trim() === '') {
    errors.mobile = 'Senior treasurer mobile number is required';
  } else {
    const mobileError = validateMobile(treasurer.mobile);
    if (mobileError) errors.mobile = mobileError;
  }
  
  if (!treasurer.address || treasurer.address.trim() === '') {
    errors.address = 'Senior treasurer address is required';
  }
  
  return errors;
};