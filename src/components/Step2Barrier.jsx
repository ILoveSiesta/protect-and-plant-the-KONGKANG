import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Shield,
} from 'lucide-react';
import { BOOTH_INFO, computeWaveCalmPercent } from '../data/boothContent.js';
import CoastalCanvas from './CoastalCanvas.jsx';

export default function Step2Barrier({
  zone,
  barrierChoice,
  onSelectBarrier,
  triedWithoutBarrier,
  testDemoTick,
  testDemoProtected,
  onRunTestDemo,
  onBack,
  onNext,
}) {
  const calmPercent = computeWaveCalmPercent(zone, barrierChoice);
  const canProceed = barrierChoice === 'bamboo' || barrierChoice === 'rock';

  const calmBarColor =
    calmPercent >= 70
      ? 'var(--sprout-green)'
      : calmPercent >= 40
        ? '#d1922a'
        : 'var(--terracotta)';

  return (
    <div className="activity-workspace">
      <aside className="activity-sidebar">
        <div className="sidebar-header">
          <span className="section-badge">ขั้นที่ 2 จาก 4 • จำลองสถานการณ์</span>
          <h2 className="sidebar-title">จำลองการวางแนวป้องกันคลื่น</h2>
          <p className="sidebar-subtitle">
            กดสลับแนวกันคลื่นทั้ง 5 จุดพร้อมกันเพื่อดูความแตกต่าง (ไม่กระทบต้นไม้จริงของคนอื่น)
          </p>
        </div>

        <div className="sidebar-body">
          <div className="barrier-option-list">
            {['none', 'bamboo', 'rock'].map((key) => {
              const info = BOOTH_INFO.barriers[key];
              const isActive = barrierChoice === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`tool-card ${isActive ? 'active' : ''} ${isActive && key === 'none' ? 'warn-active' : ''}`}
                  onClick={() => onSelectBarrier(key)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                    <strong style={{ fontSize: '0.96rem', color: 'var(--mangrove-dark)' }}>
                      {info.name}
                    </strong>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: key === 'none' ? 'var(--terracotta)' : 'var(--gulf-teal)' }}>
                      {info.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.48 }}>
                    {info.summary}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={barrierChoice === 'none' ? 'btn btn-warn' : 'btn btn-teal'}
            style={{ width: '100%' }}
            onClick={onRunTestDemo}
          >
            <Play size={16} />
            <span>
              {barrierChoice === 'none'
                ? 'ลองปลูกเลยโดยไม่วางแนวกันคลื่น'
                : 'จำลองวางต้นกล้าหลังแนวนี้'}
            </span>
          </button>

          {triedWithoutBarrier && barrierChoice === 'none' && (
            <div className="alert-box alert-warn">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>ต้นกล้าถูกคลื่นซัดหลุด!</strong> ลองกดเลือกแนวไม้ไผ่หรือแนวคันหินเพื่อดูการชะลอแรงน้ำ
              </div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Shield size={16} />
                ความสงบของผืนน้ำ
              </span>
              <span>{calmPercent}%</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${calmPercent}%`, background: calmBarColor }}
              />
            </div>
            {canProceed ? (
              <div style={{ fontSize: '0.86rem', color: 'var(--mangrove-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={15} />
                พร้อมเข้าสู่พื้นที่ปลูกจริงของโซนนี้แล้ว
              </div>
            ) : (
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                เลือก “แนวไม้ไผ่” หรือ “แนวคันหิน” ก่อนไปขั้นถัดไป
              </div>
            )}
          </div>

          <div className="kraft-box" style={{ fontSize: '0.86rem', lineHeight: 1.52 }}>
            <strong>ข้อมูลหน้างาน:</strong> {BOOTH_INFO.barriers[barrierChoice].fieldNote}
          </div>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>ย้อนกลับ</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            disabled={!canProceed}
            onClick={onNext}
          >
            <span>ไปปลูกต้นจริง</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </aside>

      <section className="canvas-stage">
        <CoastalCanvas
          mode="barrier"
          zone={zone}
          barrierChoice={barrierChoice}
          testDemoTick={testDemoTick}
          testDemoProtected={testDemoProtected}
        />
        <div className="canvas-caption">
          <span>
            โหมดจำลองสำหรับ <strong>{zone?.name_th}</strong> — ต้นไม้ของคนก่อนๆ จะยังถูกเก็บรักษาไว้อย่างปลอดภัยในขั้นถัดไป
          </span>
          <strong>{BOOTH_INFO.barriers[barrierChoice].name}</strong>
        </div>
      </section>
    </div>
  );
}
