import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Cpu, 
  Truck, 
  Flame, 
  Compass, 
  RotateCcw, 
  Coins, 
  CheckCircle, 
  Info, 
  Activity, 
  Database, 
  Droplet, 
  MapPin, 
  Clock, 
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';

const PRODUCTS_DATA = {
  "Saraswatarishta": {
    name: "Saraswatarishta Tonic",
    tagline: "Traditional Fermented Brain & Memory Elixir",
    description: "Prepared using wood-fire clay pots (Asava-Arishta method) with handpicked Brahmi from the wetlands of Kerala.",
    baseFarmCO2: 1.25, // E_farm (kg CO2e)
    baseMfgCO2: 0.85,  // E_mfg (kg CO2e)
    originFarm: "Vaikom Organic Wetlands, Kerala, India",
    soilHealthScore: "9.2/10 (Rich Humus)",
    soilCarbonSequestration: "3.4 tons C/hectare/year",
    processingMethod: "Traditional Clay Pot Fermentation (30-day natural cooling)",
    packagingMaterial: "100% Recyclable Amber Glass Bottle",
    baseVolumeMl: 450,
    recommendedDailyDose: 15, // ml
    transitDistanceKm: 1250, // d_i
    defaultTransitMode: "electric_truck",
  },
  "Chyawanprash": {
    name: "Amla-Active Chyawanprash",
    tagline: "Rejuvenating Bio-active Immunity Jam",
    description: "Formulated with wild-harvested forest Amla sweetened with raw liquid jaggery, slow-cooked in brass vessels.",
    baseFarmCO2: 1.95,
    baseMfgCO2: 1.40,
    originFarm: "Satpura Biosphere Reserve Forest, Madhya Pradesh, India",
    soilHealthScore: "8.7/10 (Wild Forest Soil)",
    soilCarbonSequestration: "5.8 tons C/hectare/year (High canopy cover)",
    processingMethod: "Brass Uruli Slow Simmering using Solar Biomass Hybrid Gasifiers",
    packagingMaterial: "BPA-Free Food Grade Tinplate Canister",
    baseVolumeMl: 500, // represented as grams
    recommendedDailyDose: 10, // grams
    transitDistanceKm: 780,
    defaultTransitMode: "rail_freight",
  },
  "Dashmoola Churna": {
    name: "Dashmoola Herbal Powder",
    tagline: "Anti-inflammatory Ten-Roots Decoction Blend",
    description: "A synergistic blend of ten divine roots ground at low temperatures to protect essential herbal volatile oils.",
    baseFarmCO2: 0.75,
    baseMfgCO2: 0.45,
    originFarm: "Western Ghats Biodiversity Reserve, Karnataka, India",
    soilHealthScore: "9.5/10 (High Organic Matter)",
    soilCarbonSequestration: "4.1 tons C/hectare/year",
    processingMethod: "Cryogenic Herbal Pulverization (Zero Heat Degradation)",
    packagingMaterial: "Compostable Cellulose Plant-Based Pouch",
    baseVolumeMl: 250, // grams
    recommendedDailyDose: 5, // grams
    transitDistanceKm: 1450,
    defaultTransitMode: "road_diesel",
  }
};

const TRANSIT_MODES = {
  electric_truck: { name: "EV Road Transit", factor: 0.04, label: "Eco-Conscious Electric Vehicle" },
  rail_freight: { name: "Electric Rail Freight", factor: 0.08, label: "Optimized Low-Emission Rail" },
  road_diesel: { name: "Standard Diesel Freight", factor: 0.28, label: "Medium Impact Fleet Logistics" },
  air_cargo: { name: "Expedited Air Cargo", factor: 0.95, label: "High Emission Express Delivery" }
};

const PREP_METHODS = {
  none: { name: "No Cooking/Raw Intake", factor: 0.0 },
  induction: { name: "Electric Induction (Green Grid)", factor: 0.04 }, // per minute
  lpg: { name: "Traditional Cooking Gas (LPG)", factor: 0.16 }, // per minute
  solar: { name: "Solar Concentrator Cooker", factor: 0.0 }
};

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState("Saraswatarishta");
  const currentProduct = PRODUCTS_DATA[selectedProductId];

  // SCM Customization Variables
  const [transitMode, setTransitMode] = useState(currentProduct.defaultTransitMode);
  const [customDistance, setCustomDistance] = useState(currentProduct.transitDistanceKm);

  // Consumer Dynamic Variables
  const [daysUsed, setDaysUsed] = useState(12);
  const [prepMethod, setPrepMethod] = useState("none");
  const [prepMinutes, setPrepMinutes] = useState(5);
  
  // Circular Loop Actions
  const [compostedWaste, setCompostedWaste] = useState(false);
  const [returnedPackaging, setReturnedPackaging] = useState(false);

  // Ledger / Blockchain Feed Simulator State
  const [blockchainLogs, setBlockchainLogs] = useState([]);
  const [karmaPoints, setKarmaPoints] = useState(250);
  const [unlockedBadges, setUnlockedBadges] = useState(["Prithvi Guard"]);

  // Function to push simulation logs
  const addBlockToLedger = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    const mockHash = "0x" + Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join("");
    const newBlock = { timestamp, type, message, hash: mockHash };
    setBlockchainLogs(prev => [newBlock, ...prev].slice(0, 15));
  };

  // Set initial product SCM defaults when selection changes
  useEffect(() => {
    setTransitMode(currentProduct.defaultTransitMode);
    setCustomDistance(currentProduct.transitDistanceKm);
    // Add SCM verification block to simulated blockchain
    addBlockToLedger("SCM_AUDIT", `Audited batch ledger for ${currentProduct.name}. Certified authentic organic raw materials.`);
  }, [selectedProductId]);

  const eFarm = currentProduct.baseFarmCO2;
  const eMfg = currentProduct.baseMfgCO2;
  const transitEmissionFactor = TRANSIT_MODES[transitMode].factor;
  const transitTotal = parseFloat(((customDistance * transitEmissionFactor) / 1000).toFixed(3)); // convert to metric/kg equivalence nicely

  // Dynamic Consumer Prep math
  const prepFactor = PREP_METHODS[prepMethod].factor;
  const consumerPrepTotal = parseFloat((daysUsed * prepMinutes * prepFactor).toFixed(3));

  // Circular loop discount offsets
  const cOffset = (compostedWaste ? 0.35 : 0) + (returnedPackaging ? 0.95 : 0);

  // Combined calculations (Carbon Footprint Total in kg CO2)
  const totalCarbonFootprint = parseFloat(
    (eFarm + eMfg + transitTotal + consumerPrepTotal - cOffset).toFixed(3)
  );

  // Benchmarking calculation
  const benchmarkFootprint = parseFloat(
    (eFarm * 1.5 + eMfg * 1.8 + (customDistance * 0.28) / 1000 + (daysUsed * prepMinutes * 0.16)).toFixed(2)
  );
  const savingsPct = Math.max(0, Math.round(((benchmarkFootprint - totalCarbonFootprint) / benchmarkFootprint) * 100));

  const handleLogDailyDose = () => {
    const dose = currentProduct.recommendedDailyDose;
    const remainingVolume = currentProduct.baseVolumeMl - (daysUsed * dose);
    
    if (remainingVolume <= 0) {
      addBlockToLedger("USAGE_ERR", `Cycle complete for ${currentProduct.name}. Please return and cycle the container.`);
      return;
    }

    setDaysUsed(prev => prev + 1);
    setKarmaPoints(prev => prev + 15);
    
    addBlockToLedger("CONSUMER_LOG", `User consumed ${dose} units. Dynamic usage updated. Active Prep: ${PREP_METHODS[prepMethod].name}.`);

    // Dynamic karma checks
    if (karmaPoints > 300 && !unlockedBadges.includes("Amrit Seeker")) {
      setUnlockedBadges(prev => [...prev, "Amrit Seeker"]);
      addBlockToLedger("REWARD_AWARD", "Badge Unlocked: [Amrit Seeker] achieved for dynamic Ayurvedic dose compliance.");
    }
  };

  const handleToggleRecycle = () => {
    const nextState = !returnedPackaging;
    setReturnedPackaging(nextState);
    if (nextState) {
      setKarmaPoints(prev => prev + 80);
      addBlockToLedger("SCM_CIRCULAR", `Vessel Return Logged! Packaging certified returned to localized collection point. Deducted 0.95 kg CO2e.`);
      if (!unlockedBadges.includes("Prakriti Purifier")) {
        setUnlockedBadges(prev => [...prev, "Prakriti Purifier"]);
      }
    } else {
      setKarmaPoints(prev => Math.max(0, prev - 80));
      addBlockToLedger("SCM_CIRCULAR", `Circular offset removed from verification ledger.`);
    }
  };

  const handleToggleCompost = () => {
    const nextState = !compostedWaste;
    setCompostedWaste(nextState);
    if (nextState) {
      setKarmaPoints(prev => prev + 40);
      addBlockToLedger("SCM_CIRCULAR", `Organic herbal residue returned to natural soil. Carbon offset updated.`);
    } else {
      setKarmaPoints(prev => Math.max(0, prev - 40));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-3 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-emerald-800 selection:text-white">
      
      {/* HEADER BAR */}
      <header className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-emerald-900/40 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              <Leaf className="w-6 h-6 animate-pulse" />
            </span>
            <span className="text-xs tracking-widest font-mono text-emerald-500 uppercase font-semibold">Ayur-Scm Framework</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-50">
            Prakriti <span className="text-emerald-400">Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Tracing Ayurvedic formulations from soil microbiota organic cultivation to final post-consumer metabolic utilization.
          </p>
        </div>

        {/* ECO WALLET STATUS */}
        <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-900/30 rounded-lg text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">My Karma Balance</p>
              <p className="text-lg font-bold text-amber-400 font-mono">{karmaPoints} KP</p>
            </div>
          </div>
          <div className="border-l border-emerald-900/40 pl-4">
            <p className="text-[10px] text-slate-400 uppercase font-mono">Current Streak</p>
            <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
              <Activity className="w-4 h-4 text-emerald-500" /> {daysUsed} Days Green
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPONENT: 1. SELECTOR & REAL-TIME ORIGIN TRACE */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* PRODUCT SPEC SELECTOR */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> 1. Select Active Formulation
            </h2>
            <div className="flex flex-col gap-2">
              {Object.keys(PRODUCTS_DATA).map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedProductId(id)}
                  className={`p-3 rounded-xl text-left transition-all duration-300 border flex items-center justify-between ${
                    selectedProductId === id 
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-amber-100 shadow-lg shadow-emerald-950/20' 
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{PRODUCTS_DATA[id].name}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{PRODUCTS_DATA[id].tagline}</p>
                  </div>
                  <div className={`p-1 rounded-full ${selectedProductId === id ? 'bg-emerald-900/50 text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Product Summary Details */}
            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <p className="text-[11px] text-emerald-500 font-mono uppercase mb-1 font-semibold">Formulation Scope</p>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{currentProduct.description}"</p>
            </div>
          </div>

          {/* BLOCKCHAIN SCM ORIGIN VISUALIZER */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> 2. Farm-To-Fingertip SCM Nodes
              </h2>

              <div className="relative border-l-2 border-emerald-900/60 pl-5 ml-2 space-y-6">
                
                {/* FARM NODE */}
                <div className="relative">
                  <span className="absolute -left-8 top-0.5 w-5.5 h-5.5 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-[10px] text-emerald-400 font-mono font-bold">1</span>
                  <div>
                    <h3 className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                      Sowing & Cultivation Node <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-400 font-mono">Organic Certified</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      <span className="text-slate-300 font-medium">Origin:</span> {currentProduct.originFarm}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-slate-950/60 rounded border border-slate-800/40 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block">Soil Health</span>
                        <span className="text-emerald-400 font-medium">{currentProduct.soilHealthScore}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Carbon Sequestration</span>
                        <span className="text-amber-400/90 font-medium">{currentProduct.soilCarbonSequestration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PROCESSING NODE */}
                <div className="relative">
                  <span className="absolute -left-8 top-0.5 w-5.5 h-5.5 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-[10px] text-emerald-400 font-mono font-bold">2</span>
                  <div>
                    <h3 className="text-xs font-bold text-amber-100">Processing & Sodhana (Purification)</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{currentProduct.processingMethod}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-slate-950/60 rounded border border-slate-800/40 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block">Base Agri E<sub>farm</sub></span>
                        <span className="text-amber-500 font-medium">{currentProduct.baseFarmCO2} kg CO₂e</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Base Mfg E<sub>mfg</sub></span>
                        <span className="text-amber-500 font-medium">{currentProduct.baseMfgCO2} kg CO₂e</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRANSIT LOGISTICS NODE */}
                <div className="relative">
                  <span className="absolute -left-8 top-0.5 w-5.5 h-5.5 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-[10px] text-emerald-400 font-mono font-bold">3</span>
                  <div>
                    <h3 className="text-xs font-bold text-amber-100 flex items-center gap-1.5">Logistics & Distribution Node</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Real-time supply path optimization to distribution hubs.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* TRANSPORT INTERACTIVE PARAMETERS */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-2">Configure Transit Mode & Mileage</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {Object.keys(TRANSIT_MODES).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setTransitMode(mode);
                      addBlockToLedger("TRANSIT_CHANGE", `Recalculating transit network. Selected ${TRANSIT_MODES[mode].name}.`);
                    }}
                    className={`p-2 rounded text-[10px] font-mono text-left transition border ${
                      transitMode === mode 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-semibold">{TRANSIT_MODES[mode].name}</p>
                    <p className="text-[8px] text-slate-500 mt-0.5">EF: {TRANSIT_MODES[mode].factor} kg/km</p>
                  </button>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Transit Distance</span>
                  <span className="text-amber-400 font-semibold">{customDistance} km</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="3000" 
                  step="50"
                  value={customDistance} 
                  onChange={(e) => {
                    setCustomDistance(Number(e.target.value));
                  }} 
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
              </div>
            </div>

          </div>
        </section>

        {/* MIDDLE COMPONENT: 3. POST-PURCHASE CONSUMER PORTAL */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> 3. Post-Purchase Consumer Portal
                </h2>
                <span className="text-[10px] bg-amber-400/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-400/20">Live Simulation</span>
              </div>

              {/* CONSUMPTION & DEPLETION ACCURACY METER */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">Intake & Container Fill</span>
                  <span className="text-xs font-mono text-emerald-400">
                    {Math.max(0, currentProduct.baseVolumeMl - (daysUsed * currentProduct.recommendedDailyDose))} / {currentProduct.baseVolumeMl} ml remaining
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden p-[2px]">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, ((currentProduct.baseVolumeMl - (daysUsed * currentProduct.recommendedDailyDose)) / currentProduct.baseVolumeMl) * 100)}%` }}
                  ></div>
                </div>

                {/* Action Buttons to increment intake */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleLogDailyDose}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-950/30"
                  >
                    <PlusIcon className="w-3.5 h-3.5" /> Log Daily Intake
                  </button>
                  <button 
                    onClick={() => {
                      setDaysUsed(0);
                      addBlockToLedger("LEDGER_RESET", "Container refilled. Simulated consumption timeline reset.");
                    }}
                    className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                    title="Reset Usage Stats"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* HEATING & WATER PREPARATION ESTIMATOR */}
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                  <div className="flex items-start gap-2">
                    <Flame className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Decoction & Heating Footprint</h3>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                        Does your intake process involve boiling herbal powders (*Kwatha* decoctions) or warming ingredients?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selection Options */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-2">Select Heating Prep Technology</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(PREP_METHODS).map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setPrepMethod(method);
                          addBlockToLedger("PREP_UPDATE", `Consumer cooking energy parameter updated to: ${PREP_METHODS[method].name}`);
                        }}
                        className={`p-2 rounded text-[10px] font-mono text-left transition border ${
                          prepMethod === method 
                            ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' 
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="font-semibold">{PREP_METHODS[method].name}</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">+{PREP_METHODS[method].factor} kg CO₂e/min</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider for Heating Duration */}
                {prepMethod !== 'none' && (
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 transition-all">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Daily Prep Duration</span>
                      <span className="text-amber-400 font-semibold">{prepMinutes} Minutes</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={prepMinutes} 
                      onChange={(e) => setPrepMinutes(Number(e.target.value))} 
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* CIRCULAR LOOP: 3. PACKAGING RETURN & HERB COMPOSTING */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-2">4. Zero Waste / Circular Loop Tasks</label>
              
              {/* Task 1: Herb Waste Composting */}
              <button 
                onClick={handleToggleCompost}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  compostedWaste 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${compostedWaste ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Compost Herb Infusion Residues</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Feed traditional spent ingredients back to local plants</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${compostedWaste ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                  {compostedWaste && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Task 2: Package Return */}
              <button 
                onClick={handleToggleRecycle}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  returnedPackaging 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${returnedPackaging ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Return Package to SCM Outlet</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Refill/Recycle Amber Glass Bottle or Tin packaging</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${returnedPackaging ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                  {returnedPackaging && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </button>
            </div>

          </div>
        </section>

        {/* RIGHT COMPONENT: MATH CALCULATION ENGINE & IMMUTABLE LIVE LEDGER FEED */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* MATH ENGINE & CORE FORMULA VISUALIZER */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs uppercase font-mono tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Database className="w-4 h-4" /> 4. Live Carbon Calculation Engine
            </h2>

            {/* Core Footprint Visualization Circle */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl mb-4 relative overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-mono text-emerald-500">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> Global Ledger
              </div>

              {/* Dynamic Footprint Metric */}
              <div className="relative z-10 text-center">
                <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                  Dynamic Total (CF<sub>total</sub>)
                </p>
                <p className="text-3xl sm:text-4xl font-black font-mono text-amber-100 tracking-tight mt-1">
                  {totalCarbonFootprint} <span className="text-sm font-normal text-slate-400">kg CO₂e</span>
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-900/40 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-mono">
                  <TrendingDown className="w-3.5 h-3.5" /> Saves {savingsPct}% over typical generic alternatives
                </div>
              </div>

              {/* Dynamic formula element highlights */}
              <div className="w-full px-4 mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-4 text-center text-[10px] font-mono text-slate-400">
                <div>
                  <span className="block text-[9px] text-slate-500">E<sub>farm</sub> + E<sub>mfg</sub></span>
                  <span className="text-amber-100 font-medium font-semibold">{(eFarm + eMfg).toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500">E<sub>trans</sub></span>
                  <span className="text-amber-100 font-medium font-semibold">{transitTotal}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500">E<sub>prep</sub></span>
                  <span className="text-amber-100 font-medium font-semibold">{consumerPrepTotal}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500">- C<sub>offset</sub></span>
                  <span className="text-emerald-400 font-semibold">-{cOffset}</span>
                </div>
              </div>
            </div>

            {/* Subscript Formula breakdown */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[10.5px] leading-relaxed">
              <p className="text-[10px] text-emerald-500 font-mono uppercase mb-1 font-semibold">Scientific Formula Applied</p>
              <div className="font-mono text-amber-200/90 py-1 overflow-x-auto select-all text-center border-b border-slate-800/60 mb-2">
                CF_total = E_farm + E_mfg + (d_i × EF_trans) + (U_days × E_prep) - C_offset
              </div>
              <p className="text-slate-400 leading-snug">
                Your Ayurvedic system uses precise agricultural baselines (E<sub>farm</sub>) concatenated with variable consumer prep emissions (E<sub>prep</sub>) and return actions (C<sub>offset</sub>) to evaluate dynamic life cycles accurately.
              </p>
            </div>
          </div>

          {/* BLOCKCHAIN AUDIT LOG & IMMUTABLE LEDGER */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex-1 flex flex-col justify-between min-h-[250px]">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4" /> Immutable Blockchain Ledger
                </h2>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 font-mono border border-emerald-500/20 px-2 py-0.5 rounded">
                  Status: Connected
                </span>
              </div>
              
              {/* SCROLLING LEDGER TERMINAL */}
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 text-[10px] font-mono scrollbar-thin scrollbar-thumb-slate-800">
                {blockchainLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 italic">
                    No active blocks yet. Change parameters or log intake to write blocks to the chain!
                  </div>
                ) : (
                  blockchainLogs.map((log, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded border border-slate-800/60 hover:border-emerald-950 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${
                          log.type === "CONSUMER_LOG" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" :
                          log.type === "SCM_CIRCULAR" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/20" :
                          log.type === "REWARD_AWARD" ? "bg-amber-950 text-amber-400 border border-amber-500/20" :
                          "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-slate-500 text-[8px]">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 leading-normal mb-1">{log.message}</p>
                      <div className="flex items-center gap-1 text-[8px] text-slate-500 select-all font-semibold">
                        <span>HASH:</span> <span>{log.hash}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* BADGES & REWARDS GAINED */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <p className="text-[10px] font-mono uppercase text-slate-400 mb-2">Prakriti Credentials Unlocked</p>
              <div className="flex flex-wrap gap-1.5">
                {unlockedBadges.map((badge, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-950/40 to-emerald-950/40 border border-amber-500/20 rounded text-[9px] font-medium text-amber-200"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin" /> {badge}
                  </span>
                ))}
                <span className="text-[9px] text-slate-500 border border-dashed border-slate-800 rounded px-2 py-1 italic">
                  + more tokens pending intake log
                </span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER METRIC EXPLANATION */}
      <footer className="w-full max-w-7xl mx-auto border-t border-slate-800/80 mt-6 pt-4 text-center flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-3">
        <p>
          Designed for Ayurvedic SCM & Consumer Utilization ledger integration. All calculations follow standard greenhouse gas protocols.
        </p>
        <div className="flex items-center gap-3">
          <span className="hover:text-slate-300 cursor-pointer">Protocol Specifications</span>
          <span className="hover:text-slate-300 cursor-pointer">Blockchain Oracle API</span>
        </div>
      </footer>

    </div>
  );
}

// Simple Helper Icon components
function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
