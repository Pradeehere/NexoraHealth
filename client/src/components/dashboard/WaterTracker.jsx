import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const WaterTracker = ({ current = 0, goal = 8, onUpdate, recordId }) => {
  const { user } = useSelector((state) => state.auth);
  const glasses = Array.from({ length: goal }, (_, i) => i < current);
  
  const handleClick = async (index) => {
    const newCount = index + 1 === current ? index : index + 1;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const token = user?.token || '';
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Check if today's record exists
      const { data: records } = await axios.get('/api/health', config);
      const todayRecord = records.find(r => 
        new Date(r.date).toISOString().split('T')[0] === today
      );
      
      if (todayRecord) {
        await axios.put(`/api/health/${todayRecord._id}`, 
          { waterIntake: newCount },
          config
        );
      } else {
        await axios.post('/api/health',
          { waterIntake: newCount, calories: 0, sleepHours: 0, mood: 3, weight: 0, date: new Date().toISOString() },
          config
        );
      }
      
      onUpdate(newCount);
    } catch (err) {
      console.error("Water update error", err.message);
    }
  };

  return (
    <div style={{ border: '1px solid #000', padding: '24px', background: '#fff' }} className="luxury-card group hover:bg-black transition-all duration-300 h-full">
      <p style={{ 
        fontFamily: 'DM Serif Display, serif', 
        letterSpacing: '0.15em',
        color: '#C9A84C', 
        fontSize: '14px', 
        textTransform: 'uppercase',
        marginBottom: '12px' 
      }}>
        WATER INTAKE
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap',
                    marginBottom: '16px' }}>
        {glasses.map((filled, i) => (
          <button key={i} onClick={() => handleClick(i)}
            style={{
              width: '36px', height: '48px', cursor: 'pointer',
              background: filled ? '#C9A84C' : 'transparent',
              border: '1px solid #000', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px'
            }}
            className={filled ? "" : "group-hover:border-brand-gold"}
            title={`${i + 1} glass${i > 0 ? 'es' : ''}`}>
            {filled ? '💧' : '○'}
          </button>
        ))}
      </div>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px',
                  fontWeight: 600, color: '#000', margin: 0 }} className="group-hover:text-white transition-colors">
        {current}<span style={{ fontSize: '16px', color: '#888',
                                  fontFamily: 'Inter, sans-serif', marginLeft: '6px' }}>
          / {goal} glasses
        </span>
      </p>
    </div>
  );
};


export default WaterTracker;
