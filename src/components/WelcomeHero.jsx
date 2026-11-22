import React from 'react';
import { ArrowRight, Layers, MapPin, Sprout, Users } from 'lucide-react';
import { BOOTH_INFO } from '../data/boothContent.js';

export default function WelcomeHero({ stats, onStart }) {
  return (
    <div className="hero-stage">
      {/* Subtle full-width decorative coastal wave backdrop */}
      <svg
        className="hero-stage-bg"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#d6ead8"
          fillOpacity="0.65"
          d="M0,130 C240,85 480,175 720,130 C960,85 1200,165 1440,120 L1440,220 L0,220 Z"
        />
        <path
          fill="#c4e0d8"
          fillOpacity="0.45"
          d="M0,165 C300,130 560,200 880,158 C1140,124 1300,178 1440,152 L1440,220 L0,220 Z"
        />
      </svg>

      <div className="hero-grid">
        <section className="hero-card">
          {/* Top Visual Storytelling Banner: Bang Khun Thian Coastal Scene */}
          <div className="hero-visual-banner">
            <svg
              viewBox="0 0 800 210"
              preserveAspectRatio="xMidYMid slice"
              className="hero-banner-svg"
              role="img"
              aria-label="ภาพประกอบสะพานรักษ์ทะเลบางขุนเทียน แนวกันคลื่น และป่าชายเลน"
            >
              <defs>
                <linearGradient id="bkSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bce2ec" />
                  <stop offset="65%" stopColor="#e2f2ea" />
                  <stop offset="100%" stopColor="#f5efe1" />
                </linearGradient>
                <linearGradient id="bkSea" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#267588" />
                  <stop offset="100%" stopColor="#185164" />
                </linearGradient>
                <radialGradient id="bkSun" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff4bf" stopOpacity="0.98" />
                  <stop offset="100%" stopColor="#fff4bf" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sky */}
              <rect width="800" height="122" fill="url(#bkSky)" />
              <circle cx="675" cy="52" r="56" fill="url(#bkSun)" />
              <circle cx="675" cy="52" r="19" fill="#fff7cf" />

              {/* Clouds */}
              <g fill="#ffffff" fillOpacity="0.78">
                <circle cx="250" cy="40" r="14" />
                <circle cx="266" cy="34" r="18" />
                <circle cx="284" cy="40" r="13" />
                <circle cx="515" cy="48" r="12" />
                <circle cx="530" cy="42" r="15" />
                <circle cx="546" cy="48" r="11" />
              </g>

              {/* Distant Bangkok City Skyline ("ธรรมชาติในเมืองใหญ่") */}
              <g fill="#5b818c" fillOpacity="0.26">
                <rect x="28" y="82" width="16" height="36" rx="1" />
                <rect x="48" y="66" width="14" height="52" rx="1" />
                <rect x="66" y="86" width="18" height="32" rx="1" />
                <rect x="88" y="58" width="15" height="60" rx="1" />
                <rect x="107" y="76" width="17" height="42" rx="1" />
                <rect x="128" y="88" width="14" height="30" rx="1" />
              </g>

              {/* Open Gulf Sea */}
              <rect x="0" y="116" width="800" height="94" fill="url(#bkSea)" />

              {/* Gentle Curling Waves */}
              <g fill="none" stroke="#d5f2f8" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.72">
                <path d="M578,143 C570,147 561,134 551,133 C545,132 543,136 546,138 C548,136 551,138 550,142 C549,145 544,146 537,144 Q533,143 530,144" />
                <path d="M674,157 C665,161 655,146 644,145 C637,144 635,149 638,151 C640,149 644,151 643,155 C642,159 636,160 628,158 Q623,156 620,158" />
                <path d="M624,177 C615,181 605,166 594,165 C587,164 585,169 588,171 C590,169 594,171 593,175 C592,179 586,180 578,178 Q573,176 570,178" />
                <path d="M741,139 C732,143 722,128 711,127 C704,126 702,131 705,133 C707,131 711,133 710,137 C709,141 703,142 695,140 Q690,138 687,140" />
                <path d="M761,185 C752,189 742,174 731,173 C724,172 722,177 725,179 C727,177 731,179 730,183 C729,187 723,188 715,186 Q710,184 707,186" />
              </g>

              {/* Fertile Mudbank & Reclaimed Land */}
              <path d="M0,115 Q260,118 390,148 Q430,164 415,210 L0,210 Z" fill="#6b563c" />
              <path d="M0,115 Q245,118 360,145 Q395,160 382,210 L265,210 Q285,155 240,122 Z" fill="#7d9458" fillOpacity="0.52" />

              {/* Bamboo & Rock Wave Barrier at Mid-Sea */}
              <g>
                {/* Rock revetment */}
                <g fill="#7d8487" stroke="#53595c" strokeWidth="1.2">
                  <ellipse cx="478" cy="136" rx="14" ry="8" />
                  <ellipse cx="490" cy="142" rx="12" ry="7" />
                  <ellipse cx="484" cy="154" rx="15" ry="8" />
                  <ellipse cx="495" cy="164" rx="13" ry="7" />
                  <ellipse cx="487" cy="176" rx="15" ry="8" />
                  <ellipse cx="497" cy="188" rx="14" ry="8" />
                </g>
                {/* Bamboo poles */}
                <g stroke="#c89d54" strokeWidth="3.5" strokeLinecap="round">
                  <line x1="454" y1="126" x2="454" y2="152" />
                  <line x1="461" y1="132" x2="461" y2="160" />
                  <line x1="457" y1="156" x2="457" y2="186" />
                  <line x1="464" y1="164" x2="464" y2="194" />
                </g>
              </g>

              {/* Wooden Boardwalk & Pavilion ("สะพานรักษ์ทะเล") */}
              <g>
                {/* Boardwalk deck */}
                <path d="M0,128 L295,134 L295,141 L0,136 Z" fill="#a87645" />
                <g stroke="#7a512a" strokeWidth="2.5">
                  <line x1="45" y1="136" x2="45" y2="154" />
                  <line x1="105" y1="137" x2="105" y2="156" />
                  <line x1="165" y1="138" x2="165" y2="158" />
                  <line x1="225" y1="139" x2="225" y2="159" />
                  <line x1="282" y1="140" x2="282" y2="160" />
                </g>
                {/* Triangle viewpoint pavilion */}
                <g stroke="#6c4522" strokeWidth="2.5">
                  <line x1="296" y1="104" x2="296" y2="142" />
                  <line x1="336" y1="104" x2="336" y2="142" />
                </g>
                <polygon points="286,106 316,80 346,106" fill="#c75934" stroke="#943c1f" strokeWidth="1.5" />
              </g>

              {/* Mangrove Trees with Arching Prop Roots */}
              {[
                { x: 92, y: 162, s: 1.05 },
                { x: 168, y: 174, s: 1.15 },
                { x: 248, y: 168, s: 0.98 },
                { x: 325, y: 180, s: 0.92 },
              ].map((tree, idx) => (
                <g key={idx} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`}>
                  {/* Prop roots */}
                  <g fill="none" stroke="#6c4928" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M0,-12 Q-12,2 -17,16" />
                    <path d="M0,-10 Q-5,4 -8,18" />
                    <path d="M0,-10 Q6,4 9,18" />
                    <path d="M0,-12 Q13,2 18,16" />
                  </g>
                  {/* Trunk */}
                  <line x1="0" y1="-34" x2="0" y2="-6" stroke="#5e3e22" strokeWidth="4" strokeLinecap="round" />
                  {/* Lush canopy */}
                  <circle cx="-11" cy="-34" r="14" fill="#2c6f46" />
                  <circle cx="11" cy="-34" r="13" fill="#26643e" />
                  <circle cx="0" cy="-44" r="16" fill="#3b8857" />
                  <circle cx="-4" cy="-47" r="7" fill="#52a46c" fillOpacity="0.65" />
                </g>
              ))}

              {/* White Egret Bird on Shore */}
              <g transform="translate(362, 165)">
                <line x1="0" y1="4" x2="-2" y2="14" stroke="#c88a32" strokeWidth="1.4" />
                <line x1="4" y1="4" x2="5" y2="14" stroke="#c88a32" strokeWidth="1.4" />
                <ellipse cx="2" cy="1" rx="7" ry="4.5" fill="#ffffff" />
                <path d="M6,-1 Q10,-8 8,-12" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="8.5" cy="-13" r="2.6" fill="#ffffff" />
                <polygon points="10.5,-13.5 16,-12.5 10.5,-11.5" fill="#e69d24" />
              </g>
            </svg>

            <span className="hero-banner-badge">
              <MapPin size={13} />
              <span>บูธ {BOOTH_INFO.boothName} • กลุ่ม {BOOTH_INFO.groupCode}</span>
            </span>
          </div>

          <div className="hero-card-body">
            <div>
              <h1 className="hero-title">Protect &amp; Plant the KONGKANG</h1>
              <p className="hero-th-headline">
                ร่วมสร้างแนวกันคลื่นและปลูกโกงกาง คืนแผ่นดินบางขุนเทียน
              </p>
              <p className="hero-location">
                <MapPin size={15} />
                <span>{BOOTH_INFO.location}</span>
              </p>
            </div>

            <blockquote className="quote-editorial">
              “{BOOTH_INFO.coreQuote}”
            </blockquote>

            <div className="hero-metrics-strip">
              <div className="hero-metric-item">
                <span className="hero-metric-icon">
                  <Users size={18} />
                </span>
                <div>
                  <div className="hero-metric-value">{stats.totalParticipants}</div>
                  <div className="hero-metric-label">ผู้ร่วมกิจกรรม (คน)</div>
                </div>
              </div>

              <div className="hero-metric-item">
                <span className="hero-metric-icon">
                  <Sprout size={18} />
                </span>
                <div>
                  <div className="hero-metric-value">{stats.totalMangrovesPlanted}</div>
                  <div className="hero-metric-label">ต้นโกงกางที่ปลูกรวม (ต้น)</div>
                </div>
              </div>

              <div className="hero-metric-item">
                <span className="hero-metric-icon">
                  <Layers size={18} />
                </span>
                <div>
                  <div className="hero-metric-value">{stats.totalLandRecoveredSqm}</div>
                  <div className="hero-metric-label">ผืนดินงอกคืน (ตร.ม.)</div>
                </div>
              </div>
            </div>

            <div className="hero-cta-wrap">
              <button
                type="button"
                className="btn btn-primary btn-hero-cta"
                onClick={onStart}
              >
                <Sprout size={21} />
                <span>เริ่มกิจกรรมฟื้นฟูชายฝั่ง</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        <aside className="steps-preview-card">
          <div>
            <span className="section-badge">4 ขั้นตอนกิจกรรมหน้าบูธ</span>
            <h2 className="steps-preview-heading">
              ทดลองสร้างที่กำบังและปลูกป่าคืนแผ่นดิน
            </h2>
            <p className="steps-preview-sub">
              ไม่ต้องเข้าสู่ระบบ สามารถเริ่มเล่นบนเครื่องบูธได้ทันที
            </p>
          </div>

          <div className="steps-clean-list">
            {BOOTH_INFO.activitySteps.map((item) => (
              <div key={item.step} className="step-clean-item">
                <div className="preview-step-num">{item.step}</div>
                <div>
                  <div className="step-clean-title">{item.title}</div>
                  <div className="step-clean-summary">{item.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
