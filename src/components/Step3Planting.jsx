import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  FastForward,
  Lock,
  MapPin,
  Sprout,
} from 'lucide-react';
import CoastalCanvas from './CoastalCanvas.jsx';

const GROWTH_MILESTONES = [
  { label: 'เดือนที่ 1', value: 0.15 },
  { label: 'ปีที่ 1', value: 0.45 },
  { label: 'ปีที่ 3', value: 0.75 },
  { label: 'ปีที่ 5', value: 1.0 },
];

export default function Step3Planting({
  zone,
  existingTrees,
  userTree,
  growthProgress,
  landRecoveredSqm,
  onPlaceUserTree,
  onQuickPlaceTree,
  onSetGrowth,
  onBack,
  onNext,
}) {
  const hasUserTree = Boolean(userTree);
  const wildlifeLabel = !hasUserTree && existingTrees.length === 0
    ? 'รอต้นกล้าต้นแรกของโซนนี้'
    : growthProgress >= 0.8 || existingTrees.length >= 3
      ? 'นกยางสีขาว ปูแสม และปลาตีนกลับมาอาศัยแล้ว'
      : growthProgress >= 0.55
        ? 'ปูแสมและปลาตีนเริ่มเข้ามาหากินตามราก'
        : 'รากเล็กๆ กำลังเริ่มยึดเกาะดินเลนอย่างมั่นคง';

  return (
    <div className="activity-workspace">
      <aside className="activity-sidebar">
        <div className="sidebar-header">
          <span className="section-badge">ขั้นที่ 3 จาก 4 • 1 คนปลูกได้ 1 ต้น</span>
          <h2 className="sidebar-title">ปลูกต้นโกงกางคืนพื้นที่นี้</h2>
          <p className="sidebar-subtitle">
            คลิก/แตะในกรอบเส้นประบนภาพเพื่อปักตำแหน่งต้นไม้ของคุณ (กดจุดใหม่เพื่อย้ายได้)
          </p>
        </div>

        <div className="sidebar-body">
          <div className="alert-box alert-info">
            <Lock size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>ล็อกแนวคันหินถาวร 5 จุด:</strong> พื้นที่ปลูกจริงใช้แนวคันหินคุ้มครองต้นไม้ที่ทุกคนร่วมปลูกไว้ในโซนนี้
            </div>
          </div>

          <div className="planting-metrics">
            <div className="metric-box">
              <div className="metric-val">{existingTrees.length}</div>
              <div className="metric-lbl">ต้นเดิมโซนนี้</div>
            </div>
            <div className="metric-box">
              <div className="metric-val">{hasUserTree ? '1/1' : '0/1'}</div>
              <div className="metric-lbl">ต้นของคุณ</div>
            </div>
            <div className="metric-box">
              <div className="metric-val">+{landRecoveredSqm}</div>
              <div className="metric-lbl">ดินงอก (ตร.ม.)</div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={onQuickPlaceTree}
          >
            <MapPin size={16} />
            <span>{hasUserTree ? 'สุ่มย้ายตำแหน่งต้นของคุณ' : 'สุ่มจุดปลูกต้นของคุณ 1 ต้น'}</span>
          </button>

          <div className="kraft-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--mangrove-dark)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Clock size={15} />
                ดูต้นไม้เติบโต
              </strong>
              <button
                type="button"
                className="btn btn-teal"
                style={{ padding: '6px 12px', fontSize: '0.84rem' }}
                disabled={!hasUserTree}
                onClick={() => onSetGrowth(1)}
              >
                <FastForward size={14} />
                <span>เร่งเวลา 5 ปี</span>
              </button>
            </div>

            <div className="timeline-buttons">
              {GROWTH_MILESTONES.map((m) => {
                const active = hasUserTree && Math.abs(growthProgress - m.value) < 0.16;
                return (
                  <button
                    key={m.label}
                    type="button"
                    disabled={!hasUserTree}
                    className={`timeline-btn ${active ? 'active' : ''}`}
                    onClick={() => onSetGrowth(m.value)}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="alert-box alert-success">
            <Sprout size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>ระบบนิเวศ:</strong> {wildlifeLabel}
            </div>
          </div>

          <div className="legend-box">
            <div className="legend-title">สัญลักษณ์บนแผนที่ชายฝั่ง</div>
            <div className="legend-item">
              <span className="legend-dot gold" />
              <span>วงสีทอง = ต้นโกงกางของคุณ (1 คน/1 ต้น)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dashed" />
              <span>เส้นประ = แนวตลิ่งเดิมก่อนฟื้นฟู</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot land" />
              <span>แถบเขียวอมน้ำตาล = ผืนดินที่งอกกลับคืน</span>
            </div>
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
            disabled={!hasUserTree}
            onClick={onNext}
          >
            <span>ไปลงชื่อบันทึกผล</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </aside>

      <section className="canvas-stage">
        <CoastalCanvas
          mode="planting"
          zone={zone}
          barrierChoice="rock"
          existingTrees={existingTrees}
          userTree={userTree}
          growthProgress={growthProgress}
          onPlaceUserTree={onPlaceUserTree}
        />
        <div className="canvas-caption">
          <span>
            {hasUserTree
              ? `ปักจุดปลูกของคุณแล้ว (${Math.round(userTree.x * 100)}%, ${Math.round(userTree.y * 100)}%) — แตะจุดอื่นในกรอบเพื่อย้ายได้ (ยิ่งร่วมปลูกมาก ผืนดินยิ่งงอกออกไปด้านขวา)`
              : 'เริ่มจากแนวตลิ่งด้านซ้าย แตะหรือคลิกภายในกรอบเส้นประเพื่อปลูก 1 ต้นและเพิ่มผืนดิน'}
          </span>
          <strong>{zone?.name_th}</strong>
        </div>
      </section>
    </div>
  );
}
