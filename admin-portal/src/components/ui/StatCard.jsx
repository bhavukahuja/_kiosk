import React from 'react';

const StatCard = ({ label, value, icon: Icon, color, bgColor, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 group transition-all hover:shadow-lg hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-12 h-12 ${bgColor} ${color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-[#002b5c]">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
