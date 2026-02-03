import axios from 'axios';
import type { Metric } from './types';

export const getMetrics = async (): Promise<Metric[]> => {
    const response = await axios.get('/metrics/');
    return response.data;
};

export const createMetric = async (metric: Metric): Promise<Metric> => {
    const response = await axios.post('/metrics/', metric);
    return response.data;
};

export const updateMetric = async (id: number, metric: Metric): Promise<Metric> => {
    const response = await axios.put(`/metrics/${id}`, metric);
    return response.data;
};

export const deleteMetric = async (id: number): Promise<void> => {
    await axios.delete(`/metrics/${id}`);
};
