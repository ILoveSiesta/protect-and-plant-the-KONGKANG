import React from 'react';
import { MapPin, Users, X } from 'lucide-react';
import { BOOTH_INFO } from '../data/boothContent.js';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="เบื้องหลังงานสำรวจบางขุนเทียน"
      onClick={onClose}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-badge">
              <MapPin size={14} />
              {BOOTH_INFO.courseTitle} • กลุ่ม {BOOTH_INFO.groupCode}
            </span>
            <h2 style={{ margin: '10px 0 4px', color: 'var(--mangrove-dark)' }}>
              เบื้องหลังการสำรวจ: สะพานรักษ์ทะเลบางขุนเทียน
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ทำไมเราถึงสร้างกิจกรรม “ป้องกันก่อนปลูก” บนเว็บไซต์นี้
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '8px 12px' }}
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            <X size={18} />
          </button>
        </div>

        <div className="kraft-box" style={{ marginBottom: 14 }}>
          <strong>ใจความสำคัญจากพื้นที่จริง:</strong>
          <p style={{ margin: '6px 0 0', lineHeight: 1.65 }}>
            ตลอดเส้นทางปั่นจักรยานไป–กลับราว 8 กิโลเมตรสู่ทะเลเปิดบางขุนเทียน ทีมงานได้เห็นทั้งความร่มรื่นของป่าชายเลน
            นกยางสีขาว ปลาตีน และร่องรอยความพยายามของคนที่ร่วมกันสร้างแนวกันคลื่นเพื่อให้ต้นกล้าโกงกางหยั่งรากและคืนผืนดินกลับมาได้จริง
          </p>
        </div>

        <h3 style={{ margin: '14px 0 6px', fontSize: '1.05rem', color: 'var(--mangrove-dark)' }}>
          มุมมองจากผู้ให้สัมภาษณ์ในพื้นที่
        </h3>
        <div className="interview-grid">
          {BOOTH_INFO.fieldInterviews.map((item) => (
            <div key={item.role} className="panel" style={{ padding: 15 }}>
              <div style={{ fontWeight: 700, color: 'var(--mangrove-primary)' }}>
                {item.role}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gulf-teal)', fontWeight: 600, marginBottom: 6 }}>
                {item.focus}
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--text-main)' }}>
                “{item.quote}”
              </p>
            </div>
          ))}
        </div>

        <h3 style={{ margin: '14px 0 8px', fontSize: '1.05rem', color: 'var(--mangrove-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Users size={18} />
          สมาชิกกลุ่มและบทบาทหน้าที่ ({BOOTH_INFO.groupCode})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BOOTH_INFO.teamMembers.map((member) => (
            <div
              key={member.names}
              style={{
                padding: '9px 12px',
                borderRadius: 10,
                background: '#f7fbf6',
                border: '1px solid var(--border-soft)',
                fontSize: '0.86rem',
              }}
            >
              <strong style={{ color: 'var(--mangrove-dark)' }}>{member.names}</strong>
              <span style={{ color: 'var(--text-muted)' }}> — {member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
