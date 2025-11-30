export interface Metric {
    id?: number;
    name: string;
    value: string;
    metric_type: 'text' | 'number' | 'percentage' | 'currency' | 'calculated_percentage';
    is_counter?: boolean;
    color: string;
    icon?: string;
}
