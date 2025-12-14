import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  options?: string[];
  placeholder?: string;
  error?: string;
  rows?: number;
  as?: 'input' | 'select' | 'textarea';
  validate?: (value: string) => string | undefined;
  showValidation?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
                                               label,
                                               name,
                                               type = 'text',
                                               required = false,
                                               value,
                                               onChange,
                                               options,
                                               placeholder,
                                               error,
                                               rows = 3,
                                               as = 'input',
                                               validate,
                                               showValidation = true
                                             }) => {
  const [validationError, setValidationError] = React.useState<string | undefined>();
  const [touched, setTouched] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(e);

    if (validate && e.target.value && showValidation) {
      const validationResult = validate(e.target.value);
      setValidationError(validationResult);
    } else {
      setValidationError(undefined);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validate && value && showValidation) {
      const validationResult = validate(value.toString());
      setValidationError(validationResult);
    }
  };

  const displayError = error || (touched && validationError);
  const baseClasses = `mt-1 block w-full rounded-lg border ${
      displayError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  } shadow-sm focus:ring-2 focus:ring-opacity-50 px-3 py-2`;

  return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {as === 'select' && options ? (
            <select
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
                className={baseClasses}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
              ))}
            </select>
        ) : as === 'textarea' ? (
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
                rows={rows}
                placeholder={placeholder}
                className={`${baseClasses} resize-none`}
            />
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
                placeholder={placeholder}
                className={baseClasses}
            />
        )}

        {displayError && (
            <div className="mt-1 flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{displayError}</p>
            </div>
        )}
      </div>
  );
};

export default FormField;