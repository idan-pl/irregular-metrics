import React, { useState } from 'react';
import type { Metric } from '../types';
import { updateMetric } from '../api';
import { Gauge } from './Gauge';
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
    Smile,
    Plus,
    Minus,
    Cake,
    Bell,
    Star,
    Zap,
    Heart,
    Coffee,
    Cloud,
    Camera,
    Music,
    Video
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

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
    smile: Smile,
    cake: Cake,
    bell: Bell,
    star: Star,
    zap: Zap,
    heart: Heart,
    coffee: Coffee,
    cloud: Cloud,
    camera: Camera,
    music: Music,
    video: Video
};

interface MetricCardProps {
    metric: Metric;
    className?: string;
    onUpdate?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, className, onUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const Icon = metric.icon && iconMap[metric.icon.toLowerCase()] ? iconMap[metric.icon.toLowerCase()] : Activity;

    const handleValueChange = async (delta: number) => {
        if (isUpdating) return;

        const currentValue = parseFloat(metric.value);
        if (isNaN(currentValue)) return;

        setIsUpdating(true);
        try {
            const newValue = (currentValue + delta).toString();
            await updateMetric(metric.id!, { ...metric, value: newValue });
            onUpdate?.();
        } catch (error) {
            console.error('Failed to update metric value', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getColorStyles = (color: string) => {
        const colors: { [key: string]: { border: string, iconBg: string, iconColor: string, shadow: string, barColor: string } } = {
            blue: {
                border: 'border-blue-200',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                shadow: 'shadow-blue-100',
                barColor: 'bg-blue-600'
            },
            green: {
                border: 'border-green-200',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                shadow: 'shadow-green-100',
                barColor: 'bg-green-600'
            },
            red: {
                border: 'border-red-200',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                shadow: 'shadow-red-100',
                barColor: 'bg-red-600'
            },
            yellow: {
                border: 'border-yellow-200',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
                shadow: 'shadow-yellow-100',
                barColor: 'bg-yellow-600'
            },
            purple: {
                border: 'border-purple-200',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
                shadow: 'shadow-purple-100',
                barColor: 'bg-purple-600'
            },
            pink: {
                border: 'border-pink-200',
                iconBg: 'bg-pink-100',
                iconColor: 'text-pink-600',
                shadow: 'shadow-pink-100',
                barColor: 'bg-pink-600'
            },
            gray: {
                border: 'border-gray-200',
                iconBg: 'bg-gray-100',
                iconColor: 'text-gray-600',
                shadow: 'shadow-gray-100',
                barColor: 'bg-gray-600'
            },
        };
        return colors[color] || colors.blue;
    };

    const styles = getColorStyles(metric.color);

    const isPercentage = metric.metric_type === 'percentage' || metric.metric_type === 'calculated_percentage';

    const parseMetricValue = (val: string): number => {
        if (!val) return 0;
        if (val.includes('/')) {
            const [num, den] = val.split('/').map(s => parseFloat(s.trim()));
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                return (num / den) * 100;
            }
        }
        return parseFloat(val) || 0;
    };

    const numericValue = parseMetricValue(metric.value);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={twMerge(clsx(
                "bg-white rounded-2xl border-2 p-6 transition-all relative overflow-hidden",
                styles.border,
                "shadow-lg hover:shadow-xl",
                styles.shadow,
                className
            ))}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/50 rounded-bl-full pointer-events-none opacity-50" />

            {isPercentage ? (
                <div className="relative z-10 w-full flex flex-col items-center pt-4">
                    <Gauge value={numericValue} color={metric.color} size={180} />
                    <div className="text-center mt-2">
                        <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase mb-1 px-2 line-clamp-2 h-10 flex items-center justify-center">
                            {metric.name}
                        </h3>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-gray-900 tracking-tight">
                                {metric.value}
                            </span>
                            <span className="text-lg font-bold text-gray-400">%</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className={clsx("p-3 rounded-xl", styles.iconBg, styles.iconColor)}>
                            <Icon className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        {/* Decorative dot */}
                        <div className={clsx("w-2 h-2 rounded-full", styles.iconBg.replace('bg-', 'bg-').replace('100', '400'))} />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase mb-1 ml-1">
                            {metric.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 tracking-tight">
                                {metric.value}
                            </span>
                            <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-full">
                                {metric.metric_type}
                            </span>
                        </div>

                        {metric.metric_type === 'number' && (
                            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3 mb-1">
                                <motion.div
                                    className={clsx("h-2.5 rounded-full", styles.barColor)}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(Math.max(numericValue, 0), 100)}%` }}
                                    transition={{ type: "spring", stiffness: 50, damping: 10 }}
                                />
                            </div>
                        )}

                        {metric.is_counter && (
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleValueChange(-1)}
                                    disabled={isUpdating}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors disabled:opacity-50"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleValueChange(1)}
                                    disabled={isUpdating}
                                    className={clsx(
                                        "p-2 rounded-lg text-white transition-colors disabled:opacity-50",
                                        styles.iconBg.replace('bg-', 'bg-').replace('100', '600'),
                                        "hover:opacity-90"
                                    )}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </motion.div>
    );
};
