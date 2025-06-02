import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

// Constants
const COLORS = ["#FF4D4D", "#4CAF50", "#2196F3", "#9C27B0"];
const MAX_LABEL_LENGTH = 8;

interface ChartStats {
  locations?: {
    data: Array<{ location: string; count: number }>;
  };
  categories?: {
    data: Array<{ category: string; count: number }>;
  };
  conditions?: {
    data: Array<{ condition: string; count: number }>;
  };
}

// Define the chart data type
interface ChartDataItem {
  name: string;
  value: number;
}

interface ChartData {
  locations: ChartDataItem[];
  categories: ChartDataItem[];
  conditions: ChartDataItem[];
}

export default function DashboardCharts({ stats }: { stats: ChartStats | null }) {
  const [chartData, setChartData] = useState<ChartData>({
    locations: [],
    categories: [],
    conditions: []
  });

  // Process all chart data in a single useEffect
  useEffect(() => {
    if (stats) {
      // Process location data
      if (stats.locations?.data) {
        const locationData = stats.locations.data.map(loc => ({
          name: loc.location,
          value: loc.count
        }));
        setChartData(prev => ({ ...prev, locations: locationData }));
      }
      
      // Process category data
      if (stats.categories?.data) {
        const categoryData = stats.categories.data.map(cat => ({
          name: cat.category,
          value: cat.count
        }));
        setChartData(prev => ({ ...prev, categories: categoryData }));
      }
      
      // Process condition data
      if (stats.conditions?.data) {
        const conditionData = stats.conditions.data.map(cond => ({
          name: cond.condition,
          value: cond.count
        }));
        setChartData(prev => ({ ...prev, conditions: conditionData }));
      }
    }
  }, [stats]);

  // Helper functions
  const renderBarLabel = ({ x, y, width, value }: { x: number; y: number; width: number; value: number }) => (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#333"
      textAnchor="middle"
      fontSize={12}
      fontWeight="bold"
    >
      {value}
    </text>
  );

  const shortenLabel = (label: string) => {
    return label.length > MAX_LABEL_LENGTH 
      ? `${label.slice(0, MAX_LABEL_LENGTH)}...` 
      : label;
  };

  // Common chart configurations
  const barChartConfig = {
    fill: "#ada5e9",
    label: renderBarLabel
  };

  const xAxisConfig = {
    interval: 0,
    angle: -45,
    textAnchor: "end",
    height: 100,
    tickFormatter: shortenLabel
  };

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Asset by Locations (Full Width) */}
      <div className="bg-white p-4 rounded-lg border border-gray-300 md:col-span-2">
        <h2 className="text-xl font-bold mb-6">Asset by Locations</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData.locations}>
            <Bar dataKey="value" {...barChartConfig} />
            <XAxis dataKey="name" {...xAxisConfig} />
            <YAxis />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Asset by Category */}
      <div className="bg-white p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-6">Asset by Category</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData.categories}>
            <Bar dataKey="value" {...barChartConfig} />
            <XAxis dataKey="name" {...xAxisConfig} />
            <YAxis />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Asset by Condition */}
      <div className="bg-white p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-6">Asset by Condition</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData.conditions}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.conditions.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}