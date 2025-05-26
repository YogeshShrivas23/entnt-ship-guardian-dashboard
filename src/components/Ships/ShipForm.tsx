
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface ShipFormProps {
  ship?: any;
  onClose: () => void;
}

const ShipForm: React.FC<ShipFormProps> = ({ ship, onClose }) => {
  const { addShip, updateShip } = useApp();
  const [formData, setFormData] = useState({
    name: ship?.name || '',
    imo: ship?.imo || '',
    flag: ship?.flag || '',
    status: ship?.status || 'Active'
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }

    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    }

    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (ship) {
        updateShip(ship.id, formData);
      } else {
        addShip(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving ship:', error);
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
          <DialogTitle>{ship ? 'Edit Ship' : 'Add New Ship'}</DialogTitle>
          <DialogDescription>
            {ship ? 'Update the ship information below.' : 'Enter the details for the new ship.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ship Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter ship name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imo">IMO Number</Label>
            <Input
              id="imo"
              value={formData.imo}
              onChange={(e) => handleChange('imo', e.target.value)}
              placeholder="Enter IMO number (7 digits)"
              className={errors.imo ? 'border-red-500' : ''}
            />
            {errors.imo && <p className="text-sm text-red-500">{errors.imo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="flag">Flag</Label>
            <Input
              id="flag"
              value={formData.flag}
              onChange={(e) => handleChange('flag', e.target.value)}
              placeholder="Enter flag country"
              className={errors.flag ? 'border-red-500' : ''}
            />
            {errors.flag && <p className="text-sm text-red-500">{errors.flag}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (ship ? 'Update Ship' : 'Add Ship')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipForm;
