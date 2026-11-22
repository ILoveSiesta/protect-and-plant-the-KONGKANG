import React, { useEffect, useState } from 'react';
import { RefreshCw, Sprout, Trees, Users, Waves } from 'lucide-react';
import CoastalCanvas from './CoastalCanvas.jsx';
import { formatThaiDateTime } from '../utils/api.js';

export default function CommunityForest({
  zones = [],
  treesByZone = {},
  stats = {},
  initialZoneCode,
  onRefresh,
  onStartActivity,
  onViewWall,
}) {
  const [activeZoneCode, setActiveZoneCode] = useState(
    initialZoneCode || zones[0]?.code || 'estuary_strong'
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!zones.length) return;
    if (!zones.some((z) => z.code === activeZoneCode)) {
      setActiveZoneCode(zones[0].code);
    }
  }, [zones, activeZoneCode]);

  const activeZone =
    zones.find((z) => z.code === activeZoneCode) || zones[0] || null;
  const activeTrees = treesByZone[activeZone?.code] || [];
  const totalTrees = stats?.totalMangrovesPlanted ?? Object.values(treesByZone).reduce(
    (sum, list) => sum + (list?.length || 0),
    0
  );

  async function handleRefresh() {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  const waveBadgeClass =
    (activeZone?.wave_intensity || 3) >= 4
      ? 'wave-high'
      : (activeZone?.wave_intensity || 3) >= 3
        ? 'wave-mid'
        : 'wave-low';

  return (
    <div className="forest-page">
      <div className="forest-header">
        <div>
          <span className="section-badge">
            <Trees size={14} />
            ผืนป่าโกงกางรวมจากผู้ร่วมกิจกรรมทุกคน ({totalTrees} ต้น)
          </span>
          <h1 className="forest-title">
            ผืนป่ารวมทุกคน (สะพานรักษ์ทะเลบางขุนเทียน)
          </h1>
          <p className="forest-subtitle">
            เลือกดูแต่ละโซนชายฝั่ง ชี้เมาส์บนต้นไม้แต่ละต้นเพื่อดูรหัสนักศึกษาผู้ปลูก
          </p>
        </div>

        <div className="forest-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
            <span>{refreshing ? 'กำลังอัปเดต...' : 'รีเฟรช'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onViewWall}
          >
            <Users size={16} />
            <span>ดูร่องรอยผู้เข้าร่วม</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onStartActivity}
          >
            <Sprout size={17} />
            <span>ร่วมปลูกเพิ่ม 1 ต้น</span>
          </button>
        </div>
      </div>

      <div className="forest-zone-tabs" role="tablist" aria-label="เลือกโซนชายฝั่ง">
        {zones.map((zone) => {
          const count = (treesByZone[zone.code] || []).length;
          const isActive = zone.code === activeZone?.code;
          return (
            <button
              key={zone.code}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`forest-zone-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveZoneCode(zone.code)}
            >
              <span className="forest-zone-name">{zone.name_th}</span>
              <span className="forest-zone-count">{count} ต้น</span>
            </button>
          );
        })}
      </div>

      <section className="forest-canvas-card">
        <div className="forest-canvas-stage">
          <CoastalCanvas
            mode="forest"
            zone={activeZone}
            barrierChoice="rock"
            existingTrees={activeTrees}
            userTree={null}
            growthProgress={1}
          />
        </div>

        <div className="canvas-caption">
          <span>
            ปลูกแล้วในโซนนี้ <strong>{activeTrees.length} ต้น</strong> •{' '}
            ชี้เมาส์หรือแตะที่ต้นโกงกางบนภาพเพื่อดูรหัสนักศึกษาผู้ปลูก
          </span>
          {activeZone && (
            <span className={`wave-meter ${waveBadgeClass}`}>
              <Waves size={13} />
              <span>
                คลื่นระดับ {activeZone.wave_intensity}/5 ({activeZone.erosion_level_th})
              </span>
            </span>
          )}
        </div>
      </section>

      <section className="forest-list-section">
        <div className="forest-list-head">
          <h2>รายชื่อผู้ร่วมปลูกใน{activeZone?.name_th || 'โซนนี้'}</h2>
          <span>{activeTrees.length} ต้น</span>
        </div>

        {activeTrees.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--mangrove-dark)' }}>
              ยังไม่มีต้นโกงกางที่บันทึกในโซนนี้
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '6px 0 16px' }}>
              มาเป็นคนแรกที่ปักต้นโกงกางและช่วยงอกผืนดินคืนให้โซนนี้กันเลย
            </p>
            <button type="button" className="btn btn-primary" onClick={onStartActivity}>
              <Sprout size={17} />
              <span>ร่วมปลูกต้นแรกในโซนนี้</span>
            </button>
          </div>
        ) : (
          <div className="forest-tree-grid">
            {[...activeTrees].reverse().map((tree) => (
              <article key={tree.id} className="forest-tree-chip">
                <div className="forest-tree-chip-top">
                  <strong>
                    <Sprout size={15} style={{ color: 'var(--sprout-green)' }} />
                    <span>{tree.studentId}</span>
                  </strong>
                  <span className="tag teal">#{tree.id}</span>
                </div>
                {tree.reflection && (
                  <p className="forest-tree-reflection">“{tree.reflection}”</p>
                )}
                <div className="forest-tree-meta">
                  <span>พิกัด ({Math.round(tree.x * 100)}%, {Math.round(tree.y * 100)}%)</span>
                  {tree.createdAt && <span>{formatThaiDateTime(tree.createdAt)}</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
