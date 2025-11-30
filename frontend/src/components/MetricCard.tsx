import React from 'react';
import type { Metric } from '../types';
import {
    Activity,
    DollarSign,
    Percent,
    TrendingUp,
    Users,
    Server,
    Cpu,
    Database,
    Globe,
    Clock,
    Smile
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const iconMap: { [key: string]: React.ElementType } = {
    activity: Activity,
    currency: DollarSign,
    percent: Percent,
    trending: TrendingUp,
    users: Users,
    server: Server,
    cpu: Cpu,
    database: Database,
    globe: Globe,
    clock: Clock,
    smile: Smile
};

interface MetricCardProps {
    metric: Metric;
    className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, className }) => {
    const Icon = metric.icon && iconMap[metric.icon.toLowerCase()] ? iconMap[metric.icon.toLowerCase()] : Activity;

    const getColorClass = (color: string) => {
        const colors: { [key: string]: string } = {
            blue: 'bg-blue-100 text-blue-800 border-blue-200',
            green: 'bg-green-100 text-green-800 border-green-200',
            red: 'bg-red-100 text-red-800 border-red-200',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            purple: 'bg-purple-100 text-purple-800 border-purple-200',
            pink: 'bg-pink-100 text-pink-800 border-pink-200',
            gray: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className={twMerge(clsx(
            "rounded-xl border p-6 shadow-sm transition-all hover:shadow-md",
            getColorClass(metric.color),
            className
        ))}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium opacity-80">{metric.name}</h3>
                <Icon className="w-5 h-5 opacity-60" />
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{metric.value}</span>
                <span className="text-sm opacity-60 font-medium uppercase">{metric.metric_type}</span>
            </div>
        </div>
    );
};
