import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MealPlannerPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    calorieGoal: 2000,
    dietType: 'Any',
    meals: 3,
    allergies: ''
  });
  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem('nexora-meal-plan');
    return saved ? JSON.parse(saved) : null;
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post('/api/ai/meal-plan', formData, config);
      setMealPlan(data);
    } catch (err) {
      console.error("Meal plan error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (mealPlan) {
      localStorage.setItem('nexora-meal-plan', JSON.stringify(mealPlan));
      alert('Meal plan saved to your library');
    }
  };

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Jost, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px' }}>
        <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.25em', color: '#C9A84C', fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>
          MEAL PLANNER
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '48px', fontStyle: 'italic', color: '#000', margin: 0, fontWeight: 600 }}>
          AI-Powered Nutrition
        </h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: mealPlan ? '1fr 2fr' : '1fr', gap: '40px' }}>
        {/* Form Card */}
        <div style={{ border: '1px solid #000', padding: '32px', height: 'fit-content', background: '#fff' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Tenor Sans', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '8px', color: '#888' }}>DAILY CALORIE GOAL</label>
              <input 
                type="number" 
                value={formData.calorieGoal}
                onChange={(e) => setFormData({...formData, calorieGoal: e.target.value})}
                placeholder="e.g. 2000"
                min="1000" max="5000"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', fontFamily: 'Jost' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Tenor Sans', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '8px', color: '#888' }}>DIET TYPE</label>
              <select 
                value={formData.dietType}
                onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', fontFamily: 'Jost' }}
              >
                <option value="Any">Any</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
                <option value="High Protein">High Protein</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Tenor Sans', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '8px', color: '#888' }}>NUMBER OF MEALS</label>
              <select 
                value={formData.meals}
                onChange={(e) => setFormData({...formData, meals: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', fontFamily: 'Jost' }}
              >
                <option value="3">3 Meals</option>
                <option value="4">4 Meals</option>
                <option value="5">5 Meals</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Tenor Sans', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '8px', color: '#888' }}>ALLERGIES</label>
              <input 
                type="text" 
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                placeholder="e.g. nuts, dairy (optional)"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', fontFamily: 'Jost' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ background: '#000', color: '#fff', padding: '16px', border: 'none', fontFamily: 'Tenor Sans', letterSpacing: '0.2em', cursor: 'pointer', marginTop: '8px' }}
            >
              {loading ? 'GENERATING...' : 'GENERATE MEAL PLAN'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', fontStyle: 'italic', marginBottom: '16px' }}>Generating your personalized meal plan...</p>
              <div style={{ height: '2px', width: '100px', background: '#C9A84C', margin: '0 auto', animation: 'pulse 1.5s infinite' }}></div>
              <style>{`
                @keyframes pulse {
                  0% { opacity: 0.3; width: 0; }
                  50% { opacity: 1; width: 150px; }
                  100% { opacity: 0.3; width: 0; }
                }
              `}</style>
            </div>
          )}

          {!loading && mealPlan && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {mealPlan.meals && mealPlan.meals.map((meal, idx) => (
                <div key={idx} style={{ border: '1px solid #000', padding: '24px', background: '#fff' }}>
                  <p style={{ fontFamily: 'Tenor Sans', fontSize: '11px', letterSpacing: '0.2em', color: '#C9A84C', marginBottom: '8px' }}>{meal.type?.toUpperCase()}</p>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '28px', fontStyle: 'italic', color: '#000', margin: '0 0 12px 0' }}>{meal.name}</h3>
                  <p style={{ fontFamily: 'Jost', fontSize: '14px', color: '#555', lineHeight: 1.7, marginBottom: '20px' }}>{meal.description}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'CALORIES', val: meal.calories },
                      { label: 'PROTEIN', val: meal.protein, unit: 'g' },
                      { label: 'CARBS', val: meal.carbs, unit: 'g' },
                      { label: 'FATS', val: meal.fats, unit: 'g' }
                    ].map((m, i) => (
                      <div key={i} style={{ border: '1px solid #eee', padding: '6px 12px', display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: 'Tenor Sans', fontSize: '9px', letterSpacing: '0.1em', color: '#888' }}>{m.label}</span>
                        <span style={{ fontFamily: 'Jost', fontSize: '12px', fontWeight: 600, color: '#C9A84C' }}>{m.val}{m.unit || ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ border: '1px solid #C9A84C', padding: '32px', background: '#fdf8ee', marginTop: '12px' }}>
                <p style={{ fontFamily: 'Tenor Sans', fontSize: '11px', letterSpacing: '0.2em', color: '#C9A84C', marginBottom: '16px' }}>DAILY TOTALS</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                  {[
                    { label: 'TOTAL CALORIES', val: mealPlan.totalCalories },
                    { label: 'PROTEIN', val: mealPlan.totalProtein, unit: 'g' },
                    { label: 'CARBS', val: mealPlan.totalCarbs, unit: 'g' },
                    { label: 'FATS', val: mealPlan.totalFats, unit: 'g' }
                  ].map((t, i) => (
                    <div key={i} style={{ flex: 1, minWidth: '100px' }}>
                      <p style={{ fontFamily: 'Tenor Sans', fontSize: '9px', color: '#888', marginBottom: '4px' }}>{t.label}</p>
                      <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '32px', fontWeight: 600, margin: 0 }}>{t.val}{t.unit || ''}</p>
                    </div>
                  ))}
                </div>
                <div style={{ height: '1px', background: '#C9A84C', margin: '20px 0', opacity: 0.3 }}></div>
                <p style={{ fontFamily: 'Jost', fontSize: '14px', fontStyle: 'italic', color: '#555' }}>
                  💡 {mealPlan.tip}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button onClick={() => setMealPlan(null)} style={{ flex: 1, padding: '14px', border: '1px solid #000', background: 'transparent', fontFamily: 'Tenor Sans', fontSize: '12px', letterSpacing: '0.15em', cursor: 'pointer' }}>REGENERATE</button>
                <button onClick={handleSave} style={{ flex: 1, padding: '14px', border: 'none', background: '#000', color: '#fff', fontFamily: 'Tenor Sans', fontSize: '12px', letterSpacing: '0.15em', cursor: 'pointer' }}>SAVE PLAN</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlannerPage;
