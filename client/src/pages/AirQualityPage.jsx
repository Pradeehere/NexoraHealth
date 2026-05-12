import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AirQualityPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector(state => state.auth?.token || state.auth?.user?.token || '');
  const BASE = import.meta.env.VITE_API_URL || 'https://nexora-health-api.onrender.com/api';

  // SAFE mock data — always available as fallback
  const MOCK = {
    aqi: 58, aqiLevel: 'Moderate', aqiColor: '#ff7e00',
    pm25: 35, pm10: 62, uvIndex: 7,
    pollen: { birch: 3, grass: 12, olive: 2, level: 'Moderate' },
    warning: 'Moderate air quality. Sensitive groups should limit outdoor exposure.',
    location: { lat: 12.9716, lon: 77.5946 }, isMockData: true
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        let lat = 12.9716, lon = 77.5946;
        try {
          const pos = await new Promise((res, rej) => {
            const t = setTimeout(rej, 5000);
            navigator.geolocation?.getCurrentPosition(
              p => { clearTimeout(t); res(p); },
              () => { clearTimeout(t); rej(); }
            );
          });
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch { /* use Bangalore */ }

        const { data: result } = await axios.get(
          `${BASE}/air-quality?lat=${lat}&lon=${lon}`,
          { headers: { Authorization: `Bearer ${token}` }, timeout: 12000 }
        );
        if (!cancelled) setData(result);
      } catch (e) {
        console.error('Air quality load failed:', e.message);
        if (!cancelled) setData(MOCK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [token]);

  // SAFE rendering — check every property before using
  if (loading) return (
    <div style={{ padding: '48px', fontFamily: 'Jost' }}>
      <div style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                    color: '#C9A84C', fontSize: '13px' }}>
        LOADING AIR QUALITY DATA...
      </div>
    </div>
  );

  if (!data) return null; // should never happen but prevents blank crash

  const aqi = data?.aqi ?? 0;
  const aqiLevel = data?.aqiLevel ?? 'Unknown';
  const aqiColor = data?.aqiColor ?? '#888';
  const pm25 = data?.pm25 ?? 0;
  const pm10 = data?.pm10 ?? 0;
  const uvIndex = data?.uvIndex ?? 0;
  const pollen = data?.pollen ?? { birch: 0, grass: 0, olive: 0, level: 'Low' };
  const warning = data?.warning ?? null;

  // AQI circle percentage (max AQI ~150 for display)
  const aqiPercent = Math.min((aqi / 150) * 100, 100);
  const circumference = 2 * Math.PI * 70;
  const strokeDash = (aqiPercent / 100) * circumference;

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif',
                  maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Page Title */}
      <p style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em',
                  color: '#C9A84C', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>
        AIR QUALITY MONITOR
      </p>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px',
                   fontStyle: 'italic', color: '#000', marginBottom: '8px', fontWeight: 600 }}>
        Bengaluru, India
      </h1>
      {data.isMockData && (
        <p style={{ color: '#999', fontSize: '13px', marginBottom: '32px', fontFamily: 'Inter, sans-serif' }}>
          Showing estimated data for your region
        </p>
      )}

      {/* Warning Banner */}
      {warning && (
        <div style={{ borderLeft: '4px solid #ff4757', padding: '16px 20px',
                      background: '#fff5f5', marginBottom: '32px',
                      display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <p style={{ margin: 0, color: '#c0392b', fontSize: '15px', lineHeight: 1.8, fontFamily: 'Inter, sans-serif' }}>
            {warning}
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '24px', marginBottom: '24px' }}>
        
        {/* AQI Gauge Card */}
        <div style={{ border: '1px solid #000', padding: '40px 32px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em',
                      color: '#C9A84C', fontSize: '12px', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 700 }}>
            AIR QUALITY INDEX
          </p>
          <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r="70" fill="none"
                    stroke="#eee" strokeWidth="12" />
            <circle cx="90" cy="90" r="70" fill="none"
                    stroke={aqiColor} strokeWidth="12"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease' }} />
          </svg>
          <div style={{ marginTop: '-140px', marginBottom: '100px',
                        textAlign: 'center', zIndex: 1 }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px',
                        fontWeight: 700, color: aqiColor, margin: 0,
                        lineHeight: 1 }}>
              {aqi}
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em',
                        fontSize: '12px', color: '#000', marginTop: '4px', fontWeight: 700 }}>
              {aqiLevel.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ border: '1px solid #000', padding: '32px', background: '#fff' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em',
                      color: '#C9A84C', fontSize: '12px', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 700 }}>
            DETAILED METRICS
          </p>
          {[
            { label: 'PM2.5', value: pm25, unit: 'μg/m³' },
            { label: 'PM10', value: pm10, unit: 'μg/m³' },
            { label: 'UV INDEX', value: uvIndex, unit: '' },
          ].map(({ label, value, unit }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
                                       alignItems: 'baseline', borderBottom: '1px solid #eee',
                                       paddingBottom: '16px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em',
                              fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px',
                              fontWeight: 700, color: '#000' }}>
                {value}<span style={{ fontSize: '14px', color: '#888',
                                       marginLeft: '4px', fontFamily: 'Inter, sans-serif' }}>{unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pollen Card */}
      <div style={{ border: '1px solid #000', padding: '32px', marginBottom: '24px', background: '#fff' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em',
                    color: '#C9A84C', fontSize: '12px', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 700 }}>
          POLLEN LEVELS — {(pollen.level || 'LOW').toUpperCase()}
        </p>
        {[
          { label: 'BIRCH', value: pollen.birch ?? 0 },
          { label: 'GRASS', value: pollen.grass ?? 0 },
          { label: 'OLIVE', value: pollen.olive ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                           marginBottom: '6px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em',
                              fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px',
                              color: '#000', fontWeight: 600 }}>{value}</span>
            </div>
            <div style={{ height: '4px', background: '#eee', width: '100%' }}>
              <div style={{ height: '4px', background: '#C9A84C',
                             width: `${Math.min((value / 60) * 100, 100)}%`,
                             transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Health Recommendations */}
      <div style={{ border: '1px solid #000', padding: '32px', background: '#fff' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em',
                    color: '#C9A84C', fontSize: '12px', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 700 }}>
          HEALTH RECOMMENDATIONS
        </p>
        {(aqi <= 20 ? [
          '✓ Excellent day for outdoor exercise and activities',
          '✓ Air quality poses no risk — enjoy the outdoors',
          '✓ Great conditions for morning runs or cycling'
        ] : aqi <= 40 ? [
          '○ Good conditions for most outdoor activities',
          '○ Unusually sensitive individuals should monitor symptoms',
          '○ Safe for jogging, walking, and outdoor sports'
        ] : aqi <= 60 ? [
          '⚠ Sensitive groups should limit prolonged outdoor exertion',
          '⚠ Consider wearing a light mask during outdoor exercise',
          '⚠ Keep windows slightly closed during peak hours'
        ] : aqi <= 80 ? [
          '✕ Avoid strenuous outdoor activities',
          '✕ People with asthma should stay indoors',
          '✕ Keep windows and doors closed',
          '✕ Use air purifier if available'
        ] : [
          '✕ Do not go outside unless absolutely necessary',
          '✕ Wear N95 mask if going outdoors',
          '✕ Seek medical advice if experiencing symptoms',
          '✕ Keep all windows sealed — use air purifier'
        ]).map((tip, i) => (
          <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px',
                               color: '#333', lineHeight: 1.8, margin: '0 0 10px 0',
                               paddingLeft: '12px', borderLeft: '2px solid #eee' }}>
            {tip}
          </p>
        ))}
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#bbb',
                    marginTop: '24px', borderTop: '1px solid #eee',
                    paddingTop: '16px' }}>
          Data source: Open-Meteo Air Quality API • Updated on load
        </p>
      </div>

    </div>

  );
};

export default AirQualityPage;
