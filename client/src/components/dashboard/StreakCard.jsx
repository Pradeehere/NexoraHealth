import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StreakCard = () => {
  const [streakData, setStreakData] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/users/streak', config);
        setStreakData(data);
      } catch (err) {
        console.error("Streak fetch error", err);
      }
    };
    if (user) fetchStreak();
  }, [user]);

  return (
    <div style={{ 
      border: '1px solid #000', 
      borderTop: streakData?.isOnFire ? '4px solid #C9A84C' : '1px solid #000',
      padding: '28px',
      background: '#fff',
      transition: 'all 0.3s' 
    }} className="luxury-card h-full">
      
      <p style={{ 
        fontFamily: 'DM Serif Display, serif', 
        letterSpacing: '0.15em',
        color: '#C9A84C', 
        fontSize: '14px', 
        textTransform: 'uppercase',
        marginBottom: '12px' 
      }}>
        DAILY STREAK
      </p>
      
      {/* Streak number with flame */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px',
                    marginBottom: '12px' }}>
        <span style={{ 
          fontFamily: 'Cormorant Garamond, serif', 
          fontSize: '72px',
          fontWeight: 700, 
          lineHeight: 1,
          color: streakData?.isOnFire ? '#C9A84C' : '#000' 
        }}>
          {streakData?.streak ?? 0}
        </span>
        <div>
          <p style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '15px',
            letterSpacing: '0.1em', 
            marginBottom: '2px',
            color: '#666' 
          }}>
            DAY STREAK
          </p>
          {streakData?.isOnFire && (
            <p style={{ fontSize: '20px', margin: 0 }}>🔥</p>
          )}
        </div>
      </div>

      {/* Thin gold divider */}
      <div style={{ height: '1px', background: '#C9A84C',
                    width: '100%', marginBottom: '16px' }} />

      {/* AI motivational message */}
      <p style={{ 
        fontFamily: 'Cormorant Garamond, serif', 
        fontSize: '20px',
        fontStyle: 'italic', 
        lineHeight: 1.6,
        color: '#333',
        marginBottom: '12px' 
      }}>
        "{streakData?.message || 'Start logging daily to build your streak'}"
      </p>

      {/* Longest streak */}
      <p style={{ 
        fontFamily: 'Inter, sans-serif', 
        fontSize: '12px',
        color: '#888',
        letterSpacing: '0.1em' 
      }}>
        BEST: {streakData?.longestStreak ?? 0} DAYS
      </p>

      {/* Milestone badge */}
      {streakData?.milestone && (
        <div style={{ marginTop: '12px', padding: '6px 14px',
                      border: '1px solid #C9A84C', display: 'inline-block' }}>
          <span style={{ 
            fontFamily: 'DM Serif Display, serif', 
            fontSize: '12px',
            letterSpacing: '0.1em', 
            color: '#C9A84C' 
          }}>
            🏆 {streakData.milestone.toUpperCase()}
          </span>
        </div>
      )}
    </div>

  );
};

export default StreakCard;
