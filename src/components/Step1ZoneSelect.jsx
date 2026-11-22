import React from 'react';
import { AlertTriangle, ArrowRight, Sprout, Waves } from 'lucide-react';
import CoastalCanvas from './CoastalCanvas.jsx';

export default function Step1ZoneSelect({
  zones,
  selectedZone,
  treesByZone,
  onSelectZone,
  onNext,
}) {
  const waveClass = (intensity) => {
    if (intensity >= 5) return 'wave-high';
    if (intensity >= 3) return 'wave-mid';
    return 'wave-low';
  };

  return (
    <div className="activity-workspace">
      <aside className="activity-sidebar">
        <div className="sidebar-header">
          <span className="section-badge">ขั้นที่ 1 จาก 4</span>
          <h2 className="sidebar-title">เลือกพื้นที่ชายฝั่งบางขุนเทียน</h2>
          <p className="sidebar-subtitle">
            แต่ละพื้นที่จะจำจำนวนและตำแหน่งต้นโกงกางที่ทุกคนปลูกไว้แยกกัน
          </p>
        </div>

        <div className="sidebar-body">
          <div className="zone-list">
            {zones.map((zone) => {
              const isSelected = selectedZone?.code === zone.code;
              const zoneTreeCount = (treesByZone[zone.code] || []).length;
              return (
                <button
                  key={zone.code}
                  type="button"
                  className={`zone-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectZone(zone)}
                >
                  <div className="zone-card-head">
                    <div className="zone-title">{zone.name_th}</div>
                    <span className={`wave-meter ${waveClass(zone.wave_intensity)}`}>
                      <Waves size={12} />
                      <span>{zone.wave_intensity}/5</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    {zone.subtitle_th}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem', color: 'var(--mangrove-primary)', fontWeight: 600 }}>
                    <span>{zone.erosion_level_th}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Sprout size={14} />
                      ปลูกแล้ว {zoneTreeCount} ต้น
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedZone && (
            <div className="kraft-box">
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--mangrove-dark)', marginBottom: 4 }}>
                บริบทพื้นที่จริง
              </div>
              <div style={{ fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--text-main)' }}>
                {selectedZone.real_context_th}
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={!selectedZone}
            onClick={onNext}
          >
            <span>เลือกพื้นที่นี้ → จำลองแนวกันคลื่น</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </aside>

      <section className="canvas-stage">
        <CoastalCanvas mode="preview" zone={selectedZone} barrierChoice="none" />
        <div className="canvas-caption">
          <span>
            <AlertTriangle size={14} style={{ verticalAlign: 'text-bottom', color: 'var(--terracotta)' }} />{' '}
            {selectedZone?.description_th}
          </span>
          <strong>{selectedZone?.erosion_level_th}</strong>
        </div>
      </section>
    </div>
  );
}
