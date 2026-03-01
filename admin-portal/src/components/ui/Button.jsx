import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'default', // 'small' | 'default' | 'large'
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  fullWidth = false,
}) => {
  const baseClasses =
    'font-medium transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800:bg-slate-100 shadow-sm',
    secondary:
      'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50:bg-slate-700 shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100:bg-slate-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs rounded-md',
    default: 'px-4 py-2 text-sm rounded-lg',
    large: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <Loader2
          className="animate-spin"
          size={size === 'small' ? 14 : size === 'large' ? 20 : 16}
        />
      ) : (
        <>
          {Icon && <Icon size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
