import { useState, useEffect, useRef } from "react";

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const styles = `
  ${GOOGLE_FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, #root { min-height: 100vh; background: #0a0a0a; font-family: 'DM Sans', sans-serif; color: #f0f0f0; }
  .app { min-height: 100vh; background: #0a0a0a; background-image: radial-gradient(ellipse at 20% 50%, rgba(0,200,100,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,150,255,0.05) 0%, transparent 50%); }
  .creator { max-width: 480px; margin: 0 auto; padding: 32px 20px 60px; }
  .creator-header { margin-bottom: 36px; }
  .creator-header .label { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #00c864; margin-bottom: 8px; }
  .creator-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 52px; line-height: 0.95; color: #fff; letter-spacing: 1px; }
  .creator-header h1 span { color: #00c864; }
  .section { margin-bottom: 28px; }
  .section-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #555; margin-bottom: 10px; }
  .field { width: 100%; background: #141414; border: 1px solid #222; border-radius: 10px; padding: 14px 16px; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; }
  .field:focus { border-color: #00c864; }
  .field::placeholder { color: #444; }
  textarea.field { resize: vertical; min-height: 80px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .field-icon-wrap { position: relative; }
  .field-icon-wrap .field { padding-right: 40px; }
  .field-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; pointer-events: none; }
  .location-wrapper { position: relative; }
  .autocomplete-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #1a1a1a; border: 1px solid #333; border-radius: 10px; margin-top: 4px; z-index: 100; overflow: hidden; }
  .autocomplete-item { padding: 12px 16px; cursor: pointer; font-size: 14px; color: #ccc; border-bottom: 1px solid #222; transition: background 0.15s; }
  .autocomplete-item:last-child { border-bottom: none; }
  .autocomplete-item:hover { background: #222; color: #fff; }
  .autocomplete-item .main { font-weight: 500; color: #f0f0f0; }
  .autocomplete-item .secondary { font-size: 12px; color: #666; margin-top: 2px; }
  .organizer-toggle { display: flex; align-items: center; gap: 14px; background: #141414; border: 1px solid #222; border-radius: 10px; padding: 16px; cursor: pointer; transition: border-color 0.2s; }
  .organizer-toggle:hover { border-color: #333; }
  .organizer-toggle.active { border-color: #00c864; }
  .toggle-switch { width: 44px; height: 24px; background: #2a2a2a; border-radius: 12px; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .toggle-switch.on { background: #00c864; }
  .toggle-knob { position: absolute; width: 18px; height: 18px; background: #fff; border-radius: 50%; top: 3px; left: 3px; transition: transform 0.2s; }
  .toggle-switch.on .toggle-knob { transform: translateX(20px); }
  .toggle-info strong { display: block; font-size: 14px; font-weight: 600; color: #f0f0f0; }
  .toggle-info span { font-size: 12px; color: #555; }
  .organizer-name-field { margin-top: 10px; }
  .btn-create { width: 100%; background: #00c864; color: #000; border: none; border-radius: 10px; padding: 18px; font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1.5px; cursor: pointer; transition: opacity 0.2s, transform 0.1s; margin-top: 8px; }
  .btn-create:hover { opacity: 0.9; }
  .btn-create:active { transform: scale(0.98); }
  .btn-create:disabled { opacity: 0.4; cursor: not-allowed; }
  .share-screen { max-width: 480px; margin: 0 auto; padding: 32px 20px 60px; }
  .share-screen h2 { font-family: 'Bebas Neue', sans-serif; font-size: 40px; color: #fff; margin-bottom: 6px; }
  .share-screen p { color: #666; font-size: 14px; margin-bottom: 28px; }
  .link-box { background: #141414; border: 1px solid #222; border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .link-text { flex: 1; font-size: 13px; color: #00c864; word-break: break-all; font-family: monospace; }
  .btn-copy { background: #00c864; color: #000; border: none; border-radius: 7px; padding: 10px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity 0.2s; flex-shrink: 0; }
  .btn-copy:hover { opacity: 0.85; }
  .btn-view { width: 100%; background: transparent; border: 1px solid #333; border-radius: 10px; padding: 16px; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: border-color 0.2s; margin-top: 10px; }
  .btn-view:hover { border-color: #555; }
  .btn-admin { width: 100%; background: transparent; border: 1px solid #00c864; border-radius: 10px; padding: 17px; color: #00c864; font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; margin-top: 0; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .btn-admin:hover { background: rgba(0,200,100,0.08); }
  .admin-note { font-size: 12px; color: #444; text-align: center; margin-top: 8px; }
  .admin-view { max-width: 480px; margin: 0 auto; padding: 0 0 60px; }
  .admin-section { padding: 20px; border-bottom: 1px solid #1a1a1a; }
  .admin-title { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #fff; margin-bottom: 14px; letter-spacing: 0.5px; }
  .admin-player { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1a1a1a; }
  .admin-player:last-child { border-bottom: none; }
  .admin-player-name { font-size: 14px; color: #f0f0f0; }
  .admin-player-status { font-size: 12px; color: #555; margin-top: 2px; }
  .btn-remove { background: transparent; border: 1px solid #333; border-radius: 6px; padding: 6px 12px; color: #ff6060; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .btn-remove:hover { border-color: #ff6060; background: rgba(255,96,96,0.08); }
  .edit-field { width: 100%; background: #141414; border: 1px solid #222; border-radius: 8px; padding: 10px 14px; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; margin-bottom: 8px; }
  .edit-field:focus { border-color: #00c864; }
  .btn-save { background: #00c864; color: #000; border: none; border-radius: 8px; padding: 12px 24px; font-family: 'Bebas Neue', sans-serif; font-size: 18px; cursor: pointer; letter-spacing: 1px; transition: opacity 0.2s; }
  .btn-save:hover { opacity: 0.85; }
  .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
  .saved-msg { font-size: 13px; color: #00c864; margin-left: 10px; }
  .btn-whatsapp { width: 100%; background: #25D366; color: #fff; border: none; border-radius: 10px; padding: 18px; font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1.5px; cursor: pointer; transition: opacity 0.2s; margin-top: 0; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .btn-whatsapp:hover { opacity: 0.88; }
  .event-view { max-width: 480px; margin: 0 auto; padding: 0 0 60px; }
  .event-hero { background: linear-gradient(160deg, #0d1f12 0%, #0a0a0a 60%); border-bottom: 1px solid #1a1a1a; padding: 36px 20px 28px; position: relative; overflow: hidden; }
  .event-hero::before { content: '🎾'; position: absolute; right: -10px; top: -10px; font-size: 120px; opacity: 0.06; transform: rotate(-15deg); }
  .event-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #00c864; background: rgba(0,200,100,0.1); border: 1px solid rgba(0,200,100,0.2); border-radius: 4px; padding: 4px 10px; margin-bottom: 14px; }
  .event-title { font-family: 'Bebas Neue', sans-serif; font-size: 46px; line-height: 1; color: #fff; margin-bottom: 20px; }
  .event-meta { display: flex; flex-direction: column; gap: 8px; }
  .meta-row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #aaa; }
  .meta-icon { width: 28px; height: 28px; background: #1a1a1a; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .meta-link { color: #00c864; text-decoration: none; font-size: 14px; }
  .meta-link:hover { text-decoration: underline; }
  .slots-section { padding: 24px 20px; border-bottom: 1px solid #1a1a1a; }
  .slots-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .slots-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #fff; letter-spacing: 0.5px; }
  .slots-count { font-size: 13px; color: #555; }
  .slots-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .slot { background: #141414; border: 1px solid #222; border-radius: 10px; padding: 16px; min-height: 70px; display: flex; align-items: center; gap: 10px; }
  .slot.filled { border-color: rgba(0,200,100,0.3); background: rgba(0,200,100,0.05); }
  .slot-number { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #2a2a2a; line-height: 1; flex-shrink: 0; }
  .slot.filled .slot-number { color: rgba(0,200,100,0.3); }
  .slot-player { font-size: 14px; font-weight: 500; color: #f0f0f0; }
  .slot-organizer-tag { font-size: 10px; color: #00c864; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
  .slot-empty { font-size: 13px; color: #333; }
  .declined-list { margin-top: 16px; padding-top: 16px; border-top: 1px solid #1a1a1a; }
  .declined-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #444; margin-bottom: 10px; }
  .declined-item { font-size: 14px; color: #555; padding: 6px 0; border-bottom: 1px solid #1a1a1a; }
  .declined-item:last-child { border-bottom: none; }
  .refreshing { font-size: 11px; color: #333; text-align: center; padding: 8px; letter-spacing: 1px; }
  .rsvp-section { padding: 24px 20px; }
  .rsvp-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #fff; letter-spacing: 0.5px; margin-bottom: 6px; }
  .rsvp-sub { font-size: 13px; color: #555; margin-bottom: 18px; }
  .rsvp-full-banner { background: #1a1a1a; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #555; text-align: center; margin-bottom: 12px; }
  .rsvp-input { display: flex; flex-direction: column; gap: 10px; }
  .rsvp-buttons { display: flex; gap: 10px; }
  .btn-confirm { flex: 1; background: #00c864; color: #000; border: none; border-radius: 10px; padding: 17px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1px; cursor: pointer; transition: opacity 0.2s; }
  .btn-confirm:hover { opacity: 0.85; }
  .btn-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-decline { flex: 1; background: transparent; color: #666; border: 1px solid #2a2a2a; border-radius: 10px; padding: 17px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; }
  .btn-decline:hover { border-color: #555; color: #aaa; }
  .btn-decline:disabled { opacity: 0.4; cursor: not-allowed; }
  .confirmed-msg { background: rgba(0,200,100,0.08); border: 1px solid rgba(0,200,100,0.2); border-radius: 10px; padding: 20px; text-align: center; }
  .confirmed-msg .emoji { font-size: 36px; margin-bottom: 8px; }
  .confirmed-msg p { font-size: 14px; color: #aaa; }
  .confirmed-msg strong { color: #00c864; font-size: 16px; display: block; margin-bottom: 4px; }
  .declined-msg { background: rgba(255,80,80,0.06); border: 1px solid rgba(255,80,80,0.15); border-radius: 10px; padding: 20px; text-align: center; }
  .declined-msg .emoji { font-size: 36px; margin-bottom: 8px; }
  .declined-msg p { font-size: 14px; color: #666; }
  .declined-msg strong { color: #ff6060; font-size: 16px; display: block; margin-bottom: 4px; }
  .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: #333; letter-spacing: 2px; }
  .countdown { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,200,100,0.1); border: 1px solid rgba(0,200,100,0.2); border-radius: 20px; padding: 6px 14px; font-size: 13px; color: #00c864; font-weight: 500; margin-top: 16px; }
  .slot.empty-pulse { animation: borderPulse 1.8s ease-in-out infinite; }
  @keyframes borderPulse { 0%, 100% { border-color: #222; border-width: 1px; } 50% { border-color: rgba(0,200,100,0.5); border-width: 2px; } }
  .slot.just-filled { animation: fillPulse 1.8s ease-in-out; }
  @keyframes fillPulse { 0%, 100% { border-color: rgba(0,200,100,0.3); } 50% { border-color: #00c864; border-width: 2px; box-shadow: 0 0 10px rgba(0,200,100,0.3); } }
  .btn-confirm.bounce { animation: btnBounce 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
  @keyframes btnBounce { 0% { transform: scale(1); } 20% { transform: scale(0.88); } 50% { transform: scale(1.15); } 70% { transform: scale(0.96); } 100% { transform: scale(1); } }
  .particle { position: fixed; pointer-events: none; z-index: 9999; border-radius: 3px; }
  .waitlist-list { margin-top: 16px; padding-top: 16px; border-top: 1px solid #1a1a1a; }
  .waitlist-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 10px; }
  .waitlist-item { font-size: 14px; color: #666; padding: 6px 0; border-bottom: 1px solid #1a1a1a; display: flex; align-items: center; gap: 8px; }
  .waitlist-item:last-child { border-bottom: none; }
  .progress-bar-wrap { height: 4px; background: #222; border-radius: 2px; margin-top: 8px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: #00c864; border-radius: 2px; transition: width 0.4s ease; }
  .admin-player-time { font-size: 11px; color: #444; margin-top: 2px; }
  .cancelled-banner { background: rgba(255,60,60,0.1); border: 2px solid rgba(255,60,60,0.4); border-radius: 10px; padding: 20px; text-align: center; margin: 20px; }
  .cancelled-banner .emoji { font-size: 40px; margin-bottom: 8px; }
  .cancelled-banner h2 { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #ff4040; letter-spacing: 1px; margin-bottom: 6px; }
  .cancelled-banner p { font-size: 14px; color: #888; }
  .btn-cancel { width: 100%; background: transparent; border: 1px solid #ff4040; border-radius: 10px; padding: 14px; color: #ff4040; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
  .btn-cancel:hover { background: rgba(255,64,64,0.08); }
  .btn-calendar { width: 100%; background: transparent; border: 1px solid #4a90d9; border-radius: 10px; padding: 14px; color: #4a90d9; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-calendar:hover { background: rgba(74,144,217,0.08); }
  .my-events { max-width: 480px; margin: 0 auto; padding: 32px 20px 60px; }
  .my-events-header { margin-bottom: 28px; }
  .my-events-header .label { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #00c864; margin-bottom: 8px; }
  .my-events-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 48px; line-height: 0.95; color: #fff; letter-spacing: 1px; }
  .my-events-header h1 span { color: #00c864; }
  .event-card { background: #141414; border: 1px solid #222; border-radius: 12px; padding: 18px; margin-bottom: 12px; cursor: pointer; transition: border-color 0.2s; }
  .event-card:hover { border-color: #00c864; }
  .event-card-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #fff; letter-spacing: 0.5px; margin-bottom: 6px; }
  .event-card-meta { font-size: 13px; color: #666; display: flex; gap: 14px; align-items: center; }
  .event-card-slots { font-size: 13px; color: #00c864; font-weight: 600; }
  .event-card-cancelled { opacity: 0.5; }
  .btn-new-event { width: 100%; background: #00c864; color: #000; border: none; border-radius: 10px; padding: 18px; font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1.5px; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; }
  .btn-new-event:hover { opacity: 0.9; }
  .no-events { text-align: center; padding: 40px 20px; color: #444; font-size: 15px; }
  .paste-link-section { margin-top: 20px; }
  .paste-link-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #555; margin-bottom: 8px; }
  .paste-link-row { display: flex; gap: 8px; }
  .paste-link-input { flex: 1; background: #141414; border: 1px solid #222; border-radius: 10px; padding: 14px 16px; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; }
  .paste-link-input:focus { border-color: #00c864; }
  .paste-link-input::placeholder { color: #444; }
  .btn-paste { background: #00c864; color: #000; border: none; border-radius: 10px; padding: 14px 18px; font-family: 'Bebas Neue', sans-serif; font-size: 16px; cursor: pointer; white-space: nowrap; }
  .btn-paste:disabled { opacity: 0.4; cursor: not-allowed; }
`;

function genId() { return Math.random().toString(36).slice(2, 9); }
function mapsLink(placeId, location) {
  if (placeId) return `https://maps.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}&query_place_id=${placeId}`;
  return `https://maps.google.com/?q=${encodeURIComponent(location)}`;
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${parseInt(d)} de ${months[parseInt(m)-1]} ${y}`;
}



function getDb() { return window.db; }

function launchConfetti() {
  const colors = ['#00c864','#ffffff','#00ff88','#ffdd00','#ff4444','#44aaff','#ff88cc','#ffaa00'];
  for (let i = 0; i < 90; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 4 + Math.random() * 7;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = Math.random() > 0.4 ? '50%' : '3px';
      const startX = Math.random() * window.innerWidth;
      p.style.left = startX + 'px';
      p.style.top = '-20px';
      const driftX = (Math.random() - 0.5) * 200;
      const fallY = window.innerHeight + 60;
      const rotation = Math.random() * 720 - 360;
      const duration = 1.2 + Math.random() * 1.0;
      p.style.transition = 'transform ' + duration + 's ease-in, opacity ' + (duration * 0.8) + 's ease-in';
      p.style.opacity = '1';
      document.body.appendChild(p);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        p.style.transform = 'translate(' + driftX + 'px, ' + fallY + 'px) rotate(' + rotation + 'deg)';
        p.style.opacity = '0';
      }));
      setTimeout(() => p.remove(), duration * 1000 + 100);
    }, i * 10);
  }
}

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return h + ':' + m;
}

function getSavedEvents() {
  try {
    const saved = localStorage.getItem('padel_my_events');
    return saved ? JSON.parse(saved) : [];
  } catch(e) { return []; }
}

function saveEventToHistory(id, adminKey, title, date) {
  try {
    const events = getSavedEvents();
    const existing = events.findIndex(e => e.id === id);
    const entry = { id, adminKey, title, date, createdAt: Date.now() };
    if (existing >= 0) events[existing] = entry;
    else events.unshift(entry);
    localStorage.setItem('padel_my_events', JSON.stringify(events.slice(0, 20)));
  } catch(e) {}
}

function saveEventAsGuest(id, title, date) {
  try {
    const events = getSavedEvents();
    const existing = events.findIndex(e => e.id === id);
    if (existing >= 0) return; // already saved (maybe as organizer)
    const entry = { id, adminKey: null, title, date, isGuest: true, createdAt: Date.now() };
    events.unshift(entry);
    localStorage.setItem('padel_my_events', JSON.stringify(events.slice(0, 20)));
  } catch(e) {}
}

async function saveEvent(id, data) {
  const db = getDb();
  if (!db) throw new Error("Firebase no disponible");
  await db.collection("events").doc(id).set(data);
}

async function addAttendee(id, attendee) {
  const db = getDb();
  if (!db) throw new Error("Firebase no disponible");
  const ref = db.collection("events").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return;
  const current = snap.data().attendees || [];
  await ref.update({ attendees: [...current, attendee] });
}

async function promoteFromWaitlist(id) {
  const db = getDb();
  if (!db) return;
  const ref = db.collection("events").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return;
  const attendees = snap.data().attendees || [];
  const confirmed = attendees.filter(a => a.status === "confirmed");
  if (confirmed.length >= 4) return;
  const waitlistIdx = attendees.findIndex(a => a.status === "waitlist");
  if (waitlistIdx < 0) return;
  const updated = [...attendees];
  updated[waitlistIdx] = { ...updated[waitlistIdx], status: "confirmed", promotedAt: Date.now() };
  await ref.update({ attendees: updated });
}

// ── LOCATION AUTOCOMPLETE ──
function LocationField({ value, onChange, initialPlaceId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [placeId, setPlaceId] = useState(initialPlaceId || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const sessionToken = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  async function handleInput(e) {
    const val = e.target.value;
    onChange(val, null);
    setPlaceId(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!val.trim() || !window.google) { setSuggestions([]); return; }
    timeoutRef.current = setTimeout(async () => {
      try {
        const request = {
          input: val,
          sessionToken: sessionToken.current,
          language: "es",
          region: "ar",
        };
        const { suggestions: results } = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        setSuggestions(results.slice(0, 5));
        setShowDropdown(true);
      } catch (e) {
        setSuggestions([]);
      }
    }, 300);
  }

  function selectPlace(s) {
    const pred = s.placePrediction;
    const mainText = pred.mainText ? pred.mainText.toString() : pred.text.toString();
    const pid = pred.placeId;
    onChange(mainText, pid);
    setPlaceId(pid);
    setSuggestions([]);
    setShowDropdown(false);
    sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
  }

  return (
    <div className="location-wrapper">
      <input className="field" placeholder="Ej: Club Escobar, Benavidez..." value={value}
        onChange={handleInput} onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)} autoComplete="off" />
      {showDropdown && suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          {suggestions.map((s, i) => {
            const pred = s.placePrediction;
            const main = pred.mainText ? pred.mainText.toString() : pred.text.toString();
            const secondary = pred.secondaryText ? pred.secondaryText.toString() : "";
            return (
              <div key={i} className="autocomplete-item" onMouseDown={() => selectPlace(s)}>
                <div className="main">{main}</div>
                {secondary && <div className="secondary">{secondary}</div>}
              </div>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>
        {(placeId || initialPlaceId) ? "📍 Lugar seleccionado" : "Escribí para buscar el lugar"}
      </div>
    </div>
  );
}

// ── CREATOR ──
function CreatorView({ onCreate }) {
  const [form, setForm] = useState({ title: "", description: "", date: "", timeStart: "", timeEnd: "", location: "", placeId: null });
  const [includeOrganizer, setIncludeOrganizer] = useState(true);
  const [organizerName, setOrganizerName] = useState(() => {
    try { return localStorage.getItem('padel_last_name') || ""; } catch(e) { return ""; }
  });
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
    if (!apiKey) return;
    if (window.google) { setMapsReady(true); return; }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`;
    script.async = true;
    script.onload = () => setMapsReady(true);
    document.head.appendChild(script);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canCreate = !!(form.title.trim() && form.date && form.timeStart && form.location.trim() && (!includeOrganizer || organizerName.trim()));

  async function handleCreate() {
    setLoading(true);
    try {
      const id = genId();
      const attendees = includeOrganizer && organizerName.trim()
        ? [{ name: organizerName.trim(), isOrganizer: true, status: "confirmed", at: Date.now() }]
        : [];
      const data = {
        id, title: form.title.trim(), description: form.description,
        date: form.date, timeStart: form.timeStart, timeEnd: form.timeEnd,
        location: form.location.trim(), placeId: form.placeId || null,
        createdAt: Date.now(), attendees
      };
      const adminKey = Math.random().toString(36).slice(2, 10);
      data.adminKey = adminKey;
      await saveEvent(id, data);
      saveEventToHistory(id, adminKey, data.title, data.date, data.timeStart);
      onCreate(id, adminKey);
    } catch(e) {
      console.error(e);
      alert("Error al crear el evento: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="creator">
      <div className="creator-header">
        <div className="label">Nuevo evento</div>
        <h1>CREAR<br /><span>PARTIDO</span></h1>
      </div>
      <div className="section">
        <div className="section-label">Título</div>
        <input className="field" placeholder="Ej: Pádel del domingo" value={form.title} onChange={e => set("title", e.target.value)} />
      </div>
      <div className="section">
        <div className="section-label">Descripción (opcional)</div>
        <textarea className="field" placeholder="Detalles, nivel de juego, qué traer..." value={form.description} onChange={e => set("description", e.target.value)} />
      </div>
      <div className="section">
        <div className="section-label">Fecha</div>
        <div className="field-icon-wrap">
          <input className="field" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
          <span className="field-icon">📅</span>
        </div>
      </div>
      <div className="section">
        <div className="section-label">Horario</div>
        <div className="row">
          <div className="field-icon-wrap">
            <input className="field" type="time" value={form.timeStart} onChange={e => {
              set("timeStart", e.target.value);
              if (e.target.value) {
                const [h, m] = e.target.value.split(":").map(Number);
                const total = h * 60 + m + 90;
                const endH = Math.floor(total / 60) % 24;
                const endM = total % 60;
                set("timeEnd", String(endH).padStart(2,"0") + ":" + String(endM).padStart(2,"0"));
              }
            }} />
            <span className="field-icon">🕐</span>
          </div>
          <div className="field-icon-wrap">
            <input className="field" type="time" value={form.timeEnd} onChange={e => set("timeEnd", e.target.value)} />
            <span className="field-icon">🕑</span>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-label">Lugar</div>
        {mapsReady ? (
          <LocationField value={form.location} onChange={(loc, pid) => setForm(f => ({ ...f, location: loc, placeId: pid }))} />
        ) : (
          <>
            <input className="field" placeholder="Ej: Club Escobar, Benavidez..." value={form.location} onChange={e => set("location", e.target.value)} />
            <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>Se generará link a Google Maps automáticamente</div>
          </>
        )}
      </div>
      <div className="section">
        <div className="section-label">¿Te incluís como jugador?</div>
        <div className={`organizer-toggle ${includeOrganizer ? "active" : ""}`} onClick={() => setIncludeOrganizer(v => !v)}>
          <div className={`toggle-switch ${includeOrganizer ? "on" : ""}`}><div className="toggle-knob" /></div>
          <div className="toggle-info">
            <strong>{includeOrganizer ? "Sí, me incluyo" : "No, solo organizo"}</strong>
            <span>{includeOrganizer ? "Quedás como jugador #1" : "El evento arranca con 0 confirmados"}</span>
          </div>
        </div>
        {includeOrganizer && (
          <div className="organizer-name-field">
            <input className="field" placeholder="Tu nombre" value={organizerName} onChange={e => setOrganizerName(e.target.value)} />
          </div>
        )}
      </div>
      <button className="btn-create" onClick={handleCreate} disabled={!canCreate || loading}>
        {loading ? "CREANDO..." : "GENERAR LINK →"}
      </button>
    </div>
  );
}

// ── SHARE ──
function ShareView({ eventId, adminKey, onViewEvent }) {
  const [copied, setCopied] = useState(false);
  const base = `${window.location.origin}`;
  const shareLink = `https://padel-event-green.vercel.app/api/preview?event=${eventId}`;
  const adminLink = `${base}/?event=${eventId}&admin=${adminKey}`;

  function copy() {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  function shareWhatsApp() {
    const msg = encodeURIComponent(shareLink);
    window.open("https://wa.me/?text=" + msg, "_blank");
  }
  function saveAdminLink() {
    const msg = encodeURIComponent("🔐 Mi link de administrador para el partido:\n" + adminLink);
    window.open("https://wa.me/?text=" + msg, "_blank");
  }
  return (
    <div className="share-screen">
      <h2>¡LISTO!</h2>
      <p>Compartí el link con tus amigos y guardá tu link de admin.</p>
      <button className="btn-whatsapp" onClick={shareWhatsApp}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.104.549 4.078 1.508 5.793L0 24l6.375-1.493A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.36-.214-3.732.874.944-3.641-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
        COMPARTIR CON AMIGOS
      </button>
      <button className="btn-admin" onClick={saveAdminLink} style={{marginTop: 10}}>
        🔐 GUARDAR MI LINK DE ADMIN
      </button>
      <p className="admin-note">Te lo mandás a vos mismo por WhatsApp para no perderlo</p>
      <div className="link-box" style={{marginTop: 14}}>
        <span className="link-text">{shareLink}</span>
        <button className="btn-copy" onClick={copy}>{copied ? "✓ Copiado" : "Copiar"}</button>
      </div>
      <button className="btn-view" onClick={onViewEvent}>⚙️ Ver como administrador →</button>
    </div>
  );
}

// ── EVENT VIEW ──
function EventView({ eventId, adminKey, onBack }) {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [name, setName] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin")) return "";
      return localStorage.getItem('padel_last_name') || "";
    } catch(e) { return ""; }
  });
  const [myName, setMyName] = useState(() => {
    try { return localStorage.getItem(`padel_name_${eventId}`) || null; } catch(e) { return null; }
  });
  const [myResponse, setMyResponse] = useState(() => {
    try { return localStorage.getItem(`padel_response_${eventId}`) || null; } catch(e) { return null; }
  });
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [changingResponse, setChangingResponse] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const MAX_PLAYERS = 4;

  useEffect(() => {
    function calcCountdown(dateStr, timeStr) {
      if (!dateStr || !timeStr) return "";
      try {
        const eventDate = new Date(`${dateStr}T${timeStr}:00`);
        if (isNaN(eventDate.getTime())) return "";
        const now = new Date();
        const diff = eventDate - now;
        if (diff <= 0) return "¡El partido ya comenzó!";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) return `Faltan ${days} día${days !== 1 ? "s" : ""} y ${hours} hora${hours !== 1 ? "s" : ""}`;
        if (hours > 0) return `Faltan ${hours} hora${hours !== 1 ? "s" : ""} y ${mins} minuto${mins !== 1 ? "s" : ""}`;
        return `Faltan ${mins} minuto${mins !== 1 ? "s" : ""}`;
      } catch(e) { return ""; }
    }
    if (!event) return;
    setCountdown(calcCountdown(event.date, event.timeStart));
    const interval = setInterval(() => setCountdown(calcCountdown(event.date, event.timeStart)), 60000);
    return () => clearInterval(interval);
  }, [event]);

  useEffect(() => {
    const db = getDb();
    if (!db) { setLoading(false); return; }
    const unsub = db.collection("events").doc(eventId).onSnapshot(snap => {
      if (snap.exists) {
        const data = snap.data();
        setEvent(data);
        setAttendees(data.attendees || []);
        setEditForm({ title: data.title, date: data.date, timeStart: data.timeStart, timeEnd: data.timeEnd, location: data.location, placeId: data.placeId || null, description: data.description || "" });
        // Save to history when opening any event
        if (adminKey && data.adminKey === adminKey) {
          saveEventToHistory(eventId, adminKey, data.title, data.date);
        } else {
          saveEventAsGuest(eventId, data.title, data.date, data.timeStart);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [eventId]);

  function addToCalendar(evt) {
    const title = encodeURIComponent(evt.title || "Partido de Pádel");
    const location = encodeURIComponent(evt.location || "");
    const startDate = evt.date ? evt.date.replace(/-/g, "") : "";
    const startTime = evt.timeStart ? evt.timeStart.replace(":", "") + "00" : "000000";
    const endTime = evt.timeEnd ? evt.timeEnd.replace(":", "") + "00" : "020000";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}T${startTime}/${startDate}T${endTime}&location=${location}`;
    window.open(url, "_blank");
  }

  async function respond(status, btnEl) {
    if (!name.trim() || confirming) return;
    setConfirming(true);
    try {
      const trimmedName = name.trim();
      // Check waitlist
      const currentConfirmed = attendees.filter(a => a.status === "confirmed");
      const goesToWaitlist = status === "confirmed" && !isAdmin && currentConfirmed.length >= MAX_PLAYERS;
      const actualStatus = goesToWaitlist ? "waitlist" : status;
      
      await addAttendee(eventId, { name: trimmedName, isOrganizer: false, status: actualStatus, at: Date.now() });
      
      if (isAdmin) {
        setName("");
      } else {
        setMyName(trimmedName);
        setMyResponse(actualStatus);
        try {
          localStorage.setItem(`padel_name_${eventId}`, trimmedName);
          localStorage.setItem(`padel_response_${eventId}`, actualStatus);
          localStorage.setItem('padel_last_name', trimmedName);
          if (event) saveEventAsGuest(eventId, event.title, event.date, event.timeStart);
        } catch(e) {}
        // Confetti + bounce only if confirmed
        if (actualStatus === "confirmed" && btnEl) {
          btnEl.classList.remove('bounce');
          void btnEl.offsetWidth;
          btnEl.classList.add('bounce');
          setTimeout(() => btnEl.classList.remove('bounce'), 500);
          launchConfetti();
        }
      }
    } catch(e) { console.error(e); }
    setConfirming(false);
  }

  async function changeResponse(newStatus) {
    setChangingResponse(true);
    try {
      const db = getDb();
      const snap = await db.collection("events").doc(eventId).get();
      const current = snap.data().attendees || [];
      const currentConfirmed = current.filter(a => a.status === "confirmed");
      // If trying to go to confirmed but full → waitlist
      const actualStatus = (newStatus === "confirmed" && currentConfirmed.length >= MAX_PLAYERS) ? "waitlist" : newStatus;
      const filtered = current.filter(a => a.name !== myName || a.isOrganizer);
      const updated = [...filtered, { name: myName, isOrganizer: false, status: actualStatus, at: Date.now() }];
      await db.collection("events").doc(eventId).update({ attendees: updated });
      // If someone freed a spot, promote from waitlist
      if (newStatus === "declined") await promoteFromWaitlist(eventId);
      setMyResponse(actualStatus);
      try {
        localStorage.setItem(`padel_response_${eventId}`, actualStatus);
      } catch(e) {}
    } catch(e) { console.error(e); }
    setChangingResponse(false);
  }

  async function removeAttendee(idx) {
    const db = getDb();
    const removedStatus = attendees[idx]?.status;
    const updated = attendees.filter((_, i) => i !== idx);
    await db.collection("events").doc(eventId).update({ attendees: updated });
    if (removedStatus === "confirmed") await promoteFromWaitlist(eventId);
  }

  async function saveEdit() {
    setSaving(true);
    const db = getDb();
    await db.collection("events").doc(eventId).update({
      title: editForm.title,
      date: editForm.date,
      timeStart: editForm.timeStart,
      timeEnd: editForm.timeEnd,
      location: editForm.location,
      placeId: editForm.placeId || null,
      description: editForm.description,
    });
    setSaving(false);
    setSavedMsg(true);
    setEditMode(false);
    setTimeout(() => setSavedMsg(false), 3000);
  }

  if (loading) return <div className="loading">CARGANDO...</div>;
  if (!event) return <div className="loading">EVENTO NO ENCONTRADO</div>;

  const isAdmin = !!(adminKey && event && event.adminKey === adminKey);
  const confirmed = attendees.filter(a => a.status === "confirmed");
  const declined = attendees.filter(a => a.status === "declined");
  const waitlist = attendees.filter(a => a.status === "waitlist");
  const full = confirmed.length >= MAX_PLAYERS;


  return (
    <div className="event-view">
      <div className="event-hero">
        {onBack && <button onClick={onBack} style={{background:"transparent",border:"none",color:"#00c864",fontSize:14,cursor:"pointer",marginBottom:12,padding:0,display:"flex",alignItems:"center",gap:4}}>← Mis eventos</button>}
        <div className="event-badge">🎾 Pádel</div>
        <div className="event-title">{event.title}</div>
        <div className="event-meta">
          <div className="meta-row"><div className="meta-icon">📅</div>{formatDate(event.date)}</div>
          <div className="meta-row"><div className="meta-icon">🕐</div>{event.timeStart}{event.timeEnd ? ` → ${event.timeEnd}` : ""}</div>
          <div className="meta-row">
            <div className="meta-icon">📍</div>
            <a className="meta-link" href={mapsLink(event.placeId, event.location)} target="_blank" rel="noreferrer">{event.location} ↗</a>
          </div>
          {event.description && (
            <div className="meta-row"><div className="meta-icon">💬</div><span style={{ color: "#888", fontSize: 13 }}>{event.description}</span></div>
          )}
        </div>
        {countdown && <div className="countdown">⏱ {countdown}</div>}
      </div>
      {event.cancelled && (
        <div className="cancelled-banner">
          <div className="emoji">❌</div>
          <h2>PARTIDO CANCELADO</h2>
          <p>El organizador canceló este partido.</p>
        </div>
      )}
      <div className="slots-section">
        <div className="slots-header">
          <div className="slots-title">JUGADORES</div>
          <div className="slots-count">{confirmed.length} / {MAX_PLAYERS}</div>
        </div>
        <div className="slots-grid">
          {Array.from({ length: MAX_PLAYERS }, (_, i) => confirmed[i] || null).map((player, i) => (
            <div className={`slot ${player ? "filled just-filled" : "empty-pulse"}`} key={i}>
              <div className="slot-number">{i + 1}</div>
              {player ? (
                <div>
                  <div className="slot-player">{player.name}</div>
                  {player.isOrganizer && <div className="slot-organizer-tag">Organizador</div>}
                </div>
              ) : (
                <div className="slot-empty">Lugar libre</div>
              )}
            </div>
          ))}
        </div>
        {waitlist.length > 0 && (
          <div className="waitlist-list">
            <div className="waitlist-title">⏳ LISTA DE ESPERA</div>
            {waitlist.map((p, i) => <div className="waitlist-item" key={i}>⏳ {p.name}</div>)}
          </div>
        )}
        {declined.length > 0 && (
          <div className="declined-list">
            <div className="declined-title">NO PUEDEN</div>
            {declined.map((p, i) => <div className="declined-item" key={i}>❌ {p.name}</div>)}
          </div>
        )}
        <div className="refreshing">• se actualiza en tiempo real</div>
      </div>
      {!event.cancelled && <div className="rsvp-section">
        <div className="rsvp-title">¿ESTÁS PARA JUGAR?</div>
        {!isAdmin && myResponse === "waitlist" ? (
          <div className="declined-msg" style={{borderColor:"rgba(255,170,0,0.3)",background:"rgba(255,170,0,0.06)"}}>
            <div className="emoji">⏳</div>
            <strong style={{color:"#ffaa00"}}>Estás en lista de espera, {myName}.</strong>
            <p style={{marginBottom:12}}>Si alguien cancela, tu lugar se confirma automáticamente.</p>
            <button className="btn-decline" onClick={() => changeResponse("declined")} disabled={changingResponse}
              style={{width:"100%",marginTop:8}}>
              {changingResponse ? "..." : "Salir de la lista de espera"}
            </button>
          </div>
        ) : !isAdmin && myResponse === "confirmed" ? (
          <div className="confirmed-msg">
            <div className="emoji">✅</div>
            <strong>¡Confirmado, {myName}!</strong>
            <p style={{marginBottom:12}}>Ya estás en el partido.</p>
            <button className="btn-calendar" onClick={() => addToCalendar(event)}>
              📅 Agregar al calendario
            </button>
            <button className="btn-decline" onClick={() => changeResponse("declined")} disabled={changingResponse}
              style={{width:"100%",marginTop:8}}>
              {changingResponse ? "..." : "Cambiar — no puedo ir"}
            </button>
            <button className="btn-whatsapp" onClick={() => {
              const shareLink = "https://padel-event-green.vercel.app/api/preview?event=" + eventId;
              window.open("https://wa.me/?text=" + encodeURIComponent(shareLink), "_blank");
            }} style={{marginTop:8,fontSize:18,padding:"14px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.104.549 4.078 1.508 5.793L0 24l6.375-1.493A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.36-.214-3.732.874.944-3.641-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
              COMPARTIR INVITACIÓN
            </button>
          </div>
        ) : !isAdmin && myResponse === "declined" ? (
          <div className="declined-msg">
            <div className="emoji">😔</div>
            <strong>Avisaste que no podés, {myName}.</strong>
            <p style={{marginBottom:12}}>Los demás lo saben.</p>
            <button className="btn-confirm" onClick={() => changeResponse("confirmed")} disabled={changingResponse}
              style={{width:"100%",marginTop:8,opacity: (attendees.filter(a=>a.status==="confirmed").length >= MAX_PLAYERS ? 0.4 : 1)}}>
              {changingResponse ? "..." : attendees.filter(a=>a.status==="confirmed").length >= MAX_PLAYERS ? "Partido completo" : "Cambiar — sí puedo ir"}
            </button>
            <button className="btn-whatsapp" onClick={() => {
              const shareLink = "https://padel-event-green.vercel.app/api/preview?event=" + eventId;
              window.open("https://wa.me/?text=" + encodeURIComponent(shareLink), "_blank");
            }} style={{marginTop:8,fontSize:18,padding:"14px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.104.549 4.078 1.508 5.793L0 24l6.375-1.493A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.36-.214-3.732.874.944-3.641-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
              COMPARTIR INVITACIÓN
            </button>
          </div>
        ) : (
          <div className="rsvp-input">
            {isAdmin && <div style={{fontSize:12,color:"#555",marginBottom:4}}>Como admin podés agregar jugadores manualmente</div>}
            {!full && <div className="rsvp-sub">Quedan {MAX_PLAYERS - confirmed.length} lugar{MAX_PLAYERS - confirmed.length !== 1 ? "es" : ""}</div>}
            {full && !isAdmin && <div className="rsvp-sub">El partido está completo — podés anotarte en lista de espera</div>}
            <input className="field" placeholder="Nombre del jugador" value={name} onChange={e => setName(e.target.value)} />
            <div className="rsvp-buttons">
              {(!full || isAdmin) && (
                <button className="btn-confirm" onClick={e => respond("confirmed", e.currentTarget)} disabled={!name.trim() || confirming}>
                  {confirming ? "..." : "✅ VOY"}
                </button>
              )}
              {full && !isAdmin && (
                <button className="btn-confirm" onClick={e => respond("confirmed", e.currentTarget)} disabled={!name.trim() || confirming}
                  style={{opacity: name.trim() ? 1 : 0.4}}>
                  {confirming ? "..." : "⏳ LISTA DE ESPERA"}
                </button>
              )}
              <button className="btn-decline" onClick={e => respond("declined", e.currentTarget)} disabled={!name.trim() || confirming}>
                {confirming ? "..." : "❌ NO PUEDO"}
              </button>
            </div>
          </div>
        )}
      </div>}

      {isAdmin && (
        <div className="admin-section">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div className="admin-title">⚙️ PANEL DE ADMIN</div>
            <button className="btn-remove" onClick={() => setEditMode(v => !v)} style={{color:"#00c864",borderColor:"#00c864"}}>
              {editMode ? "Cancelar" : "Editar evento"}
            </button>
            {savedMsg && <span className="saved-msg">✓ Guardado</span>}
          </div>

          {editMode && (
            <div style={{marginBottom:16}}>
              <input className="edit-field" placeholder="Título" value={editForm.title} onChange={e => setEditForm(f=>({...f,title:e.target.value}))} />
              <div className="field-icon-wrap">
                <input className="edit-field field" type="date" value={editForm.date} onChange={e => setEditForm(f=>({...f,date:e.target.value}))} />
                <span className="field-icon">📅</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <input className="edit-field" type="time" value={editForm.timeStart} onChange={e => {
                  const val = e.target.value;
                  setEditForm(f => {
                    const updated = {...f, timeStart: val};
                    if (val) {
                      const [h, m] = val.split(":").map(Number);
                      const total = h * 60 + m + 90;
                      const endH = Math.floor(total / 60) % 24;
                      const endM = total % 60;
                      updated.timeEnd = String(endH).padStart(2,"0") + ":" + String(endM).padStart(2,"0");
                    }
                    return updated;
                  });
                }} style={{marginBottom:0}} />
                <input className="edit-field" type="time" value={editForm.timeEnd} onChange={e => setEditForm(f=>({...f,timeEnd:e.target.value}))} style={{marginBottom:0}} />
              </div>
              <div style={{marginBottom:8}}>
                <LocationField
                  value={editForm.location}
                  initialPlaceId={editForm.placeId}
                  onChange={(loc, pid) => setEditForm(f => ({ ...f, location: loc, placeId: pid || f.placeId }))}
                />
              </div>
              <textarea className="edit-field" placeholder="Descripción" value={editForm.description} onChange={e => setEditForm(f=>({...f,description:e.target.value}))} style={{resize:"vertical",minHeight:60}} />
              <button className="btn-save" onClick={saveEdit} disabled={saving}>{saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}</button>
            </div>
          )}

          <button className="btn-calendar" onClick={() => addToCalendar(event)} style={{marginBottom:8}}>
            📅 Agregar al calendario
          </button>
          {!event.cancelled && <button className="btn-cancel" onClick={async () => {
            if (!window.confirm("¿Cancelar el partido? Todos los invitados verán el evento como cancelado.")) return;
            const db = getDb();
            await db.collection("events").doc(eventId).update({ cancelled: true });
          }}>❌ CANCELAR PARTIDO</button>}
          {event.cancelled && <button className="btn-cancel" style={{borderColor:"#00c864",color:"#00c864"}} onClick={async () => {
            const db = getDb();
            await db.collection("events").doc(eventId).update({ cancelled: false });
          }}>✅ REACTIVAR PARTIDO</button>}
          <button className="btn-whatsapp" style={{marginBottom:16,fontSize:18,padding:"14px",marginTop:10}} onClick={() => {
            const base = window.location.origin + window.location.pathname;
            const inviteLink = "https://padel-event-green.vercel.app/api/preview?event=" + eventId;
            const msg = encodeURIComponent(inviteLink);
            window.open("https://wa.me/?text=" + msg, "_blank");
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.104.549 4.078 1.508 5.793L0 24l6.375-1.493A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.36-.214-3.732.874.944-3.641-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
            COMPARTIR INVITACIÓN
          </button>
          <div className="admin-title" style={{fontSize:16,marginBottom:10}}>JUGADORES</div>
          {attendees.map((p, i) => (
            <div className="admin-player" key={i}>
              <div>
                <div className="admin-player-name">{p.name} {p.isOrganizer ? "👑" : ""}</div>
                <div className="admin-player-status">{p.status === "confirmed" ? "✅ Confirmado" : p.status === "waitlist" ? "⏳ Lista de espera" : "❌ No puede"}</div>
                {p.at && <div className="admin-player-time">{formatTime(p.at)}</div>}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {i > 0 && <button className="btn-remove" style={{color:"#aaa",borderColor:"#333"}}
                  onClick={async () => {
                    const db = getDb();
                    const updated = [...attendees];
                    [updated[i-1], updated[i]] = [updated[i], updated[i-1]];
                    await db.collection("events").doc(eventId).update({ attendees: updated });
                  }}>↑</button>}
                {i < attendees.length-1 && <button className="btn-remove" style={{color:"#aaa",borderColor:"#333"}}
                  onClick={async () => {
                    const db = getDb();
                    const updated = [...attendees];
                    [updated[i], updated[i+1]] = [updated[i+1], updated[i]];
                    await db.collection("events").doc(eventId).update({ attendees: updated });
                  }}>↓</button>}
                <button className="btn-remove" style={{color: p.status === "confirmed" ? "#ff6060" : "#00c864"}}
                  onClick={async () => {
                    const db = getDb();
                    const updated = [...attendees];
                    if (p.status === "confirmed") {
                      updated[i] = { ...updated[i], status: "declined" };
                      await db.collection("events").doc(eventId).update({ attendees: updated });
                      await promoteFromWaitlist(eventId);
                    } else {
                      const currentConfirmed = attendees.filter(a => a.status === "confirmed").length;
                      const newStatus = (p.status === "waitlist" && currentConfirmed >= MAX_PLAYERS) ? "waitlist" : "confirmed";
                      updated[i] = { ...updated[i], status: newStatus };
                      await db.collection("events").doc(eventId).update({ attendees: updated });
                    }
                  }}>
                  {p.status === "confirmed" ? "→ No puedo" : p.status === "waitlist" ? "→ Confirmar" : "→ Voy"}
                </button>
                <button className="btn-remove" onClick={() => removeAttendee(i)}>✕</button>
              </div>
            </div>
          ))}
          {attendees.length === 0 && <div style={{fontSize:13,color:"#444"}}>Sin respuestas aún</div>}
        </div>
      )}
    </div>
  );
}

// ── MY EVENTS VIEW ──
function MyEventsView({ onSelect, onNew }) {
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({});
  const [pasteLink, setPasteLink] = useState("");
  const [pasteError, setPasteError] = useState("");

  useEffect(() => {
    const saved = getSavedEvents();
    const today = new Date();
    today.setHours(0,0,0,0);
    const active = saved.filter(e => {
      if (!e.date) return true;
      const timeStart = e.timeStart || "23:59";
      const eventDate = new Date(e.date + "T" + timeStart + ":00");
      return eventDate >= new Date();
    });
    setEvents(active);

    const db = getDb();
    if (!db) return;
    active.forEach(ev => {
      db.collection("events").doc(ev.id).get().then(snap => {
        if (snap.exists) {
          const data = snap.data();
          const confirmed = (data.attendees || []).filter(a => a.status === "confirmed").length;
          setEventData(prev => ({ ...prev, [ev.id]: { confirmed, cancelled: !!data.cancelled } }));
        } else {
          setEventData(prev => ({ ...prev, [ev.id]: { cancelled: true } }));
        }
      }).catch(() => {});
    });
  }, []);

  function formatDateShort(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return `${parseInt(d)} ${months[parseInt(m)-1]}`;
  }

  const myEvents = events.filter(e => !e.isGuest);
  const guestEvents = events.filter(e => e.isGuest);

  function EventCard({ ev }) {
    const data = eventData[ev.id] || {};
    if (data.cancelled) return null;
    const pct = data.confirmed !== undefined ? Math.round((data.confirmed / 4) * 100) : 0;
    return (
      <div className="event-card" onClick={() => onSelect(ev.id, ev.adminKey)}>
        <div className="event-card-title">{ev.title || "Partido de Pádel"}</div>
        <div className="event-card-meta">
          <span>📅 {formatDateShort(ev.date)}</span>
          {data.confirmed !== undefined && (
            <span className="event-card-slots">{data.confirmed}/4 jugadores</span>
          )}
          {ev.isGuest && (() => {
            try {
              const resp = localStorage.getItem(`padel_response_${ev.id}`);
              if (resp === "confirmed") return <span style={{color:"#00c864"}}>✅ Voy</span>;
              if (resp === "waitlist") return <span style={{color:"#ffaa00"}}>⏳ En espera</span>;
              if (resp === "declined") return <span style={{color:"#ff6060"}}>❌ No puedo</span>;
            } catch(e) {}
            return null;
          })()}
        </div>
        {data.confirmed !== undefined && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{width: pct + '%'}} />
          </div>
        )}
      </div>
    );
  }

  const hasEvents = myEvents.length > 0 || guestEvents.length > 0;

  function handlePasteLink() {
    setPasteError("");
    try {
      const trimmed = pasteLink.trim();
      const url = new URL(trimmed);
      // Accept both app URL (?event=xxx) and preview URL (/api/preview?event=xxx)
      const eventId = url.searchParams.get("event");
      if (!eventId) { setPasteError("Link inválido — pegá el link completo"); return; }
      const ak = url.searchParams.get("admin") || null;
      onSelect(eventId, ak);
      setPasteLink("");
    } catch(e) {
      setPasteError("Link inválido — pegá el link completo");
    }
  }

  return (
    <div className="my-events">
      <div className="my-events-header">
        <div className="label">Mis partidos</div>
        <h1>TUS<br /><span>EVENTOS</span></h1>
      </div>

      {!hasEvents && (
        <div className="no-events">
          <div style={{fontSize:40,marginBottom:12}}>🎾</div>
          <p>No tenés partidos activos.<br/>Creá uno nuevo.</p>
        </div>
      )}

      {myEvents.length > 0 && (
        <>
          <div className="section-label" style={{marginBottom:10}}>ORGANIZADOR</div>
          {myEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
        </>
      )}

      {guestEvents.length > 0 && (
        <>
          <div className="section-label" style={{marginTop:20,marginBottom:10}}>INVITADO</div>
          {guestEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
        </>
      )}

      <div className="paste-link-section">
        <div className="paste-link-label">🔗 Pegar link de invitación</div>
        <div className="paste-link-row">
          <input
            className="paste-link-input"
            placeholder="Pegá el link que te mandaron..."
            value={pasteLink}
            onChange={e => { setPasteLink(e.target.value); setPasteError(""); }}
            onKeyDown={e => e.key === "Enter" && handlePasteLink()}
          />
          <button className="btn-paste" onClick={handlePasteLink} disabled={!pasteLink.trim()}>IR</button>
        </div>
        {pasteError && <div style={{fontSize:12,color:"#ff6060",marginTop:6}}>{pasteError}</div>}
      </div>

      <button className="btn-new-event" onClick={onNew} style={{marginTop:20}}>+ CREAR NUEVO PARTIDO</button>
    </div>
  );
}

// ── APP ROOT ──
export default function App() {
  const [screen, setScreen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("event")) return "event";
    return "myevents";
  });
  const [currentEventId, setCurrentEventId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("event") || null;
  });
  const [adminKey, setAdminKey] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("admin") || null;
  });

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  function handleCreate(id, adminKey) {
    setCurrentEventId(id);
    setAdminKey(adminKey);
    setScreen("share");
  }

  function handleSelectEvent(id, ak) {
    setCurrentEventId(id);
    setAdminKey(ak);
    setScreen("event");
  }

  return (
    <div className="app">
      {screen === "myevents" && <MyEventsView onSelect={handleSelectEvent} onNew={() => setScreen("creator")} />}
      {screen === "creator" && <CreatorView onCreate={handleCreate} />}
      {screen === "share" && <ShareView eventId={currentEventId} adminKey={adminKey} onViewEvent={() => setScreen("event")} />}
      {screen === "event" && <EventView eventId={currentEventId} adminKey={adminKey} onBack={currentEventId ? () => setScreen("myevents") : null} />}
    </div>
  );
}
