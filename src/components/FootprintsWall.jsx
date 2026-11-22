import React, { useEffect, useState } from 'react';
import { Download, Search, Sprout, Trees } from 'lucide-react';
import { BOOTH_INFO } from '../data/boothContent.js';
import { fetchParticipations, formatThaiDateTime } from '../utils/api.js';

const BARRIER_LABELS = {
  bamboo: BOOTH_INFO.barriers.bamboo.name,
  rock: BOOTH_INFO.barriers.rock.name,
  mixed: 'แนวผสมผสาน',
};

export default function FootprintsWall({ zones, stats, onStartActivity, onViewForest }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [barrierFilter, setBarrierFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchParticipations({
      zone: zoneFilter,
      barrier: barrierFilter,
      q: searchQuery,
    })
      .then((data) => {
        if (!cancelled) {
          setItems(data.items || []);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [zoneFilter, barrierFilter, searchQuery]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 14,
          flexWrap: 'wrap',
          marginBottom: 18,
        }}
      >
        <div>
          <span className="section-badge">ฐานข้อมูล PostgreSQL (kongkang)</span>
          <h1 style={{ margin: '8px 0 4px', fontSize: '1.75rem', color: 'var(--mangrove-dark)' }}>
            ร่องรอยของผู้เข้าร่วมกิจกรรม
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.94rem' }}>
            รวมความรู้สึก รหัสนักศึกษา และผืนดินที่ทุกคนช่วยกันฟื้นฟูหน้าบูธ ธรรมชาติในเมืองใหญ่
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {onViewForest && (
            <button type="button" className="btn btn-secondary" onClick={onViewForest}>
              <Trees size={17} />
              <span>ดูผืนป่ารวมทุกคน</span>
            </button>
          )}

          <a
            href="/api/participations/export.csv"
            className="btn btn-secondary"
            download="kongkang-participations.csv"
          >
            <Download size={17} />
            <span>ดาวน์โหลด CSV</span>
          </a>

          <button type="button" className="btn btn-primary" onClick={onStartActivity}>
            <Sprout size={17} />
            <span>ร่วมปลูกเพิ่มอีกคน</span>
          </button>
        </div>
      </div>

      <div className="wall-stats-grid">
        <div className="wall-stat-card">
          <div className="mini-stat-value">{stats.totalParticipants}</div>
          <div className="mini-stat-label">ผู้เข้าร่วมทั้งหมด (คน)</div>
        </div>
        <div className="wall-stat-card">
          <div className="mini-stat-value">{stats.totalMangrovesPlanted}</div>
          <div className="mini-stat-label">ต้นโกงกางปลูกรวม (ต้น)</div>
        </div>
        <div className="wall-stat-card">
          <div className="mini-stat-value">{stats.totalLandRecoveredSqm}</div>
          <div className="mini-stat-label">ผืนดินงอกคืนรวม (ตร.ม.)</div>
        </div>
        <div className="wall-stat-card">
          <div className="mini-stat-value">{stats.barrierBreakdown?.rock || 0} / {stats.barrierBreakdown?.bamboo || 0}</div>
          <div className="mini-stat-label">แนวคันหิน / แนวไม้ไผ่ (ครั้ง)</div>
        </div>
      </div>

      <div className="wall-filters">
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="search"
            className="text-input"
            style={{ paddingLeft: 38 }}
            placeholder="ค้นหาด้วยรหัสนักศึกษา หรือข้อความความรู้สึก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="select-input"
          aria-label="กรองตามพื้นที่ชายฝั่ง"
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
        >
          <option value="all">ทุกพื้นที่ชายฝั่ง</option>
          {zones.map((z) => (
            <option key={z.code} value={z.code}>
              {z.name_th}
            </option>
          ))}
        </select>

        <select
          className="select-input"
          aria-label="กรองตามประเภทแนวป้องกัน"
          value={barrierFilter}
          onChange={(e) => setBarrierFilter(e.target.value)}
        >
          <option value="all">ทุกแนวป้องกันคลื่น</option>
          <option value="rock">แนวคันหิน</option>
          <option value="bamboo">แนวไม้ไผ่</option>
          <option value="mixed">แนวผสมผสาน</option>
        </select>
      </div>

      {error && (
        <div className="alert-box alert-warn" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="panel" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          กำลังโหลดร่องรอยผู้เข้าร่วม...
        </div>
      ) : items.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--mangrove-dark)' }}>
            ยังไม่มีร่องรอยผู้เข้าร่วมที่ตรงกับเงื่อนไข
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 18 }}>
            ลองเป็นผู้เข้าร่วมคนแรกในการสร้างแนวป้องกันและปลูกต้นโกงกางคืนแผ่นดินบางขุนเทียน
          </p>
          <button type="button" className="btn btn-primary" onClick={onStartActivity}>
            <Sprout size={18} />
            <span>เริ่มกิจกรรมเลย</span>
          </button>
        </div>
      ) : (
        <div className="footprints-grid">
          {items.map((item) => (
            <article key={item.id} className="footprint-card">
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    gap: 8,
                  }}
                >
                  <strong style={{ color: 'var(--mangrove-dark)', fontSize: '1rem' }}>
                    {item.studentId}
                  </strong>
                  <span className="tag teal">#{item.id}</span>
                </div>

                <p className="footprint-quote">“{item.reflection}”</p>
              </div>

              <div>
                <div className="tag-row" style={{ marginBottom: 8 }}>
                  <span className="tag">{item.coastalZoneName}</span>
                  <span className="tag">
                    {BARRIER_LABELS[item.barrierType] || item.barrierType} ({item.barrierSegments} จุด)
                  </span>
                  <span className="tag">ปลูก {item.mangrovesPlanted} ต้น</span>
                  <span className="tag">ดินงอก {item.landRecoveredSqm} ตร.ม.</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  บันทึกเมื่อ {formatThaiDateTime(item.createdAt)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
