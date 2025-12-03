import React from 'react';
import { motion } from 'framer-motion';

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

    // Calculate rotation: -90deg is 0%, 90deg is 100%
    const rotation = (clampedValue / 100) * 180 - 90;

    const strokeColor = colorMap[color] || colorMap.blue;

    // SVG dimensions
    const strokeWidth = 20;
    const radius = 80;
    const center = 100;

    // Calculate arc path for the colored progress
    // We want the arc to go from left (180 degrees) to right (0 degrees) in SVG coordinates
    // But for a gauge, we usually want bottom-left to bottom-right.
    // Let's use a simple approach: a background arc and a foreground arc that is masked or dash-arrayed.

    // Using dasharray for the progress arc
    // Circumference of the semi-circle = PI * radius
    const circumference = Math.PI * radius;
    const dashOffset = circumference - (clampedValue / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size / 2 + 20 }}>
            <svg
                width={size}
                height={size / 2}
                viewBox={`0 0 200 100`}
                className="overflow-visible"
            >
                {/* Background Track */}
                <path
                    d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
                    fill="none"
                    stroke="#E5E7EB" // gray-200
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Progress Arc */}
                <motion.path
                    d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Needle */}
                <motion.g
                    initial={{ rotate: -90 }}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    style={{
                        originX: 0.5, // percentage of element width
                        originY: 1,   // bottom of the element? No, this applies to the group bounding box which is tricky.
                        // Let's try explicit transform origin in pixels relative to SVG
                        transformBox: "fill-box",
                        transformOrigin: "50% 100%" // Relative to the group bounding box?
                    }}
                >
                    {/*
                       Instead of rotating the group which has dynamic bounding box based on children,
                       let's put the center at 0,0 of the group and translate it to center.
                    */}
                </motion.g>
                {/* Alternative Needle Implementation: Standard Rotation Group */}
                <g transform={`translate(${center}, ${center})`}>
                     <motion.g
                        initial={{ rotate: -90 }}
                        animate={{ rotate: rotation }}
                        transition={{ type: "spring", stiffness: 50, damping: 10 }}
                     >
                        <line
                            x1={0}
                            y1={0}
                            x2={0}
                            y2={-(radius - 10)}
                            stroke="#1F2937"
                            strokeWidth={4}
                            strokeLinecap="round"
                        />
                        <circle cx={0} cy={0} r={6} fill="#1F2937" />
                     </motion.g>
                </g>
            </svg>

            {/* Value Text inside/below */}
            <div className="absolute bottom-0 transform translate-y-1/2 flex flex-col items-center">
               {/* Value is rendered by parent usually, but we can keep it clean here */}
            </div>
        </div>
    );
};
