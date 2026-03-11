import React from 'react';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: {
        value: string;
        isUp: boolean;
    };
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color, trend }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-xl shadow-sm`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${trend.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'}`}>
                        {trend.isUp ? '↑' : '↓'} {trend.value}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
                <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</p>
            </div>
        </div>
    );
};

export default KpiCard;
