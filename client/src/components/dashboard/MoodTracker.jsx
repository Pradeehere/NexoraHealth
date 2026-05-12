import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MoodTracker = ({ todayMood, onMoodSelect, recordId }) => {
  const { user } = useSelector((state) => state.auth);

  const moods = [
    { emoji: '😞', label: 'Bad', value: 1 },
    { emoji: '😐', label: 'Meh', value: 2 },
    { emoji: '🙂', label: 'OK', value: 3 },
    { emoji: '😊', label: 'Good', value: 4 },
    { emoji: '🤩', label: 'Great', value: 5 },
  ];

  const handleMoodSelect = async (moodValue) => {
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
          { mood: moodValue },
          config
        );
      } else {
        await axios.post('/api/health',
          { mood: moodValue, calories: 0, waterIntake: 0, sleepHours: 0, weight: 0, date: new Date().toISOString() },
          config
        );
      }

      onMoodSelect(moodValue);
    } catch (err) {
      console.error('Mood update error:', err.message);
    }
  };

  return (
    <div style={{ border: '1px solid #000', padding: '24px', background: '#fff' }} className="luxury-card">
      <p style={{
        fontFamily: 'DM Serif Display, serif', 
        letterSpacing: '0.15em',
        color: '#C9A84C', 
        fontSize: '14px', 
        textTransform: 'uppercase',
        marginBottom: '12px'
      }}>
        TODAY'S MOOD
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {moods.map(({ emoji, label, value }) => (
          <button key={value} onClick={() => handleMoodSelect(value)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '6px', padding: '12px', border: todayMood === value ? '2px solid #C9A84C' : '1px solid #ddd',
              background: todayMood === value ? '#fdf8ee' : 'transparent',
              cursor: 'pointer', transition: 'all 0.2s', minWidth: '56px'
            }}>
            <span style={{ fontSize: '28px' }}>{emoji}</span>
            <span style={{
              fontFamily: 'DM Serif Display, serif', fontSize: '10px',
              letterSpacing: '0.1em', color: '#888'
            }}>
              {label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
      {todayMood && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#444',
          textAlign: 'center', marginTop: '12px'
        }}>
          Mood logged ✓
        </p>
      )}
    </div>
  );
};


export default MoodTracker;
