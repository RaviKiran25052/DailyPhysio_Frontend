import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AnalyticsCharts = ({ chartData }) => {
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  const DARK_THEME = {
    backgroundColor: '#1f2937',
    textColor: '#e5e7eb',
    gridColor: '#374151',
    tooltipBackground: '#374151',
    tooltipText: '#e5e7eb'
  };

  // Custom tooltip component to ensure dark background
  const CustomTooltip = ({ active, payload, label, ...props }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 shadow-md rounded">
          <p className="text-gray-300 font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-lg font-medium text-gray-300 mb-4">User Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.userGrowth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={DARK_THEME.gridColor} />
                <XAxis dataKey="month" stroke={DARK_THEME.textColor} />
                <YAxis stroke={DARK_THEME.textColor} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: DARK_THEME.textColor }} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8, fill: '#8884d8', stroke: '#8884d8' }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Exercise Usage Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Exercise Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.exerciseUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.exerciseUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: DARK_THEME.textColor }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* User Activity Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Weekly User Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.userActivity}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={DARK_THEME.gridColor} />
                <XAxis dataKey="day" stroke={DARK_THEME.textColor} />
                <YAxis stroke={DARK_THEME.textColor} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: DARK_THEME.textColor }} />
                <Bar 
                  dataKey="sessions" 
                  fill="#8884d8" 
                  activeBar={{ fill: '#9061f9' }} // Darker purple for active state
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
