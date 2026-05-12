import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const HealthScoreRing = () => {
  const [scoreData, setScoreData] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/ai/health-score', config);
        setScoreData(data);
      } catch (err) {
        console.error("Health score fetch error", err);
      }
    };
    if (user) fetchScore();
  }, [user]);

  // Animate score counting up on load
  useEffect(() => {
    if (!scoreData) return;
    let start = 0;
    const target = scoreData.score || 0;
    if (target === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { 
        setAnimatedScore(target); 
        clearInterval(timer); 
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [scoreData?.score]);

  const score = animatedScore;
  const size = 200;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#C9A84C' : '#ef4444';
  const grade = scoreData?.grade || (score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F');

  return (
    <div style={{ border: '1px solid #000', padding: '32px 40px',
                  display: 'flex', alignItems: 'center', gap: '48px',
                  marginBottom: '24px', background: '#fff' }} className="animate-fade-in">
      
      {/* Ring */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={radius}
                  fill="none" stroke="#f0f0f0" strokeWidth="12" />
          {/* Progress */}
          <circle cx={size/2} cy={size/2} r={radius}
                  fill="none" stroke={color} strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${filled} ${circumference}`}
                  style={{ transition: 'stroke-dasharray 0.05s linear' }} />
        </svg>
        {/* Center content */}
        <div style={{ position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px',
                      fontWeight: 700, color, margin: 0, lineHeight: 1 }}>
            {score}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px',
                      letterSpacing: '0.1em', color: '#888', margin: 0 }}>
            /100
          </p>
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em',
                    color: '#C9A84C', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>
          HEALTH SCORE
        </p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px',
                     fontStyle: 'italic', color: '#000', margin: '0 0 4px 0',
                     fontWeight: 600 }}>
          Grade {grade}
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#444',
                    marginBottom: '24px', lineHeight: 1.8 }}>
          {scoreData?.message || 'Log your health data to calculate your score'}
        </p>

        {/* Breakdown bars */}
        {(scoreData?.breakdown || []).map(({ label, score: s, max, tip }) => (
          <div key={label} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                           marginBottom: '6px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px',
                              letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
                {label}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px',
                              color: '#000', fontWeight: 500 }}>{s}/{max}</span>
            </div>
            <div style={{ height: '4px', background: '#f0f0f0', width: '100%' }}>
              <div style={{ height: '4px', background: color,
                             width: `${(s / max) * 100}%`,
                             transition: 'width 1s ease 0.5s' }} />
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px',
                        color: '#999', margin: '4px 0 0 0', fontStyle: 'italic' }}>
              {tip}
            </p>
          </div>
        ))}
      </div>

    </div>

  );
};

export default HealthScoreRing;
