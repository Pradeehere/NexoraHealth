Fix ONLY these two things in the existing Nexora Health app. Do not touch anything else.

==================================================
FIX 1 — FONT CHANGE (CRITICAL)
==================================================

The fonts "Tenor Sans", "DM Serif Display", and "Cormorant Garamond" must be completely 
removed from the ENTIRE app. Replace with these clean modern fonts used by top apps:

Update client/index.html — replace ALL font imports with ONLY this:
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet">

Font roles:
  Headings only (Good Morning, page titles, big numbers): Playfair Display — elegant, readable
  EVERYTHING else (labels, body, buttons, nav, tips, cards, tables): Plus Jakarta Sans

Update tailwind.config.js — replace fontFamily with:
fontFamily: {
  playfair: ['Playfair Display', 'serif'],
  jakarta: ['Plus Jakarta Sans', 'sans-serif'],
  cormorant: ['Playfair Display', 'serif'],   // redirect old class to new font
  tenor: ['Plus Jakarta Sans', 'sans-serif'], // redirect old class to new font
  jost: ['Plus Jakarta Sans', 'sans-serif'],  // redirect old class to new font
  body: ['Plus Jakarta Sans', 'sans-serif'],
}

Update client/src/index.css:
* { font-family: 'Plus Jakarta Sans', sans-serif; }
body { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #1a1a1a; }
h1, h2, h3 { font-family: 'Playfair Display', serif; }

Specific fixes:
- "DAILY STREAK" label → Plus Jakarta Sans, 11px, #C9A84C, uppercase, letter-spacing 0.2em
- "DAY STREAK" text next to number → Plus Jakarta Sans, 12px, #888, uppercase
- Streak motivational quote → Plus Jakarta Sans, 15px, #444, font-style: italic, NO quotes ""
- "BEST: X DAYS" → Plus Jakarta Sans, 11px, #999, uppercase
- Streak number (15) → Playfair Display, 64px, bold — ONLY the number
- All card labels (CALORIES TODAY, WATER INTAKE etc) → Plus Jakarta Sans, 12px, 
  font-weight: 600, #C9A84C, uppercase, letter-spacing: 0.15em
- All tip text in AI Insights → Plus Jakarta Sans, 15px, #333, line-height: 1.8, 
  font-weight: 400 — clean and very readable
- "NEXORA AI INSIGHTS" heading → Plus Jakarta Sans, 12px, font-weight: 700, 
  #C9A84C, uppercase, letter-spacing: 0.2em
- Sidebar nav items → Plus Jakarta Sans, 13px, font-weight: 600, uppercase, 
  letter-spacing: 0.1em
- All buttons → Plus Jakarta Sans, 13px, font-weight: 600, uppercase, letter-spacing: 0.08em
- Dashboard "Good Morning, [Name]" → Playfair Display italic, 48px — keep elegant

STREAK CARD — also fix dark background:
  Remove black background completely
  background: #ffffff always
  border: 1px solid #000
  The streak number: Playfair Display, color: #C9A84C when streak >= 7, else #000
  Quote text: Plus Jakarta Sans italic, #555, NO quotation marks around it
  Remove the " " characters wrapping the motivational message

==================================================
FEATURE — AI WORKOUT GENERATOR PAGE
==================================================

Create client/src/pages/WorkoutPlannerPage.jsx
Route: /workout-planner (add to App.jsx as protected route)
Add to Sidebar: icon = Dumbbell (Lucide), label = "WORKOUT PLAN", below MEAL PLANNER

PAGE LAYOUT:

Header:
  Label: Plus Jakarta Sans, 12px, gold, uppercase, tracking — "AI WORKOUT GENERATOR"  
  Title: Playfair Display italic, 48px, black — "Your Personal Workout Plan"
  Subtitle: Plus Jakarta Sans, 15px, #666 — "Generated based on your BMI and fitness goals"

Input Form (1px solid #000, no radius, p-8):
  - Fitness Goal dropdown: 
      Options: Weight Loss / Muscle Gain / Improve Stamina / Stay Active / Flexibility
  - Fitness Level dropdown:
      Options: Beginner / Intermediate / Advanced
  - Days Per Week dropdown: 3 / 4 / 5 / 6
  - Workout Duration dropdown: 30 mins / 45 mins / 60 mins
  - Equipment dropdown: No Equipment / Basic (dumbbells) / Full Gym
  - BMI is auto-fetched from user profile (show it read-only: "Your BMI: 24.5")
  
  [GENERATE WORKOUT PLAN] button — full width, black bg, white text, Plus Jakarta Sans,
  font-weight: 600, uppercase, 48px height

Loading state:
  "Crafting your personalized workout plan..." — Playfair Display italic, centered
  Animated gold pulsing bar below

Result Display — 7 day weekly plan:

Week header: "YOUR 7-DAY WORKOUT PLAN" — Plus Jakarta Sans, 12px, gold, uppercase

For each day (Monday through Sunday):
  Day card: 1px solid #000, no radius, p-6
  
  Day label row:
    Left: "MONDAY" — Plus Jakarta Sans, 11px, #888, uppercase, letter-spacing 0.2em
    Right: rest day badge OR workout type badge (gold bg, black text, Plus Jakarta Sans 11px)
  
  Workout name: Playfair Display, 22px, black (e.g. "Upper Body Strength")
  
  Duration + calories row: Plus Jakarta Sans, 13px, #666
    "45 min  •  320 kcal burned  •  Intermediate"
  
  Exercises list (3-5 exercises per day):
    Each exercise row:
      Exercise name: Plus Jakarta Sans, 14px, #000, font-weight: 600
      Sets/reps: Plus Jakarta Sans, 13px, #888 (e.g. "3 sets × 12 reps" or "20 min")
      Thin #eee bottom border between exercises
  
  Rest days show:
    "REST DAY" in gold
    Tip: "Active recovery — light stretching or a 20-min walk recommended"

Bottom summary card:
  "WEEKLY SUMMARY" — Plus Jakarta Sans gold uppercase 12px
  4 stats in a row: Total Workouts | Total Minutes | Est. Calories Burned | Focus Area
  Each: Playfair Display number large, Plus Jakarta Sans label small

[REGENERATE PLAN] outlined button + [SAVE PLAN] black button row

BACKEND — add to server/controllers/aiController.js:

```javascript
const generateWorkoutPlan = async (req, res) => {
  const { fitnessGoal = 'Stay Active', fitnessLevel = 'Beginner', 
          daysPerWeek = 3, duration = 45, equipment = 'No Equipment',
          bmi = 22 } = req.body;

  try {
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('dummy')) {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `Create a 7-day personalized workout plan for someone with:
        BMI: ${bmi}, Goal: ${fitnessGoal}, Level: ${fitnessLevel}, 
        Days/week: ${daysPerWeek}, Duration: ${duration} mins, Equipment: ${equipment}.
        
        Respond ONLY with valid JSON:
        {
          "days": [
            {
              "day": "Monday",
              "isRest": false,
              "workoutName": "Upper Body Strength",
              "type": "Strength",
              "duration": 45,
              "caloriesBurned": 300,
              "exercises": [
                { "name": "Push-ups", "sets": 3, "reps": "12 reps", "note": "Keep core tight" }
              ],
              "tip": "Focus on form over speed"
            }
          ],
          "totalWorkouts": 4,
          "totalMinutes": 180,
          "totalCalories": 1200,
          "focusArea": "Full Body",
          "advice": "one overall advice tip"
        }`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000
      });
      const json = JSON.parse(
        completion.choices[0].message.content.replace(/```json|```/g, '').trim()
      );
      return res.status(200).json(json);
    }
  } catch(e) {
    console.log('OpenAI failed, using smart mock:', e.message);
  }

  // Smart mock based on inputs
  const restDays = 7 - daysPerWeek;
  const workoutDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  
  const workoutsByGoal = {
    'Weight Loss': [
      { name: 'HIIT Cardio Blast', type: 'Cardio', cal: 400,
        exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: '45 seconds', note: 'Keep pace high' },
          { name: 'Burpees', sets: 3, reps: '10 reps', note: 'Full extension at top' },
          { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', note: 'Core engaged' },
          { name: 'High Knees', sets: 3, reps: '45 seconds', note: 'Drive knees up' },
        ]},
      { name: 'Full Body Circuit', type: 'Circuit', cal: 350,
        exercises: [
          { name: 'Squat Jumps', sets: 3, reps: '12 reps', note: 'Land softly' },
          { name: 'Push-ups', sets: 3, reps: '15 reps', note: 'Chest to floor' },
          { name: 'Reverse Lunges', sets: 3, reps: '10 each leg', note: 'Keep torso upright' },
          { name: 'Plank Hold', sets: 3, reps: '40 seconds', note: 'Squeeze glutes' },
        ]},
      { name: 'Core & Cardio', type: 'Mixed', cal: 300,
        exercises: [
          { name: 'Bicycle Crunches', sets: 3, reps: '20 reps', note: 'Slow and controlled' },
          { name: 'Leg Raises', sets: 3, reps: '15 reps', note: 'Lower back flat' },
          { name: 'Jump Rope', sets: 4, reps: '1 minute', note: 'Steady rhythm' },
        ]},
    ],
    'Muscle Gain': [
      { name: 'Upper Body Push', type: 'Strength', cal: 280,
        exercises: [
          { name: equipment === 'No Equipment' ? 'Diamond Push-ups' : 'Bench Press', sets: 4, reps: '8-10 reps', note: 'Progressive overload' },
          { name: equipment === 'No Equipment' ? 'Pike Push-ups' : 'Shoulder Press', sets: 3, reps: '10 reps', note: 'Full range of motion' },
          { name: equipment === 'No Equipment' ? 'Tricep Dips' : 'Tricep Pushdown', sets: 3, reps: '12 reps', note: 'Control the negative' },
        ]},
      { name: 'Lower Body Power', type: 'Strength', cal: 320,
        exercises: [
          { name: equipment === 'No Equipment' ? 'Pistol Squats' : 'Barbell Squats', sets: 4, reps: '8 reps', note: 'Depth is key' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10 reps', note: 'Hinge at hips' },
          { name: 'Calf Raises', sets: 4, reps: '20 reps', note: 'Full range' },
        ]},
      { name: 'Upper Body Pull', type: 'Strength', cal: 260,
        exercises: [
          { name: equipment === 'No Equipment' ? 'Pull-ups' : 'Lat Pulldown', sets: 4, reps: '8 reps', note: 'Engage lats' },
          { name: equipment === 'No Equipment' ? 'Bodyweight Rows' : 'Seated Row', sets: 3, reps: '12 reps', note: 'Squeeze shoulder blades' },
          { name: 'Bicep Curls', sets: 3, reps: '12 reps', note: 'No swinging' },
        ]},
    ],
    'Improve Stamina': [
      { name: 'Steady State Cardio', type: 'Cardio', cal: 350,
        exercises: [
          { name: 'Brisk Walk / Jog', sets: 1, reps: `${duration - 10} minutes`, note: 'Zone 2 heart rate' },
          { name: 'Bodyweight Squats', sets: 2, reps: '20 reps', note: 'Warm down' },
        ]},
      { name: 'Endurance Circuit', type: 'Endurance', cal: 380,
        exercises: [
          { name: 'Step-ups', sets: 4, reps: '1 minute', note: 'Consistent pace' },
          { name: 'Shadow Boxing', sets: 3, reps: '2 minutes', note: 'Keep moving' },
          { name: 'Jump Squats', sets: 3, reps: '45 seconds', note: 'Explode up' },
        ]},
    ],
    'Flexibility': [
      { name: 'Yoga Flow', type: 'Yoga', cal: 180,
        exercises: [
          { name: 'Sun Salutations', sets: 5, reps: 'full cycle', note: 'Breathe deeply' },
          { name: 'Warrior Sequence', sets: 3, reps: '45 seconds each', note: 'Hold the stretch' },
          { name: "Child's Pose", sets: 1, reps: '2 minutes', note: 'Relax completely' },
          { name: 'Seated Forward Fold', sets: 3, reps: '1 minute', note: 'No bouncing' },
        ]},
      { name: 'Mobility & Stretch', type: 'Mobility', cal: 150,
        exercises: [
          { name: 'Hip Flexor Stretch', sets: 3, reps: '60 seconds each', note: 'Feel the release' },
          { name: 'Thoracic Rotation', sets: 2, reps: '10 each side', note: 'Slow movement' },
          { name: 'Foam Rolling', sets: 1, reps: '15 minutes', note: 'Pause on tender spots' },
        ]},
    ],
    'Stay Active': [
      { name: 'Full Body Movement', type: 'Mixed', cal: 250,
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: '15 reps', note: 'Comfortable pace' },
          { name: 'Push-ups', sets: 3, reps: '10 reps', note: 'Modify if needed' },
          { name: 'Walking Lunges', sets: 2, reps: '10 each leg', note: 'Balance focus' },
          { name: 'Plank', sets: 3, reps: '30 seconds', note: 'Breathe steadily' },
        ]},
    ],
  };

  const templates = workoutsByGoal[fitnessGoal] || workoutsByGoal['Stay Active'];
  
  // Assign workouts to days
  const restDayIndices = [];
  const step = Math.floor(7 / (restDays + 1));
  for (let i = 0; i < restDays; i++) restDayIndices.push((i + 1) * step);

  const days = workoutDays.map((day, index) => {
    if (restDayIndices.includes(index)) {
      return {
        day, isRest: true,
        workoutName: 'Rest Day',
        type: 'Recovery',
        duration: 0, caloriesBurned: 0, exercises: [],
        tip: 'Active recovery day — gentle stretching or a 20-minute walk is ideal'
      };
    }
    const workout = templates[index % templates.length];
    return {
      day, isRest: false,
      workoutName: workout.name,
      type: workout.type,
      duration: Number(duration),
      caloriesBurned: workout.cal,
      exercises: workout.exercises,
      tip: `Focus on ${fitnessLevel === 'Beginner' ? 'form and consistency' : 'progressive overload'}`
    };
  });

  const workoutDaysArr = days.filter(d => !d.isRest);
  return res.status(200).json({
    days,
    totalWorkouts: workoutDaysArr.length,
    totalMinutes: workoutDaysArr.reduce((s, d) => s + d.duration, 0),
    totalCalories: workoutDaysArr.reduce((s, d) => s + d.caloriesBurned, 0),
    focusArea: fitnessGoal,
    advice: `Consistency beats perfection. Stick to your ${daysPerWeek} days and 
             results will follow within 4-6 weeks.`
  });
};
```

Add to server/routes/aiRoutes.js:
  POST /api/ai/workout-plan [protected]
  Handler: aiController.generateWorkoutPlan

==================================================
FINAL STEPS
==================================================

1. npm install in both server/ and client/
2. npm run build in client/ — 0 errors
3. git add . && git commit -m "fix: font to Plus Jakarta Sans + Playfair, AI workout generator, streak light mode" && git push origin main
4. Render → Manual Deploy → Deploy Latest Commit

Verify:
  ✅ ALL old fonts gone — Plus Jakarta Sans everywhere, Playfair for headings/numbers only
  ✅ Streak card white background, quote has NO "" quotes, clean readable text
  ✅ AI insights text clear and readable at 15px Plus Jakarta Sans
  ✅ /workout-planner page loads and generates 7-day plan
  ✅ All 7 days shown with exercises, sets, reps
  ✅ Rest days clearly marked
  ✅ WORKOUT PLAN in sidebar navigation
  ✅ No console errors

  In the existing Nexora Health app, do ONLY this one change. Do not touch anything else.

Find every single place in the entire codebase where:
- 'Tenor Sans' is used
- 'tenor' font class is used  
- font-tenor is used
- fontFamily includes Tenor Sans
- any inline style has fontFamily: 'Tenor Sans'

Replace ALL of them with 'Plus Jakarta Sans'

Also update tailwind.config.js:
tenor: ['Plus Jakarta Sans', 'sans-serif']

Also update index.html Google Fonts — make sure Plus Jakarta Sans is imported:
Add to existing fonts link: &family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800

Keep Cormorant Garamond exactly as it is — do not touch it anywhere.
Keep Inter exactly as it is — do not touch it.

After changes:
git add . && git commit -m "fix: replace all Tenor Sans with Plus Jakarta Sans" && git push origin main

Then Render → Manual Deploy.