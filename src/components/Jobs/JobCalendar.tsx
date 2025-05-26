
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const JobCalendar = () => {
  const { jobs, ships, components } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getJobsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return jobs.filter(job => job.scheduledDate === dateStr);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-orange-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (day: number) => {
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Calendar</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2 h-24"></div>;
              }

              const dayJobs = getJobsForDate(day);
              const todayClass = isToday(day) ? 'bg-blue-50 border-blue-200' : '';

              return (
                <div 
                  key={day} 
                  className={`p-2 h-24 border border-gray-200 rounded-lg ${todayClass} overflow-hidden`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayJobs.slice(0, 2).map(job => {
                      const ship = ships.find(s => s.id === job.shipId);
                      const component = components.find(c => c.id === job.componentId);
                      return (
                        <div 
                          key={job.id}
                          className="text-xs p-1 rounded truncate"
                          style={{ backgroundColor: getPriorityColor(job.priority) + '20' }}
                        >
                          <div className="font-medium truncate">{ship?.name}</div>
                          <div className="text-gray-600 truncate">{component?.name}</div>
                        </div>
                      );
                    })}
                    {dayJobs.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayJobs.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Priority Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {['Low', 'Medium', 'High', 'Critical'].map(priority => (
              <div key={priority} className="flex items-center space-x-2">
                <div 
                  className={`w-4 h-4 rounded ${getPriorityColor(priority)}`}
                ></div>
                <span className="text-sm">{priority}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Jobs This Month</CardTitle>
          <CardDescription>Jobs scheduled for {monthNames[month]} {year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobs
              .filter(job => {
                const jobDate = new Date(job.scheduledDate);
                return jobDate.getMonth() === month && 
                       jobDate.getFullYear() === year &&
                       job.status !== 'Completed';
              })
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .slice(0, 5)
              .map(job => {
                const ship = ships.find(s => s.id === job.shipId);
                const component = components.find(c => c.id === job.componentId);
                return (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{job.type} - {ship?.name}</div>
                      <div className="text-sm text-gray-600">{component?.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(job.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getPriorityColor(job.priority)} text-white`}>
                        {job.priority}
                      </Badge>
                      <Badge variant="outline">
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
          {jobs.filter(job => {
            const jobDate = new Date(job.scheduledDate);
            return jobDate.getMonth() === month && 
                   jobDate.getFullYear() === year &&
                   job.status !== 'Completed';
          }).length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No upcoming jobs scheduled for this month.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCalendar;
