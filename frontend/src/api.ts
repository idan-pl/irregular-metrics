import axios from 'axios';
import type { Metric } from './types';

const API_URL = 'http://localhost:8000';

export const getMetrics = async (): Promise<Metric[]> => {
    const response = await axios.get(`${API_URL}/metrics/`);
    return response.data;
};

export const createMetric = async (metric: Metric): Promise<Metric> => {
    const response = await axios.post(`${API_URL}/metrics/`, metric);
    return response.data;
};

export const updateMetric = async (id: number, metric: Metric): Promise<Metric> => {
    const response = await axios.put(`${API_URL}/metrics/${id}`, metric);
    return response.data;
};

export const deleteMetric = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/metrics/${id}`);
};
