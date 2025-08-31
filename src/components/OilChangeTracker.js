import React, { useState, useEffect } from 'react';
import './OilChangeTracker.css';

const OilChangeTracker = () => {
  const [cars] = useState([
    { id: 1, name: 'Avtomobil 1', plate: 'WD0621V' },
    { id: 2, name: 'Avtomobil 2', plate: 'WD0156V' },
    { id: 3, name: 'Avtomobil 3', plate: 'WD0027V' },
    { id: 4, name: 'Avtomobil 4', plate: 'WD1123V' }
  ]);

  const [oilChanges, setOilChanges] = useState([]);
  const [currentMileage, setCurrentMileage] = useState({});
  const [newOilChange, setNewOilChange] = useState({
    carId: '',
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    oilType: '',
    notes: ''
  });

  // Local storage-dan məlumatları yüklə
  useEffect(() => {
    const savedOilChanges = localStorage.getItem('oilChangeRecords');
    const savedMileage = localStorage.getItem('currentMileage');
    
    if (savedOilChanges) {
      setOilChanges(JSON.parse(savedOilChanges));
    }
    if (savedMileage) {
      setCurrentMileage(JSON.parse(savedMileage));
    }
  }, []);

  // Məlumatları local storage-a saxla
  useEffect(() => {
    localStorage.setItem('oilChangeRecords', JSON.stringify(oilChanges));
    localStorage.setItem('currentMileage', JSON.stringify(currentMileage));
  }, [oilChanges, currentMileage]);

  const addOilChange = () => {
    if (!newOilChange.carId || !newOilChange.mileage || !newOilChange.oilType) {
      alert('Avtomobil, kilometraj və yağ növünü doldurun!');
      return;
    }

    const oilChange = {
      id: Date.now(),
      ...newOilChange,
      mileage: parseInt(newOilChange.mileage)
    };

    setOilChanges([...oilChanges, oilChange]);
    
    // Cari kilometrajı yenilə
    setCurrentMileage({
      ...currentMileage,
      [newOilChange.carId]: parseInt(newOilChange.mileage)
    });

    setNewOilChange({
      carId: '',
      date: new Date().toISOString().split('T')[0],
      mileage: '',
      oilType: '',
      notes: ''
    });
  };

  const deleteOilChange = (id) => {
    setOilChanges(oilChanges.filter(change => change.id !== id));
  };

  const getCarName = (carId) => {
    const car = cars.find(c => c.id === parseInt(carId));
    return car ? car.name : 'Naməlum';
  };

  const getCarPlate = (carId) => {
    const car = cars.find(c => c.id === parseInt(carId));
    return car ? car.plate : 'Naməlum';
  };

  const getLastOilChange = (carId) => {
    const carOilChanges = oilChanges
      .filter(change => change.carId === carId.toString())
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return carOilChanges.length > 0 ? carOilChanges[0] : null;
  };

  const getNextOilChange = (carId) => {
    const lastChange = getLastOilChange(carId);
    if (!lastChange) return null;

    // Hər 10,000 km-də yağ dəyişimi
    const nextMileage = lastChange.mileage + 10000;
    const currentMileageForCar = currentMileage[carId] || 0;
    const remainingKm = nextMileage - currentMileageForCar;

    return {
      nextMileage,
      remainingKm,
      isOverdue: remainingKm < 0
    };
  };

  return (
    <div className="oil-change-tracker">
      <h1>🛢️ Avtomobil Yağ Dəyişimi İzləmə Sistemi</h1>
      
      {/* Avtomobil Status Kartları */}
      <div className="cars-status">
        <h3>Avtomobillərin Statusu</h3>
        <div className="cars-grid">
          {cars.map(car => {
            const lastChange = getLastOilChange(car.id);
            const nextChange = getNextOilChange(car.id);
            const currentMileageForCar = currentMileage[car.id] || 0;

            return (
              <div key={car.id} className="car-status-card">
                <div className="car-header">
                  <h4>{car.name}</h4>
                  <span className="plate">{car.plate}</span>
                </div>
                
                <div className="car-info">
                  <div className="info-item">
                    <span>Cari Kilometraj:</span>
                    <span className="mileage">{currentMileageForCar.toLocaleString()} km</span>
                  </div>
                  
                  {lastChange && (
                    <div className="info-item">
                      <span>Son Yağ Dəyişimi:</span>
                      <span>{new Date(lastChange.date).toLocaleDateString('az-AZ')}</span>
                    </div>
                  )}
                  
                  {lastChange && (
                    <div className="info-item">
                      <span>Son Dəyişim Kilometrajı:</span>
                      <span>{lastChange.mileage.toLocaleString()} km</span>
                    </div>
                  )}
                  
                  {nextChange && (
                    <div className="info-item">
                      <span>Növbəti Dəyişim:</span>
                      <span className={nextChange.isOverdue ? 'overdue' : 'normal'}>
                        {nextChange.nextMileage.toLocaleString()} km
                      </span>
                    </div>
                  )}
                  
                  {nextChange && (
                    <div className="info-item">
                      <span>Qalan Məsafə:</span>
                      <span className={nextChange.isOverdue ? 'overdue' : 'normal'}>
                        {Math.abs(nextChange.remainingKm).toLocaleString()} km
                        {nextChange.isOverdue ? ' (Gecikmiş)' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yeni Yağ Dəyişimi Əlavə Et */}
      <div className="add-oil-change-form">
        <h3>Yeni Yağ Dəyişimi Əlavə Et</h3>
        <div className="form-row">
          <select
            value={newOilChange.carId}
            onChange={(e) => setNewOilChange({...newOilChange, carId: e.target.value})}
          >
            <option value="">Avtomobil seçin</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {car.name} ({car.plate})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={newOilChange.date}
            onChange={(e) => setNewOilChange({...newOilChange, date: e.target.value})}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            placeholder="Kilometraj (km)"
            value={newOilChange.mileage}
            onChange={(e) => setNewOilChange({...newOilChange, mileage: e.target.value})}
          />
          <input
            type="text"
            placeholder="Yağ növü (məsələn: 5W-30, 10W-40)"
            value={newOilChange.oilType}
            onChange={(e) => setNewOilChange({...newOilChange, oilType: e.target.value})}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            placeholder="Qeydlər (məsələn: Filtr dəyişildi)"
            value={newOilChange.notes}
            onChange={(e) => setNewOilChange({...newOilChange, notes: e.target.value})}
          />
          <button onClick={addOilChange} className="add-btn">
            Əlavə Et
          </button>
        </div>
      </div>

      {/* Kilometraj Yenilə */}
      <div className="update-mileage-form">
        <h3>Kilometraj Yenilə</h3>
        <div className="form-row">
          <select
            onChange={(e) => {
              const carId = e.target.value;
              const currentMileageForCar = currentMileage[carId] || 0;
              setNewOilChange({...newOilChange, carId, mileage: currentMileageForCar.toString()});
            }}
          >
            <option value="">Avtomobil seçin</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {car.name} ({car.plate}) - {currentMileage[car.id] || 0} km
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Yeni kilometraj (km)"
            value={newOilChange.mileage}
            onChange={(e) => setNewOilChange({...newOilChange, mileage: e.target.value})}
          />
          <button 
            onClick={() => {
              if (newOilChange.carId && newOilChange.mileage) {
                setCurrentMileage({
                  ...currentMileage,
                  [newOilChange.carId]: parseInt(newOilChange.mileage)
                });
                setNewOilChange({...newOilChange, mileage: ''});
              }
            }} 
            className="update-btn"
          >
            Yenilə
          </button>
        </div>
      </div>

      {/* Yağ Dəyişimi Tarixçəsi */}
      <div className="oil-changes-history">
        <h3>Yağ Dəyişimi Tarixçəsi ({oilChanges.length})</h3>
        {oilChanges.length === 0 ? (
          <p className="no-records">Hələ heç bir yağ dəyişimi qeydiyyatı yoxdur</p>
        ) : (
          <div className="history-table">
            <div className="table-header">
              <span>Tarix</span>
              <span>Avtomobil</span>
              <span>Kilometraj</span>
              <span>Yağ Növü</span>
              <span>Qeydlər</span>
              <span>Əməliyyat</span>
            </div>
            {oilChanges
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(change => (
                <div key={change.id} className="table-row">
                  <span>{new Date(change.date).toLocaleDateString('az-AZ')}</span>
                  <span>{getCarName(change.carId)} ({getCarPlate(change.carId)})</span>
                  <span>{change.mileage.toLocaleString()} km</span>
                  <span>{change.oilType}</span>
                  <span>{change.notes || '-'}</span>
                  <button 
                    onClick={() => deleteOilChange(change.id)}
                    className="delete-btn"
                  >
                    Sil
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OilChangeTracker; 