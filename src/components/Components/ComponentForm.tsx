
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface ComponentFormProps {
  component?: any;
  shipId: string;
  onClose: () => void;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ component, shipId, onClose }) => {
  const { addComponent, updateComponent } = useApp();
  const [formData, setFormData] = useState({
    name: component?.name || '',
    serialNumber: component?.serialNumber || '',
    installDate: component?.installDate || '',
    lastMaintenanceDate: component?.lastMaintenanceDate || ''
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.installDate) {
      newErrors.installDate = 'Installation date is required';
    }

    if (!formData.lastMaintenanceDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (component) {
        updateComponent(component.id, formData);
      } else {
        addComponent({ ...formData, shipId });
      }
      onClose();
    } catch (error) {
      console.error('Error saving component:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{component ? 'Edit Component' : 'Add New Component'}</DialogTitle>
          <DialogDescription>
            {component ? 'Update the component information below.' : 'Enter the details for the new component.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Component Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter component name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              placeholder="Enter serial number"
              className={errors.serialNumber ? 'border-red-500' : ''}
            />
            {errors.serialNumber && <p className="text-sm text-red-500">{errors.serialNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="installDate">Installation Date</Label>
            <Input
              id="installDate"
              type="date"
              value={formData.installDate}
              onChange={(e) => handleChange('installDate', e.target.value)}
              className={errors.installDate ? 'border-red-500' : ''}
            />
            {errors.installDate && <p className="text-sm text-red-500">{errors.installDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
            <Input
              id="lastMaintenanceDate"
              type="date"
              value={formData.lastMaintenanceDate}
              onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
              className={errors.lastMaintenanceDate ? 'border-red-500' : ''}
            />
            {errors.lastMaintenanceDate && <p className="text-sm text-red-500">{errors.lastMaintenanceDate}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (component ? 'Update Component' : 'Add Component')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentForm;
