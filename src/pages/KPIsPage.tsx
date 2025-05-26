
import React from 'react';
import KPICards from '../components/Dashboard/KPICards';
import Charts from '../components/Dashboard/Charts';

const KPIsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">KPIs & Analytics</h1>
        <p className="text-muted-foreground">
          Key performance indicators and analytics for your fleet
        </p>
      </div>
      
      <KPICards />
      <Charts />
    </div>
  );
};

export default KPIsPage;
