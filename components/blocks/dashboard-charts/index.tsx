import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

const trafficData = [
  { name: "Cat A", visitors: 400 },
  { name: "Cat B", visitors: 700 },
  { name: "Cat C", visitors: 550 },
  { name: "Cat D", visitors: 900 },
  { name: "Cat E", visitors: 600 },
  { name: "Cat F", visitors: 800 },
  { name: "Cat G", visitors: 450 },
  { name: "Cat H", visitors: 650 },
  { name: "Cat I", visitors: 750 },
  { name: "Cat J", visitors: 500 },
  { name: "Cat K", visitors: 850 },
  { name: "Cat L", visitors: 950 },
  { name: "Cat M", visitors: 700 },
  { name: "Cat N", visitors: 600 },
  { name: "Cat O", visitors: 800 },
  { name: "Cat P", visitors: 750 },
  { name: "Cat Q", visitors: 900 },
  { name: "Cat R", visitors: 650 },
];

const salesData = [
  { name: "Product A", sales: 2400 },
  { name: "Product B", sales: 1398 },
  { name: "Product C", sales: 9800 },
  { name: "Product D", sales: 3908 },
];

const userTypeData = [
  { name: "Good", value: 300 },
  { name: "Fair", value: 50 },
  { name: "Broken", value: 500 },
  { name: "N/A", value: 200 },
];

const COLORS = ["#FF4D4D", "#4CAF50", "#2196F3", "#9C27B0"];

export default function DashboardCharts({ stats }: { stats: any }) {
  const [assetByLocationSData, setAssetByLocationSData] = useState<
    { name: string; value: number }[]
  >([]);

  const [assetByCategory, setAssetByCategory] = useState<
  { name: string; value: number }[]
>([]);

const [assetByCondition, setAssetByCondition] = useState<
{ name: string; value: number }[]
>([]);

  useEffect(() => {
    if (stats?.locations?.data) {
      console.log(stats?.locations?.data);
      const mappedData = stats.locations.data.map((loc: any) => ({
        name: loc.location,
        value: loc.count,
      }));

      setAssetByLocationSData(mappedData);
    }
  }, [stats]);

  useEffect(() => {
    if (stats?.categories?.data) {
      console.log(stats?.categories?.data);
      const mappedData = stats.categories.data.map((dta: any) => ({
        name: dta.category,
        value: dta.count,
      }));

      setAssetByCategory(mappedData);
    }
  }, [stats]);

  useEffect(() => {
    if (stats?.conditions?.data) {
      console.log(stats?.conditions?.data);
      const mappedData = stats.conditions.data.map((dta: any) => ({
        name: dta.condition,
        value: dta.count,
      }));

      setAssetByCondition(mappedData);
    }
  }, [stats]);

  console.log(assetByLocationSData);

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5} // geser dikit ke atas
        fill="#333" // warna teks
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  const shortenLabel = (label: string, maxLength: number = 8) => {
    return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
  };

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Line Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-md md:col-span-2">
        <h2 className="text-xl font-bold mb-6">Asset by Locations</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={assetByLocationSData}>
            <Bar dataKey="value" fill="#ada5e9" label={renderCustomBarLabel} />

            {/* <CartesianGrid stroke="#ccc" /> */}
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              tickFormatter={(value) => shortenLabel(value)}
            />

            <YAxis />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-6">Asset by Location</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart width={400} height={250} data={assetByCategory}>
          <Bar dataKey="value" fill="#ada5e9" label={renderCustomBarLabel} />
            {/* <CartesianGrid stroke="#ccc" /> */}
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              tickFormatter={(value) => shortenLabel(value)}
            />
            <YAxis />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-md col-span-1 ">
        <h2 className="text-xl font-bold mb-6">Asset by Condition</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart width={400} height={250}>
            <Pie
              data={assetByCondition}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {userTypeData.map((entry, index) => (
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
