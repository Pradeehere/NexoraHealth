const HealthRecord = require('../models/HealthRecord');

const getAiSuggestions = async (req, res, next) => {
    try {
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

        if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('dummy')) {
            // Implementation for actual OpenAI call if key is present
            // Change prompt to say "Give exactly 10 personalized health recommendations"
            // Change max_tokens from 500 to 1500
        }

        res.status(200).json({ suggestions: mockSuggestions });
    } catch (error) {
        next(error);
    }
};


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
    advice: `Consistency beats perfection. Stick to your ${daysPerWeek} days and results will follow within 4-6 weeks.`
  });
};

module.exports = { getAiSuggestions, getHealthScore, generateMealPlan, generateWorkoutPlan };


