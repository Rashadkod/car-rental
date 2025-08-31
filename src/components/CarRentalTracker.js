import React, { useState, useEffect } from 'react';
import './CarRentalTracker.css';

const CarRentalTracker = () => {
  const [cars] = useState([
    { id: 1, name: 'Avtomobil 1', plate: 'WD0621V' },
    { id: 2, name: 'Avtomobil 2', plate: 'WD0156V' },
    { id: 3, name: 'Avtomobil 3', plate: 'WD0027V' },
    { id: 4, name: 'Avtomobil 4', plate: 'WD1123V' }
  ]);
  
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    carId: '',
    type: 'income', // 'income' və ya 'expense'
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Local storage-dan məlumatları yüklə
  useEffect(() => {
    const savedRecords = localStorage.getItem('carRentalRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Məlumatları local storage-a saxla
  useEffect(() => {
    localStorage.setItem('carRentalRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = () => {
    if (!newRecord.carId || !newRecord.amount || !newRecord.description) {
      alert('Bütün sahələri doldurun!');
      return;
    }

    const record = {
      id: Date.now(),
      ...newRecord,
      amount: parseFloat(newRecord.amount)
    };

    setRecords([...records, record]);
    setNewRecord({
      carId: '',
      type: 'income',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const getCarName = (carId) => {
    const car = cars.find(c => c.id === parseInt(carId));
    return car ? car.name : 'Naməlum';
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weekRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart;
    });

    const totalIncome = weekRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalExpense = weekRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      income: totalIncome,
      expense: totalExpense,
      profit: totalIncome - totalExpense,
      count: weekRecords.length
    };
  };

  const getMonthlyStats = () => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart;
    });

    const totalIncome = monthRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalExpense = monthRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      income: totalIncome,
      expense: totalExpense,
      profit: totalIncome - totalExpense,
      count: monthRecords.length
    };
  };

  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  return (
    <div className="car-rental-tracker">
      <h1>🚗 Avtomobil İcarə Qeydiyyat Sistemi</h1>
      
      {/* Statistika */}
      <div className="stats-container">
        <div className="stats-card">
          <h3>Bu Həftə</h3>
          <div className="stat-item">
            <span>Gəlir:</span>
                         <span className="income">{weeklyStats.income.toFixed(2)} zł</span>
          </div>
          <div className="stat-item">
            <span>Xərc:</span>
                         <span className="expense">{weeklyStats.expense.toFixed(2)} zł</span>
          </div>
          <div className="stat-item">
            <span>Mənfəət:</span>
            <span className={weeklyStats.profit >= 0 ? 'profit' : 'loss'}>
                             {weeklyStats.profit.toFixed(2)} zł
            </span>
          </div>
        </div>

        <div className="stats-card">
          <h3>Bu Ay</h3>
          <div className="stat-item">
            <span>Gəlir:</span>
                         <span className="income">{monthlyStats.income.toFixed(2)} zł</span>
          </div>
          <div className="stat-item">
            <span>Xərc:</span>
                         <span className="expense">{monthlyStats.expense.toFixed(2)} zł</span>
          </div>
          <div className="stat-item">
            <span>Mənfəət:</span>
            <span className={monthlyStats.profit >= 0 ? 'profit' : 'loss'}>
                             {monthlyStats.profit.toFixed(2)} zł
            </span>
          </div>
        </div>
      </div>

      {/* Yeni qeyd əlavə et */}
      <div className="add-record-form">
        <h3>Yeni Qeyd Əlavə Et</h3>
        <div className="form-row">
          <select
            value={newRecord.carId}
            onChange={(e) => setNewRecord({...newRecord, carId: e.target.value})}
          >
            <option value="">Avtomobil seçin</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {car.name} ({car.plate})
              </option>
            ))}
          </select>

          <select
            value={newRecord.type}
            onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
          >
            <option value="income">Gəlir</option>
            <option value="expense">Xərc</option>
          </select>
        </div>

        <div className="form-row">
          <input
            type="number"
                         placeholder="Məbləğ (zł)"
            value={newRecord.amount}
            onChange={(e) => setNewRecord({...newRecord, amount: e.target.value})}
          />
          <input
            type="date"
            value={newRecord.date}
            onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            placeholder="Təsvir (məsələn: Yanacaq, Təmir, İcarə haqqı)"
            value={newRecord.description}
            onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
          />
          <button onClick={addRecord} className="add-btn">
            Əlavə Et
          </button>
        </div>
      </div>

      {/* Qeydlər siyahısı */}
      <div className="records-list">
        <h3>Qeydlər ({records.length})</h3>
        {records.length === 0 ? (
          <p className="no-records">Hələ heç bir qeyd yoxdur</p>
        ) : (
          <div className="records-table">
            <div className="table-header">
              <span>Tarix</span>
              <span>Avtomobil</span>
              <span>Növ</span>
              <span>Təsvir</span>
              <span>Məbləğ</span>
              <span>Əməliyyat</span>
            </div>
            {records
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(record => (
                <div key={record.id} className="table-row">
                  <span>{new Date(record.date).toLocaleDateString('az-AZ')}</span>
                  <span>{getCarName(record.carId)}</span>
                  <span className={record.type === 'income' ? 'income-badge' : 'expense-badge'}>
                    {record.type === 'income' ? 'Gəlir' : 'Xərc'}
                  </span>
                  <span>{record.description}</span>
                  <span className={record.type === 'income' ? 'income' : 'expense'}>
                                         {record.amount.toFixed(2)} zł
                  </span>
                  <button 
                    onClick={() => deleteRecord(record.id)}
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

export default CarRentalTracker; 