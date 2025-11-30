export interface Metric {
    id?: number;
    name: string;
    value: string;
    metric_type: 'text' | 'number' | 'percentage' | 'currency';
    color: string;
    icon?: string;
}
