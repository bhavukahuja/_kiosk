import React from 'react';
import { Mail, IdCard, BadgeCheck, User as UserIcon } from 'lucide-react';

const PageHeader = ({ user, roleLabel = "Admin", badgeColor = "bg-emerald-500" }) => {
  return (
    <header className="mb-8 bg-[#002b5c] rounded-3xl p-8 shadow-lg relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white">
            <UserIcon size={32} strokeWidth={1.5} />
          </div>
          <div className="text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className={`${badgeColor} text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full`}>
                Active
              </span>
              <div className="flex items-center gap-1 text-emerald-300">
                <BadgeCheck size={12} />
                <span className="text-[9px] font-medium uppercase tracking-wider">{roleLabel}</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {user?.name || "Administrator"}
            </h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <span>{user?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1">
                <IdCard size={12} />
                <span className="uppercase text-xs">ID: {user?.userId || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
          <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider mb-0.5">Role</p>
          <p className="text-lg font-bold text-white uppercase">{roleLabel}</p>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
