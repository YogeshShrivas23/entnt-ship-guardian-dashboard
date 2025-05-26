
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
}

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
}

export interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Preventive';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  description?: string;
  createdDate: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  dismissed: boolean;
}

interface AppContextType {
  ships: Ship[];
  components: Component[];
  jobs: Job[];
  notifications: Notification[];
  addShip: (ship: Omit<Ship, 'id'>) => void;
  updateShip: (id: string, ship: Partial<Ship>) => void;
  deleteShip: (id: string) => void;
  addComponent: (component: Omit<Component, 'id'>) => void;
  updateComponent: (id: string, component: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  addJob: (job: Omit<Job, 'id' | 'createdDate'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'dismissed'>) => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock data
const initialShips: Ship[] = [
  { id: 's1', name: 'Ever Given', imo: '9811000', flag: 'Panama', status: 'Active' },
  { id: 's2', name: 'Maersk Alabama', imo: '9164263', flag: 'USA', status: 'Under Maintenance' },
  { id: 's3', name: 'MSC Oscar', imo: '9684750', flag: 'Panama', status: 'Active' }
];

const initialComponents: Component[] = [
  { id: 'c1', shipId: 's1', name: 'Main Engine', serialNumber: 'ME-1234', installDate: '2020-01-10', lastMaintenanceDate: '2024-03-12' },
  { id: 'c2', shipId: 's2', name: 'Radar', serialNumber: 'RAD-5678', installDate: '2021-07-18', lastMaintenanceDate: '2023-12-01' },
  { id: 'c3', shipId: 's1', name: 'Navigation System', serialNumber: 'NAV-9012', installDate: '2020-01-10', lastMaintenanceDate: '2024-01-15' },
  { id: 'c4', shipId: 's3', name: 'Propeller', serialNumber: 'PROP-3456', installDate: '2019-06-20', lastMaintenanceDate: '2023-11-10' }
];

const initialJobs: Job[] = [
  { 
    id: 'j1', 
    componentId: 'c1', 
    shipId: 's1', 
    type: 'Inspection', 
    priority: 'High', 
    status: 'Open', 
    assignedEngineerId: '3', 
    scheduledDate: '2025-06-05',
    description: 'Regular inspection of main engine',
    createdDate: '2025-05-20'
  },
  { 
    id: 'j2', 
    componentId: 'c2', 
    shipId: 's2', 
    type: 'Repair', 
    priority: 'Critical', 
    status: 'In Progress', 
    assignedEngineerId: '3', 
    scheduledDate: '2025-05-28',
    description: 'Radar malfunction repair',
    createdDate: '2025-05-15'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedShips = localStorage.getItem('ships');
    const storedComponents = localStorage.getItem('components');
    const storedJobs = localStorage.getItem('jobs');
    const storedNotifications = localStorage.getItem('notifications');

    setShips(storedShips ? JSON.parse(storedShips) : initialShips);
    setComponents(storedComponents ? JSON.parse(storedComponents) : initialComponents);
    setJobs(storedJobs ? JSON.parse(storedJobs) : initialJobs);
    setNotifications(storedNotifications ? JSON.parse(storedNotifications) : []);
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addShip = (ship: Omit<Ship, 'id'>) => {
    const newShip = { ...ship, id: generateId() };
    const updatedShips = [...ships, newShip];
    setShips(updatedShips);
    saveToStorage('ships', updatedShips);
    addNotification({ message: `Ship "${ship.name}" has been added`, type: 'success' });
  };

  const updateShip = (id: string, ship: Partial<Ship>) => {
    const updatedShips = ships.map(s => s.id === id ? { ...s, ...ship } : s);
    setShips(updatedShips);
    saveToStorage('ships', updatedShips);
    addNotification({ message: `Ship has been updated`, type: 'info' });
  };

  const deleteShip = (id: string) => {
    const updatedShips = ships.filter(s => s.id !== id);
    setShips(updatedShips);
    saveToStorage('ships', updatedShips);
    // Also delete related components and jobs
    const updatedComponents = components.filter(c => c.shipId !== id);
    setComponents(updatedComponents);
    saveToStorage('components', updatedComponents);
    const updatedJobs = jobs.filter(j => j.shipId !== id);
    setJobs(updatedJobs);
    saveToStorage('jobs', updatedJobs);
    addNotification({ message: `Ship has been deleted`, type: 'warning' });
  };

  const addComponent = (component: Omit<Component, 'id'>) => {
    const newComponent = { ...component, id: generateId() };
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    saveToStorage('components', updatedComponents);
    addNotification({ message: `Component "${component.name}" has been added`, type: 'success' });
  };

  const updateComponent = (id: string, component: Partial<Component>) => {
    const updatedComponents = components.map(c => c.id === id ? { ...c, ...component } : c);
    setComponents(updatedComponents);
    saveToStorage('components', updatedComponents);
    addNotification({ message: `Component has been updated`, type: 'info' });
  };

  const deleteComponent = (id: string) => {
    const updatedComponents = components.filter(c => c.id !== id);
    setComponents(updatedComponents);
    saveToStorage('components', updatedComponents);
    // Also delete related jobs
    const updatedJobs = jobs.filter(j => j.componentId !== id);
    setJobs(updatedJobs);
    saveToStorage('jobs', updatedJobs);
    addNotification({ message: `Component has been deleted`, type: 'warning' });
  };

  const addJob = (job: Omit<Job, 'id' | 'createdDate'>) => {
    const newJob = { 
      ...job, 
      id: generateId(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveToStorage('jobs', updatedJobs);
    addNotification({ message: `Job has been created`, type: 'success' });
  };

  const updateJob = (id: string, job: Partial<Job>) => {
    const updatedJobs = jobs.map(j => j.id === id ? { ...j, ...job } : j);
    setJobs(updatedJobs);
    saveToStorage('jobs', updatedJobs);
    
    if (job.status) {
      const jobData = updatedJobs.find(j => j.id === id);
      if (jobData) {
        addNotification({ 
          message: `Job status updated to "${job.status}"`, 
          type: job.status === 'Completed' ? 'success' : 'info' 
        });
      }
    }
  };

  const deleteJob = (id: string) => {
    const updatedJobs = jobs.filter(j => j.id !== id);
    setJobs(updatedJobs);
    saveToStorage('jobs', updatedJobs);
    addNotification({ message: `Job has been deleted`, type: 'warning' });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'dismissed'>) => {
    const newNotification = {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString(),
      dismissed: false
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveToStorage('notifications', updatedNotifications);
  };

  const dismissNotification = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, dismissed: true } : n
    );
    setNotifications(updatedNotifications);
    saveToStorage('notifications', updatedNotifications);
  };

  return (
    <AppContext.Provider value={{
      ships,
      components,
      jobs,
      notifications,
      addShip,
      updateShip,
      deleteShip,
      addComponent,
      updateComponent,
      deleteComponent,
      addJob,
      updateJob,
      deleteJob,
      addNotification,
      dismissNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
