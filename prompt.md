You are improving the existing deployed Nexora Health MERN app. Do NOT rebuild. Apply all fixes and features below carefully. The app is live on Vercel + Render. Fix all errors automatically.

==================================================
FIX 1 — STAT CARD SUBHEADINGS FONT SIZE & STYLE
==================================================

The dashboard stat card labels (CALORIES TODAY, WATER INTAKE, SLEEP HOURS, BMI) are too small and unattractive. Fix globally.

Find the stat cards in Dashboard.jsx or HealthCard.jsx and apply:

Card label (title like "CALORIES TODAY"):
  font-family: 'Tenor Sans', sans-serif
  font-size: 13px
  letter-spacing: 0.25em
  color: #C9A84C
  text-transform: uppercase
  margin-bottom: 12px
  font-weight: 400

Card main value (the big number):
  font-family: 'Cormorant Garamond', serif
  font-size: 56px (text-5xl minimum, use text-6xl if space allows)
  color: #000000
  font-weight: 600
  line-height: 1

Card unit label (kcal, hrs, glasses):
  font-family: 'Jost', sans-serif
  font-size: 13px
  color: #888
  letter-spacing: 0.1em
  text-transform: uppercase
  display: inline-block
  margin-left: 6px

Keep "Good Morning, [Name]" heading exactly as is — Cormorant Garamond italic large — user loves it.

Apply same label treatment to ALL section titles across ALL pages:
  "CALORIE TREND (LAST 7 DAYS)", "SLEEP QUALITY", "NEXORA AI INSIGHTS",
  "AIR QUALITY MONITOR", "RECENT EXERCISES", "GOAL PROGRESS" etc.
  → All: Tenor Sans, 13px, tracking-widest, #C9A84C, uppercase

==================================================
FIX 2 — AIR QUALITY PAGE BLANK / NOT LOADING
==================================================

The Air Quality page goes completely blank. This is a React crash (unhandled error or missing data causing render failure).

Step 1 — Wrap entire AirQualityPage.jsx in an error boundary:

Create client/src/components/common/ErrorBoundary.jsx:
```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px', fontFamily: 'Jost, sans-serif' }}>
          <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.2em', 
                      color: '#C9A84C', fontSize: '13px', marginBottom: '16px' }}>
            SOMETHING WENT WRONG
          </p>
          <p style={{ color: '#333', marginBottom: '24px' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ background: '#000', color: '#fff', padding: '10px 24px',
                     border: 'none', cursor: 'pointer', fontFamily: 'Tenor Sans',
                     letterSpacing: '0.15em', fontSize: '12px' }}>
            RETRY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
```

Wrap in App.jsx:
```jsx
import ErrorBoundary from './components/common/ErrorBoundary';
<Route path="/air-quality" element={
  <ProtectedRoute>
    <ErrorBoundary>
      <AirQualityPage />
    </ErrorBoundary>
  </ProtectedRoute>
} />
```

Step 2 — Rewrite AirQualityPage.jsx completely (safe version):

```jsx
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
    <div style={{ padding: '32px 40px', fontFamily: 'Jost, sans-serif',
                  maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Page Title */}
      <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                  color: '#C9A84C', fontSize: '13px', marginBottom: '8px' }}>
        AIR QUALITY MONITOR
      </p>
      <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '48px',
                   fontStyle: 'italic', color: '#000', marginBottom: '8px', fontWeight: 600 }}>
        Bengaluru, India
      </h1>
      {data.isMockData && (
        <p style={{ color: '#999', fontSize: '12px', marginBottom: '32px' }}>
          Showing estimated data for your region
        </p>
      )}

      {/* Warning Banner */}
      {warning && (
        <div style={{ borderLeft: '4px solid #ff4757', padding: '16px 20px',
                      background: '#fff5f5', marginBottom: '32px',
                      display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <p style={{ margin: 0, color: '#c0392b', fontSize: '14px', lineHeight: 1.6 }}>
            {warning}
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '24px', marginBottom: '24px' }}>
        
        {/* AQI Gauge Card */}
        <div style={{ border: '1px solid #000', padding: '40px 32px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                      color: '#C9A84C', fontSize: '11px', marginBottom: '24px' }}>
            AIR QUALITY INDEX
          </p>
          <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r="70" fill="none"
                    stroke="#eee" strokeWidth="8" />
            <circle cx="90" cy="90" r="70" fill="none"
                    stroke={aqiColor} strokeWidth="8"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease' }} />
          </svg>
          <div style={{ marginTop: '-140px', marginBottom: '100px',
                        textAlign: 'center', zIndex: 1 }}>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '64px',
                        fontWeight: 600, color: aqiColor, margin: 0,
                        lineHeight: 1 }}>
              {aqi}
            </p>
            <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.2em',
                        fontSize: '13px', color: '#000', marginTop: '4px' }}>
              {aqiLevel.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ border: '1px solid #000', padding: '32px' }}>
          <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                      color: '#C9A84C', fontSize: '11px', marginBottom: '24px' }}>
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
              <span style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.15em',
                              fontSize: '11px', color: '#888' }}>{label}</span>
              <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '32px',
                              fontWeight: 600, color: '#000' }}>
                {value}<span style={{ fontSize: '14px', color: '#888',
                                       marginLeft: '4px', fontFamily: 'Jost' }}>{unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pollen Card */}
      <div style={{ border: '1px solid #000', padding: '32px', marginBottom: '24px' }}>
        <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                    color: '#C9A84C', fontSize: '11px', marginBottom: '24px' }}>
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
              <span style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.15em',
                              fontSize: '11px', color: '#888' }}>{label}</span>
              <span style={{ fontFamily: 'Jost', fontSize: '13px',
                              color: '#000' }}>{value}</span>
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
      <div style={{ border: '1px solid #000', padding: '32px' }}>
        <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                    color: '#C9A84C', fontSize: '11px', marginBottom: '24px' }}>
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
          <p key={i} style={{ fontFamily: 'Jost', fontSize: '14px',
                               color: '#333', lineHeight: 1.8, margin: '0 0 8px 0',
                               paddingLeft: '8px' }}>
            {tip}
          </p>
        ))}
        <p style={{ fontFamily: 'Jost', fontSize: '11px', color: '#bbb',
                    marginTop: '24px', borderTop: '1px solid #eee',
                    paddingTop: '16px' }}>
          Data source: Open-Meteo Air Quality API • Updated on load
        </p>
      </div>
    </div>
  );
};

export default AirQualityPage;
```

==================================================
FEATURE 1 — AI HEALTH SCORE (Dashboard)
==================================================

Add a single AI-calculated Health Score (0–100) to the dashboard.

Backend — add to server/controllers/aiController.js a new function getHealthScore:
```javascript
const getHealthScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await HealthRecord.find({ userId }).sort({ date: -1 }).limit(7);
    
    if (!records.length) {
      return res.status(200).json({ score: 0, grade: 'N/A', message: 'Log your health data to get your score', breakdown: [] });
    }

    const avg = (arr, key) => arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length;
    
    const avgCalories = avg(records, 'calories');
    const avgWater = avg(records, 'waterIntake');
    const avgSleep = avg(records, 'sleepHours');
    const avgMood = avg(records, 'mood');

    // Score each metric out of 25
    const calorieScore = avgCalories >= 1500 && avgCalories <= 2500 ? 25 : avgCalories > 0 ? 15 : 0;
    const waterScore = avgWater >= 8 ? 25 : avgWater >= 6 ? 18 : avgWater >= 4 ? 10 : 0;
    const sleepScore = avgSleep >= 7 && avgSleep <= 9 ? 25 : avgSleep >= 6 ? 18 : avgSleep >= 5 ? 10 : 0;
    const moodScore = avgMood >= 4 ? 25 : avgMood >= 3 ? 18 : avgMood >= 2 ? 10 : 5;

    const total = calorieScore + waterScore + sleepScore + moodScore;
    const grade = total >= 90 ? 'A' : total >= 75 ? 'B' : total >= 60 ? 'C' : total >= 40 ? 'D' : 'F';
    
    const breakdown = [
      { label: 'Nutrition', score: calorieScore, max: 25, tip: avgCalories < 1500 ? 'Eat more' : avgCalories > 2500 ? 'Reduce intake' : 'On track' },
      { label: 'Hydration', score: waterScore, max: 25, tip: avgWater < 8 ? `Drink ${Math.ceil(8 - avgWater)} more glasses` : 'Well hydrated' },
      { label: 'Sleep', score: sleepScore, max: 25, tip: avgSleep < 7 ? 'Sleep earlier tonight' : 'Great sleep pattern' },
      { label: 'Mood', score: moodScore, max: 25, tip: avgMood < 3 ? 'Try meditation or light exercise' : 'Positive mindset' },
    ];

    return res.status(200).json({ score: total, grade, message: `Your overall health score is ${total}/100`, breakdown });
  } catch (e) {
    return res.status(200).json({ score: 72, grade: 'B', message: 'Sample health score', breakdown: [] });
  }
};
```

Add route in aiRoutes.js:
  GET /api/ai/health-score  [protected]

Frontend — Add HealthScoreCard.jsx to Dashboard:

```jsx
const HealthScoreCard = () => {
  const [scoreData, setScoreData] = useState(null);
  // fetch from /api/ai/health-score using same axios pattern as rest of app
  // Display:
  // - Large circular SVG ring (same as AQI ring above)
  // - Color: green if >75, gold if >50, red if <50
  // - Grade letter in center (A/B/C/D/F)
  // - Score number below grade
  // - 4 breakdown rows: Nutrition, Hydration, Sleep, Mood each with thin progress bar
  // Style: luxury — Tenor Sans labels, Cormorant numbers, black border card
};
```

Place HealthScoreCard on Dashboard between the 4 stat cards and the charts.

==================================================
FEATURE 2 — CLICKABLE WATER INTAKE TRACKER
==================================================

Replace the plain water number on dashboard with an interactive glass tracker.

In Dashboard.jsx, replace the Water Intake stat card with WaterTracker component:

```jsx
const WaterTracker = ({ current = 0, goal = 8, onUpdate }) => {
  const glasses = Array.from({ length: goal }, (_, i) => i < current);
  
  const handleClick = async (index) => {
    const newCount = index + 1 === current ? index : index + 1;
    // Call PUT /api/health/:todayRecordId to update waterIntake
    // OR POST /api/health with today's date if no record exists
    onUpdate(newCount);
  };

  return (
    <div style={{ border: '1px solid #000', padding: '24px' }}>
      <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                  color: '#C9A84C', fontSize: '13px', marginBottom: '20px' }}>
        WATER INTAKE
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap',
                    marginBottom: '16px' }}>
        {glasses.map((filled, i) => (
          <button key={i} onClick={() => handleClick(i)}
            style={{
              width: '36px', height: '48px', cursor: 'pointer',
              background: filled ? '#000' : 'transparent',
              border: '1px solid #000', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px'
            }}
            title={`${i + 1} glass${i > 0 ? 'es' : ''}`}>
            {filled ? '💧' : '○'}
          </button>
        ))}
      </div>
      <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '42px',
                  fontWeight: 600, color: '#000', margin: 0 }}>
        {current}<span style={{ fontSize: '16px', color: '#888',
                                  fontFamily: 'Jost', marginLeft: '6px' }}>
          / {goal} glasses
        </span>
      </p>
    </div>
  );
};
```

==================================================
FEATURE 3 — MOOD TRACKER ON DASHBOARD
==================================================

Add a daily mood tracker card to the Dashboard.

```jsx
const MoodTracker = ({ todayMood, onMoodSelect }) => {
  const moods = [
    { emoji: '😞', label: 'Bad', value: 1 },
    { emoji: '😐', label: 'Meh', value: 2 },
    { emoji: '🙂', label: 'OK', value: 3 },
    { emoji: '😊', label: 'Good', value: 4 },
    { emoji: '🤩', label: 'Great', value: 5 },
  ];

  return (
    <div style={{ border: '1px solid #000', padding: '24px' }}>
      <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                  color: '#C9A84C', fontSize: '13px', marginBottom: '20px' }}>
        TODAY'S MOOD
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {moods.map(({ emoji, label, value }) => (
          <button key={value} onClick={() => onMoodSelect(value)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '6px', padding: '12px', border: todayMood === value ? '2px solid #C9A84C' : '1px solid #ddd',
              background: todayMood === value ? '#fdf8ee' : 'transparent',
              cursor: 'pointer', transition: 'all 0.2s', minWidth: '56px'
            }}>
            <span style={{ fontSize: '28px' }}>{emoji}</span>
            <span style={{ fontFamily: 'Tenor Sans', fontSize: '9px',
                            letterSpacing: '0.1em', color: '#888' }}>
              {label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
      {todayMood && (
        <p style={{ fontFamily: 'Jost', fontSize: '13px', color: '#888',
                    textAlign: 'center', marginTop: '12px' }}>
          Mood logged ✓
        </p>
      )}
    </div>
  );
};
```

When mood is selected: call PUT /api/health/:todayId to update mood field.
If no health record for today exists: create one with POST /api/health.

==================================================
POSSIBLE CONSOLE ERRORS — PRE-FIX ALL OF THESE
==================================================

Fix these errors before they occur:

1. "Cannot read properties of undefined (reading 'aqi')"
   Fix: use optional chaining everywhere: data?.aqi ?? 0

2. "Each child in a list should have a unique key prop"
   Fix: add key={index} or key={item.id} to every .map()

3. "Warning: Can't perform a React state update on unmounted component"
   Fix: use cancelled flag pattern in all useEffect cleanups (shown above)

4. "ResizeObserver loop limit exceeded"
   Fix: wrap Recharts in div with style={{ width: '100%', minHeight: 0 }}
   Use height={300} not height="100%" on ResponsiveContainer

5. "Failed to load resource: 404 /api/ai/health-score"
   Fix: make sure route is registered in server.js before error middleware

6. "401 Unauthorized on /api/air-quality"
   Fix: always send Authorization header using token from Redux store

7. "Maximum update depth exceeded"
   Fix: do not put state setters inside useEffect without proper deps array
   Always specify exact dependencies: useEffect(() => {...}, [token])

==================================================
FINAL STEPS
==================================================

1. npm install in server/ and client/
2. npm run build in client/ — fix ALL build errors before committing
3. git add . && git commit -m "feat: health score, water tracker, mood tracker, air quality page fix, font improvements" && git push origin main
4. Render → Manual Deploy → Deploy Latest Commit
5. Vercel auto-deploys on push

Verify after deployment:
  ✅ Stat card labels clearly visible — Tenor Sans gold uppercase
  ✅ Air quality page loads with data or mock — never blank
  ✅ Health Score ring visible on dashboard
  ✅ Water glasses are clickable on dashboard
  ✅ Mood emoji buttons work and log mood
  ✅ No console errors on any page
  ✅ All existing features still working

  Add these 3 new features to the existing deployed Nexora Health app. Do NOT rebuild or touch existing code unless necessary. Auto-fix all errors.

==================================================
FEATURE 1 — AI MEAL PLANNER PAGE
==================================================

Create client/src/pages/MealPlannerPage.jsx

Full page with:
- Route: /meal-planner (add to App.jsx, protected)
- Add to sidebar: icon = UtensilsCrossed (Lucide), label = "MEAL PLANNER", below TRACKER

UI Layout:

Header:
  "MEAL PLANNER" — Tenor Sans, gold, uppercase, tracking-widest, 13px
  "AI-Powered Nutrition" — Cormorant Garamond, italic, 48px, black

Input Form Card (1px solid black, no radius, p-8):
  - Calorie Goal input: number, placeholder "e.g. 2000", min 1000 max 5000
  - Diet Type dropdown: Any / Vegetarian / Vegan / Keto / High Protein
  - Number of Meals dropdown: 3 / 4 / 5
  - Allergies input: text, placeholder "e.g. nuts, dairy (optional)"
  - [GENERATE MEAL PLAN] button: full width, black bg, white text, Tenor Sans uppercase

Loading state:
  Show animated dots "Generating your meal plan..." in Cormorant Garamond italic
  Pulsing gold horizontal line animation below text

Result Display (shown after generation):
  For each meal (Breakfast, Lunch, Dinner + snacks if >3 meals):
    Card: 1px solid black, p-6, no radius
    Meal label: Tenor Sans, gold, uppercase, tracking-widest, 11px (e.g. "BREAKFAST")
    Meal name: Cormorant Garamond, 28px, black, italic (e.g. "Oats with Banana & Honey")
    Description: Jost, 14px, #555, line-height 1.7
    Nutrition row: 4 pills — Calories | Protein | Carbs | Fats
      Each pill: thin black border, Tenor Sans 11px uppercase, gold number

  Bottom summary card:
    "DAILY TOTALS" label in gold Tenor Sans
    Total: Calories, Protein, Carbs, Fats in large Cormorant numbers
    Thin gold divider between each

  [REGENERATE] button: outlined black, below results
  [SAVE PLAN] button: black filled — saves to localStorage key "nexora-meal-plan"

BACKEND — server/controllers/aiController.js add function generateMealPlan:

```javascript
const generateMealPlan = async (req, res) => {
  const { calorieGoal = 2000, dietType = 'Any', meals = 3, allergies = '' } = req.body;
  
  try {
    // If OpenAI key exists and is valid, use it
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('dummy')) {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const prompt = `Create a ${meals}-meal nutrition plan for someone with a ${calorieGoal} calorie daily goal. Diet type: ${dietType}. Allergies/avoid: ${allergies || 'none'}. 
      
      Respond ONLY with valid JSON in this exact format:
      {
        "meals": [
          {
            "type": "Breakfast",
            "name": "meal name",
            "description": "2 sentence description",
            "calories": 400,
            "protein": 20,
            "carbs": 45,
            "fats": 12
          }
        ],
        "totalCalories": 2000,
        "totalProtein": 80,
        "totalCarbs": 200,
        "totalFats": 65,
        "tip": "one personalized nutrition tip"
      }`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      });
      
      const text = completion.choices[0].message.content;
      const json = JSON.parse(text.replace(/```json|```/g, '').trim());
      return res.status(200).json(json);
    }
  } catch (e) {
    console.log('OpenAI failed, using smart mock:', e.message);
  }

  // Smart mock meal plans based on calorie goal and diet type
  const perMeal = Math.round(calorieGoal / meals);
  
  const mealTemplates = {
    'Vegetarian': [
      { type: 'Breakfast', name: 'Greek Yogurt Parfait with Granola', description: 'Creamy Greek yogurt layered with house-made granola, fresh berries, and a drizzle of local honey. Rich in probiotics and slow-release carbohydrates.', protein: 18, carbs: 52, fats: 9 },
      { type: 'Lunch', name: 'Quinoa Buddha Bowl', description: 'Protein-rich quinoa topped with roasted chickpeas, avocado, cucumber, and tahini dressing. A complete plant-based meal full of essential amino acids.', protein: 22, carbs: 58, fats: 18 },
      { type: 'Dinner', name: 'Paneer Tikka with Brown Rice', description: 'Marinated cottage cheese grilled to perfection with bell peppers and onions, served alongside fiber-rich brown rice and mint chutney.', protein: 28, carbs: 48, fats: 16 },
      { type: 'Snack', name: 'Mixed Nuts & Fruit', description: 'A balanced mix of almonds, walnuts, and cashews with seasonal fruit. Perfect for sustained energy between meals.', protein: 8, carbs: 22, fats: 14 },
      { type: 'Snack 2', name: 'Hummus with Vegetable Sticks', description: 'House-blended hummus with fresh carrot, celery, and cucumber sticks. High in fiber and plant protein.', protein: 6, carbs: 18, fats: 8 },
    ],
    'Vegan': [
      { type: 'Breakfast', name: 'Overnight Oats with Chia Seeds', description: 'Steel-cut oats soaked overnight in almond milk with chia seeds, topped with fresh mango and coconut flakes. High in omega-3 and fiber.', protein: 14, carbs: 58, fats: 10 },
      { type: 'Lunch', name: 'Lentil & Vegetable Soup', description: 'Hearty red lentil soup with spinach, tomatoes, and warming spices. A complete protein source rich in iron and folate.', protein: 20, carbs: 52, fats: 6 },
      { type: 'Dinner', name: 'Tofu Stir Fry with Noodles', description: 'Firm tofu wok-tossed with seasonal vegetables in a ginger-sesame sauce over whole grain noodles. High in plant protein and essential minerals.', protein: 24, carbs: 55, fats: 14 },
      { type: 'Snack', name: 'Edamame with Sea Salt', description: 'Fresh steamed edamame beans with a light sprinkle of Himalayan salt. One of the best plant-based complete protein snacks.', protein: 11, carbs: 14, fats: 5 },
      { type: 'Snack 2', name: 'Smoothie Bowl', description: 'Blended frozen acai with banana and oat milk, topped with granola and fresh fruit. Antioxidant-rich and energizing.', protein: 8, carbs: 48, fats: 6 },
    ],
    'Keto': [
      { type: 'Breakfast', name: 'Scrambled Eggs with Avocado', description: 'Three free-range eggs scrambled in butter with half an avocado and crispy bacon. Zero-carb, high healthy fat breakfast to fuel ketosis.', protein: 24, carbs: 4, fats: 32 },
      { type: 'Lunch', name: 'Grilled Chicken Caesar Salad', description: 'Grilled chicken breast over romaine lettuce with parmesan, bacon bits, and sugar-free Caesar dressing. High protein, minimal carbs.', protein: 42, carbs: 6, fats: 28 },
      { type: 'Dinner', name: 'Salmon with Asparagus', description: 'Pan-seared Atlantic salmon fillet with roasted asparagus and garlic butter sauce. Rich in omega-3 fatty acids and essential vitamins.', protein: 38, carbs: 8, fats: 36 },
      { type: 'Snack', name: 'Cheese & Almonds', description: 'Aged cheddar cubes with a small handful of raw almonds. Perfect keto snack with zero sugar and high satiety.', protein: 12, carbs: 4, fats: 22 },
      { type: 'Snack 2', name: 'Bulletproof Coffee', description: 'Black coffee blended with grass-fed butter and MCT oil. Provides sustained mental clarity and supports fat burning.', protein: 1, carbs: 0, fats: 28 },
    ],
    'High Protein': [
      { type: 'Breakfast', name: 'Egg White Omelette with Turkey', description: 'Six egg whites with lean turkey breast, spinach, and low-fat cheese. Over 40g of protein to kickstart muscle recovery.', protein: 42, carbs: 8, fats: 10 },
      { type: 'Lunch', name: 'Chicken Rice Bowl', description: 'Double serving of grilled chicken breast with brown rice, steamed broccoli, and teriyaki glaze. Ideal post-workout muscle-building meal.', protein: 55, carbs: 62, fats: 10 },
      { type: 'Dinner', name: 'Tuna Steak with Sweet Potato', description: 'Seared yellowfin tuna with roasted sweet potato and green beans. High in lean protein, omega-3, and complex carbohydrates.', protein: 48, carbs: 45, fats: 8 },
      { type: 'Snack', name: 'Protein Shake with Banana', description: 'Whey protein shake blended with banana and skimmed milk. Fast-absorbing protein perfect for post-exercise recovery.', protein: 38, carbs: 32, fats: 4 },
      { type: 'Snack 2', name: 'Cottage Cheese with Berries', description: 'Low-fat cottage cheese with mixed berries. Casein protein provides slow-release amino acids for overnight muscle repair.', protein: 24, carbs: 18, fats: 3 },
    ],
    'Any': [
      { type: 'Breakfast', name: 'Masala Omelette with Toast', description: 'Spiced three-egg omelette with onions, tomatoes, and green chilli, served with whole grain toast. A balanced, energizing start to the day.', protein: 22, carbs: 38, fats: 14 },
      { type: 'Lunch', name: 'Grilled Chicken with Vegetables', description: 'Herb-marinated chicken breast with roasted seasonal vegetables and a side of brown rice. Balanced macros for sustained afternoon energy.', protein: 38, carbs: 52, fats: 12 },
      { type: 'Dinner', name: 'Dal Tadka with Roti', description: 'Yellow lentil curry tempered with cumin, garlic, and dried chilli, served with two whole wheat rotis. High fiber, plant protein comfort meal.', protein: 20, carbs: 58, fats: 10 },
      { type: 'Snack', name: 'Fruit & Nut Mix', description: 'Seasonal fruit with a small portion of mixed nuts. Provides natural sugars, healthy fats, and micronutrients for afternoon focus.', protein: 6, carbs: 28, fats: 12 },
      { type: 'Snack 2', name: 'Greek Yogurt', description: 'Plain Greek yogurt with a teaspoon of honey. High in protein and probiotics, ideal as a light evening snack.', protein: 15, carbs: 14, fats: 4 },
    ]
  };

  const template = mealTemplates[dietType] || mealTemplates['Any'];
  const selectedMeals = template.slice(0, meals).map(m => {
    const cal = Math.round(perMeal);
    return { ...m, calories: cal };
  });

  const totals = selectedMeals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fats: acc.fats + m.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return res.status(200).json({
    meals: selectedMeals,
    totalCalories: totals.calories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFats: totals.fats,
    tip: `Aim to eat your meals 3-4 hours apart for optimal metabolism. Stay hydrated with at least 8 glasses of water throughout the day.`
  });
};
```

Add to aiRoutes.js:
  POST /api/ai/meal-plan [protected]

==================================================
FEATURE 2 — SMART STREAK SYSTEM
==================================================

Backend — add to server/controllers/userController.js:

```javascript
const getStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await HealthRecord.find({ userId })
      .sort({ date: -1 })
      .select('date');

    if (!records.length) {
      return res.status(200).json({ streak: 0, longestStreak: 0, message: 'Start logging to build your streak!', isOnFire: false });
    }

    // Calculate consecutive days streak
    let streak = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);

    // Get unique dates
    const uniqueDates = [...new Set(records.map(r => {
      const d = new Date(r.date);
      d.setHours(0,0,0,0);
      return d.getTime();
    }))].sort((a, b) => b - a);

    const ONE_DAY = 86400000;
    const todayTime = today.getTime();
    const yesterdayTime = todayTime - ONE_DAY;

    // Check if user logged today or yesterday (streak still alive)
    if (uniqueDates[0] !== todayTime && uniqueDates[0] !== yesterdayTime) {
      return res.status(200).json({
        streak: 0, longestStreak: 0,
        message: 'Your streak was broken. Start fresh today!',
        isOnFire: false, lastLogged: new Date(uniqueDates[0])
      });
    }

    // Count streak
    let expected = uniqueDates[0];
    for (const date of uniqueDates) {
      if (date === expected) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
        expected -= ONE_DAY;
      } else break;
    }
    streak = currentStreak;

    // AI motivational message based on streak
    const messages = {
      0: 'Every expert was once a beginner. Log today to start your streak!',
      1: 'Day 1 complete! The journey of a thousand miles begins with a single step.',
      2: 'Two days strong! Consistency is the key to transformation.',
      3: 'Three days in a row! You are building an unstoppable habit.',
      5: 'Five day streak! Your dedication is already showing results.',
      7: '🔥 One full week! You are in the top 20% of health trackers.',
      10: '🔥 10 days! Your body is thanking you for this consistency.',
      14: '🔥 Two weeks strong! Habits take 21 days — you are almost there.',
      21: '🏆 21 days! Science says this is now a habit. You did it.',
      30: '🏆 30 DAY STREAK! You are an elite health tracker. Incredible.',
      50: '👑 50 days. You are an inspiration. Keep going.',
      100: '👑 100 DAYS. Legendary status achieved. You are unstoppable.'
    };

    const milestones = [100, 50, 30, 21, 14, 10, 7, 5, 3, 2, 1, 0];
    const milestone = milestones.find(m => streak >= m);
    const message = messages[milestone] || `${streak} day streak! Keep going strong.`;

    return res.status(200).json({
      streak,
      longestStreak,
      message,
      isOnFire: streak >= 7,
      milestone: streak >= 7 ? `${streak} Day Streak` : null
    });
  } catch (e) {
    return res.status(200).json({ streak: 0, longestStreak: 0, message: 'Keep logging daily!', isOnFire: false });
  }
};
```

Add route in userRoutes.js:
  GET /api/users/streak [protected]

Frontend — Create StreakCard.jsx:

```jsx
const StreakCard = () => {
  const [streakData, setStreakData] = useState(null);
  // fetch from GET /api/users/streak using same auth pattern

  return (
    <div style={{ border: '1px solid #000', padding: '28px',
                  background: streakData?.isOnFire ? '#000' : '#fff',
                  transition: 'all 0.3s' }}>
      
      <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                  color: '#C9A84C', fontSize: '11px', marginBottom: '16px' }}>
        DAILY STREAK
      </p>
      
      {/* Streak number with flame */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px',
                    marginBottom: '12px' }}>
        <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '72px',
                        fontWeight: 700, lineHeight: 1,
                        color: streakData?.isOnFire ? '#C9A84C' : '#000' }}>
          {streakData?.streak ?? 0}
        </span>
        <div>
          <p style={{ fontFamily: 'Tenor Sans', fontSize: '11px',
                      letterSpacing: '0.2em', marginBottom: '2px',
                      color: streakData?.isOnFire ? '#fff' : '#888' }}>
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
      <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px',
                  fontStyle: 'italic', lineHeight: 1.6,
                  color: streakData?.isOnFire ? '#fff' : '#333',
                  marginBottom: '12px' }}>
        "{streakData?.message}"
      </p>

      {/* Longest streak */}
      <p style={{ fontFamily: 'Jost', fontSize: '11px',
                  color: streakData?.isOnFire ? '#888' : '#bbb',
                  letterSpacing: '0.1em' }}>
        BEST: {streakData?.longestStreak ?? 0} DAYS
      </p>

      {/* Milestone badge */}
      {streakData?.milestone && (
        <div style={{ marginTop: '12px', padding: '6px 14px',
                      border: '1px solid #C9A84C', display: 'inline-block' }}>
          <span style={{ fontFamily: 'Tenor Sans', fontSize: '11px',
                          letterSpacing: '0.15em', color: '#C9A84C' }}>
            🏆 {streakData.milestone.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};
```

Add StreakCard to Dashboard — place it in the 4-card stat row as a 5th card, or below the stat cards in a 2-column row alongside MoodTracker.

==================================================
FEATURE 3 — ANIMATED HEALTH SCORE RING (DASHBOARD)
==================================================

This should be a prominent hero element on the dashboard, placed BETWEEN the greeting header and the 4 stat cards.

Create HealthScoreRing.jsx:

```jsx
const HealthScoreRing = () => {
  const [scoreData, setScoreData] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  // fetch from GET /api/ai/health-score

  // Animate score counting up on load
  useEffect(() => {
    if (!scoreData) return;
    let start = 0;
    const target = scoreData.score;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setAnimatedScore(target); clearInterval(timer); }
      else setAnimatedScore(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [scoreData?.score]);

  const score = animatedScore;
  const size = 200;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#C9A84C' : '#ef4444';
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

  return (
    <div style={{ border: '1px solid #000', padding: '32px 40px',
                  display: 'flex', alignItems: 'center', gap: '48px',
                  marginBottom: '24px', background: '#fff' }}>
      
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
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '52px',
                      fontWeight: 700, color, margin: 0, lineHeight: 1 }}>
            {score}
          </p>
          <p style={{ fontFamily: 'Tenor Sans', fontSize: '10px',
                      letterSpacing: '0.2em', color: '#888', margin: 0 }}>
            /100
          </p>
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em',
                    color: '#C9A84C', fontSize: '11px', marginBottom: '8px' }}>
          HEALTH SCORE
        </p>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '40px',
                     fontStyle: 'italic', color: '#000', margin: '0 0 4px 0',
                     fontWeight: 600 }}>
          Grade {grade}
        </h2>
        <p style={{ fontFamily: 'Jost', fontSize: '14px', color: '#555',
                    marginBottom: '24px', lineHeight: 1.6 }}>
          {scoreData?.message || 'Log your health data to calculate your score'}
        </p>

        {/* Breakdown bars */}
        {(scoreData?.breakdown || []).map(({ label, score: s, max, tip }) => (
          <div key={label} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                           marginBottom: '4px' }}>
              <span style={{ fontFamily: 'Tenor Sans', fontSize: '10px',
                              letterSpacing: '0.15em', color: '#888' }}>
                {label.toUpperCase()}
              </span>
              <span style={{ fontFamily: 'Jost', fontSize: '11px',
                              color: '#000' }}>{s}/{max}</span>
            </div>
            <div style={{ height: '3px', background: '#f0f0f0', width: '100%' }}>
              <div style={{ height: '3px', background: color,
                             width: `${(s / max) * 100}%`,
                             transition: 'width 1s ease 0.5s' }} />
            </div>
            <p style={{ fontFamily: 'Jost', fontSize: '11px',
                        color: '#999', margin: '3px 0 0 0', fontStyle: 'italic' }}>
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

Backend route (if not already added from previous prompt):
GET /api/ai/health-score [protected] — add to aiRoutes.js
Use the getHealthScore controller from previous prompt.

==================================================
POSSIBLE ERRORS — PRE-FIX ALL
==================================================

1. "Cannot read properties of undefined (reading 'score')"
   Fix: scoreData?.score ?? 0 everywhere. Never access nested props without ?.

2. "Objects are not valid as React children"
   Fix: Always convert numbers/objects to strings before rendering.
   Wrap all dynamic values: {String(value)} or {value?.toString()}

3. "Route /meal-planner not found"
   Fix: Add in App.jsx before the catch-all route:
   <Route path="/meal-planner" element={<ProtectedRoute><MealPlannerPage /></ProtectedRoute>} />

4. "Streak API 404"
   Fix: Register in server.js: app.use('/api/users', userRoutes)
   Make sure getStreak is exported from userController.js

5. "JSON parse error on meal plan response"
   Fix: In frontend, always wrap JSON.parse in try/catch:
   try { const plan = JSON.parse(text) } catch { setError('Invalid response') }

6. "SVG animation not smooth"
   Fix: Set initial strokeDasharray to "0 circumference" and transition to filled value.
   Add style={{ transition: 'stroke-dasharray 1.5s ease' }} on the progress circle.

7. "Meal planner shows blank after generate"
   Fix: Check that response.data.meals is an array before mapping.
   Add: if (!Array.isArray(data?.meals)) return;

==================================================
FINAL STEPS
==================================================

1. npm install in server/ and client/
2. npm run build in client/ — 0 build errors required
3. git add . && git commit -m "feat: AI meal planner, smart streak system, health score ring" && git push origin main
4. Render → Manual Deploy → Deploy Latest Commit
5. Vercel auto-deploys

Verify:
  ✅ /meal-planner page loads and generates meal plans
  ✅ Meal plan shows breakfast, lunch, dinner with macros
  ✅ Streak card shows on dashboard with correct count
  ✅ Streak card turns black background when streak >= 7 days
  ✅ Health score ring animates from 0 to score on load
  ✅ Breakdown bars animate in after ring
  ✅ All 3 features work without crashing existing pages
  ✅ Sidebar shows MEAL PLANNER nav item