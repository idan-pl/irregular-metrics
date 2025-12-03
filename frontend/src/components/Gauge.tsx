import React from 'react';
import GaugeComponent from 'react-gauge-component';

interface GaugeProps {
    value: number;
    color: string;
    size?: number;
}

const colorMap: { [key: string]: string } = {
    blue: '#2563EB',   // blue-600
    green: '#16A34A',  // green-600
    red: '#DC2626',    // red-600
    yellow: '#CA8A04', // yellow-600
    purple: '#9333EA', // purple-600
    pink: '#DB2777',   // pink-600
    gray: '#4B5563',   // gray-600
};

export const Gauge: React.FC<GaugeProps> = ({ value, color, size = 200 }) => {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);
    const targetColor = colorMap[color] || colorMap.blue;

    return (
        <div style={{ width: size, height: size / 1.5, margin: '0 auto' }}>
            <GaugeComponent
                value={clampedValue}
                type="semicircle"
                arc={{
                    padding: 0.02,
                    subArcs: [
                        { limit: clampedValue, color: targetColor, showTick: false },
                        { limit: 100, color: '#E5E7EB', showTick: false }
                    ],
                    width: 0.15
                }}
                pointer={{
                    type: "needle",
                    elastic: true,
                    animationDelay: 0,
                    color: "#1F2937",
                    width: 15,
                }}
                labels={{
                    valueLabel: { hide: true },
                    tickLabels: { hideMinMax: true }
                }}
            />
        </div>
    );
};
