import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  MapPin,
  RotateCcw,
  Send,
  Users,
} from 'lucide-react';
import { BOOTH_INFO } from '../data/boothContent.js';

const BARRIER_LABELS = {
  bamboo: BOOTH_INFO.barriers.bamboo.name,
  rock: BOOTH_INFO.barriers.rock.name,
  mixed: 'แนวผสมผสาน (ไม้ไผ่ + คันหิน)',
};

export default function Step4SignIn({
  zone,
  barrierChoice,
  triedWithoutBarrier,
  userTree,
  existingCount,
  landRecoveredSqm,
  savedRecord,
  isSubmitting,
  submitError,
  onSubmit,
  onBack,
  onRestart,
  onViewWall,
}) {
  const [studentId, setStudentId] = useState('');
  const [reflection, setReflection] = useState('');

  const simulatedBarrier = barrierChoice === 'bamboo' ? 'bamboo' : 'rock';

  function handleFormSubmit(event) {
    event.preventDefault();
    onSubmit({
      studentId: studentId.trim(),
      reflection: reflection.trim(),
    });
  }

  if (savedRecord) {
    return (
      <div className="panel" style={{ maxWidth: 900, margin: '0 auto', padding: 30 }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              background: '#e2f4e6',
              color: 'var(--mangrove-primary)',
              display: 'inline-grid',
              placeItems: 'center',
              marginBottom: 10,
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <span className="section-badge">บันทึกร่องรอยสำเร็จ • ผู้ร่วมปลูกคนที่ #{savedRecord.id}</span>
          <h2 style={{ margin: '10px 0 6px', fontSize: '1.45rem', color: 'var(--mangrove-dark)' }}>
            บันทึกต้นโกงกางของคุณลงพื้นที่เรียบร้อยแล้ว!
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.96rem' }}>
            ผู้เข้าร่วมคนถัดไปที่เลือกโซนนี้จะเห็นต้นไม้ของคุณเติบโตอยู่บนชายฝั่งด้วย
          </p>
        </div>

        <div className="kraft-box" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <strong style={{ color: 'var(--mangrove-dark)' }}>
              รหัสนักศึกษา: {savedRecord.studentId}
            </strong>
            <span className="tag teal">ร่องรอย #{savedRecord.id}</span>
          </div>
          <p className="footprint-quote">“{savedRecord.reflection}”</p>
          <div className="tag-row" style={{ marginTop: 10 }}>
            <span className="tag">{savedRecord.coastalZoneName}</span>
            <span className="tag">ปลูก 1 ต้น</span>
            <span className="tag">
              พิกัด ({Math.round(savedRecord.treeX * 100)}%, {Math.round(savedRecord.treeY * 100)}%)
            </span>
            <span className="tag">ดินงอกคืน +{savedRecord.landRecoveredSqm} ตร.ม.</span>
          </div>
        </div>

        <div className="alert-box alert-info" style={{ marginBottom: 20 }}>
          <Award size={19} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>แจ้งเจ้าหน้าที่หน้าบูธเพื่อรับของรางวัลได้เลย!</strong> แล้วกดเริ่มรอบใหม่สำหรับผู้เล่นคนถัดไป
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary btn-lg" onClick={onRestart}>
            <RotateCcw size={18} />
            <span>เริ่มรอบใหม่สำหรับผู้เล่นคนถัดไป</span>
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={onViewWall}>
            <Users size={18} />
            <span>ดูร่องรอยผู้เข้าร่วมทั้งหมด</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step4-grid">
      <div className="panel">
        <span className="section-badge">สรุปจุดที่คุณปลูกไว้</span>
        <h2 style={{ margin: '10px 0 10px', fontSize: '1.35rem', color: 'var(--mangrove-dark)' }}>
          ร่องรอยของคุณในบางขุนเทียน
        </h2>

        <div className="kraft-box" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>พื้นที่ชายฝั่งที่เลือก</div>
            <div style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--mangrove-dark)' }}>{zone?.name_th}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>แนวกันคลื่นที่ทดลอง / คุ้มครองจริง</div>
            <div style={{ fontWeight: 700, color: 'var(--mangrove-dark)' }}>
              จำลอง {BARRIER_LABELS[simulatedBarrier]} • ปลูกจริงในแนวคันหินถาวร 5 จุด
            </div>
          </div>
          {userTree && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.92rem', color: 'var(--gulf-teal)', fontWeight: 600 }}>
              <MapPin size={16} />
              <span>
                พิกัดต้นของคุณ: ({Math.round(userTree.x * 100)}%, {Math.round(userTree.y * 100)}%)
              </span>
            </div>
          )}
          <div className="planting-metrics" style={{ margin: '4px 0 0' }}>
            <div className="metric-box">
              <div className="metric-val">1</div>
              <div className="metric-lbl">ต้นที่คุณปลูก</div>
            </div>
            <div className="metric-box">
              <div className="metric-val">{existingCount + 1}</div>
              <div className="metric-lbl">รวมในโซนนี้</div>
            </div>
            <div className="metric-box">
              <div className="metric-val">+{landRecoveredSqm}</div>
              <div className="metric-lbl">ดินงอก (ตร.ม.)</div>
            </div>
          </div>
          {triedWithoutBarrier && (
            <div style={{ fontSize: '0.86rem', color: 'var(--terracotta)', fontWeight: 600 }}>
              • ได้ลองปลูกแบบไม่มีแนวกันคลื่นและเห็นแรงคลื่นซัดต้นกล้าแล้ว
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <span className="section-badge">ขั้นที่ 4 จาก 4</span>
        <h2 style={{ margin: '10px 0 6px', fontSize: '1.35rem', color: 'var(--mangrove-dark)' }}>
          ลงชื่อร่วมกิจกรรมและฝากความรู้สึก
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
          กรอกรหัสนักศึกษาและความรู้สึกสั้นๆ หลังเล่น 1 ประโยค เพื่อบันทึกตำแหน่งต้นไม้ของคุณลงฐานข้อมูล `kongkang`
        </p>

        <form onSubmit={handleFormSubmit}>
          <div className="form-field">
            <label htmlFor="student-id-input" className="form-label">
              รหัสนักศึกษา *
            </label>
            <input
              id="student-id-input"
              type="text"
              className="text-input"
              placeholder="เช่น 67070501037"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              maxLength={32}
              required
            />
          </div>

          <div className="form-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="reflection-input" className="form-label">
                ความรู้สึกสั้นๆ หลังเล่น 1 ประโยค *
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {reflection.length}/240
              </span>
            </div>
            <textarea
              id="reflection-input"
              rows={3}
              className="text-area"
              placeholder="เช่น เพิ่งรู้ว่าการสร้างที่กำบังให้ต้นกล้าสำคัญพอๆ กับการปลูกต้นไม้เลย"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              maxLength={240}
              required
            />
          </div>

          {submitError && (
            <div className="alert-box alert-warn" style={{ marginBottom: 14 }}>
              {submitError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              <ArrowLeft size={17} />
              <span>ย้อนกลับ</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting || studentId.trim().length < 3 || reflection.trim().length < 2}
            >
              <Send size={17} />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกร่องรอยและตำแหน่งต้นไม้'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
