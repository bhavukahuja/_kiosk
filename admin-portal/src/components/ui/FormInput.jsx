import React from 'react';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  icon: Icon, 
  value, 
  onChange, 
  placeholder,
  disabled = false,
  size = 'default' // 'default' | 'small'
}) => {
  const sizeClasses = size === 'small' 
    ? 'py-2.5 pl-9 pr-3 text-sm rounded-lg'
    : 'py-3 pl-11 pr-4 text-sm rounded-xl';
  
  const iconSize = size === 'small' ? 14 : 16;
  const iconPosition = size === 'small' ? 'left-3' : 'left-4';
  const labelPosition = size === 'small' ? 'left-2 text-[7px]' : 'left-3 text-[8px]';

  return (
    <div className="relative group">
      <label className={`absolute -top-2 ${labelPosition} bg-white px-1.5 font-bold text-slate-400 uppercase tracking-wider group-focus-within:text-[#002b5c] transition-colors z-10`}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon 
            className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002b5c] transition-colors`} 
            size={iconSize} 
          />
        )}
        <input 
          type={type}
          name={name}
          disabled={disabled}
          className={`w-full border border-slate-200 bg-slate-50/50 ${sizeClasses} font-medium text-[#002b5c] focus:outline-none focus:border-[#002b5c] focus:bg-white transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${!Icon ? 'pl-4' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default FormInput;
