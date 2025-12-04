import React, { useEffect, useState, useCallback } from 'react';
import type { Metric } from '../types';
import { getMetrics, createMetric, deleteMetric, updateMetric } from '../api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Plus, Save, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [numerator, setNumerator] = useState('');
    const [denominator, setDenominator] = useState('');

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
            const metricToSave = { ...currentMetric };
            if (currentMetric.metric_type === 'calculated_percentage') {
                metricToSave.value = `${numerator}/${denominator}`;
            }

            if (isEditing && metricToSave.id) {
                await updateMetric(metricToSave.id, metricToSave);
            } else {
                await createMetric(metricToSave);
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
        if (metric.metric_type === 'calculated_percentage') {
            const [num, den] = metric.value.split('/');
            setNumerator(num || '');
            setDenominator(den || '');
        } else {
            setNumerator('');
            setDenominator('');
        }
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentMetric(initialMetric);
        setNumerator('');
        setDenominator('');
        setIsEditing(false);
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-0 outline-none transition-all bg-slate-50 focus:bg-white";
    const labelClasses = "block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide";

    return (
        <div className="p-8 sm:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link to="/" className="mr-4 p-3 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 hover:text-blue-600 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900">Admin Control</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 sticky top-8 border border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    {isEditing ? <Edit2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Metric' : 'New Metric'}</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className={labelClasses}>Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentMetric.name}
                                        onChange={e => setCurrentMetric({ ...currentMetric, name: e.target.value })}
                                        className={inputClasses}
                                        placeholder="e.g. Daily Coffee"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Value</label>
                                    {currentMetric.metric_type === 'calculated_percentage' ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                required
                                                value={numerator}
                                                onChange={e => setNumerator(e.target.value)}
                                                className={inputClasses}
                                                placeholder="Num"
                                            />
                                            <span className="text-slate-400 font-bold">/</span>
                                            <input
                                                type="number"
                                                required
                                                value={denominator}
                                                onChange={e => setDenominator(e.target.value)}
                                                className={inputClasses}
                                                placeholder="Den"
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            required
                                            value={currentMetric.value}
                                            onChange={e => setCurrentMetric({ ...currentMetric, value: e.target.value })}
                                            className={inputClasses}
                                            placeholder="e.g. 42"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Type</label>
                                        <select
                                            value={currentMetric.metric_type}
                                            onChange={e => setCurrentMetric({ ...currentMetric, metric_type: e.target.value as Metric['metric_type'] })}
                                            className={inputClasses}
                                        >
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="currency">Currency</option>
                                            <option value="calculated_percentage">Calc %</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Color</label>
                                        <select
                                            value={currentMetric.color}
                                            onChange={e => setCurrentMetric({ ...currentMetric, color: e.target.value })}
                                            className={inputClasses}
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
                                </div>

                                <div>
                                    <label className={labelClasses}>Icon</label>
                                    <input
                                        type="text"
                                        value={currentMetric.icon || ''}
                                        onChange={e => setCurrentMetric({ ...currentMetric, icon: e.target.value })}
                                        className={inputClasses}
                                        placeholder="e.g. users"
                                    />
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Options: activity, users, server, cpu, database, globe, smile</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all active:scale-95"
                                    >
                                        {isEditing ? <Save className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                                        {isEditing ? 'Save' : 'Create'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex items-center justify-center px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Existing Metrics</h2>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {metrics.map((metric) => (
                                    <motion.div
                                        key={metric.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-${metric.color}-100 text-${metric.color}-600 flex items-center justify-center`}>
                                                <span className="font-bold text-lg">{metric.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{metric.name}</h4>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{metric.metric_type}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">{metric.value}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(metric)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => metric.id && handleDelete(metric.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {metrics.length === 0 && (
                                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium">No metrics yet. Create one on the left!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
