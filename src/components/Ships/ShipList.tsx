
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import ShipForm from './ShipForm';

const ShipList = () => {
  const { ships, deleteShip, components, jobs } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingShip, setEditingShip] = useState(null);

  const filteredShips = ships.filter(ship => {
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship.imo.includes(searchTerm) ||
                         ship.flag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShipStats = (shipId: string) => {
    const shipComponents = components.filter(c => c.shipId === shipId);
    const shipJobs = jobs.filter(j => j.shipId === shipId);
    const activeJobs = shipJobs.filter(j => j.status === 'Open' || j.status === 'In Progress');
    
    return {
      components: shipComponents.length,
      activeJobs: activeJobs.length,
      totalJobs: shipJobs.length
    };
  };

  const handleEdit = (ship: any) => {
    setEditingShip(ship);
    setShowForm(true);
  };

  const handleDelete = (shipId: string) => {
    if (window.confirm('Are you sure you want to delete this ship? This will also delete all associated components and jobs.')) {
      deleteShip(shipId);
    }
  };

  const canModify = user?.role === 'Admin' || user?.role === 'Inspector';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ships</h1>
          <p className="text-muted-foreground">Manage your fleet of ships</p>
        </div>
        {canModify && (
          <Button onClick={() => { setEditingShip(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Ship
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search ships by name, IMO, or flag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShips.map((ship) => {
          const stats = getShipStats(ship.id);
          return (
            <Card key={ship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ship.name}</CardTitle>
                    <CardDescription>IMO: {ship.imo}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(ship.status)}>
                    {ship.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Flag:</span>
                    <span className="font-medium">{ship.flag}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Components:</span>
                    <span className="font-medium">{stats.components}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Jobs:</span>
                    <span className="font-medium">{stats.activeJobs}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/ships/${ship.id}`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {canModify && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ship)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ship.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredShips.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No ships found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <ShipForm
          ship={editingShip}
          onClose={() => {
            setShowForm(false);
            setEditingShip(null);
          }}
        />
      )}
    </div>
  );
};

export default ShipList;
