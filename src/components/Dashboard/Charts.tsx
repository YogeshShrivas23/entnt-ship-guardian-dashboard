
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Charts = () => {
  const { ships, jobs } = useApp();

  // Ship status distribution
  const shipStatusData = [
    {
      name: 'Active',
      value: ships.filter(s => s.status === 'Active').length,
      color: '#22c55e'
    },
    {
      name: 'Under Maintenance',
      value: ships.filter(s => s.status === 'Under Maintenance').length,
      color: '#f59e0b'
    },
    {
      name: 'Inactive',
      value: ships.filter(s => s.status === 'Inactive').length,
      color: '#ef4444'
    }
  ];

  // Job priority distribution
  const jobPriorityData = [
    {
      name: 'Low',
      value: jobs.filter(j => j.priority === 'Low').length,
      color: '#22c55e'
    },
    {
      name: 'Medium',
      value: jobs.filter(j => j.priority === 'Medium').length,
      color: '#f59e0b'
    },
    {
      name: 'High',
      value: jobs.filter(j => j.priority === 'High').length,
      color: '#ef4444'
    },
    {
      name: 'Critical',
      value: jobs.filter(j => j.priority === 'Critical').length,
      color: '#dc2626'
    }
  ];

  // Job status over time (mock data for trend)
  const jobTrendData = [
    { month: 'Jan', completed: 12, open: 8 },
    { month: 'Feb', completed: 15, open: 6 },
    { month: 'Mar', completed: 10, open: 12 },
    { month: 'Apr', completed: 18, open: 9 },
    { month: 'May', completed: jobs.filter(j => j.status === 'Completed').length, open: jobs.filter(j => j.status === 'Open').length }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ship Status Distribution</CardTitle>
          <CardDescription>Current status of all ships in the fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={shipStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {shipStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Priority Distribution</CardTitle>
          <CardDescription>Distribution of maintenance jobs by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPriorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Job Completion Trend</CardTitle>
          <CardDescription>Monthly trend of completed vs open jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={jobTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={2} name="Open" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
