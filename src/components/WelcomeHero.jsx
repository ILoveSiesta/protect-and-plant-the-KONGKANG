import React from 'react';
import { ArrowRight, MapPin, Sprout, Users } from 'lucide-react';
import { BOOTH_INFO } from '../data/boothContent.js';

export default function WelcomeHero({ stats, onStart, onViewWall, onOpenAbout }) {
  return (
    <div className="hero-grid">
      <section className="hero-card">
        <div>
          <span className="section-badge">
            <MapPin size={14} />
            บูธ {BOOTH_INFO.boothName} • กลุ่ม {BOOTH_INFO.groupCode}
          </span>
          <h1 className="hero-title">Protect &amp; Plant the KONGKANG</h1>
          <p className="hero-subtitle">{BOOTH_INFO.location}</p>
        </div>

        <blockquote className="quote-card">
          “{BOOTH_INFO.coreQuote}”
        </blockquote>

        <div className="hero-stats-row">
          <div className="mini-stat">
            <div className="mini-stat-value">{stats.totalParticipants}</div>
            <div className="mini-stat-label">ผู้ร่วมกิจกรรม (คน)</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-value">{stats.totalMangrovesPlanted}</div>
            <div className="mini-stat-label">ต้นโกงกางที่ปลูกรวม (ต้น)</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-value">{stats.totalLandRecoveredSqm}</div>
            <div className="mini-stat-label">ผืนดินงอกคืน (ตร.ม.)</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onStart}
          >
            <Sprout size={20} />
            <span>เริ่มกิจกรรมฟื้นฟูชายฝั่ง</span>
            <ArrowRight size={19} />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onViewWall}
          >
            <Users size={18} />
            <span>ดูร่องรอยผู้เข้าร่วม</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenAbout}
          >
            อ่านข้อมูลลงพื้นที่
          </button>
        </div>
      </section>

      <aside className="steps-preview-card">
        <div>
          <span className="section-badge">4 ขั้นตอนกิจกรรมหน้าบูธ</span>
          <h2 style={{ margin: '10px 0 4px', fontSize: '1.35rem', color: 'var(--mangrove-dark)' }}>
            ทดลองสร้างที่กำบังและปลูกป่าคืนแผ่นดิน
          </h2>
          <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--text-muted)' }}>
            ไม่ต้องเข้าสู่ระบบ สามารถเริ่มเล่นบนเครื่องบูธได้ทันที
          </p>
        </div>

        {BOOTH_INFO.activitySteps.map((item) => (
          <div key={item.step} className="preview-step-item">
            <div className="preview-step-num">{item.step}</div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--mangrove-dark)', fontSize: '1.02rem' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.52 }}>
                {item.summary}
              </div>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
