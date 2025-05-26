
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Ship, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const KPICards = () => {
  const { ships, components, jobs } = useApp();

  const totalShips = ships.length;
  const activeShips = ships.filter(s => s.status === 'Active').length;
  const shipsUnderMaintenance = ships.filter(s => s.status === 'Under Maintenance').length;

  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status === 'Open').length;
  const inProgressJobs = jobs.filter(j => j.status === 'In Progress').length;
  const completedJobs = jobs.filter(j => j.status === 'Completed').length;

  // Calculate overdue maintenance
  const today = new Date();
  const threeMonthsAgo = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
  const overdueComponents = components.filter(c => 
    new Date(c.lastMaintenanceDate) < threeMonthsAgo
  ).length;

  const criticalJobs = jobs.filter(j => j.priority === 'Critical' && j.status !== 'Completed').length;

  const kpis = [
    {
      title: 'Total Ships',
      value: totalShips,
      description: `${activeShips} active, ${shipsUnderMaintenance} under maintenance`,
      icon: Ship,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Jobs',
      value: openJobs + inProgressJobs,
      description: `${openJobs} open, ${inProgressJobs} in progress`,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Overdue Maintenance',
      value: overdueComponents,
      description: 'Components requiring attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Completed Jobs',
      value: completedJobs,
      description: 'Successfully completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        );
      })}

      {criticalJobs > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Critical Jobs</CardTitle>
            <Badge variant="destructive">{criticalJobs}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{criticalJobs}</div>
            <p className="text-xs text-red-600">Require immediate attention</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KPICards;
