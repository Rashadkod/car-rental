import React, { useState } from 'react';
import CarRentalTracker from './components/CarRentalTracker';
import OilChangeTracker from './components/OilChangeTracker';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('rental');

  return (
    <div className="App">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'rental' ? 'active' : ''}`}
          onClick={() => setActiveTab('rental')}
        >
          🚗 İcarə Qeydiyyatı
        </button>
        <button 
          className={`tab-btn ${activeTab === 'oil' ? 'active' : ''}`}
          onClick={() => setActiveTab('oil')}
        >
          🛢️ Yağ Dəyişimi
        </button>
      </div>
      
      {activeTab === 'rental' ? <CarRentalTracker /> : <OilChangeTracker />}
    </div>
  );
}

export default App;
