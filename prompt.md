Fix the following specific bugs and UI issues in the deployed Nexora Health app. Do NOT rebuild. Apply only these fixes. Auto-fix all errors. Do not ask questions.

==================================================
FIX 1 — WATER GLASS & MOOD BUTTONS NOT WORKING
(400 Error: "Calories must be a number")
==================================================

The water tracker and mood buttons are sending requests to POST /api/health without a calories field, causing validation to reject with 400.

The issue: when clicking a water glass or mood button, the frontend sends ONLY waterIntake or mood — but the backend validator requires calories to be present and a number.

FIX BACKEND — server/controllers/healthController.js:

Find the createHealthRecord or updateHealthRecord function.
Make ALL fields optional except userId and date.
Replace any strict validation like:
  if (!calories || isNaN(calories)) return res.status(400).json(...)
With:
  const calories = req.body.calories !== undefined ? Number(req.body.calories) : 0;
  const waterIntake = req.body.waterIntake !== undefined ? Number(req.body.waterIntake) : 0;
  const sleepHours = req.body.sleepHours !== undefined ? Number(req.body.sleepHours) : 0;
  const mood = req.body.mood !== undefined ? Number(req.body.mood) : 3;
  const weight = req.body.weight !== undefined ? Number(req.body.weight) : 0;

So the record is created/updated with whatever fields are provided, defaulting missing ones to 0.

FIX BACKEND — server/middleware/validationMiddleware.js (if it exists):
Find any validation rule like:
  body('calories').isNumeric().withMessage('Calories must be a number')
Change to:
  body('calories').optional().isNumeric().withMessage('Calories must be a number')

Do the same for ALL health record fields — make them ALL optional():
  body('waterIntake').optional().isNumeric()
  body('sleepHours').optional().isNumeric()
  body('mood').optional().isNumeric()
  body('weight').optional().isNumeric()

FIX FRONTEND — WaterTracker component (Dashboard.jsx or WaterTracker.jsx):

When a glass is clicked, the API call must:
1. First GET today's health record: GET /api/health?date=today
2. If record EXISTS: PATCH/PUT /api/health/:id with { waterIntake: newCount }
3. If NO record today: POST /api/health with { waterIntake: newCount, calories: 0, sleepHours: 0, mood: 3, date: new Date() }

Always send ALL fields with defaults so validation never fails:
```javascript
const handleWaterClick = async (index) => {
  const newCount = index + 1 === current ? index : index + 1;
  try {
    const today = new Date().toISOString().split('T')[0];
    const token = store.getState().auth?.token || '';
    const BASE = import.meta.env.VITE_API_URL;
    
    // Check if today's record exists
    const { data: records } = await axios.get(`${BASE}/health`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const todayRecord = records.find(r => 
      new Date(r.date).toISOString().split('T')[0] === today
    );
    
    if (todayRecord) {
      await axios.put(`${BASE}/health/${todayRecord._id}`, 
        { waterIntake: newCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(`${BASE}/health`,
        { waterIntake: newCount, calories: 0, sleepHours: 0, mood: 3, weight: 0, date: new Date() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    setCurrent(newCount);
  } catch (err) {
    console.error('Water update error:', err.message);
  }
};
```

FIX FRONTEND — MoodTracker component:
Same pattern — always include all fields with defaults:
```javascript
const handleMoodSelect = async (moodValue) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const token = store.getState().auth?.token || '';
    const BASE = import.meta.env.VITE_API_URL;
    
    const { data: records } = await axios.get(`${BASE}/health`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const todayRecord = records.find(r =>
      new Date(r.date).toISOString().split('T')[0] === today
    );
    
    if (todayRecord) {
      await axios.put(`${BASE}/health/${todayRecord._id}`,
        { mood: moodValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(`${BASE}/health`,
        { mood: moodValue, calories: 0, waterIntake: 0, sleepHours: 0, weight: 0, date: new Date() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    setSelectedMood(moodValue);
  } catch (err) {
    console.error('Mood update error:', err.message);
  }
};
```

==================================================
FIX 2 — STREAK CARD: CHANGE DARK MODE TO LIGHT
==================================================

The streak/motivational message card is dark (black background). Change it to light mode permanently.

In StreakCard.jsx, remove ALL dark mode conditional styling:

REMOVE: background: streakData?.isOnFire ? '#000' : '#fff'
REPLACE WITH: background: '#fff' always

REMOVE: color: streakData?.isOnFire ? '#C9A84C' : '#000' on numbers
REPLACE WITH: color: '#000' always

REMOVE: color: streakData?.isOnFire ? '#fff' : '#333' on message text
REPLACE WITH: color: '#333' always

REMOVE: color: streakData?.isOnFire ? '#888' : '#bbb' on footer
REPLACE WITH: color: '#888' always

Keep the 🔥 emoji and milestone badge — just make the entire card white background with black text always.

When streak >= 7, instead of dark background, show:
  - A thin gold top border (4px solid #C9A84C) on the card
  - The streak number in gold color (#C9A84C) instead of black
  - The 🔥 emoji next to the number

==================================================
FIX 3 — REPLACE TENOR SANS WITH BETTER FONT
==================================================

Replace 'Tenor Sans' with 'DM Serif Display' for all headings/labels throughout the app.
Replace body font 'Jost' with 'Inter' — clean, modern, used by Notion/Linear/Vercel.

Update client/index.html Google Fonts import:
REMOVE current fonts link
REPLACE WITH:
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

Update tailwind.config.js:
fontFamily: {
  cormorant: ['Cormorant Garamond', 'serif'],
  tenor: ['DM Serif Display', 'serif'],      // keeps same class names, changes font
  jost: ['Inter', 'sans-serif'],              // keeps same class names, changes font
  display: ['DM Serif Display', 'serif'],
  body: ['Inter', 'sans-serif'],
}

Update client/src/index.css:
body { font-family: 'Inter', sans-serif; }

This way every place that used font-tenor now shows DM Serif Display and font-jost shows Inter — no need to change individual components.

Font usage guide going forward:
  Main headings (Good Morning, page titles): Cormorant Garamond italic — keep as is
  Section labels (CALORIES TODAY, WATER INTAKE etc): DM Serif Display, uppercase
  Body text, descriptions, tips: Inter, 14-15px, #333
  Numbers/values in cards: Cormorant Garamond, large, bold

==================================================
FIX 4 — FIX ALL TEXT SIZE AND VISIBILITY ISSUES
==================================================

Many texts are too small or too light to read. Fix globally:

RULE 1 — Minimum font sizes:
  Body text: 14px minimum (never below 13px)
  Card labels: 13px minimum
  Descriptions/tips: 14px, color #444 (never lighter than #666)
  Small helper text: 12px minimum, color #666 (never lighter)
  Numbers in stat cards: 48px minimum

RULE 2 — Card label fixes (CALORIES TODAY, WATER INTAKE etc):
  font-family: DM Serif Display
  font-size: 14px (increase from current tiny size)
  letter-spacing: 0.15em
  color: #C9A84C
  text-transform: uppercase
  margin-bottom: 12px

RULE 3 — Section heading fixes (chart titles, page sections):
  font-family: DM Serif Display
  font-size: 15px
  letter-spacing: 0.15em
  color: #C9A84C
  text-transform: uppercase
  margin-bottom: 20px

RULE 4 — Dashboard greeting:
  "Good Morning, [Name]" — keep Cormorant Garamond italic, increase to 52px desktop / 36px mobile
  Date below: Inter, 15px, #666

RULE 5 — AI Insights tips text:
  Inter, 15px, #333, line-height: 1.8
  Each tip: left gold bar (3px solid #C9A84C), padding-left: 16px, margin-bottom: 16px

RULE 6 — Sidebar nav items:
  DM Serif Display, 13px, letter-spacing 0.12em, uppercase, color #000
  Active: color #C9A84C, left border 3px solid #C9A84C

RULE 7 — All buttons:
  Inter, 13px, letter-spacing 0.12em, uppercase, font-weight 500
  Minimum height: 44px (touch friendly)

RULE 8 — Table text (health records, exercises):
  Inter, 14px, #333
  Table headers: DM Serif Display, 12px, #888, uppercase, letter-spacing 0.1em

==================================================
FIX 5 — AI INSIGHTS: INCREASE TO 10 TIPS
==================================================

In server/controllers/aiController.js find the getSuggestions or getAiSuggestions function.

Change the prompt or mock response to return 10 tips instead of 5.

If using OpenAI:
  Change prompt to say "Give exactly 10 personalized health recommendations"
  Change max_tokens from 500 to 1500

If using mock data, replace the mock array with 10 items:
```javascript
const mockSuggestions = [
  "Drink a glass of water first thing in the morning to kickstart your metabolism and hydration.",
  "Aim for 7-9 hours of sleep tonight — your body repairs muscle and consolidates memory during deep sleep.",
  "Take a 10-minute walk after each meal to improve digestion and lower blood sugar spikes.",
  "Add a protein source to every meal to stay fuller longer and support muscle maintenance.",
  "Practice 5 minutes of deep breathing or meditation before bed to improve sleep quality.",
  "Limit screen time 1 hour before sleep — blue light suppresses melatonin production.",
  "Include at least 3 different colored vegetables in your meals today for diverse micronutrients.",
  "Do 20 minutes of moderate exercise today — even a brisk walk counts toward your daily goal.",
  "Track your mood daily — emotional wellbeing is as important as physical health metrics.",
  "Eat your largest meal at lunch when metabolism is highest, and keep dinner light."
];
```

In the frontend AI Insights panel:
  Render ALL 10 tips
  Each tip displayed as:
    - Container: padding-left 16px, border-left 3px solid #C9A84C, margin-bottom 16px
    - Number badge: DM Serif Display, gold, 13px — "01", "02" etc (padStart 2 zeros)
    - Tip text: Inter, 15px, #333, line-height 1.8
  
  Panel has internal scroll if too tall (max-height: 480px, overflow-y: auto)
  Custom scrollbar: 3px wide, gold thumb

==================================================
FINAL STEPS
==================================================

1. Fix all import errors and build errors
2. npm run build in client/ — must be 0 errors
3. git add . && git commit -m "fix: water/mood 400 error, streak light mode, font to DM Serif+Inter, text visibility, 10 AI insights" && git push origin main
4. Render → Manual Deploy → Deploy Latest Commit

Verify after deploy:
  ✅ Clicking water glasses updates count — no 400 error
  ✅ Clicking mood emoji logs mood — no 400 error
  ✅ Streak card is white/light background always
  ✅ Tenor Sans replaced with DM Serif Display everywhere
  ✅ All text minimum 14px and readable (no light gray tiny text)
  ✅ AI insights panel shows 10 tips
  ✅ Card labels (CALORIES TODAY etc) are 14px gold DM Serif Display
  ✅ No console errors on dashboard