
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface JobFormProps {
  job?: any;
  shipId?: string;
  onClose: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, shipId, onClose }) => {
  const { addJob, updateJob, ships, components } = useApp();
  const [formData, setFormData] = useState({
    shipId: job?.shipId || shipId || '',
    componentId: job?.componentId || '',
    type: job?.type || 'Inspection',
    priority: job?.priority || 'Medium',
    status: job?.status || 'Open',
    scheduledDate: job?.scheduledDate || '',
    description: job?.description || '',
    assignedEngineerId: job?.assignedEngineerId || '3'
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const filteredComponents = components.filter(c => c.shipId === formData.shipId);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }

    if (!formData.componentId) {
      newErrors.componentId = 'Component is required';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (job) {
        updateJob(job.id, formData);
      } else {
        addJob(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
    
    // Reset component when ship changes
    if (field === 'shipId') {
      setFormData(prev => ({ ...prev, componentId: '' }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job' : 'Create New Job'}</DialogTitle>
          <DialogDescription>
            {job ? 'Update the job information below.' : 'Enter the details for the new maintenance job.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipId">Ship</Label>
              <Select value={formData.shipId} onValueChange={(value) => handleChange('shipId', value)}>
                <SelectTrigger className={errors.shipId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select ship" />
                </SelectTrigger>
                <SelectContent>
                  {ships.map(ship => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shipId && <p className="text-sm text-red-500">{errors.shipId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="componentId">Component</Label>
              <Select 
                value={formData.componentId} 
                onValueChange={(value) => handleChange('componentId', value)}
                disabled={!formData.shipId}
              >
                <SelectTrigger className={errors.componentId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {filteredComponents.map(component => (
                    <SelectItem key={component.id} value={component.id}>
                      {component.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.componentId && <p className="text-sm text-red-500">{errors.componentId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleChange('scheduledDate', e.target.value)}
                className={errors.scheduledDate ? 'border-red-500' : ''}
              />
              {errors.scheduledDate && <p className="text-sm text-red-500">{errors.scheduledDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter job description"
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (job ? 'Update Job' : 'Create Job')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
