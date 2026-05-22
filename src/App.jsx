import { useState, useRef } from "react";

// ─── FOOD DATABASE ────────────────────────────────────────────────────
const FOOD_GROUPS = {
  protein: { label: "Protein", color: "#8B2E2E", light: "#FDF0F0", emoji: "🥩" },
  carbs: { label: "Complex Carbs", color: "#8B6914", light: "#FDF6E3", emoji: "🌾" },
  fat: { label: "Healthy Fats", color: "#2A6B7D", light: "#E8F4F8", emoji: "🥑" },
  veggie: { label: "Vegetables", color: "#2A7D4F", light: "#E8F5EE", emoji: "🥦" },
  fruit: { label: "Fruit", color: "#7D2A6B", light: "#F5E8F3", emoji: "🍓" },
  herb: { label: "Herbs & Drinks", color: "#5C3A8B", light: "#F0ECF8", emoji: "🌿" },
};

const BENEFITS = {
  potassium: { label: "High K+", color: "#2A7D4F", desc: "Replenishes critically low potassium" },
  adrenal: { label: "Adrenal", color: "#8B6914", desc: "Nourishes exhausted adrenal glands" },
  antiInflam: { label: "Anti-Inflam", color: "#8B2E2E", desc: "Reduces inflammation driving your Na/K" },
  selenium: { label: "Selenium", color: "#5C3A8B", desc: "Supports thyroid and antioxidant defense" },
  magnesium: { label: "Magnesium", color: "#2A6B7D", desc: "Replenishes critically low magnesium" },
  bloodSugar: { label: "Blood Sugar", color: "#7D2A6B", desc: "Stabilizes blood sugar throughout the day" },
  detox: { label: "Detox", color: "#3A7D5C", desc: "Supports liver and heavy metal clearance" },
  k2: { label: "Vitamin K2", color: "#8B5014", desc: "Helps move calcium to bones" },
  vitA: { label: "Vitamin A", color: "#C4692A", desc: "Supports calcium shell protocol" },
  copper: { label: "Copper Bal", color: "#6B3F1A", desc: "Supports copper balance gently" },
};

const ALL_FOODS = [
  // PROTEINS
  { id: "eggs", name: "Pasture-Raised Eggs", group: "protein", portion: "2–3 eggs", benefits: ["adrenal","selenium","vitA"], paths: ["all"] },
  { id: "chicken", name: "Chicken Thighs", group: "protein", portion: "4–6 oz", benefits: ["adrenal","antiInflam"], paths: ["all"] },
  { id: "salmon", name: "Wild Salmon", group: "protein", portion: "4–6 oz", benefits: ["antiInflam","selenium"], paths: ["all"] },
  { id: "sardines", name: "Sardines (with bones)", group: "protein", portion: "1 can", benefits: ["antiInflam","selenium","k2"], paths: ["all"] },
  { id: "walleye", name: "Walleye", group: "protein", portion: "4–6 oz", benefits: ["antiInflam","selenium"], paths: ["all"] },
  { id: "venison", name: "Ground Venison", group: "protein", portion: "4–6 oz", benefits: ["adrenal","antiInflam"], paths: ["all"] },
  { id: "beef", name: "Grass-Fed Beef", group: "protein", portion: "4–6 oz", benefits: ["adrenal","copper"], paths: ["all"] },
  { id: "liver", name: "Grass-Fed Liver", group: "protein", portion: "2–3 oz", benefits: ["vitA","copper","adrenal"], paths: ["calcium-shell","copper-imbalance","high-nak"] },
  { id: "oysters", name: "Oysters", group: "protein", portion: "3–4 oz", benefits: ["selenium","copper","adrenal"], paths: ["all"] },
  { id: "boneBroth", name: "Bone Broth", group: "protein", portion: "1 cup", benefits: ["adrenal","detox","antiInflam"], paths: ["all"] },
  { id: "tuna", name: "Canned Wild Tuna", group: "protein", portion: "1 can", benefits: ["antiInflam","selenium"], paths: ["all"] },
  { id: "legumes", name: "Lentils / Chickpeas", group: "protein", portion: "1/2 cup cooked", benefits: ["potassium","bloodSugar"], paths: ["all"] },

  // COMPLEX CARBS
  { id: "sweetPotato", name: "Sweet Potato", group: "carbs", portion: "1 medium", benefits: ["potassium","bloodSugar","adrenal"], paths: ["all"] },
  { id: "potato", name: "White Potato", group: "carbs", portion: "1 medium", benefits: ["potassium","bloodSugar"], paths: ["all"] },
  { id: "oats", name: "Certified GF Oats", group: "carbs", portion: "1/2 cup dry", benefits: ["bloodSugar","magnesium"], paths: ["high-nak","low-nak","four-lows","camg"] },
  { id: "rice", name: "White Rice", group: "carbs", portion: "1/2 cup cooked", benefits: ["bloodSugar"], paths: ["all"] },
  { id: "whiteBeans", name: "White Beans", group: "carbs", portion: "1/2 cup", benefits: ["potassium","bloodSugar","magnesium"], paths: ["all"] },
  { id: "squash", name: "Butternut Squash", group: "carbs", portion: "1 cup", benefits: ["potassium","bloodSugar","vitA"], paths: ["all"] },
  { id: "beets", name: "Beets", group: "carbs", portion: "1 cup", benefits: ["potassium","detox","antiInflam"], paths: ["all"] },
  { id: "quinoa", name: "Quinoa", group: "carbs", portion: "1/2 cup cooked", benefits: ["bloodSugar","magnesium"], paths: ["all"] },

  // HEALTHY FATS
  { id: "avocado", name: "Avocado", group: "fat", portion: "1/2 avocado", benefits: ["potassium","magnesium","bloodSugar"], paths: ["all"] },
  { id: "oliveOil", name: "Olive Oil (Extra Virgin)", group: "fat", portion: "1–2 tbsp", benefits: ["antiInflam"], paths: ["all"] },
  { id: "coconutMilk", name: "Coconut Milk (full fat)", group: "fat", portion: "1/4 cup", benefits: ["bloodSugar","adrenal"], paths: ["all"] },
  { id: "pumpkinSeeds", name: "Pumpkin Seeds", group: "fat", portion: "2 tbsp", benefits: ["magnesium","potassium","copper"], paths: ["all"] },
  { id: "almonds", name: "Almonds", group: "fat", portion: "Small handful", benefits: ["magnesium","bloodSugar"], paths: ["low-nak","four-lows","camg","speeding-up"] },
  { id: "brazilNuts", name: "Brazil Nuts", group: "fat", portion: "1–2 nuts only", benefits: ["selenium"], paths: ["all"] },
  { id: "codLiverOil", name: "Cod Liver Oil", group: "fat", portion: "1 tsp", benefits: ["vitA","antiInflam","k2"], paths: ["calcium-shell","copper-imbalance"] },
  { id: "grassFedButter", name: "Grass-Fed Butter", group: "fat", portion: "1 tsp", benefits: ["vitA","k2"], paths: ["calcium-shell","all"] },
  { id: "darkChocolate", name: "Dark Chocolate (85%+)", group: "fat", portion: "1–2 squares", benefits: ["magnesium","copper"], paths: ["all"] },

  // VEGETABLES
  { id: "swissChard", name: "Swiss Chard (cooked)", group: "veggie", portion: "1 cup", benefits: ["potassium","magnesium","antiInflam"], paths: ["all"] },
  { id: "spinach", name: "Spinach (cooked)", group: "veggie", portion: "1 cup", benefits: ["potassium","magnesium","antiInflam"], paths: ["all"] },
  { id: "broccoli", name: "Broccoli (cooked)", group: "veggie", portion: "1 cup", benefits: ["potassium","detox","antiInflam"], paths: ["all"] },
  { id: "zucchini", name: "Zucchini", group: "veggie", portion: "1 whole", benefits: ["potassium","antiInflam"], paths: ["all"] },
  { id: "bokChoy", name: "Bok Choy (cooked)", group: "veggie", portion: "1 cup", benefits: ["potassium","antiInflam","k2"], paths: ["all"] },
  { id: "garlic", name: "Garlic", group: "veggie", portion: "2–3 cloves", benefits: ["detox","antiInflam","adrenal"], paths: ["all"] },
  { id: "celery", name: "Celery", group: "veggie", portion: "2–3 stalks", benefits: ["adrenal","potassium"], paths: ["all"] },
  { id: "carrot", name: "Carrots", group: "veggie", portion: "1 cup", benefits: ["vitA","bloodSugar"], paths: ["all"] },
  { id: "beetGreens", name: "Beet Greens", group: "veggie", portion: "1 cup cooked", benefits: ["potassium","magnesium","detox"], paths: ["all"] },
  { id: "kale", name: "Kale (cooked)", group: "veggie", portion: "1 cup", benefits: ["potassium","antiInflam","k2"], paths: ["all"] },
  { id: "cilantro", name: "Fresh Cilantro", group: "veggie", portion: "Handful", benefits: ["detox"], paths: ["all"] },

  // FRUIT
  { id: "banana", name: "Banana", group: "fruit", portion: "1 medium", benefits: ["potassium","bloodSugar"], paths: ["all"] },
  { id: "berries", name: "Mixed Berries", group: "fruit", portion: "1/2 cup", benefits: ["antiInflam","bloodSugar"], paths: ["all"] },
  { id: "orangeJuice", name: "Fresh Orange Juice", group: "fruit", portion: "4 oz", benefits: ["adrenal","antiInflam"], paths: ["all"] },
  { id: "lemon", name: "Lemon / Lime", group: "fruit", portion: "1/2 squeezed", benefits: ["detox","adrenal"], paths: ["all"] },
  { id: "apple", name: "Apple", group: "fruit", portion: "1 medium", benefits: ["bloodSugar"], paths: ["all"] },
  { id: "dates", name: "Dates", group: "fruit", portion: "2–3 dates", benefits: ["potassium","adrenal"], paths: ["all"] },

  // HERBS & DRINKS
  { id: "nettlesTea", name: "Nettles Infusion", group: "herb", portion: "1–2 cups", benefits: ["potassium","magnesium","adrenal"], paths: ["all"] },
  { id: "coconutWater", name: "Coconut Water", group: "herb", portion: "1 cup", benefits: ["potassium","adrenal","bloodSugar"], paths: ["all"] },
  { id: "turmeric", name: "Turmeric + Black Pepper", group: "herb", portion: "1/4 tsp each", benefits: ["antiInflam","detox"], paths: ["all"] },
  { id: "ginger", name: "Fresh Ginger", group: "herb", portion: "1 tsp grated", benefits: ["antiInflam","adrenal"], paths: ["all"] },
  { id: "dandelionTea", name: "Dandelion Root Tea", group: "herb", portion: "1 cup", benefits: ["detox","copper"], paths: ["all"] },
  { id: "lemonBalm", name: "Lemon Balm Tea", group: "herb", portion: "1 cup", benefits: ["adrenal"], paths: ["all"] },
  { id: "celticSalt", name: "Celtic Grey Salt", group: "herb", portion: "1/4 tsp", benefits: ["adrenal","potassium"], paths: ["all"] },
  { id: "creamTartar", name: "Cream of Tartar", group: "herb", portion: "1/4 tsp", benefits: ["potassium","adrenal"], paths: ["all"] },
];

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PATH_COLORS = {
  "calcium-shell": "#8B6914",
  "high-nak": "#8B2E2E",
  "low-nak": "#2A4A8B",
  "four-lows": "#5C3A8B",
  "copper-imbalance": "#6B3F1A",
  "camg": "#2A6B7D",
  "speeding-up": "#7A8C2A",
};

const PATH_NAMES = {
  "calcium-shell": "🧱 Calcium Shell",
  "high-nak": "🔥 High Na/K",
  "low-nak": "📉 Low Na/K",
  "four-lows": "🔋 Four Lows",
  "copper-imbalance": "🟤 Copper Imbalance",
  "camg": "🩸 Ca/Mg Blood Sugar",
  "speeding-up": "⚡ Speeding Up",
};

export default function MealPlanner() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const pathKey = params.get("path") || "high-nak";
  const clientName = params.get("name") || "Friend";
  const firstName = clientName.split(" ")[0];
  const pathColor = PATH_COLORS[pathKey] || "#2A7D6E";

  const [activeTab, setActiveTab] = useState("planner");
  const [activeDay, setActiveDay] = useState(0);
  const [activeMeal, setActiveMeal] = useState(null);
  const [weekPlan, setWeekPlan] = useState(() => {
    const plan = {};
    DAYS.forEach(d => { plan[d] = {}; MEALS.forEach(m => { plan[d][m] = []; }); });
    return plan;
  });
  const [hoveredFood, setHoveredFood] = useState(null);
  const [activeGroup, setActiveGroup] = useState("all");
  const [activeBenefit, setActiveBenefit] = useState("all");
  const [dragging, setDragging] = useState(null);
  const [showGrocery, setShowGrocery] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const dragOver = useRef(null);

  const day = DAYS[activeDay];

  // Filter foods for this path
  const pathFoods = ALL_FOODS.filter(f =>
    f.paths.includes("all") || f.paths.includes(pathKey)
  );

  // Apply group + benefit filters
  const filteredFoods = pathFoods.filter(f => {
    const groupMatch = activeGroup === "all" || f.group === activeGroup;
    const benefitMatch = activeBenefit === "all" || f.benefits.includes(activeBenefit);
    return groupMatch && benefitMatch;
  });

  function addFoodToMeal(food, meal) {
    if (!meal) return;
    const current = weekPlan[day][meal];
    if (current.find(f => f.id === food.id)) return;
    setWeekPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: [...current, food] }
    }));
  }

  function removeFoodFromMeal(food, meal) {
    setWeekPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: prev[day][meal].filter(f => f.id !== food.id) }
    }));
  }

  function copyDayToAll() {
    const source = weekPlan[day];
    setWeekPlan(prev => {
      const updated = { ...prev };
      DAYS.forEach(d => { if (d !== day) updated[d] = JSON.parse(JSON.stringify(source)); });
      return updated;
    });
  }

  // Grocery list generation
  const groceryList = (() => {
    const items = {};
    DAYS.forEach(d => {
      MEALS.forEach(m => {
        weekPlan[d][m].forEach(food => {
          if (!items[food.id]) items[food.id] = { ...food, days: new Set() };
          items[food.id].days.add(d);
        });
      });
    });
    const grouped = {};
    Object.values(items).forEach(item => {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group].push(item);
    });
    return grouped;
  })();

  const totalFoodsPlanned = Object.values(weekPlan).reduce((sum, day) =>
    sum + Object.values(day).reduce((s, meal) => s + meal.length, 0), 0
  );

  // Potassium tracker
  const highKFoodsToday = MEALS.reduce((sum, m) =>
    sum + weekPlan[day][m].filter(f => f.benefits.includes("potassium")).length, 0
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FAF6F0", fontFamily: "'DM Sans', sans-serif", color: "#5C3D2E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .rr-brand-bar {
          background: #5C3D2E;
          padding: 8px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 200;
        }
        .rr-brand-bar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rr-brand-dot {
          width: 28px; height: 28px;
          background: #7A9E7E;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .rr-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #C9A882;
          letter-spacing: 0.3px;
        }
        .rr-brand-tool {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
        }


        .food-card {
          background: white;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: grab;
          border: 1.5px solid #eee;
          transition: all 0.15s ease;
          user-select: none;
          position: relative;
        }
        .food-card:hover {
          border-color: ${pathColor};
          box-shadow: 0 3px 12px ${pathColor}25;
          transform: translateY(-1px);
        }
        .food-card:active { cursor: grabbing; transform: scale(0.97); }

        .meal-slot {
          background: white;
          border-radius: 12px;
          border: 2px dashed #e0e0e0;
          padding: 12px;
          min-height: 80px;
          transition: all 0.15s;
        }
        .meal-slot.active {
          border-color: ${pathColor};
          background: ${pathColor}08;
        }
        .meal-slot.drag-over {
          border-color: ${pathColor};
          background: ${pathColor}15;
          transform: scale(1.01);
        }

        .benefit-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 7px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
          margin: 2px 2px 0 0;
          cursor: pointer;
          color: white;
        }

        .filter-pill {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1.5px solid #e0e0e0;
          background: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .filter-pill:hover { border-color: ${pathColor}; color: ${pathColor}; }
        .filter-pill.active { background: ${pathColor}; border-color: ${pathColor}; color: white; }

        .day-btn {
          padding: 8px 4px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          border-radius: 10px;
          transition: all 0.15s;
          min-width: 44px;
        }
        .day-btn:hover { background: ${pathColor}15; }
        .day-btn.active { background: ${pathColor}; }

        .tab-btn {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          border-bottom: 3px solid transparent;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .tab-btn.active { border-bottom-color: ${pathColor}; color: ${pathColor}; }

        .added-food {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f9f9f9;
          border-radius: 8px;
          padding: 7px 10px;
          margin-bottom: 6px;
          border: 1px solid #eee;
          gap: 8px;
        }

        .remove-btn {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: none;
          background: #fee;
          color: #c00;
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          line-height: 1;
          font-weight: 700;
        }

        .k-bar {
          height: 8px;
          border-radius: 100px;
          background: #eee;
          overflow: hidden;
          margin-top: 4px;
        }
        .k-fill {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(90deg, #2A7D4F, #4BAA70);
          transition: width 0.3s ease;
        }

        .tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 100;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #1a1a1a;
        }

        .grocery-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .print-btn {
          padding: 10px 20px;
          background: ${pathColor};
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .print-btn:hover { opacity: 0.85; }

        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }

        @media (max-width: 600px) {
          .food-grid { grid-template-columns: 1fr 1fr !important; }
          .filters-wrap { overflow-x: auto; }
        }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────── */}
      <div style={{ background: "white", borderBottom: "1px solid #eee", padding: "0 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ padding: "14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px,3vw,24px)", fontWeight: 700, margin: 0 }}>
                {firstName}'s Meal Planner
              </h1>
              <p style={{ fontSize: 12, color: pathColor, fontWeight: 700, margin: "2px 0 0", letterSpacing: 0.5 }}>
                {PATH_NAMES[pathKey]}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>
                {totalFoodsPlanned} foods planned this week
              </div>
              <button className="print-btn no-print" onClick={() => setShowGrocery(!showGrocery)}>
                {showGrocery ? "← Back to Planner" : "🛒 Grocery List"}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 8 }}>
            {["planner", "learn"].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)} style={{ color: activeTab === tab ? pathColor : "#888" }}>
                {tab === "planner" ? "📅 Weekly Planner" : "📚 Why These Foods"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GROCERY LIST VIEW ─────────────────────────── */}
      {showGrocery && (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>
              🛒 Your Weekly Grocery List
            </h2>
            <button className="print-btn" onClick={() => window.print()}>Print List</button>
          </div>

          {Object.keys(groceryList).length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p style={{ fontSize: 16, fontStyle: "italic" }}>Add foods to your meal plan first — your grocery list will appear here automatically.</p>
            </div>
          ) : (
            Object.entries(groceryList).map(([group, foods]) => (
              <div key={group} style={{ marginBottom: 24, background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: FOOD_GROUPS[group].color, marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {FOOD_GROUPS[group].emoji} {FOOD_GROUPS[group].label}
                </h3>
                {foods.map(food => (
                  <div key={food.id} className="grocery-row">
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: "2px solid #ddd", flexShrink: 0, marginTop: 1 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{food.name}</div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 1 }}>
                        {food.portion} · Used {food.days.size} day{food.days.size !== 1 ? "s" : ""} this week
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 140 }}>
                      {food.benefits.slice(0, 2).map(b => (
                        <span key={b} className="benefit-tag" style={{ background: BENEFITS[b].color, fontSize: 9 }}>
                          {BENEFITS[b].label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── LEARN TAB ────────────────────────────────── */}
      {!showGrocery && activeTab === "learn" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            Why These Foods Work for Your Pattern
          </h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 28, fontStyle: "italic" }}>
            Understanding the why makes the what stick. Here's what each benefit label means for your body right now.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
            {Object.entries(BENEFITS).map(([key, b]) => (
              <div key={key} style={{ background: "white", borderRadius: 12, padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", borderTop: `3px solid ${b.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className="benefit-tag" style={{ background: b.color }}>{b.label}</span>
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{b.desc}</p>
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Best Sources
                  </div>
                  {pathFoods.filter(f => f.benefits.includes(key)).slice(0, 4).map(f => (
                    <div key={f.id} style={{ fontSize: 12, color: "#444", padding: "3px 0", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
                      <span>{f.name}</span>
                      <span style={{ color: "#aaa" }}>{f.portion}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
            Your Protocol's Key Priorities
          </h2>
          <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {["potassium", "adrenal", "antiInflam", "magnesium", "selenium"].map(key => {
                const b = BENEFITS[key];
                const topFoods = pathFoods.filter(f => f.benefits.includes(key)).slice(0, 3);
                return (
                  <div key={key} style={{ padding: 14, background: "#FAF6F0", borderRadius: 8 }}>
                    <span className="benefit-tag" style={{ background: b.color, marginBottom: 8, display: "inline-flex" }}>{b.label}</span>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>{b.desc}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>
                      {topFoods.map(f => f.name).join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PLANNER TAB ──────────────────────────────── */}
      {!showGrocery && activeTab === "planner" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

            {/* LEFT — Day view */}
            <div>
              {/* Day selector */}
              <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", gap: 4, justifyContent: "space-between", alignItems: "center" }}>
                  {DAYS.map((d, i) => {
                    const foodCount = MEALS.reduce((sum, m) => sum + weekPlan[d][m].length, 0);
                    return (
                      <button key={d} className={`day-btn ${activeDay === i ? "active" : ""}`}
                        onClick={() => setActiveDay(i)}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: activeDay === i ? "white" : "#aaa" }}>
                          {d}
                        </span>
                        <span style={{ fontSize: 18, fontWeight: 700, color: activeDay === i ? "white" : "#5C3D2E" }}>
                          {i + 1}
                        </span>
                        {foodCount > 0 && (
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeDay === i ? "rgba(255,255,255,0.6)" : pathColor }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Potassium tracker */}
              <div style={{ background: "white", borderRadius: 10, padding: "12px 16px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
                    🌿 Potassium-Rich Foods Today
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: highKFoodsToday >= 3 ? "#2A7D4F" : "#E65100" }}>
                    {highKFoodsToday}/3 recommended
                  </span>
                </div>
                <div className="k-bar">
                  <div className="k-fill" style={{ width: `${Math.min(100, (highKFoodsToday / 3) * 100)}%` }} />
                </div>
                <p style={{ fontSize: 11, color: "#aaa", marginTop: 4, fontStyle: "italic" }}>
                  Aim for potassium-rich foods at every meal — your K level is critically low.
                </p>
              </div>

              {/* Meal slots */}
              <div style={{ display: "grid", gap: 12 }}>
                {MEALS.map(meal => (
                  <div key={meal}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                      {meal}
                    </div>
                    <div
                      className={`meal-slot ${activeMeal === meal ? "active" : ""}`}
                      onClick={() => setActiveMeal(activeMeal === meal ? null : meal)}
                      onDragOver={e => { e.preventDefault(); dragOver.current = meal; }}
                      onDrop={e => {
                        e.preventDefault();
                        if (dragging) { addFoodToMeal(dragging, meal); setDragging(null); }
                      }}
                    >
                      {weekPlan[day][meal].length === 0 ? (
                        <p style={{ fontSize: 13, color: "#ccc", fontStyle: "italic", margin: "8px 0", textAlign: "center" }}>
                          {activeMeal === meal ? "← Select foods from the panel" : "Tap to add foods"}
                        </p>
                      ) : (
                        weekPlan[day][meal].map(food => (
                          <div key={food.id} className="added-food">
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: 14 }}>{FOOD_GROUPS[food.group].emoji}</span>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {food.name}
                                </div>
                                <div style={{ fontSize: 11, color: "#aaa" }}>{food.portion}</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 3 }}>
                              {food.benefits.slice(0, 2).map(b => (
                                <span key={b} className="benefit-tag" style={{ background: BENEFITS[b].color }}>{BENEFITS[b].label}</span>
                              ))}
                            </div>
                            <button className="remove-btn" onClick={e => { e.stopPropagation(); removeFoodFromMeal(food, meal); }}>
                              ×
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Copy to all days */}
              <button onClick={copyDayToAll} style={{ marginTop: 16, width: "100%", padding: "12px", border: `2px dashed ${pathColor}`, borderRadius: 10, background: "transparent", color: pathColor, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => e.target.style.background = `${pathColor}10`}
                onMouseLeave={e => e.target.style.background = "transparent"}>
                Use this day as my weekly template →
              </button>
            </div>

            {/* RIGHT — Food panel */}
            <div style={{ position: "sticky", top: 100, height: "fit-content", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
              <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                    {activeMeal ? `Adding to: ${activeMeal}` : "Select a meal slot first"}
                  </p>
                  {!activeMeal && (
                    <p style={{ fontSize: 12, color: "#bbb", fontStyle: "italic" }}>
                      Tap a meal slot on the left, then tap foods here to add them. Or drag foods directly.
                    </p>
                  )}
                </div>

                {/* Group filters */}
                <div className="filters-wrap" style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                  <button className={`filter-pill ${activeGroup === "all" ? "active" : ""}`}
                    onClick={() => setActiveGroup("all")}>All</button>
                  {Object.entries(FOOD_GROUPS).map(([key, g]) => (
                    <button key={key} className={`filter-pill ${activeGroup === key ? "active" : ""}`}
                      onClick={() => setActiveGroup(key)}
                      style={activeGroup === key ? {} : { borderColor: g.color + "60", color: g.color }}>
                      {g.emoji}
                    </button>
                  ))}
                </div>

                {/* Benefit filters */}
                <div className="filters-wrap" style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                  <button className={`filter-pill ${activeBenefit === "all" ? "active" : ""}`}
                    onClick={() => setActiveBenefit("all")} style={{ fontSize: 11 }}>All Benefits</button>
                  {Object.entries(BENEFITS).slice(0, 6).map(([key, b]) => (
                    <span key={key} className="benefit-tag no-print"
                      onClick={() => setActiveBenefit(activeBenefit === key ? "all" : key)}
                      style={{ background: activeBenefit === key ? b.color : "#f0f0f0", color: activeBenefit === key ? "white" : b.color, cursor: "pointer", border: `1.5px solid ${b.color}`, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                      {b.label}
                    </span>
                  ))}
                </div>

                {/* Food grid */}
                <div className="food-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
                  {filteredFoods.map(food => {
                    const addedToCurrentMeal = activeMeal && weekPlan[day][activeMeal]?.find(f => f.id === food.id);
                    return (
                      <div key={food.id}
                        className="food-card"
                        draggable
                        onDragStart={() => setDragging(food)}
                        onDragEnd={() => setDragging(null)}
                        onClick={() => activeMeal && addFoodToMeal(food, activeMeal)}
                        onMouseEnter={() => setHoveredFood(food.id)}
                        onMouseLeave={() => setHoveredFood(null)}
                        style={{
                          opacity: addedToCurrentMeal ? 0.4 : 1,
                          borderColor: addedToCurrentMeal ? pathColor : "#eee",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 16 }}>{FOOD_GROUPS[food.group].emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{food.name}</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>{food.portion}</div>
                          </div>
                          {addedToCurrentMeal && <span style={{ fontSize: 12, color: pathColor, fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          {food.benefits.map(b => (
                            <span key={b} className="benefit-tag" style={{ background: BENEFITS[b]?.color || "#888" }}>
                              {BENEFITS[b]?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredFoods.length === 0 && (
                  <p style={{ textAlign: "center", color: "#ccc", fontSize: 13, fontStyle: "italic", padding: "20px 0" }}>
                    No foods match these filters for your protocol.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
