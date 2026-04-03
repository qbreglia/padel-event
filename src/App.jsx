import { useState, useEffect, useCallback, useRef } from "react";

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
`;

function genId() { return Math.random().toString(36).slice(2, 9); }
function mapsLink(placeId, location) {
  if (placeId) return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  return `https://maps.google.com/?q=${encodeURIComponent(location)}`;
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${parseInt(d)} de ${months[parseInt(m)-1]} ${y}`;
}

function getDb() { return window.db; }

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
  const confirmed = current.filter(a => a.status === "confirmed");
  if (attendee.status === "confirmed" && confirmed.length >= 4) return;
  await ref.update({ attendees: [...current, attendee] });
}

// ── LOCATION AUTOCOMPLETE ──
function LocationField({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [placeId, setPlaceId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteService = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  function handleInput(e) {
    const val = e.target.value;
    onChange(val, null);
    setPlaceId(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!val.trim() || !autocompleteService.current) { setSuggestions([]); return; }
    timeoutRef.current = setTimeout(() => {
      autocompleteService.current.getPlacePredictions(
        { input: val, types: ['establishment', 'geocode'] },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5));
            setShowDropdown(true);
          } else { setSuggestions([]); }
        }
      );
    }, 300);
  }

  function selectPlace(prediction) {
    onChange(prediction.structured_formatting.main_text, prediction.place_id);
    setPlaceId(prediction.place_id);
    setSuggestions([]);
    setShowDropdown(false);
  }

  return (
    <div className="location-wrapper">
      <input className="field" placeholder="Ej: Club Escobar, Benavidez..." value={value}
        onChange={handleInput} onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)} autoComplete="off" />
      {showDropdown && suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          {suggestions.map((s) => (
            <div key={s.place_id} className="autocomplete-item" onMouseDown={() => selectPlace(s)}>
              <div className="main">{s.structured_formatting.main_text}</div>
              <div className="secondary">{s.structured_formatting.secondary_text}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>
        {placeId ? "📍 Lugar seleccionado" : "Escribí para buscar el lugar"}
      </div>
    </div>
  );
}

// ── CREATOR ──
function CreatorView({ onCreate }) {
  const [form, setForm] = useState({ title: "", description: "", date: "", timeStart: "", timeEnd: "", location: "", placeId: null });
  const [includeOrganizer, setIncludeOrganizer] = useState(true);
  const [organizerName, setOrganizerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
    if (!apiKey) return;
    if (window.google) { setMapsReady(true); return; }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
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
        <input className="field" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
      </div>
      <div className="section">
        <div className="section-label">Horario</div>
        <div className="row">
          <input className="field" type="time" value={form.timeStart} onChange={e => set("timeStart", e.target.value)} />
          <input className="field" type="time" value={form.timeEnd} onChange={e => set("timeEnd", e.target.value)} />
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
  const base = `${window.location.origin}${window.location.pathname}`;
  const link = `${base}?event=${eventId}`;
  const adminLink = `${base}?event=${eventId}&admin=${adminKey}`;

  function copy() {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  function shareWhatsApp() {
    const msg = encodeURIComponent("Te invitaron a un partido de pádel 🎾\n\nVer detalles y confirmar si vas:\n" + link);
    window.open("https://wa.me/?text=" + msg, "_blank");
  }
  function saveAdminLink() {
    const msg = encodeURIComponent("🔐 Mi link de administrador para el partido:\n" + adminLink + "\n\n(Guardalo, es el único que te permite editar el evento)");
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
        <span className="link-text">{link}</span>
        <button className="btn-copy" onClick={copy}>{copied ? "✓ Copiado" : "Copiar"}</button>
      </div>
      <button className="btn-view" onClick={onViewEvent}>⚙️ Ver como administrador →</button>
    </div>
  );
}

// ── EVENT VIEW ──
function EventView({ eventId, adminKey }) {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [name, setName] = useState("");
  const [myName, setMyName] = useState(null);
  const [myResponse, setMyResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const MAX_PLAYERS = 4;

  const isAdmin = adminKey && event && event.adminKey === adminKey;

  useEffect(() => {
    const db = getDb();
    if (!db) { setLoading(false); return; }
    const unsub = db.collection("events").doc(eventId).onSnapshot(snap => {
      if (snap.exists) {
        const data = snap.data();
        setEvent(data);
        setAttendees(data.attendees || []);
        setEditForm({ title: data.title, date: data.date, timeStart: data.timeStart, timeEnd: data.timeEnd, location: data.location, description: data.description || "" });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [eventId]);

  async function respond(status) {
    if (!name.trim() || confirming) return;
    setConfirming(true);
    try {
      await addAttendee(eventId, { name: name.trim(), isOrganizer: false, status, at: Date.now() });
      if (isAdmin) {
        setName("");
      } else {
        setMyName(name.trim());
        setMyResponse(status);
      }
    } catch(e) { console.error(e); }
    setConfirming(false);
  }

  async function removeAttendee(idx) {
    const db = getDb();
    const updated = attendees.filter((_, i) => i !== idx);
    await db.collection("events").doc(eventId).update({ attendees: updated });
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
      description: editForm.description,
    });
    setSaving(false);
    setSavedMsg(true);
    setEditMode(false);
    setTimeout(() => setSavedMsg(false), 3000);
  }

  if (loading) return <div className="loading">CARGANDO...</div>;
  if (!event) return <div className="loading">EVENTO NO ENCONTRADO</div>;

  const confirmed = attendees.filter(a => a.status === "confirmed");
  const declined = attendees.filter(a => a.status === "declined");
  const full = confirmed.length >= MAX_PLAYERS;

  return (
    <div className="event-view">
      <div className="event-hero">
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
      </div>
      <div className="slots-section">
        <div className="slots-header">
          <div className="slots-title">JUGADORES</div>
          <div className="slots-count">{confirmed.length} / {MAX_PLAYERS}</div>
        </div>
        <div className="slots-grid">
          {Array.from({ length: MAX_PLAYERS }, (_, i) => confirmed[i] || null).map((player, i) => (
            <div className={`slot ${player ? "filled" : ""}`} key={i}>
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
        {declined.length > 0 && (
          <div className="declined-list">
            <div className="declined-title">NO PUEDEN</div>
            {declined.map((p, i) => <div className="declined-item" key={i}>❌ {p.name}</div>)}
          </div>
        )}
        <div className="refreshing">• se actualiza en tiempo real</div>
      </div>
      <div className="rsvp-section">
        <div className="rsvp-title">¿ESTÁS PARA JUGAR?</div>
        {!isAdmin && myResponse === "confirmed" ? (
          <div className="confirmed-msg">
            <div className="emoji">✅</div>
            <strong>¡Confirmado, {myName}!</strong>
            <p>Ya estás en el partido.</p>
          </div>
        ) : !isAdmin && myResponse === "declined" ? (
          <div className="declined-msg">
            <div className="emoji">😔</div>
            <strong>Avisaste que no podés, {myName}.</strong>
            <p>Los demás lo saben.</p>
          </div>
        ) : (
          <div className="rsvp-input">
            {isAdmin && <div style={{fontSize:12,color:"#555",marginBottom:4}}>Como admin podés agregar jugadores manualmente</div>}
            {full && !isAdmin ? <div className="rsvp-full-banner">🔒 El partido está completo</div> : !full && <div className="rsvp-sub">Quedan {MAX_PLAYERS - confirmed.length} lugar{MAX_PLAYERS - confirmed.length !== 1 ? "es" : ""}</div>}
            <input className="field" placeholder="Nombre del jugador" value={name} onChange={e => setName(e.target.value)} />
            <div className="rsvp-buttons">
              {(!full || isAdmin) && (
                <button className="btn-confirm" onClick={() => respond("confirmed")} disabled={!name.trim() || confirming}>
                  {confirming ? "..." : "✅ VOY"}
                </button>
              )}
              <button className="btn-decline" onClick={() => respond("declined")} disabled={!name.trim() || confirming}>
                {confirming ? "..." : "❌ NO PUEDO"}
              </button>
            </div>
          </div>
        )}
      </div>

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
              <input className="edit-field" type="date" value={editForm.date} onChange={e => setEditForm(f=>({...f,date:e.target.value}))} />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <input className="edit-field" type="time" value={editForm.timeStart} onChange={e => setEditForm(f=>({...f,timeStart:e.target.value}))} style={{marginBottom:0}} />
                <input className="edit-field" type="time" value={editForm.timeEnd} onChange={e => setEditForm(f=>({...f,timeEnd:e.target.value}))} style={{marginBottom:0}} />
              </div>
              <input className="edit-field" placeholder="Lugar" value={editForm.location} onChange={e => setEditForm(f=>({...f,location:e.target.value}))} />
              <textarea className="edit-field" placeholder="Descripción" value={editForm.description} onChange={e => setEditForm(f=>({...f,description:e.target.value}))} style={{resize:"vertical",minHeight:60}} />
              <button className="btn-save" onClick={saveEdit} disabled={saving}>{saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}</button>
            </div>
          )}

          <button className="btn-whatsapp" style={{marginBottom:16,fontSize:18,padding:"14px"}} onClick={() => {
            const base = window.location.origin + window.location.pathname;
            const inviteLink = base + "?event=" + eventId;
            const msg = encodeURIComponent("Te invitaron a un partido de pádel 🎾\n\nVer detalles y confirmar si vas:\n" + inviteLink);
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
                <div className="admin-player-status">{p.status === "confirmed" ? "✅ Confirmado" : "❌ No puede"}</div>
              </div>
              <button className="btn-remove" onClick={() => removeAttendee(i)}>Eliminar</button>
            </div>
          ))}
          {attendees.length === 0 && <div style={{fontSize:13,color:"#444"}}>Sin respuestas aún</div>}
        </div>
      )}
    </div>
  );
}

// ── APP ROOT ──
export default function App() {
  const [screen, setScreen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("event") ? "event" : "creator";
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

  return (
    <div className="app">
      {screen === "creator" && <CreatorView onCreate={handleCreate} />}
      {screen === "share" && <ShareView eventId={currentEventId} adminKey={adminKey} onViewEvent={() => setScreen("event")} />}
      {screen === "event" && <EventView eventId={currentEventId} adminKey={adminKey} />}
    </div>
  );
}
