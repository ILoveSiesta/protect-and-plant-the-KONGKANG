async function requestJson(url, options) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `เกิดข้อผิดพลาด (${response.status})`);
  }
  return data;
}

export function fetchZones() {
  return requestJson('/api/zones');
}

export function fetchForest() {
  return requestJson('/api/forest');
}

export function fetchStats() {
  return requestJson('/api/stats');
}

export function fetchParticipations({ zone = 'all', barrier = 'all', q = '' } = {}) {
  const params = new URLSearchParams();
  if (zone && zone !== 'all') params.set('zone', zone);
  if (barrier && barrier !== 'all') params.set('barrier', barrier);
  if (q && q.trim()) params.set('q', q.trim());
  const queryString = params.toString();
  return requestJson(`/api/participations${queryString ? `?${queryString}` : ''}`);
}

export function createParticipation(payload) {
  return requestJson('/api/participations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function formatThaiDateTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
