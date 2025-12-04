import React, { useEffect, useState, useCallback } from 'react';
import type { Metric } from '../types';
import { getMetrics } from '../api';
import { MetricCard } from './MetricCard';
import { Link } from 'react-router-dom';
import { Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);

    const fetchMetrics = useCallback(async () => {
        try {
            const data = await getMetrics();
            setMetrics(data);
        } catch (error) {
            console.error("Failed to fetch metrics", error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000); // Auto-refresh every 5s
        return () => clearInterval(interval);
    }, [fetchMetrics]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="p-8 sm:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm mb-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Live Overview</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"
                        >
                            Irregular Metrics <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dashboard</span>
                        </motion.h1>
                    </div>

                    <Link to="/admin">
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 90 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-white rounded-full shadow-md text-slate-600 hover:text-blue-600 hover:shadow-lg transition-all"
                        >
                            <Settings className="w-6 h-6" />
                        </motion.button>
                    </Link>
                </div>

                {metrics.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200"
                    >
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No metrics yet</h3>
                        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                            Your dashboard is looking a bit empty. Head over to the admin panel to create your first metric!
                        </p>
                        <Link
                            to="/admin"
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-1"
                        >
                            Create Metric
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {metrics.map((metric) => (
                            <MetricCard
                                key={metric.id}
                                metric={metric}
                                onUpdate={fetchMetrics}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
