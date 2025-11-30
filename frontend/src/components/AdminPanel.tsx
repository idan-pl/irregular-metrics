import React, { useEffect, useState, useCallback } from 'react';
import type { Metric } from '../types';
import { getMetrics, createMetric, deleteMetric, updateMetric } from '../api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Plus, Save, X } from 'lucide-react';

const initialMetric: Metric = {
    name: '',
    value: '',
    metric_type: 'text',
    color: 'blue',
    icon: 'activity'
};

export const AdminPanel: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [currentMetric, setCurrentMetric] = useState<Metric>(initialMetric);
    const [isEditing, setIsEditing] = useState(false);

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
    }, [fetchMetrics]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentMetric.id) {
                await updateMetric(currentMetric.id, currentMetric);
            } else {
                await createMetric(currentMetric);
            }
            fetchMetrics();
            resetForm();
        } catch (error) {
            console.error("Failed to save metric", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this metric?')) {
            try {
                await deleteMetric(id);
                fetchMetrics();
            } catch (error) {
                console.error("Failed to delete metric", error);
            }
        }
    };

    const handleEdit = (metric: Metric) => {
        setCurrentMetric(metric);
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentMetric(initialMetric);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Control</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Metric' : 'Add New Metric'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentMetric.name}
                                    onChange={e => setCurrentMetric({ ...currentMetric, name: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Daily Coffee"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input
                                    type="text"
                                    required
                                    value={currentMetric.value}
                                    onChange={e => setCurrentMetric({ ...currentMetric, value: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. 42"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={currentMetric.metric_type}
                                    onChange={e => setCurrentMetric({ ...currentMetric, metric_type: e.target.value as Metric['metric_type'] })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="currency">Currency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <select
                                    value={currentMetric.color}
                                    onChange={e => setCurrentMetric({ ...currentMetric, color: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="blue">Blue</option>
                                    <option value="green">Green</option>
                                    <option value="red">Red</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="purple">Purple</option>
                                    <option value="pink">Pink</option>
                                    <option value="gray">Gray</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide name)</label>
                                <input
                                    type="text"
                                    value={currentMetric.icon || ''}
                                    onChange={e => setCurrentMetric({ ...currentMetric, icon: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. users, server, cpu"
                                />
                                <p className="text-xs text-gray-500 mt-1">Try: activity, users, server, cpu, database, globe, smile</p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                {isEditing ? 'Update Metric' : 'Add Metric'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Existing Metrics</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {metrics.map((metric) => (
                            <div key={metric.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full bg-${metric.color}-500`} />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{metric.name}</h4>
                                        <p className="text-sm text-gray-500">{metric.value} ({metric.metric_type})</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(metric)}
                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => metric.id && handleDelete(metric.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {metrics.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No metrics found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
