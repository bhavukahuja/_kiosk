import React from 'react';

const Card = ({ children, className = '', header, headerIcon: HeaderIcon, headerTitle, headerSubtitle, headerAction }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      {(header || headerTitle) && (
        <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {HeaderIcon && (
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <HeaderIcon size={20} />
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-[#002b5c]">{headerTitle}</h2>
              {headerSubtitle && <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{headerSubtitle}</p>}
            </div>
          </div>
          {headerAction}
        </header>
      )}
      {children}
    </div>
  );
};

export default Card;
