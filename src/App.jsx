import React, { useCallback, useEffect, useState } from 'react';
import AboutModal from './components/AboutModal.jsx';
import FootprintsWall from './components/FootprintsWall.jsx';
import Header from './components/Header.jsx';
import Step1ZoneSelect from './components/Step1ZoneSelect.jsx';
import Step2Barrier from './components/Step2Barrier.jsx';
import Step3Planting from './components/Step3Planting.jsx';
import Step4SignIn from './components/Step4SignIn.jsx';
import WelcomeHero from './components/WelcomeHero.jsx';
import {
  BOOTH_INFO,
  computeLandRecoveredSqm,
} from './data/boothContent.js';
import {
  createParticipation,
  fetchForest,
  fetchStats,
  fetchZones,
} from './utils/api.js';

export default function App() {
  const [view, setView] = useState('welcome'); // 'welcome' | 'activity' | 'wall'
  const [aboutOpen, setAboutOpen] = useState(false);

  const [zones, setZones] = useState(BOOTH_INFO.fallbackZones);
  const [treesByZone, setTreesByZone] = useState({
    estuary_strong: [],
    boardwalk_mid: [],
    community_canal: [],
  });
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalMangrovesPlanted: 0,
    totalLandRecoveredSqm: 0,
    triedWithoutBarrierCount: 0,
    barrierBreakdown: { bamboo: 0, rock: 0, mixed: 0 },
  });

  // Activity state
  const [step, setStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState(BOOTH_INFO.fallbackZones[0]);
  const [barrierChoice, setBarrierChoice] = useState('none'); // 'none' | 'bamboo' | 'rock'
  const [triedWithoutBarrier, setTriedWithoutBarrier] = useState(false);
  const [testDemoTick, setTestDemoTick] = useState(0);
  const [testDemoProtected, setTestDemoProtected] = useState(false);

  // Strictly 1 tree per participant
  const [userTree, setUserTree] = useState(null);
  const [growthProgress, setGrowthProgress] = useState(0.2);

  const [savedRecord, setSavedRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loadInitialData = useCallback(async () => {
    try {
      const [zonesRes, statsRes, forestRes] = await Promise.all([
        fetchZones(),
        fetchStats(),
        fetchForest(),
      ]);
      if (zonesRes?.zones?.length) {
        setZones(zonesRes.zones);
        setSelectedZone((prev) => {
          const match = zonesRes.zones.find((z) => z.code === prev?.code);
          return match || zonesRes.zones[0];
        });
      }
      if (statsRes) {
        setStats(statsRes);
      }
      if (forestRes?.treesByZone) {
        setTreesByZone(forestRes.treesByZone);
      }
    } catch (error) {
      console.warn('[init] Using fallback zone list:', error.message);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Smoothly grow the visitor's 1 tree in Step 3 once placed
  useEffect(() => {
    if (view !== 'activity' || step !== 3 || !userTree) {
      return undefined;
    }
    const timer = setInterval(() => {
      setGrowthProgress((prev) =>
        prev >= 1 ? 1 : Math.min(1, Number((prev + 0.015).toFixed(3)))
      );
    }, 220);
    return () => clearInterval(timer);
  }, [view, step, userTree]);

  function resetActivity({ targetView = 'activity' } = {}) {
    setStep(1);
    setMaxUnlockedStep(1);
    setSelectedZone(zones[0] || BOOTH_INFO.fallbackZones[0]);
    setBarrierChoice('none');
    setTriedWithoutBarrier(false);
    setTestDemoTick(0);
    setTestDemoProtected(false);
    setUserTree(null);
    setGrowthProgress(0.2);
    setSavedRecord(null);
    setSubmitError('');
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNavigate(targetView) {
    if (targetView === 'activity' && savedRecord) {
      resetActivity({ targetView: 'activity' });
      return;
    }
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToStep(nextStep) {
    setStep(nextStep);
    setMaxUnlockedStep((prev) => Math.max(prev, nextStep));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSelectZone(zone) {
    setSelectedZone(zone);
    // Clear previous spot if user switches zone before finalizing
    setUserTree(null);
    setGrowthProgress(0.2);
  }

  function handleRunTestDemo() {
    if (barrierChoice === 'none') {
      setTriedWithoutBarrier(true);
      setTestDemoProtected(false);
    } else {
      setTestDemoProtected(true);
    }
    setTestDemoTick((t) => t + 1);
  }

  function handlePlaceUserTree(xNorm, yNorm) {
    setUserTree((prev) => ({
      x: xNorm,
      y: yNorm,
      seed: prev?.seed ?? Math.random() * 10,
    }));
  }

  function handleQuickPlaceTree() {
    // Pick a tidy spot starting near the current shore/accretion frontier, avoiding existing trees
    const zoneCode = selectedZone?.code;
    const existing = treesByZone[zoneCode] || [];
    const baseShore =
      zoneCode === 'estuary_strong' ? 0.12 : zoneCode === 'community_canal' ? 0.18 : 0.15;
    const currentExpansion = 0.41 * (1 - Math.exp(-existing.length / 12));
    const minX = 0.1;
    const maxX = Math.min(0.53, Math.max(0.24, baseShore + currentExpansion + 0.08));

    let bestX = Number(((minX + maxX) / 2).toFixed(4));
    let bestY = 0.66;
    let bestMinDist = -1;

    for (let attempt = 0; attempt < 22; attempt += 1) {
      const candX = Number((minX + Math.random() * (maxX - minX)).toFixed(4));
      const candY = Number((0.47 + Math.random() * 0.41).toFixed(4));
      let minDist = 1;
      for (const t of existing) {
        minDist = Math.min(minDist, Math.hypot(candX - t.x, candY - t.y));
      }
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestX = candX;
        bestY = candY;
      }
    }
    handlePlaceUserTree(bestX, bestY);
  }

  const currentZoneTrees = treesByZone[selectedZone?.code] || [];
  const landRecoveredSqm = computeLandRecoveredSqm({
    hasUserTree: Boolean(userTree),
    growthProgress,
    zone: selectedZone,
  });

  async function handleSubmitParticipation({ studentId, reflection }) {
    if (!userTree) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        studentId,
        reflection,
        coastalZoneCode: selectedZone.code,
        barrierType: barrierChoice === 'bamboo' ? 'bamboo' : 'rock',
        barrierSegments: 5,
        triedWithoutBarrier,
        mangrovesPlanted: 1,
        landRecoveredSqm,
        treeX: userTree.x,
        treeY: userTree.y,
      };
      const result = await createParticipation(payload);
      setSavedRecord(result.participation);
      if (result.stats) setStats(result.stats);
      if (result.treesByZone) setTreesByZone(result.treesByZone);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <Header
        activeView={view}
        currentStep={step}
        maxUnlockedStep={maxUnlockedStep}
        savedRecord={savedRecord}
        onNavigate={handleNavigate}
        onSelectStep={(s) => {
          if (!savedRecord) {
            setStep(s);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAbout={() => setAboutOpen(true)}
        totalParticipants={stats.totalParticipants}
      />

      <main className="main-content">
        {view === 'welcome' && (
          <WelcomeHero
            stats={stats}
            onStart={() => resetActivity({ targetView: 'activity' })}
            onViewWall={() => handleNavigate('wall')}
            onOpenAbout={() => setAboutOpen(true)}
          />
        )}

        {view === 'activity' && (
          <>
            {step === 1 && (
              <Step1ZoneSelect
                zones={zones}
                selectedZone={selectedZone}
                treesByZone={treesByZone}
                onSelectZone={handleSelectZone}
                onNext={() => goToStep(2)}
              />
            )}

            {step === 2 && (
              <Step2Barrier
                zone={selectedZone}
                barrierChoice={barrierChoice}
                onSelectBarrier={setBarrierChoice}
                triedWithoutBarrier={triedWithoutBarrier}
                testDemoTick={testDemoTick}
                testDemoProtected={testDemoProtected}
                onRunTestDemo={handleRunTestDemo}
                onBack={() => setStep(1)}
                onNext={() => goToStep(3)}
              />
            )}

            {step === 3 && (
              <Step3Planting
                zone={selectedZone}
                existingTrees={currentZoneTrees}
                userTree={userTree}
                growthProgress={growthProgress}
                landRecoveredSqm={landRecoveredSqm}
                onPlaceUserTree={handlePlaceUserTree}
                onQuickPlaceTree={handleQuickPlaceTree}
                onSetGrowth={(val) => setGrowthProgress(val)}
                onBack={() => setStep(2)}
                onNext={() => goToStep(4)}
              />
            )}

            {step === 4 && (
              <Step4SignIn
                zone={selectedZone}
                barrierChoice={barrierChoice}
                triedWithoutBarrier={triedWithoutBarrier}
                userTree={userTree}
                existingCount={currentZoneTrees.length}
                landRecoveredSqm={landRecoveredSqm}
                savedRecord={savedRecord}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onSubmit={handleSubmitParticipation}
                onBack={() => setStep(3)}
                onRestart={() => resetActivity({ targetView: 'welcome' })}
                onViewWall={() => handleNavigate('wall')}
              />
            )}
          </>
        )}

        {view === 'wall' && (
          <FootprintsWall
            zones={zones}
            stats={stats}
            onStartActivity={() => resetActivity({ targetView: 'activity' })}
          />
        )}
      </main>

      <footer className="footer-bar">
        บูธ <strong>{BOOTH_INFO.boothName}</strong> • {BOOTH_INFO.courseTitle} • กลุ่ม{' '}
        {BOOTH_INFO.groupCode} ({BOOTH_INFO.location})
      </footer>

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
