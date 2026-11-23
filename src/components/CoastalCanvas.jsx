import React, { useEffect, useRef } from 'react';

const BARRIER_X_NORM = 0.67;
const BARRIER_Y_SLOTS = [0.45, 0.55, 0.65, 0.75, 0.85];

function getBaseShoreX(zoneCode) {
  if (zoneCode === 'estuary_strong') return 0.12;
  if (zoneCode === 'community_canal') return 0.18;
  return 0.15; // boardwalk_mid
}

function getShorelineX(yNorm, zoneCode, recoveredOffset) {
  const base = getBaseShoreX(zoneCode);
  const curve = Math.sin(yNorm * Math.PI * 1.45) * 0.022 - (yNorm - 0.52) * 0.024;
  return base + curve + recoveredOffset;
}

function drawSkyAndBackdrop(ctx, w, h, time, zoneCode, scale) {
  const skyTop = '#c2e4ee';
  const skyMid = '#e2f1ea';
  const skyBot = '#f4efe0';

  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.36);
  if (zoneCode === 'estuary_strong') {
    skyGrad.addColorStop(0, '#8ec6e0');
    skyGrad.addColorStop(0.65, '#c8e4ef');
    skyGrad.addColorStop(1, '#e6f0ee');
  } else if (zoneCode === 'community_canal') {
    skyGrad.addColorStop(0, '#eab984');
    skyGrad.addColorStop(0.58, '#f6dfb9');
    skyGrad.addColorStop(1, '#e4ece0');
  } else {
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(0.65, skyMid);
    skyGrad.addColorStop(1, skyBot);
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h * 0.37);

  const horizonY = h * 0.345;

  // Sun / warm glow positioned per zone mood
  const sunX = zoneCode === 'community_canal' ? w * 0.74 : w * 0.84;
  const sunY = zoneCode === 'community_canal' ? h * 0.19 : h * 0.12;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 6 * scale, sunX, sunY, w * 0.14);
  sunGrad.addColorStop(
    0,
    zoneCode === 'community_canal'
      ? 'rgba(255, 224, 148, 0.96)'
      : 'rgba(255, 246, 206, 0.92)'
  );
  sunGrad.addColorStop(1, 'rgba(255, 245, 204, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, w * 0.14, 0, Math.PI * 2);
  ctx.fill();

  // Clouds (heavier monsoon clouds for estuary_strong)
  ctx.fillStyle =
    zoneCode === 'estuary_strong'
      ? 'rgba(244, 250, 255, 0.82)'
      : 'rgba(255, 255, 255, 0.68)';
  const cloudCount = zoneCode === 'estuary_strong' ? 4 : 3;
  const clouds = [
    { baseX: 0.32, y: 0.11, s: 1.05 },
    { baseX: 0.58, y: 0.15, s: 0.9 },
    { baseX: 0.84, y: 0.09, s: 0.78 },
    { baseX: 0.45, y: 0.21, s: 1.15 },
  ];
  for (let i = 0; i < cloudCount; i += 1) {
    const c = clouds[i];
    const speed = zoneCode === 'estuary_strong' ? 0.011 : 0.005;
    const cx = (((c.baseX + time * speed) % 1.2) - 0.1) * w;
    const cy = c.y * h;
    const r = c.s * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, 18 * r, 0, Math.PI * 2);
    ctx.arc(cx + 16 * r, cy - 6 * r, 22 * r, 0, Math.PI * 2);
    ctx.arc(cx + 36 * r, cy, 16 * r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Zone-specific horizon landmarks!
  if (zoneCode === 'boardwalk_mid') {
    // Distant Bangkok city skyline ("ธรรมชาติในเมืองใหญ่")
    const buildings = [
      [0.02, 0.024, 0.09],
      [0.048, 0.02, 0.14],
      [0.072, 0.028, 0.08],
      [0.105, 0.022, 0.15],
      [0.132, 0.026, 0.1],
      [0.165, 0.02, 0.12],
      [0.19, 0.025, 0.075],
    ];
    ctx.fillStyle = 'rgba(85, 118, 126, 0.26)';
    for (const [bx, bw, bh] of buildings) {
      ctx.fillRect(bx * w, horizonY - bh * h, bw * w, bh * h);
    }
  } else if (zoneCode === 'estuary_strong') {
    // Distant gulf cargo ship + sea marker buoy on open ocean horizon
    const shipX = ((0.76 + Math.sin(time * 0.15) * 0.02) * w);
    const shipY = horizonY - 2;
    ctx.fillStyle = 'rgba(35, 68, 84, 0.55)';
    ctx.beginPath();
    ctx.moveTo(shipX - 24 * scale, shipY);
    ctx.lineTo(shipX + 26 * scale, shipY);
    ctx.lineTo(shipX + 20 * scale, shipY + 6 * scale);
    ctx.lineTo(shipX - 18 * scale, shipY + 6 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(shipX - 8 * scale, shipY - 9 * scale, 16 * scale, 9 * scale);

    // Floating red gulf buoy
    const buoyX = w * 0.88;
    const buoyY = h * 0.43 + Math.sin(time * 3) * 2.5;
    ctx.fillStyle = '#c84b31';
    ctx.beginPath();
    ctx.moveTo(buoyX - 5 * scale, buoyY + 4 * scale);
    ctx.lineTo(buoyX, buoyY - 12 * scale);
    ctx.lineTo(buoyX + 5 * scale, buoyY + 4 * scale);
    ctx.closePath();
    ctx.fill();
  } else if (zoneCode === 'community_canal') {
    // Soft green coconut/nipa palm silhouettes along distant canal bank
    ctx.fillStyle = 'rgba(72, 110, 74, 0.35)';
    for (let i = 0; i < 6; i += 1) {
      const px = (0.04 + i * 0.045) * w;
      const py = horizonY - 12 * scale;
      ctx.beginPath();
      ctx.arc(px, py, 14 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawZoneUpperLandmark(ctx, w, h, time, zoneCode, scale) {
  ctx.save();
  if (zoneCode === 'estuary_strong') {
    // Iconic Bang Khun Thian Triangular Viewpoint Pavilion (จุดชมวิวสามเหลี่ยม) on stilts
    const baseX = w * 0.11;
    const baseY = h * 0.365;
    // Wooden/concrete stilts in shallow edge
    ctx.strokeStyle = '#4e4237';
    ctx.lineWidth = 2.6 * scale;
    for (const dx of [-24, -8, 8, 24]) {
      ctx.beginPath();
      ctx.moveTo(baseX + dx * scale, baseY - 12 * scale);
      ctx.lineTo(baseX + dx * scale, baseY + 14 * scale);
      ctx.stroke();
    }
    // Viewing deck
    ctx.fillStyle = '#8b6342';
    ctx.fillRect(baseX - 30 * scale, baseY - 15 * scale, 60 * scale, 6 * scale);
    // Triangular roof & spire
    ctx.fillStyle = '#b45335';
    ctx.beginPath();
    ctx.moveTo(baseX - 28 * scale, baseY - 17 * scale);
    ctx.lineTo(baseX, baseY - 46 * scale);
    ctx.lineTo(baseX + 28 * scale, baseY - 17 * scale);
    ctx.closePath();
    ctx.fill();
    // Observation posts
    ctx.strokeStyle = '#5c4128';
    ctx.lineWidth = 2.2 * scale;
    ctx.beginPath();
    ctx.moveTo(baseX - 20 * scale, baseY - 15 * scale);
    ctx.lineTo(baseX - 20 * scale, baseY - 24 * scale);
    ctx.moveTo(baseX + 20 * scale, baseY - 15 * scale);
    ctx.lineTo(baseX + 20 * scale, baseY - 24 * scale);
    ctx.stroke();

    // Small Bangkok sea boundary marker pylon
    const pylonX = w * 0.24;
    const pylonY = h * 0.37;
    ctx.strokeStyle = '#e8ecf0';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(pylonX, pylonY + 10 * scale);
    ctx.lineTo(pylonX, pylonY - 18 * scale);
    ctx.stroke();
    ctx.fillStyle = '#e05a3a';
    ctx.beginPath();
    ctx.arc(pylonX, pylonY - 19 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else if (zoneCode === 'boardwalk_mid') {
    // Lush background mangrove belt + Colorful Winding Boardwalk (สะพานรักษ์ทะเล) + tiny cyclist
    ctx.fillStyle = '#336b43';
    for (let i = 0; i < 8; i += 1) {
      const tx = (0.02 + i * 0.032) * w;
      const ty = h * 0.34;
      ctx.beginPath();
      ctx.arc(tx, ty, (11 + (i % 2) * 4) * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(0, h * 0.355);
    ctx.bezierCurveTo(w * 0.14, h * 0.328, w * 0.24, h * 0.382, w * 0.34, h * 0.365);
    ctx.lineWidth = Math.max(7, 9 * scale);
    ctx.strokeStyle = '#d79e5e';
    ctx.lineCap = 'round';
    ctx.stroke();

    const railColors = ['#e67e5e', '#f0b84d', '#58a87b', '#4d98b5'];
    for (let i = 0; i <= 12; i += 1) {
      const t = i / 12;
      const x = t * w * 0.33;
      const y = h * (0.355 - Math.sin(t * Math.PI) * 0.012) - 6 * scale;
      ctx.fillStyle = '#5c4128';
      ctx.fillRect(x, y, 2.2 * scale, 7 * scale);
      ctx.fillStyle = railColors[i % railColors.length];
      ctx.beginPath();
      ctx.arc(x + scale, y, 3 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tiny cyclist riding along the bridge
    const bikeT = (time * 0.055) % 1;
    const bikeX = bikeT * w * 0.3;
    const bikeY = h * (0.353 - Math.sin(bikeT * Math.PI) * 0.011) - 8 * scale;
    ctx.strokeStyle = '#244737';
    ctx.lineWidth = 1.6 * scale;
    ctx.beginPath();
    ctx.arc(bikeX - 4 * scale, bikeY + 2 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.arc(bikeX + 5 * scale, bikeY + 2 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#e05a3a';
    ctx.beginPath();
    ctx.arc(bikeX + 1 * scale, bikeY - 6 * scale, 2.8 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else if (zoneCode === 'community_canal') {
    // Traditional wooden stilt houses (บ้านไม้ริมน้ำ), pond stakes (วังกุ้ง), crab icon, & long-tail boat
    const houseX = w * 0.08;
    const houseY = h * 0.355;
    // Wooden stilts
    ctx.strokeStyle = '#5a4028';
    ctx.lineWidth = 2.2 * scale;
    for (const dx of [-18, -4, 10, 24]) {
      ctx.beginPath();
      ctx.moveTo(houseX + dx * scale, houseY - 6 * scale);
      ctx.lineTo(houseX + dx * scale, houseY + 12 * scale);
      ctx.stroke();
    }
    // House body + gable roof
    ctx.fillStyle = '#a5794e';
    ctx.fillRect(houseX - 20 * scale, houseY - 22 * scale, 46 * scale, 18 * scale);
    ctx.fillStyle = '#754d2d';
    ctx.beginPath();
    ctx.moveTo(houseX - 25 * scale, houseY - 22 * scale);
    ctx.lineTo(houseX + 3 * scale, houseY - 38 * scale);
    ctx.lineTo(houseX + 31 * scale, houseY - 22 * scale);
    ctx.closePath();
    ctx.fill();
    // Warm window glow
    ctx.fillStyle = '#ffe596';
    ctx.fillRect(houseX - 6 * scale, houseY - 17 * scale, 9 * scale, 8 * scale);

    // Narrow wooden community dock leading out
    ctx.strokeStyle = '#8b6239';
    ctx.lineWidth = 5 * scale;
    ctx.beginPath();
    ctx.moveTo(houseX + 26 * scale, houseY - 5 * scale);
    ctx.lineTo(w * 0.25, houseY + 2 * scale);
    ctx.stroke();

    // Shrimp/cockle pond sluice stakes (วังกุ้ง) in upper-left water
    ctx.strokeStyle = '#7b5d3b';
    ctx.lineWidth = 2 * scale;
    for (let s = 0; s < 5; s += 1) {
      const sx = (0.27 + s * 0.018) * w;
      const sy = h * 0.375;
      ctx.beginPath();
      ctx.moveTo(sx, sy - 6 * scale);
      ctx.lineTo(sx, sy + 8 * scale);
      ctx.stroke();
    }

    // Moored wooden long-tail boat (เรือหางยาว) bobbing gently
    const boatX = w * 0.23;
    const boatY = h * 0.415 + Math.sin(time * 2.1) * 1.6;
    ctx.fillStyle = '#6c4829';
    ctx.beginPath();
    ctx.moveTo(boatX - 20 * scale, boatY);
    ctx.quadraticCurveTo(boatX, boatY + 8 * scale, boatX + 24 * scale, boatY - 2 * scale);
    ctx.lineTo(boatX + 14 * scale, boatY + 4 * scale);
    ctx.lineTo(boatX - 16 * scale, boatY + 4 * scale);
    ctx.closePath();
    ctx.fill();

    // Small giant crab icon accent on upper bank
    const crabX = w * 0.16;
    const crabY = h * 0.39;
    ctx.fillStyle = '#c84b31';
    ctx.beginPath();
    ctx.ellipse(crabX, crabY, 5.5 * scale, 3.8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCurlingWave(ctx, cx, y, len, amp) {
  const dx = (u) => cx + (0.5 - u) * len;
  const dy = (v) => y + v * amp * 2.2;

  ctx.beginPath();
  ctx.moveTo(dx(0.0), dy(0.05));
  ctx.bezierCurveTo(dx(0.16), dy(0.24), dx(0.34), dy(-0.36), dx(0.56), dy(-0.42));
  ctx.bezierCurveTo(dx(0.68), dy(-0.44), dx(0.73), dy(-0.26), dx(0.66), dy(-0.16));
  ctx.bezierCurveTo(dx(0.62), dy(-0.24), dx(0.55), dy(-0.16), dx(0.57), dy(0.02));
  ctx.bezierCurveTo(dx(0.59), dy(0.16), dx(0.7), dy(0.18), dx(0.84), dy(0.11));
  ctx.quadraticCurveTo(dx(0.93), dy(0.06), dx(1.0), dy(0.11));
  ctx.stroke();
}

function drawSeaAndWaves(ctx, w, h, time, waveIntensity, barrierChoice, zoneCode, recoveredOffset, scale) {
  const seaTop = h * 0.35;
  const seaGrad = ctx.createLinearGradient(w * 0.25, seaTop, w, h);
  if (zoneCode === 'estuary_strong') {
    seaGrad.addColorStop(0, '#3e7f93');
    seaGrad.addColorStop(0.5, '#1d5d73');
    seaGrad.addColorStop(1, '#103c4d');
  } else if (zoneCode === 'community_canal') {
    seaGrad.addColorStop(0, '#6aa197');
    seaGrad.addColorStop(0.5, '#3b7e7c');
    seaGrad.addColorStop(1, '#265c5c');
  } else {
    seaGrad.addColorStop(0, '#5a99a8');
    seaGrad.addColorStop(0.5, '#2b778d');
    seaGrad.addColorStop(1, '#1a5266');
  }
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, seaTop, w, h - seaTop);

  // Warm sun shimmer on canal water
  if (zoneCode === 'community_canal') {
    ctx.fillStyle = 'rgba(255, 224, 150, 0.14)';
    for (let s = 0; s < 5; s += 1) {
      const sw = (34 - s * 4) * scale;
      const sy = h * (0.42 + s * 0.06);
      const sx = w * 0.74 + Math.sin(time * 1.7 + s) * 8;
      ctx.beginPath();
      ctx.ellipse(sx, sy, sw, 3 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const protection = barrierChoice === 'rock' ? 0.92 : barrierChoice === 'bamboo' ? 0.68 : 0;

  const rows = 9;
  for (let r = 0; r < rows; r += 1) {
    const yNorm = 0.41 + (r / rows) * 0.54;
    const y = yNorm * h;

    for (let col = 0; col < 5; col += 1) {
      const speed = 0.042 + waveIntensity * 0.017;
      const phase = (time * speed + col * 0.22 + r * 0.13) % 1;
      const xNorm = 1.03 - phase * 0.88;
      const shoreX = getShorelineX(yNorm, zoneCode, recoveredOffset);
      if (xNorm < shoreX + 0.01) continue;

      const isBehindBarrier = xNorm < BARRIER_X_NORM;
      const localPower = isBehindBarrier ? 1 - protection : 1;
      const amp = (4.2 + waveIntensity * 1.9) * scale * Math.max(0.22, localPower);
      const crestLen = (32 + waveIntensity * 6) * scale * Math.max(0.38, localPower);
      const isCalmed = isBehindBarrier && protection > 0.45;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = (isCalmed ? 1.45 : 2.5) * scale;
      ctx.strokeStyle = isCalmed
        ? 'rgba(220, 245, 248, 0.34)'
        : 'rgba(244, 253, 255, 0.86)';

      if (isCalmed) {
        ctx.beginPath();
        ctx.moveTo(xNorm * w, y);
        ctx.quadraticCurveTo(
          xNorm * w + crestLen * 0.5,
          y - amp * 0.25,
          xNorm * w + crestLen,
          y
        );
        ctx.stroke();
      } else {
        drawCurlingWave(ctx, xNorm * w + crestLen * 0.5, y, crestLen, amp);
      }
      ctx.restore();
    }
  }
}

function drawShorelineAndMud(
  ctx,
  w,
  h,
  time,
  waveIntensity,
  barrierChoice,
  zoneCode,
  recoveredOffset,
  mode,
  scale
) {
  ctx.save();

  // Main eroded + recovered mudbank
  ctx.beginPath();
  ctx.moveTo(0, h * 0.355);
  for (let yN = 0.355; yN <= 1.02; yN += 0.05) {
    ctx.lineTo(getShorelineX(yN, zoneCode, recoveredOffset) * w, yN * h);
  }
  ctx.lineTo(0, h);
  ctx.closePath();

  const mudGrad = ctx.createLinearGradient(0, h * 0.35, w * 0.55, h);
  mudGrad.addColorStop(0, '#786246');
  mudGrad.addColorStop(0.55, '#665239');
  mudGrad.addColorStop(1, '#4f3f2b');
  ctx.fillStyle = mudGrad;
  ctx.fill();

  // Newly accreted fertile silt strip when community plants trees!
  if (recoveredOffset > 0.01) {
    ctx.beginPath();
    for (let yN = 0.36; yN <= 1.01; yN += 0.04) {
      const x = getShorelineX(yN, zoneCode, recoveredOffset) * w;
      if (yN === 0.36) ctx.moveTo(x, yN * h);
      else ctx.lineTo(x, yN * h);
    }
    for (let yN = 1.01; yN >= 0.36; yN -= 0.04) {
      const x = getShorelineX(yN, zoneCode, 0) * w;
      ctx.lineTo(x, yN * h);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(134, 156, 94, 0.42)';
    ctx.fill();

    // Dashed original eroded shoreline reference line
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    for (let yN = 0.37; yN <= 0.99; yN += 0.04) {
      const x = getShorelineX(yN, zoneCode, 0) * w;
      if (yN === 0.37) ctx.moveTo(x, yN * h);
      else ctx.lineTo(x, yN * h);
    }
    ctx.strokeStyle = 'rgba(255, 237, 198, 0.82)';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.setLineDash([]);

    // Helpful label on newly reclaimed land
    if (recoveredOffset > 0.045) {
      const midY = h * 0.94;
      const midX = getShorelineX(0.94, zoneCode, recoveredOffset * 0.55) * w;
      ctx.fillStyle = 'rgba(22, 61, 40, 0.78)';
      ctx.beginPath();
      ctx.roundRect(midX - 48 * scale, midY - 12 * scale, 96 * scale, 20 * scale, 999);
      ctx.fill();
      ctx.fillStyle = '#f2fbe8';
      ctx.font = `600 ${Math.round(10.5 * scale)}px Prompt, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ดินงอกใหม่', midX, midY - 2 * scale);
    }
  }

  // Upper bank grass edge matching narrow far-left shoreline
  const topShoreX = getShorelineX(0.38, zoneCode, 0) * w;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.35);
  ctx.quadraticCurveTo(topShoreX * 0.75, h * 0.34, topShoreX + 20 * scale, h * 0.38);
  ctx.lineTo(topShoreX, h * 0.43);
  ctx.quadraticCurveTo(topShoreX * 0.45, h * 0.42, 0, h * 0.44);
  ctx.closePath();
  ctx.fillStyle = zoneCode === 'community_canal' ? '#588248' : '#4e7b49';
  ctx.fill();

  // Eroding mud crumbs & dead stumps when unprotected
  if (barrierChoice === 'none' && mode !== 'planting' && mode !== 'forest') {
    ctx.fillStyle = 'rgba(110, 82, 52, 0.68)';
    const particleCount = 6 + waveIntensity * 3;
    for (let i = 0; i < particleCount; i += 1) {
      const pPhase = (time * 0.55 + i * 0.17) % 1;
      const yN = 0.43 + ((i * 0.13) % 0.52);
      const sx = getShorelineX(yN, zoneCode, 0) * w;
      const px = sx + pPhase * (22 + waveIntensity * 7) * scale;
      const py = yN * h + Math.sin(pPhase * Math.PI * 2 + i) * 4 * scale;
      ctx.beginPath();
      ctx.arc(px, py, 2.5 * scale * (1 - pPhase * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }

    const stumps = [
      [0.52],
      [0.69],
      [0.83],
    ];
    for (const [syN] of stumps) {
      const sx = getShorelineX(syN, zoneCode, 0) * w - 6 * scale;
      const sy = syN * h;
      ctx.strokeStyle = '#3d3023';
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 5 * scale, sy - 9 * scale);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 6 * scale, sy - 7 * scale);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawBarrierLine(ctx, w, h, barrierChoice, mode, scale) {
  if (barrierChoice === 'none') {
    if (mode === 'barrier') {
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.62)';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(BARRIER_X_NORM * w, h * 0.41);
      ctx.lineTo(BARRIER_X_NORM * w, h * 0.91);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    return;
  }

  for (let i = 0; i < BARRIER_Y_SLOTS.length; i += 1) {
    const x = BARRIER_X_NORM * w;
    const y = BARRIER_Y_SLOTS[i] * h;

    if (barrierChoice === 'bamboo') {
      ctx.save();
      ctx.strokeStyle = '#a8834a';
      ctx.lineWidth = 3.5 * scale;
      ctx.beginPath();
      ctx.moveTo(x - 5 * scale, y - 22 * scale);
      ctx.lineTo(x - 5 * scale, y + 22 * scale);
      ctx.stroke();

      for (let p = -2; p <= 2; p += 1) {
        const py = y + p * 9 * scale;
        ctx.fillStyle = '#c8a660';
        ctx.fillRect(x - 10 * scale, py - 8 * scale, 6 * scale, 16 * scale);
        ctx.strokeStyle = '#7c5d29';
        ctx.lineWidth = 1.1 * scale;
        ctx.strokeRect(x - 10 * scale, py - 8 * scale, 6 * scale, 16 * scale);
        ctx.fillStyle = '#e5cb8d';
        ctx.beginPath();
        ctx.ellipse(x - 7 * scale, py - 8 * scale, 3 * scale, 1.5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (barrierChoice === 'rock') {
      ctx.save();
      const rocks = [
        [-4, -14, 11, 8, '#73797d'],
        [4, -4, 12, 9, '#5e6569'],
        [-5, 6, 11, 8, '#858b8f'],
        [3, 15, 10, 7, '#676e73'],
        [-2, -2, 9, 7, '#949a9e'],
      ];
      for (const [dx, dy, rx, ry, col] of rocks) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.ellipse(x + dx * scale, y + dy * scale, rx * scale, ry * scale, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(30, 36, 40, 0.35)';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(240, 252, 255, 0.72)';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(x + 15 * scale, y - 18 * scale);
      ctx.quadraticCurveTo(x + 19 * scale, y, x + 15 * scale, y + 18 * scale);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawMangroveTree(ctx, x, y, growth, seed, time, scale, highlightUser = false) {
  const sway = Math.sin(time * 1.9 + seed * 4) * (1.1 + growth * 2.1) * scale;
  ctx.save();

  if (highlightUser) {
    ctx.strokeStyle = 'rgba(255, 224, 102, 0.95)';
    ctx.fillStyle = 'rgba(255, 224, 102, 0.24)';
    ctx.lineWidth = 2.4 * scale;
    ctx.beginPath();
    ctx.ellipse(x, y + 2 * scale, 20 * scale, 9 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (growth < 0.28) {
    const hStem = (12 + growth * 45) * scale;
    ctx.strokeStyle = '#5f8d4e';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sway * 0.4, y - hStem);
    ctx.stroke();

    ctx.fillStyle = '#74b85b';
    ctx.beginPath();
    ctx.ellipse(x - 4 * scale + sway * 0.4, y - hStem, 5 * scale, 2.4 * scale, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + 4 * scale + sway * 0.4, y - hStem, 5 * scale, 2.4 * scale, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const rootSpan = (6 + growth * 13) * scale;
    const rootHeight = (7 + growth * 11) * scale;
    ctx.strokeStyle = '#6c4f35';
    ctx.lineWidth = (1.6 + growth * 1.3) * scale;
    for (const dir of [-1, -0.45, 0.45, 1]) {
      ctx.beginPath();
      ctx.moveTo(x, y - rootHeight * 0.85);
      ctx.quadraticCurveTo(
        x + dir * rootSpan * 0.75,
        y - rootHeight * 0.4,
        x + dir * rootSpan,
        y + 2 * scale
      );
      ctx.stroke();
    }

    const trunkH = (17 + growth * 29) * scale;
    ctx.strokeStyle = '#5b422b';
    ctx.lineWidth = (2.5 + growth * 2.2) * scale;
    ctx.beginPath();
    ctx.moveTo(x, y - rootHeight * 0.5);
    ctx.lineTo(x + sway * 0.6, y - trunkH);
    ctx.stroke();

    const canopyRadius = (8.5 + growth * 14) * scale;
    const cx = x + sway;
    const cy = y - trunkH - canopyRadius * 0.35;

    const puffs = [
      [-canopyRadius * 0.55, 3 * scale, canopyRadius * 0.72, '#2d6a40'],
      [canopyRadius * 0.55, 3 * scale, canopyRadius * 0.72, '#347849'],
      [0, -canopyRadius * 0.35, canopyRadius * 0.85, '#429156'],
      [-canopyRadius * 0.2, -canopyRadius * 0.15, canopyRadius * 0.55, '#59ab69'],
    ];
    for (const [dx, dy, rad, color] of puffs) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (highlightUser) {
    const tagY = y - (24 + growth * 48) * scale;
    const pillW = 74 * scale;
    const pillH = 21 * scale;
    ctx.fillStyle = 'rgba(22, 61, 40, 0.92)';
    ctx.beginPath();
    ctx.roundRect(x - pillW / 2, tagY - pillH / 2, pillW, pillH, 999);
    ctx.fill();
    ctx.fillStyle = '#ffeb85';
    ctx.font = `600 ${Math.round(11 * scale)}px Prompt, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ต้นของคุณ', x, tagY);
  }

  ctx.restore();
}

function drawWildlife(ctx, w, h, time, hasAnyTrees, ecoLevel, scale) {
  if (!hasAnyTrees) return;

  if (ecoLevel >= 0.35) {
    const spots = [
      [0.2, 0.62],
      [0.17, 0.78],
    ];
    for (let i = 0; i < spots.length; i += 1) {
      const hop = Math.abs(Math.sin(time * 2.6 + i * 2)) * 4 * scale;
      const mx = spots[i][0] * w + Math.sin(time * 0.8 + i) * 8 * scale;
      const my = spots[i][1] * h - hop;
      ctx.fillStyle = '#536252';
      ctx.beginPath();
      ctx.ellipse(mx, my, 6 * scale, 3 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eef5d8';
      ctx.beginPath();
      ctx.arc(mx + 3.5 * scale, my - 1.5 * scale, 1.3 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (ecoLevel >= 0.6) {
    const cx = 0.14 * w + Math.sin(time * 1.4) * 9 * scale;
    const cy = 0.71 * h;
    ctx.fillStyle = '#b9482e';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 4.5 * scale, 3.3 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (ecoLevel >= 0.8) {
    for (let b = 0; b < 2; b += 1) {
      const bx = (((0.18 + b * 0.25 + time * 0.03) % 1.1) - 0.05) * w;
      const by = (0.17 + b * 0.05) * h + Math.sin(time * 4 + b) * 4 * scale;
      const wing = Math.sin(time * 7 + b) * 5 * scale;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2 * scale;
      ctx.beginPath();
      ctx.moveTo(bx - 8 * scale, by + wing);
      ctx.quadraticCurveTo(bx - 3 * scale, by - 4 * scale, bx, by);
      ctx.quadraticCurveTo(bx + 3 * scale, by - 4 * scale, bx + 8 * scale, by + wing);
      ctx.stroke();
    }
  }
}

function drawTestDemo(ctx, w, h, elapsedSec, isProtected, zoneCode, scale) {
  if (elapsedSec < 0 || elapsedSec > 3.2) return;
  const xBase = (getBaseShoreX(zoneCode) + 0.16) * w;
  const yBase = 0.66 * h;
  const waveProgress = Math.min(1, elapsedSec / 1.4);

  ctx.save();
  if (!isProtected) {
    const waveX = (0.78 - waveProgress * 0.49) * w;
    ctx.fillStyle = 'rgba(230, 249, 255, 0.85)';
    ctx.beginPath();
    ctx.ellipse(waveX, yBase + 4 * scale, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (elapsedSec < 1.05) {
      drawMangroveTree(ctx, xBase, yBase, 0.2, 1, elapsedSec, scale);
    } else {
      const wash = (elapsedSec - 1.05) / 2.15;
      ctx.save();
      ctx.translate(xBase - wash * 35 * scale, yBase - wash * 14 * scale);
      ctx.rotate(-wash * 1.9);
      ctx.globalAlpha = Math.max(0, 1 - wash);
      drawMangroveTree(ctx, 0, 0, 0.2, 1, elapsedSec, scale);
      ctx.restore();

      ctx.fillStyle = 'rgba(176, 52, 22, 0.93)';
      const boxW = Math.min(310 * scale, w * 0.56);
      const boxX = Math.max(12, xBase - boxW / 2 + 40 * scale);
      const boxY = yBase - 68 * scale;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, 34 * scale, 10 * scale);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${Math.round(12.5 * scale)}px Prompt, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        'คลื่นซัดต้นกล้าหลุด! ต้องวางแนวกันคลื่นก่อน',
        boxX + boxW / 2,
        boxY + 17 * scale
      );
    }
  } else {
    const waveX = Math.max(BARRIER_X_NORM + 0.025, 0.86 - waveProgress * 0.2) * w;
    ctx.fillStyle = 'rgba(230, 249, 255, 0.72)';
    ctx.beginPath();
    ctx.ellipse(waveX, yBase + 4 * scale, 14 * scale, 9 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    drawMangroveTree(ctx, xBase, yBase, 0.36, 2, elapsedSec, scale, false);

    ctx.fillStyle = 'rgba(26, 94, 52, 0.92)';
    const boxW = Math.min(310 * scale, w * 0.56);
    const boxX = Math.max(12, xBase - boxW / 2 + 40 * scale);
    const boxY = yBase - 78 * scale;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, 34 * scale, 10 * scale);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `600 ${Math.round(12.5 * scale)}px Prompt, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      'แนวกันคลื่นชะลอแรงน้ำ ต้นกล้าตั้งหลักได้!',
      boxX + boxW / 2,
      boxY + 17 * scale
    );
  }
  ctx.restore();
}

export default function CoastalCanvas({
  mode = 'preview',
  zone,
  barrierChoice = 'none',
  existingTrees = [],
  userTree = null,
  growthProgress = 0.2,
  testDemoTick = 0,
  testDemoProtected = false,
  onPlaceUserTree,
}) {
  const canvasRef = useRef(null);
  const demoStateRef = useRef({ startMs: null, isProtected: false });
  const hoveredTreeRef = useRef(null);

  useEffect(() => {
    if (testDemoTick > 0) {
      demoStateRef.current = {
        startMs: performance.now(),
        isProtected: testDemoProtected,
      };
    }
  }, [testDemoTick, testDemoProtected]);

  const propsRef = useRef({
    mode,
    zone,
    barrierChoice,
    existingTrees,
    userTree,
    growthProgress,
  });
  propsRef.current = {
    mode,
    zone,
    barrierChoice,
    existingTrees,
    userTree,
    growthProgress,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let rafId = 0;

    const render = (now) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.max(320, Math.round(rect.width * dpr));
      const targetH = Math.max(200, Math.round(rect.height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      const time = now * 0.001;
      const scale = Math.max(0.92, Math.min(1.75, Math.min(w / 720, h / 460)));

      const cur = propsRef.current;
      const zoneCode = cur.zone?.code || 'boardwalk_mid';
      const waveIntensity = cur.zone?.wave_intensity || 3;
      const isForestLike = cur.mode === 'planting' || cur.mode === 'forest';
      const activeBarrier = isForestLike ? 'rock' : cur.barrierChoice;

      // Narrow initial shore on far left; grows progressively rightward as many participants plant
      const communityCount = cur.existingTrees.length;
      const effectiveTrees =
        communityCount + (cur.userTree ? 0.25 + cur.growthProgress * 0.75 : 0);
      const maxExpansion = 0.41;
      const recoveredOffset =
        isForestLike && effectiveTrees > 0
          ? maxExpansion * (1 - Math.exp(-effectiveTrees / 12))
          : 0;

      ctx.clearRect(0, 0, w, h);
      drawSkyAndBackdrop(ctx, w, h, time, zoneCode, scale);
      drawSeaAndWaves(
        ctx,
        w,
        h,
        time,
        waveIntensity,
        activeBarrier,
        zoneCode,
        recoveredOffset,
        scale
      );
      drawShorelineAndMud(
        ctx,
        w,
        h,
        time,
        waveIntensity,
        activeBarrier,
        zoneCode,
        recoveredOffset,
        cur.mode,
        scale
      );
      drawZoneUpperLandmark(ctx, w, h, time, zoneCode, scale);

      if (cur.mode === 'planting') {
        ctx.save();
        ctx.setLineDash([7, 5]);
        ctx.strokeStyle = 'rgba(242, 252, 232, 0.82)';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.roundRect(w * 0.08, h * 0.44, w * 0.48, h * 0.47, 14 * scale);
        ctx.stroke();
        ctx.setLineDash([]);

        if (!cur.userTree) {
          const promptW = Math.min(w * 0.42, 250 * scale);
          const promptX = w * 0.32 - promptW / 2;
          ctx.fillStyle = 'rgba(22, 61, 40, 0.84)';
          ctx.beginPath();
          ctx.roundRect(promptX, h * 0.465, promptW, 28 * scale, 9 * scale);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = `600 ${Math.round(11.5 * scale)}px Prompt, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('คลิก/แตะในกรอบเพื่อปลูก 1 ต้น', w * 0.32, h * 0.465 + 14 * scale);
        }
        ctx.restore();
      }

      drawBarrierLine(ctx, w, h, activeBarrier, cur.mode, scale);

      if (isForestLike) {
        const allTrees = [
          ...cur.existingTrees.map((t) => ({
            ...t,
            isUser: false,
            growth: 0.92,
            seed: (t.id || 1) * 1.37,
          })),
        ];
        if (cur.userTree) {
          allTrees.push({
            ...cur.userTree,
            isUser: true,
            growth: cur.growthProgress,
          });
        }
        allTrees.sort((a, b) => a.y - b.y);

        for (const tree of allTrees) {
          drawMangroveTree(
            ctx,
            tree.x * w,
            tree.y * h,
            tree.growth,
            tree.seed,
            time,
            scale,
            tree.isUser
          );
        }

        const ecoLevel =
          communityCount >= 3
            ? 0.9
            : communityCount > 0
              ? Math.max(0.55, cur.userTree ? cur.growthProgress : 0.55)
              : cur.userTree
                ? cur.growthProgress
                : 0;
        drawWildlife(
          ctx,
          w,
          h,
          time,
          communityCount > 0 || Boolean(cur.userTree),
          ecoLevel,
          scale
        );

        if (hoveredTreeRef.current) {
          const ht = hoveredTreeRef.current;
          const tx = ht.x * w;
          const ty = ht.y * h - 62 * scale;
          const tipW = 130 * scale;
          const tipH = 24 * scale;
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = '#9ec5a8';
          ctx.lineWidth = 1.2 * scale;
          ctx.beginPath();
          ctx.roundRect(tx - tipW / 2, Math.max(8, ty), tipW, tipH, 8 * scale);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#163d28';
          ctx.font = `600 ${Math.round(11 * scale)}px Prompt, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`ปลูกโดย ${ht.studentId}`, tx, Math.max(8, ty) + tipH / 2);
          ctx.restore();
        }
      }

      if (cur.mode === 'barrier' && demoStateRef.current.startMs !== null) {
        const elapsed = (now - demoStateRef.current.startMs) / 1000;
        if (elapsed <= 3.2) {
          drawTestDemo(
            ctx,
            w,
            h,
            elapsed,
            demoStateRef.current.isProtected,
            zoneCode,
            scale
          );
        } else {
          demoStateRef.current.startMs = null;
        }
      }

      // Top-right status badge
      ctx.save();
      const label =
        cur.mode === 'preview'
          ? 'ตลิ่งแคบ • คลื่นกัดเซาะชายฝั่ง'
          : cur.mode === 'barrier'
            ? cur.barrierChoice === 'none'
              ? 'โหมดจำลอง • ไม่มีแนวกันคลื่น'
              : cur.barrierChoice === 'bamboo'
                ? 'โหมดจำลอง • แนวไม้ไผ่ 5 จุด'
                : 'โหมดจำลอง • แนวคันหิน 5 จุด'
            : cur.mode === 'forest'
              ? `ผืนป่ารวมโซนนี้ • ${communityCount} ต้น`
              : `ล็อกแนวคันหิน • เดิม ${communityCount} ต้น${cur.userTree ? ' + ของคุณ 1' : ''}`;
      const badgeW = 246 * scale;
      const badgeH = 28 * scale;
      ctx.fillStyle = 'rgba(22, 61, 40, 0.8)';
      ctx.beginPath();
      ctx.roundRect(w - badgeW - 10 * scale, 10 * scale, badgeW, badgeH, 999);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${Math.round(11.5 * scale)}px Prompt, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, w - badgeW / 2 - 10 * scale, 10 * scale + badgeH / 2);
      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  function getNormalizedPointer(event) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      xNorm: (event.clientX - rect.left) / rect.width,
      yNorm: (event.clientY - rect.top) / rect.height,
    };
  }

  function handlePointerMove(event) {
    const pos = getNormalizedPointer(event);
    if (!pos) return;
    if (mode === 'planting' || mode === 'forest') {
      let found = null;
      for (const tree of existingTrees) {
        if (Math.hypot(pos.xNorm - tree.x, pos.yNorm - tree.y) < 0.045) {
          found = tree;
          break;
        }
      }
      hoveredTreeRef.current = found;

      if (mode === 'planting') {
        const inZone =
          pos.xNorm >= 0.08 && pos.xNorm <= 0.56 && pos.yNorm >= 0.42 && pos.yNorm <= 0.92;
        event.currentTarget.style.cursor = inZone ? 'crosshair' : 'default';
      } else {
        event.currentTarget.style.cursor = found ? 'pointer' : 'default';
      }
    } else {
      hoveredTreeRef.current = null;
      event.currentTarget.style.cursor = 'default';
    }
  }

  function handlePointerDown(event) {
    if (mode !== 'planting' || !onPlaceUserTree) return;
    const pos = getNormalizedPointer(event);
    if (!pos) return;
    const clampedX = Math.min(0.55, Math.max(0.09, pos.xNorm));
    const clampedY = Math.min(0.9, Math.max(0.46, pos.yNorm));
    if (pos.xNorm >= 0.06 && pos.xNorm <= 0.58 && pos.yNorm >= 0.4 && pos.yNorm <= 0.94) {
      onPlaceUserTree(Number(clampedX.toFixed(4)), Number(clampedY.toFixed(4)));
    }
  }

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="coastal-canvas"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          hoveredTreeRef.current = null;
        }}
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}
