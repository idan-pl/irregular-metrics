import React, { useEffect, useState } from 'react';
import { Metric } from '../types';
import { getMetrics } from '../api';
import { MetricCard } from './MetricCard';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000); // Auto-refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const data = await getMetrics();
            setMetrics(data);
        } catch (error) {
            console.error("Failed to fetch metrics", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Meh-trics Dashboard</h1>
                    <Link to="/admin" className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Settings className="w-6 h-6" />
                    </Link>
                </div>
                
                {metrics.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No metrics yet. Go to Admin to add some!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metrics.map((metric) => (
                            <MetricCard key={metric.id} metric={metric} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

