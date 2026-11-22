import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Lock, Menu, Sprout, Users, Waves } from 'lucide-react';
import { BOOTH_INFO } from '../data/boothContent.js';

export default function Header({
  activeView,
  currentStep,
  maxUnlockedStep,
  savedRecord,
  onNavigate,
  onSelectStep,
  onOpenAbout,
  totalParticipants = 0,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuWrapRef = useRef(null);

  useEffect(() => {
    if (!drawerOpen) return undefined;

    function handlePointerDown(event) {
      if (menuWrapRef.current && !menuWrapRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  function handleStepClick(stepNumber) {
    if (stepNumber > maxUnlockedStep || savedRecord) return;
    onSelectStep(stepNumber);
    setDrawerOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand-btn"
          onClick={() => {
            setDrawerOpen(false);
            onNavigate('welcome');
          }}
        >
          <div className="brand-badge">
            <Sprout size={21} />
          </div>
          <div className="brand-text">
            <div className="brand-title">ธรรมชาติในเมืองใหญ่</div>
            <div className="brand-subtitle">Protect &amp; Plant the KONGKANG</div>
          </div>
        </button>

        <nav className="header-nav" aria-label="เมนูหลัก">
          <button
            type="button"
            className={`nav-btn ${activeView === 'welcome' || activeView === 'activity' ? 'active' : ''}`}
            onClick={() => {
              setDrawerOpen(false);
              onNavigate('activity');
            }}
          >
            <Waves size={16} />
            <span>ทำกิจกรรมบูธ</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'wall' ? 'active' : ''}`}
            onClick={() => {
              setDrawerOpen(false);
              onNavigate('wall');
            }}
          >
            <Users size={16} />
            <span>ร่องรอยผู้เข้าร่วม</span>
          </button>

          <button
            type="button"
            className="nav-btn"
            onClick={() => {
              setDrawerOpen(false);
              onOpenAbout();
            }}
          >
            <BookOpen size={16} />
            <span>เบื้องหลังงานสำรวจ</span>
          </button>

          <div className="nav-pill" title="จำนวนผู้ร่วมปลูกทั้งหมดในฐานข้อมูล">
            <Sprout size={14} />
            <span>{totalParticipants} คน</span>
          </div>

          <div className="step-menu-wrapper" ref={menuWrapRef}>
            <button
              type="button"
              className={`hamburger-btn ${drawerOpen ? 'open' : ''}`}
              aria-label="แสดงขั้นตอนกิจกรรม"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((prev) => !prev)}
            >
              {activeView === 'activity' && (
                <span className="step-compact-badge">ขั้น {currentStep}/4</span>
              )}
              <Menu size={20} />
            </button>

            {drawerOpen && (
              <div className="step-drawer" role="menu" aria-label="รายการขั้นตอนกิจกรรม">
                <div className="step-drawer-head">
                  <strong>ขั้นตอนกิจกรรม (4 ขั้น)</strong>
                  <span>
                    {activeView === 'activity'
                      ? `กำลังอยู่ขั้นที่ ${currentStep}`
                      : 'กด “ทำกิจกรรมบูธ” เพื่อเริ่ม'}
                  </span>
                </div>

                <div className="step-drawer-list">
                  {BOOTH_INFO.activitySteps.map((item) => {
                    const isCurrent = activeView === 'activity' && currentStep === item.step;
                    const isDone = activeView === 'activity' && currentStep > item.step;
                    const isLocked =
                      activeView !== 'activity' || item.step > maxUnlockedStep || Boolean(savedRecord);

                    return (
                      <button
                        key={item.step}
                        type="button"
                        role="menuitem"
                        disabled={isLocked}
                        className={`step-drawer-item ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}
                        onClick={() => handleStepClick(item.step)}
                      >
                        <span className="step-drawer-num">
                          {isDone ? (
                            <Check size={14} />
                          ) : isLocked ? (
                            <Lock size={13} />
                          ) : (
                            item.step
                          )}
                        </span>
                        <span className="step-drawer-info">
                          <span className="step-drawer-title">{item.title}</span>
                          <span className="step-drawer-sub">{item.summary}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
