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
    { emoji: '🥰', label: 'Great', value: 5 },
  ];

  const handleMoodSelect = async (value) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      if (recordId) {
        await axios.put(`/api/health/${recordId}`, { mood: value }, config);
      } else {
        await axios.post('/api/health', {
          date: new Date().toISOString(),
          mood: value
        }, config);
      }

      onMoodSelect(value);
    } catch (err) {
      console.error("Mood update error", err);
    }
  };

  return (
    <div style={{ border: '1px solid #000', padding: '24px', background: '#fff' }} className="luxury-card">
      <p style={{
        fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
        color: '#C9A84C', fontSize: '13px', marginBottom: '20px'
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
              fontFamily: 'Tenor Sans', fontSize: '9px',
              letterSpacing: '0.1em', color: '#888'
            }}>
              {label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
      {todayMood && (
        <p style={{
          fontFamily: 'Jost', fontSize: '13px', color: '#888',
          textAlign: 'center', marginTop: '12px'
        }}>
          Mood logged ✓
        </p>
      )}
    </div>
  );
};

export default MoodTracker;
