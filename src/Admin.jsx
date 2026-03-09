import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Users, Mail, Calendar, Download, RefreshCw, TrendingUp,
  Layout, ChevronDown, ChevronUp, Save, Check, AlertCircle,
  Image, Film, Upload, Copy, Type, Link, FileText, Globe, Lock, Eye, EyeOff
} from 'lucide-react';

const API = '';
const ADMIN_PASSWORD = '123456';

// ─────────────────────────────────────────────
// DEFAULT ASSET PREVIEWS (з папки assets)
// ─────────────────────────────────────────────
import happeningBgPreview from './assets/happening_bg.png';
import unLogoPreview from './assets/un_logo.png';
import damageMapPreview from './assets/damage_map.png';
import petitionAboutImagePreview from './assets/petition-about-image.jpg';
import petitionAboutVideoPreview from './assets/petition-about-video.mp4';
import heroBottleVideoPreview from './assets/hero-bottle-video.mp4';
import explodedVideoPreview from './assets/exploded-video.mp4';
import maskWomanVideoPreview from './assets/mask-woman-video.mp4';
import smogCityVideoPreview from './assets/smog-city-video.mp4';
import familyMaskVideoPreview from './assets/family-mask-video.mp4';
import earthVideoPreview from './assets/earth-video.mp4';
import modalBgPreview from './assets/modal_bg.jpg';

// ─────────────────────────────────────────────
// SITE FIELDS CONFIG
// ─────────────────────────────────────────────
const SITE_FIELDS = [
  {
    section: 'Hero', icon: '🎯',
    fields: [
      { id: 'hero_title', label: 'Main Title', type: 'text', default: 'YOUR CLEAN AIR IS ALREADY BEING SOLD' },
      { id: 'hero_tag', label: 'Top Tag Label', type: 'text', default: 'Clean Air' },
    ]
  },
  {
    section: 'Future Section', icon: '🔮',
    fields: [
      { id: 'future_title', label: 'Section Title', type: 'text', default: 'THE FUTURE OF BREATHING' },
      { id: 'future_stat1_title', label: 'Stat 1 — Title', type: 'text', default: '100 Refills' },
      { id: 'future_stat1_sub', label: 'Stat 1 — Subtitle', type: 'text', default: 'of fresh air' },
      { id: 'future_stat2_title', label: 'Stat 2 — Title', type: 'text', default: 'Built-in Type-C' },
      { id: 'future_stat2_sub', label: 'Stat 2 — Subtitle', type: 'text', default: 'charging port' },
      { id: 'future_stat3_title', label: 'Stat 3 — Title', type: 'text', default: 'Over 45 Minutes' },
      { id: 'future_stat3_sub', label: 'Stat 3 — Subtitle', type: 'text', default: 'of fresh air' },
    ]
  },
  {
    section: 'Happening Now', icon: '⚡',
    fields: [
      { id: 'happening_title', label: 'Title', type: 'text', default: 'Is Happening Now' },
      { id: 'happening_sub', label: 'Subtitle', type: 'text', default: 'What once felt distant is now evident' },
    ]
  },
  {
    section: 'UN Goal Section', icon: '🌍',
    fields: [
      { id: 'un_tag', label: 'Top Label', type: 'text', default: 'Sign to protect clean air' },
      { id: 'un_title', label: 'Main Title', type: 'textarea', default: 'WE CALL ON THE UNITED NATIONS TO RECOGNIZE CLEAN AIR AS A HUMAN RIGHT' },
      { id: 'un_sub', label: 'Subtitle', type: 'text', default: 'Not symbolic. Enforceable. Measurable.' },
      { id: 'un_card1_num', label: 'Card 1 — Number', type: 'text', default: '7 MILLION' },
      { id: 'un_card1_text', label: 'Card 1 — Description', type: 'textarea', default: "DEATHS EVERY YEAR — THAT'S 13 PEOPLE DYING EVERY MINUTE FROM SOMETHING AS BASIC AS BREATHING" },
      { id: 'un_card2_num', label: 'Card 2 — Number', type: 'text', default: '99% HUMANITY' },
      { id: 'un_card2_text', label: 'Card 2 — Description', type: 'textarea', default: 'BREATHES UNSAFE AIR — WITH CHILDREN AND VULNERABLE COMMUNITIES AFFECTED MOST' },
      { id: 'un_card3_num', label: 'Card 3 — Number', type: 'text', default: '30%' },
      { id: 'un_card3_text', label: 'Card 3 — Description', type: 'textarea', default: 'OF LUNG CANCER DEATHS WORLDWIDE ARE ATTRIBUTED TO OUTDOOR AIR POLLUTION' },
    ]
  },
  {
    section: 'Petition About', icon: '📋',
    fields: [
      { id: 'about_title', label: 'Section Title', type: 'text', default: 'WHAT THIS PETITION IS ABOUT' },
      { id: 'about_item1', label: 'Item 1', type: 'text', default: 'RECOGNIZING THE RIGHT TO BREATHE CLEAN AIR' },
      { id: 'about_item2', label: 'Item 2', type: 'text', default: 'MAKING THAT RIGHT REAL, NOT JUST A PROMISE' },
      { id: 'about_item3', label: 'Item 3', type: 'text', default: 'TURNING WORDS INTO CLEAR, MEASURABLE ACTION' },
      { id: 'about_item4', label: 'Item 4', type: 'text', default: "PROTECTING PEOPLE'S HEALTH FROM PREVENTABLE HARM" },
      { id: 'about_item5', label: 'Item 5', type: 'text', default: 'STOPPING THE SALE OF POLLUTION' },
    ]
  },
  {
    section: 'Human Cost', icon: '💔',
    fields: [
      { id: 'humancost_title', label: 'Title', type: 'text', default: 'The Human Cost Of Inaction' },
      { id: 'humancost_text', label: 'Description', type: 'textarea', default: 'This is not a crisis of nature alone — it is a crisis of justice and ethics.' },
      { id: 'humancost_point1', label: 'Point 1', type: 'textarea', default: 'Air pollution is not only a public health crisis — it is a form of environmental injustice.' },
      { id: 'humancost_point2', label: 'Point 2', type: 'textarea', default: 'While pollution does not discriminate at the source, it does at the point of impact.' },
    ]
  },
  {
    section: 'Damage Section', icon: '🗺️',
    fields: [
      { id: 'damage_title', label: 'Title', type: 'text', default: 'WHEN DAMAGE CAN NO LONGER BE IGNORED' },
      { id: 'damage_text', label: 'Description', type: 'textarea', default: 'Air pollution is a form of slow violence — a violence that occurs gradually and out of sight.' },
      { id: 'damage_btn', label: 'Button Text', type: 'text', default: 'CLIMATETRACE.ORG' },
      { id: 'damage_btn_url', label: 'Button URL', type: 'url', default: 'https://climatetrace.org' },
    ]
  },
  {
    section: 'Solution Section', icon: '✅',
    fields: [
      { id: 'solution_title', label: 'Title', type: 'text', default: "THIS DOESN'T HAVE TO STAY THIS WAY" },
      { id: 'solution_text', label: 'Description', type: 'textarea', default: 'We believe the right to breathe clean air must be affirmed as a basic and actionable human right.' },
    ]
  },
  {
    section: 'Footer & Social', icon: '🔗',
    fields: [
      { id: 'footer_title', label: 'Footer Title', type: 'text', default: 'JOIN THE DISCUSSION' },
      { id: 'discord_url', label: 'Discord URL', type: 'url', default: '#' },
      { id: 'whatsapp_url', label: 'WhatsApp URL', type: 'url', default: '#' },
    ]
  },
  {
    section: 'Petition Modal', icon: '📝',
    fields: [
      { id: 'modal_header', label: 'Header Text', type: 'textarea', default: 'We call on the United Nations to recognize clean air as a universal human right.' },
      { id: 'modal_image_text', label: 'Image Card Text', type: 'textarea', default: 'The UN must affirm clean air as a fundamental human right, equal to life and health.' },
      { id: 'modal_pdf_btn', label: 'PDF Button Text', type: 'text', default: 'DOWNLOAD PETITION (PDF)' },
    ]
  },
  {
    section: 'Partner Links', icon: '🤝',
    fields: [
      { id: 'partner_openpetition_url', label: 'OpenPetition URL', type: 'url', default: 'https://www.openpetition.eu' },
      { id: 'partner_avaaz_url', label: 'Avaaz URL', type: 'url', default: 'https://secure.avaaz.org' },
      { id: 'partner_change_url', label: 'Change.org URL', type: 'url', default: 'https://www.change.org' },
      { id: 'partner_gopetition_url', label: 'GoPetition URL', type: 'url', default: 'https://gopetition.com' },
    ]
  },
  {
    section: 'Bottom Panel', icon: '📌',
    fields: [
      { id: 'panel_btn_red', label: 'Red Button Text', type: 'text', default: "I DON'T WANT TO BUY THIS" },
      { id: 'panel_btn_blue', label: 'Blue Button Text', type: 'text', default: 'SIGN THE PETITION' },
      { id: 'panel_community_btn', label: 'Community Button', type: 'text', default: 'Our Community' },
    ]
  },
];

// ─────────────────────────────────────────────
// MEDIA ASSETS — з дефолтними превью
// ─────────────────────────────────────────────
const MEDIA_ASSETS = [
  { id: 'asset_hero_bottle_video', label: 'Hero — Bottle Video', type: 'video', section: 'Hero', defaultSrc: heroBottleVideoPreview },
  { id: 'asset_exploded_video', label: 'Future — Exploded Video', type: 'video', section: 'Future Section', defaultSrc: explodedVideoPreview },
  { id: 'asset_happening_bg', label: 'Happening Now — Background', type: 'image', section: 'Happening Now', defaultSrc: happeningBgPreview },
  { id: 'asset_mask_woman_video', label: 'UN Card 1 — Mask Woman Video', type: 'video', section: 'UN Goal', defaultSrc: maskWomanVideoPreview },
  { id: 'asset_smog_city_video', label: 'UN Card 2 — Smog City Video', type: 'video', section: 'UN Goal', defaultSrc: smogCityVideoPreview },
  { id: 'asset_family_mask_video', label: 'UN Card 3 — Family Mask Video', type: 'video', section: 'UN Goal', defaultSrc: familyMaskVideoPreview },
  { id: 'asset_petition_about_image', label: 'Petition About — Photo', type: 'image', section: 'Petition About', defaultSrc: petitionAboutImagePreview },
  { id: 'asset_earth_video', label: 'Human Cost — Earth Video', type: 'video', section: 'Human Cost', defaultSrc: earthVideoPreview },
  { id: 'asset_damage_map', label: 'Damage — Map Image', type: 'image', section: 'Damage Section', defaultSrc: damageMapPreview },
  { id: 'asset_petition_about_video', label: 'Solution — Video', type: 'video', section: 'Solution Section', defaultSrc: petitionAboutVideoPreview },
  { id: 'asset_modal_bg', label: 'Modal — Background Image', type: 'image', section: 'Petition Modal', defaultSrc: modalBgPreview },
  { id: 'asset_un_logo', label: 'UN Logo', type: 'image', section: 'General', defaultSrc: unLogoPreview },
];

// ─────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
      setPassword('');
    }
  };

  return (
    <div style={{ fontFamily: "'Unbounded', sans-serif" }} className="min-h-screen bg-[#0D0F12] flex items-center justify-center px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      <div className={`w-full max-w-[380px] ${shake ? 'shake' : ''}`}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#306CE5] to-[#4D85F7] flex items-center justify-center shadow-2xl shadow-[#306CE5]/40 mb-4">
            <span className="text-[22px] font-black text-white">G</span>
          </div>
          <h1 className="text-[16px] font-black uppercase tracking-tight text-white">Gaiia Admin</h1>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Restricted Access</p>
        </div>

        {/* Form */}
        <div className={`bg-[#13161B] border rounded-2xl p-6 transition-colors ${error ? 'border-red-500/40' : 'border-white/5'}`}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  placeholder="Enter admin password"
                  className={`w-full h-[48px] bg-white/5 border rounded-xl pl-10 pr-10 text-[13px] text-white outline-none transition-colors placeholder:text-white/15 ${
                    error ? 'border-red-500/50 focus:border-red-500' : 'border-white/8 focus:border-[#306CE5]/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {error && (
                <p className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1.5">
                  <AlertCircle size={10} /> Incorrect password
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-[48px] bg-gradient-to-b from-[#306CE5] to-[#4D85F7] rounded-xl text-[12px] font-black uppercase tracking-wide text-white hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#306CE5]/30"
            >
              Enter Admin Panel
            </button>
          </form>
        </div>

        <p className="text-center text-[9px] text-white/15 uppercase tracking-widest mt-6">
          Gaiia © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SITE EDITOR
// ─────────────────────────────────────────────
const fieldTypeIcon = (type) => {
  if (type === 'url') return <Link size={11} className="text-[#4D85F7]" />;
  if (type === 'textarea') return <FileText size={11} className="text-[#A78BFA]" />;
  return <Type size={11} className="text-[#34D399]" />;
};

const SiteEditor = () => {
  const [content, setContent] = useState({});
  const [local, setLocal] = useState({});
  const [open, setOpen] = useState({});
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/api/content`).then(r => r.json()).then(data => {
      const obj = {};
      data.forEach(i => { obj[i.id] = i.value; });
      setContent(obj);
      setLocal(obj);
    });
  }, []);

  const isDirty = id => local[id] !== undefined && local[id] !== content[id];

  const handleSave = async (id) => {
    setSaving(id); setErr(null);
    try {
      const res = await fetch(`${API}/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value: local[id] })
      });
      if (!res.ok) throw new Error();
      setContent(p => ({ ...p, [id]: local[id] }));
      setSaved(id);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      setErr(id);
      setTimeout(() => setErr(null), 3000);
    } finally { setSaving(null); }
  };

  const filteredSections = SITE_FIELDS.map(s => ({
    ...s,
    fields: s.fields.filter(f =>
      !search || f.label.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(s => !search || s.fields.length > 0);

  const totalDirty = SITE_FIELDS.flatMap(s => s.fields).filter(f => isDirty(f.id)).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[320px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fields..."
            className="w-full h-[38px] bg-white/5 border border-white/8 rounded-xl pl-8 pr-4 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#306CE5]/50 transition-colors" />
        </div>
        {totalDirty > 0 && (
          <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1.5 rounded-full uppercase">
            {totalDirty} unsaved changes
          </span>
        )}
      </div>

      {filteredSections.map(({ section, icon, fields }) => {
        const isOpen = open[section] || !!search;
        const dirtyCount = fields.filter(f => isDirty(f.id)).length;
        return (
          <div key={section} className="bg-[#13161B] border border-white/5 rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(p => ({ ...p, [section]: !p[section] }))}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[18px] leading-none">{icon}</span>
                <span className="text-[12px] font-black uppercase tracking-tight">{section}</span>
                <span className="text-[9px] text-white/25 uppercase tracking-widest hidden sm:block">{fields.length} fields</span>
                {dirtyCount > 0 && (
                  <span className="text-[9px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">{dirtyCount} unsaved</span>
                )}
              </div>
              {isOpen ? <ChevronUp size={14} className="text-white/30 flex-shrink-0" /> : <ChevronDown size={14} className="text-white/30 flex-shrink-0" />}
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-white/5 flex flex-col gap-4">
                {fields.map(({ id, label, type, default: def }) => {
                  const val = local[id] ?? content[id] ?? def;
                  const dirty = isDirty(id);
                  return (
                    <div key={id} className={`rounded-xl p-4 border transition-colors ${dirty ? 'border-[#F59E0B]/20 bg-[#F59E0B]/3' : 'border-white/4 bg-white/2'}`}>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          {fieldTypeIcon(type)}
                          <span className="text-[11px] font-bold text-white/70">{label}</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/15 hidden sm:block">{id}</span>
                      </div>
                      {type === 'textarea' ? (
                        <textarea value={val} onChange={e => setLocal(p => ({ ...p, [id]: e.target.value }))} rows={3}
                          className="w-full bg-[#0D0F12] border border-white/8 rounded-lg px-3 py-2.5 text-[12px] text-white outline-none focus:border-[#306CE5]/50 transition-colors resize-none leading-relaxed" />
                      ) : (
                        <input type={type === 'url' ? 'url' : 'text'} value={val} onChange={e => setLocal(p => ({ ...p, [id]: e.target.value }))}
                          className="w-full h-[40px] bg-[#0D0F12] border border-white/8 rounded-lg px-3 text-[12px] text-white outline-none focus:border-[#306CE5]/50 transition-colors" />
                      )}
                      <div className="flex items-center justify-between mt-2.5 min-h-[20px]">
                        <div>
                          {saved === id && <span className="text-[10px] text-[#22C55E] font-bold flex items-center gap-1"><Check size={10} /> Saved</span>}
                          {err === id && <span className="text-[10px] text-red-400 font-bold flex items-center gap-1"><AlertCircle size={10} /> Error</span>}
                        </div>
                        {dirty && (
                          <button onClick={() => handleSave(id)} disabled={saving === id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#306CE5] hover:bg-[#4D85F7] disabled:opacity-50 rounded-lg text-[10px] font-bold uppercase transition-all">
                            <Save size={10} />
                            {saving === id ? 'Saving...' : 'Save'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// MEDIA MANAGER
// ─────────────────────────────────────────────
const MediaManager = () => {
  const [content, setContent] = useState({});
  const [uploading, setUploading] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState('all');
  const fileRefs = useRef({});

  useEffect(() => {
    fetch(`${API}/api/content`).then(r => r.json()).then(data => {
      const obj = {};
      data.forEach(i => { obj[i.id] = i.value; });
      setContent(obj);
    });
  }, []);

  const handleUpload = async (assetId, file) => {
    setUploading(assetId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contentId', assetId);
      const res = await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContent(p => ({ ...p, [assetId]: data.url }));
      setUploaded(assetId);
      setTimeout(() => setUploaded(null), 3000);
    } catch {
      alert('Upload failed. Check server.');
    } finally { setUploading(null); }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = MEDIA_ASSETS.filter(a => filter === 'all' || a.type === filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all', label: 'All Assets', icon: <Globe size={11} /> },
          { key: 'image', label: 'Images', icon: <Image size={11} /> },
          { key: 'video', label: 'Videos', icon: <Film size={11} /> },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              filter === f.key ? 'bg-[#306CE5] text-white' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}>
            {f.icon} {f.label}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-white/20 uppercase tracking-widest">{filtered.length} assets</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(asset => {
          const uploadedUrl = content[asset.id];
          const isCustom = !!uploadedUrl;
          const previewSrc = uploadedUrl || asset.defaultSrc;
          const isUploading = uploading === asset.id;
          const isUploaded = uploaded === asset.id;
          const isCopied = copied === asset.id;

          return (
            <div key={asset.id} className="bg-[#13161B] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
              {/* Preview */}
              <div className="relative w-full h-[160px] bg-[#0D0F12] flex items-center justify-center overflow-hidden">
                {asset.type === 'video' ? (
                  <video src={previewSrc} className="w-full h-full object-cover"
                    muted loop playsInline
                    onMouseEnter={e => e.target.play()}
                    onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                ) : (
                  <img src={previewSrc} alt={asset.label} className="w-full h-full object-cover" />
                )}

                {/* Type badge */}
                <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
                  asset.type === 'video' ? 'bg-[#7C3AED]/80 text-white' : 'bg-[#0891B2]/80 text-white'
                }`}>
                  {asset.type === 'video' ? <Film size={9} /> : <Image size={9} />}
                  {asset.type}
                </div>

                {/* Custom / Default badge */}
                <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
                  isCustom ? 'bg-[#22C55E]/80 text-white' : 'bg-black/60 text-white/50'
                }`}>
                  {isCustom ? '✦ Custom' : '◌ Default'}
                </div>

                {/* Uploading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-[#306CE5] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-white uppercase">Uploading...</span>
                    </div>
                  </div>
                )}

                {/* Success overlay */}
                {isUploaded && (
                  <div className="absolute inset-0 bg-[#22C55E]/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center">
                      <Check size={24} className="text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-[12px] font-bold text-white leading-snug">{asset.label}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">{asset.section}</p>
                </div>

                {/* URL якщо є кастомний */}
                {isCustom && (
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-white/40 font-mono truncate flex-1">{uploadedUrl.slice(0, 38)}...</span>
                    <button onClick={() => copyUrl(uploadedUrl, asset.id)} className="flex-shrink-0 text-white/40 hover:text-white transition-colors">
                      {isCopied ? <Check size={12} className="text-[#22C55E]" /> : <Copy size={12} />}
                    </button>
                  </div>
                )}

                {/* Asset ID */}
                <span className="text-[8px] font-mono text-white/20 bg-white/5 px-2 py-1 rounded truncate">{asset.id}</span>

                {/* Upload button */}
                <input ref={el => fileRefs.current[asset.id] = el} type="file"
                  accept={asset.type === 'video' ? 'video/*' : 'image/*'} className="hidden"
                  onChange={e => { if (e.target.files[0]) handleUpload(asset.id, e.target.files[0]); e.target.value = ''; }} />
                <button onClick={() => fileRefs.current[asset.id]?.click()} disabled={isUploading}
                  className="w-full h-[36px] flex items-center justify-center gap-2 bg-[#306CE5]/15 hover:bg-[#306CE5]/30 border border-[#306CE5]/30 rounded-xl text-[10px] font-bold uppercase text-[#4D85F7] transition-all disabled:opacity-50">
                  <Upload size={11} />
                  {isCustom ? 'Replace File' : 'Upload File'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PETITIONS TAB
// ─────────────────────────────────────────────
const PetitionsTab = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchPetitions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/petitions`);
      setPetitions(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPetitions(); }, []);

  const filtered = petitions
    .filter(p => {
      const q = search.toLowerCase();
      return p.firstName?.toLowerCase().includes(q) || p.lastName?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
    })
    .sort((a, b) => sortOrder === 'desc' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));

  const exportCSV = () => {
    const header = 'ID,First Name,Last Name,Email,Date\n';
    const rows = petitions.map(p => `${p.id},"${p.firstName}","${p.lastName}","${p.email}","${new Date(p.createdAt).toLocaleString()}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'petitions.csv';
    a.click();
  };

  const formatDate = iso => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const today = new Date().toDateString();
  const todayCount = petitions.filter(p => new Date(p.createdAt).toDateString() === today).length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: <Users size={20} />, label: 'Total Signatures', value: petitions.length, color: 'from-[#306CE5] to-[#4D85F7]' },
          { icon: <TrendingUp size={20} />, label: 'Signed Today', value: todayCount, color: 'from-[#22C55E] to-[#4ADE80]' },
          { icon: <Mail size={20} />, label: 'Unique Emails', value: new Set(petitions.map(p => p.email)).size, color: 'from-[#F59E0B] to-[#FBBF24]' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#13161B] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white`}>{stat.icon}</div>
            <div>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-[30px] font-black leading-none">{loading ? '—' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#13161B] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-[13px] font-black uppercase tracking-tight">Signatures</h2>
            <p className="text-[9px] text-white/25 uppercase tracking-widest mt-0.5">{loading ? 'Loading...' : `${filtered.length} of ${petitions.length} shown`}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[220px]">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                className="w-full h-[36px] bg-white/5 border border-white/8 rounded-lg pl-8 pr-4 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#306CE5]/50 transition-colors" />
            </div>
            <button onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
              className="h-[36px] px-3 bg-white/5 border border-white/8 rounded-lg text-[10px] font-bold uppercase text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5">
              <Calendar size={11} /> {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
            <button onClick={fetchPetitions} className="h-[36px] px-3 bg-white/5 border border-white/8 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <RefreshCw size={12} />
            </button>
            <button onClick={exportCSV} className="h-[36px] px-3 bg-[#306CE5]/20 border border-[#306CE5]/30 rounded-lg text-[10px] font-bold uppercase text-[#4D85F7] hover:bg-[#306CE5]/30 transition-all flex items-center gap-1.5">
              <Download size={11} /> CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Name', 'Email', 'Date & Time'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-white/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/3">
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-3 bg-white/5 rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-white/15 text-[11px] uppercase tracking-widest">No signatures found</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-[11px] text-white/20 font-mono">{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#306CE5] to-[#4D85F7] flex items-center justify-center text-[10px] font-black flex-shrink-0">
                          {p.firstName?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-[12px] font-medium text-white/90">{p.firstName} {p.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-[11px] text-white/50 font-mono">{p.email}</span></td>
                    <td className="px-6 py-4"><span className="text-[10px] text-white/30 font-mono">{formatDate(p.createdAt)}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-white/5 flex justify-between items-center">
            <p className="text-[9px] text-white/15 uppercase tracking-widest">Updated: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-[9px] text-white/15 uppercase tracking-widest">Gaiia Admin</p>
          </div>
        )}
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// MAIN ADMIN
// ─────────────────────────────────────────────
const TABS = [
  { id: 'petitions', label: 'Petitions', icon: <Users size={13} /> },
  { id: 'editor', label: 'Site Editor', icon: <Layout size={13} /> },
  { id: 'media', label: 'Media', icon: <Image size={13} /> },
];

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('gaiia_admin_auth') === 'true';
  });
  const [tab, setTab] = useState('petitions');

  const handleLogin = () => {
    sessionStorage.setItem('gaiia_admin_auth', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gaiia_admin_auth');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={{ fontFamily: "'Unbounded', sans-serif" }} className="min-h-screen bg-[#0D0F12] text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&display=swap');`}</style>

      {/* HEADER */}
      <div className="border-b border-white/5 sticky top-0 z-50 bg-[#0D0F12]">
        <div className="max-w-[1280px] mx-auto px-6 h-[60px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#306CE5] to-[#4D85F7] flex items-center justify-center shadow-lg shadow-[#306CE5]/30">
              <span className="text-[11px] font-black">G</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[12px] font-black uppercase tracking-tight leading-none">Gaiia</p>
              <p className="text-[8px] text-white/25 uppercase tracking-[0.15em]">Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/4 rounded-xl p-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                  tab === t.id ? 'bg-[#306CE5] text-white shadow-lg shadow-[#306CE5]/30' : 'text-white/35 hover:text-white hover:bg-white/5'
                }`}>
                {t.icon}
                <span className="hidden sm:block">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
              <span className="text-[9px] text-white/25 uppercase tracking-widest hidden sm:block">Live</span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase text-white/40 hover:text-white transition-all">
              <Lock size={11} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-[20px] font-black uppercase tracking-tight">
            {tab === 'petitions' && 'Petition Signatures'}
            {tab === 'editor' && 'Site Editor'}
            {tab === 'media' && 'Media Assets'}
          </h1>
          <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">
            {tab === 'petitions' && 'View and export all petition signatures'}
            {tab === 'editor' && 'Edit any text or link on the website'}
            {tab === 'media' && 'Upload and replace images & videos on the site'}
          </p>
        </div>

        {tab === 'petitions' && <PetitionsTab />}
        {tab === 'editor' && <SiteEditor />}
        {tab === 'media' && <MediaManager />}
      </div>
    </div>
  );
}