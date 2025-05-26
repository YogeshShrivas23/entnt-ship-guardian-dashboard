
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Edit, Plus, Wrench, Calendar, AlertTriangle } from 'lucide-react';
import ComponentForm from '../Components/ComponentForm';
import JobForm from '../Jobs/JobForm';

const ShipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ships, components, jobs } = useApp();
  const { user } = useAuth();
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  const ship = ships.find(s => s.id === id);
  const shipComponents = components.filter(c => c.shipId === id);
  const shipJobs = jobs.filter(j => j.shipId === id);

  if (!ship) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ship not found.</p>
        <Button onClick={() => navigate('/ships')} className="mt-4">
          Back to Ships
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (lastMaintenanceDate: string) => {
    const today = new Date();
    const lastMaintenance = new Date(lastMaintenanceDate);
    const threeMonthsAgo = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
    return lastMaintenance < threeMonthsAgo;
  };

  const canModify = user?.role === 'Admin' || user?.role === 'Inspector';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/ships')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ships
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{ship.name}</h1>
            <p className="text-muted-foreground">IMO: {ship.imo}</p>
          </div>
        </div>
        <Badge className={getStatusColor(ship.status)}>
          {ship.status}
        </Badge>
      </div>

      {/* Ship Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Flag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ship.flag}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipComponents.length}</div>
            <p className="text-xs text-muted-foreground">
              {shipComponents.filter(c => isOverdue(c.lastMaintenanceDate)).length} overdue maintenance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipJobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {shipJobs.filter(j => j.priority === 'Critical' && j.status !== 'Completed').length} critical
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="components" className="space-y-4">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="jobs">Maintenance Jobs</TabsTrigger>
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Components</h2>
            {canModify && (
              <Button onClick={() => { setEditingComponent(null); setShowComponentForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shipComponents.map((component) => (
              <Card key={component.id} className={isOverdue(component.lastMaintenanceDate) ? 'border-red-200' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      <CardDescription>S/N: {component.serialNumber}</CardDescription>
                    </div>
                    {isOverdue(component.lastMaintenanceDate) && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Installed:</span>
                      <span>{new Date(component.installDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Maintenance:</span>
                      <span>{new Date(component.lastMaintenanceDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {canModify && (
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => { setEditingComponent(component); setShowComponentForm(true); }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowJobForm(true)}
                      >
                        <Wrench className="h-4 w-4 mr-1" />
                        Create Job
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {shipComponents.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No components found for this ship.</p>
                {canModify && (
                  <Button 
                    onClick={() => { setEditingComponent(null); setShowComponentForm(true); }}
                    className="mt-4"
                  >
                    Add First Component
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Maintenance Jobs</h2>
            {canModify && shipComponents.length > 0 && (
              <Button onClick={() => setShowJobForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {shipJobs.map((job) => {
              const component = components.find(c => c.id === job.componentId);
              return (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.type} - {component?.name}</CardTitle>
                        <CardDescription>{job.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                        <Badge className={getJobStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Scheduled:</span>
                      <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {shipJobs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No maintenance jobs found for this ship.</p>
                {canModify && shipComponents.length > 0 && (
                  <Button onClick={() => setShowJobForm(true)} className="mt-4">
                    Create First Job
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h2 className="text-xl font-semibold">Maintenance History</h2>
          <div className="space-y-4">
            {shipJobs
              .filter(job => job.status === 'Completed')
              .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
              .map((job) => {
                const component = components.find(c => c.id === job.componentId);
                return (
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{job.type} - {component?.name}</CardTitle>
                      <CardDescription>{job.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completed:</span>
                        <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {shipJobs.filter(job => job.status === 'Completed').length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No completed maintenance jobs found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {showComponentForm && (
        <ComponentForm
          component={editingComponent}
          shipId={ship.id}
          onClose={() => {
            setShowComponentForm(false);
            setEditingComponent(null);
          }}
        />
      )}

      {showJobForm && (
        <JobForm
          shipId={ship.id}
          onClose={() => setShowJobForm(false)}
        />
      )}
    </div>
  );
};

export default ShipDetail;
