import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Wind, Zap, Clock, Feather, Building2, Check } from 'lucide-react';

import happeningBg from './assets/happening_bg.png';
import unLogo from './assets/un_logo.png';
import damageMap from './assets/damage_map.png';
import petitionAboutImage from './assets/petition-about-image.jpg';
import petitionAboutVideo from './assets/petition-about-video.mp4';
import discordIcon from './assets/discord-icon.png';
import whatsappIcon from './assets/whatsapp-icon.png';
import heroBottleVideo from './assets/hero-bottle-video.mp4';
import explodedVideo from './assets/exploded-video.mp4';
import maskWomanVideo from './assets/mask-woman-video.mp4';
import smogCityVideo from './assets/smog-city-video.mp4';
import familyMaskVideo from './assets/family-mask-video.mp4';
import earthVideo from './assets/earth-video.mp4';

import PetitionModal from './PetitionModal';

// ─────────────────────────────────────────────
// CONTENT HOOK
// ─────────────────────────────────────────────
const useContent = () => {
  const [content, setContent] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/api/content')
      .then(r => r.json())
      .then(data => {
        const obj = {};
        data.forEach(item => { obj[item.id] = item.value; });
        setContent(obj);
      })
      .catch(() => {});
  }, []);

  const c = (id, fallback = '') => content[id] || fallback;
  const media = (id, localFallback) => content[id] || localFallback;

  return { c, media };
};

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@200;300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Unbounded', sans-serif; overflow-x: hidden; background-color: #000000; }
    .text-gradient-hero {
      background: linear-gradient(90deg, #FF745F 2.49%, #FF3829 51.68%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; text-fill-color: transparent;
    }
    .panel-red-container {
      background: linear-gradient(180deg, #6F4D4C 0%, #775352 100%);
      border: 2px solid rgba(255,255,255,0.08);
      box-shadow: 0px 4px 24px rgba(0,0,0,0.25); border-radius: 26px;
    }
    .panel-red-secondary {
      background: linear-gradient(180deg, #1D0D0B 0%, #24100E 100%);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0px 1px 1px rgba(57,21,21,0.25), 0px 2px 8px rgba(57,21,21,0.25), inset 0px 0px 0px 1px rgba(57,21,21,0.1);
      color: #FCABA6; border-radius: 18px;
    }
    .panel-red-primary {
      background: linear-gradient(180deg, #FF382A 0%, #FE6955 100%);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0px 1px 1px rgba(171,0,0,0.25), 0px 2px 8px rgba(171,0,0,0.25), inset 0px 0px 0px 1px rgba(171,0,0,0.1);
      color: #2C0E0A; border-radius: 18px;
    }
    .panel-blue-container {
      background: linear-gradient(180deg, #9CBFFE 0%, #BED5FF 100%);
      border: 2px solid #B4CEFF; border-radius: 26px;
    }
    .panel-blue-secondary {
      background: linear-gradient(180deg, #E7F0FF 0%, #FFFFFF 100%);
      border: 1px solid rgba(255,255,255,0.5); color: #3F4F6C; border-radius: 18px;
    }
    .panel-blue-primary {
      background: linear-gradient(180deg, #306CE5 0%, #4D85F7 100%);
      color: #F8FAFF; border-radius: 18px;
    }
  `}</style>
);

// ─────────────────────────────────────────────
// OPTIMIZED VIDEO
// ─────────────────────────────────────────────
const OptimizedVideo = ({ src, className }) => {
  const videoRef = useRef(null);
  const isInView = useInView(videoRef, { once: false, margin: "200px" });
  useEffect(() => {
    if (isInView && videoRef.current) videoRef.current.play().catch(() => {});
    else if (!isInView && videoRef.current) videoRef.current.pause();
  }, [isInView]);
  return <video ref={videoRef} src={src} loop muted playsInline preload="none" className={className} />;
};

// ─────────────────────────────────────────────
// FADE IN
// ─────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, direction = 'up', className = '', style = {} }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "0px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0
    },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay } }
  };
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={variants} className={className} style={style}>
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// FIX PANEL
// ─────────────────────────────────────────────
const FixPanel = ({ theme = 'red', count, buttonText, communityText, onButtonClick }) => {
  const isRed = theme === 'red';
  return (
    <div className={`flex flex-col md:flex-row items-center justify-center p-[8px] gap-[8px] md:gap-[10px] w-[370px] md:w-[593px] h-[173px] md:h-[72px] ${isRed ? 'panel-red-container' : 'panel-blue-container'} backdrop-blur-md z-50 mx-auto shadow-xl`}>
      <div className="order-1 md:order-2 flex flex-col items-center justify-center w-full md:w-[168px] h-auto md:h-[56px] gap-0 text-center">
        <span className={`text-[12px] font-bold uppercase ${isRed ? 'text-[#EAC7C5]' : 'text-[#42516D]'} block w-full`}>{count} PEOPLE</span>
        <span className={`text-[9px] font-medium uppercase ${isRed ? 'text-[#EAC7C5]' : 'text-[#42516D]'} block w-full opacity-80`}>Already signed petition</span>
      </div>
      <motion.button whileTap={{ scale: 0.95 }} onClick={onButtonClick}
        className={`order-2 md:order-3 w-[354px] md:w-[227px] h-[56px] flex items-center justify-center transition-transform hover:scale-105 ${isRed ? 'panel-red-primary' : 'panel-blue-primary'} flex-shrink-0`}>
        <span className="text-[12px] font-bold uppercase tracking-tight whitespace-nowrap text-center">{buttonText}</span>
      </motion.button>
      <motion.button whileTap={{ scale: 0.95 }} onClick={onButtonClick}
        className={`order-3 md:order-1 w-[354px] md:w-[162px] h-[56px] flex items-center justify-center transition-transform hover:scale-105 ${isRed ? 'panel-red-secondary' : 'panel-blue-secondary'} flex-shrink-0`}>
        <span className="text-[12px] font-bold uppercase tracking-tight text-center">{communityText}</span>
      </motion.button>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────
const Hero = ({ c, media }) => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
  return (
    <section className="relative w-full h-[744px] md:h-[800px] bg-black flex flex-col items-center overflow-hidden">
      <motion.div style={{ y: yText, opacity: opacityText }} className="absolute top-[48px] md:top-[110px] z-30 flex items-center gap-2">
        <Wind size={16} className="text-[#FF3729]" />
        <span className="text-[#FF3729] text-[12px] font-bold uppercase tracking-[-0.02em]">{c('hero_tag', 'Clean Air')}</span>
      </motion.div>
      <motion.div style={{ y: yText, opacity: opacityText }} className="absolute top-[88px] md:top-[157px] z-30 w-full px-4">
        <h1 className="text-gradient-hero text-[28px] md:text-[56px] font-black leading-[1.2] text-center uppercase tracking-[-0.04em] max-w-[1043px] mx-auto drop-shadow-lg">
          {c('hero_title', 'YOUR CLEAN AIR IS ALREADY BEING SOLD')}
        </h1>
      </motion.div>
      <div className="absolute top-[100px] md:top-[120px] z-10 flex justify-center w-full pointer-events-none">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="relative w-[500px] md:w-[750px] h-[750px] md:h-[950px]">
          <OptimizedVideo src={media('asset_hero_bottle_video', heroBottleVideo)} className="w-full h-full object-contain mix-blend-screen contrast-125 brightness-90 pointer-events-none select-none" />
        </motion.div>
      </div>
    </section>
  );
};

const FutureSection = ({ c, media }) => (
  <section className="relative w-full h-auto md:h-[800px] bg-black overflow-hidden py-16 md:py-0">
    <div className="relative w-full h-full max-w-[1440px] mx-auto flex flex-col md:block px-6 md:px-0">
      <div className="relative md:absolute md:left-[162px] md:top-1/2 md:-translate-y-1/2 z-20 flex flex-col items-start gap-[24px] md:gap-[40px] w-full max-w-[370px] md:max-w-none mx-auto md:mx-0 text-left">
        <FadeIn direction="right">
          <h2 className="text-[32px] md:text-[56px] font-black text-[#F6CFCD] uppercase leading-[1.1] tracking-[-0.04em]">
            {c('future_title', 'THE FUTURE OF BREATHING')}
          </h2>
        </FadeIn>
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-[24px] mt-2 md:mt-0 w-full">
          {[
            { Icon: Wind, tk: 'future_stat1_title', sk: 'future_stat1_sub', td: '100 Refills', sd: 'of fresh air' },
            { Icon: Zap, tk: 'future_stat2_title', sk: 'future_stat2_sub', td: 'Built-in Type-C', sd: 'charging port' },
            { Icon: Clock, tk: 'future_stat3_title', sk: 'future_stat3_sub', td: 'Over 45 Minutes', sd: 'of fresh air' },
          ].map(({ Icon, tk, sk, td, sd }, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.2} direction="right" className="flex flex-row items-center gap-[12px]">
              <div className="flex-shrink-0"><Icon size={24} className="text-[#F0453C]" /></div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[#F6CFCD] text-[15px] font-bold uppercase leading-[1.2] whitespace-nowrap">{c(tk, td)}</span>
                <span className="text-[#F6CFCD] text-[10px] font-medium uppercase leading-[1.4] opacity-80 whitespace-nowrap">{c(sk, sd)}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <div className="relative mt-8 md:mt-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-y-1/2 md:translate-x-[171px] md:-translate-x-1/2 z-10 pb-20 md:pb-0 flex justify-center">
        <FadeIn direction="left" delay={0.2} className="w-full flex justify-center">
          <motion.div className="w-[320px] md:w-[450px] h-[450px] md:h-[700px] pointer-events-none select-none">
            <OptimizedVideo src={media('asset_exploded_video', explodedVideo)} className="w-full h-full object-contain mix-blend-screen contrast-125 brightness-90 pointer-events-none select-none" />
          </motion.div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const HappeningNow = ({ c, media }) => (
  <section className="relative w-full h-[260px] md:h-[400px] bg-[#1B1818] overflow-hidden flex flex-col items-center justify-center">
    <div className="absolute inset-0 flex justify-center items-center w-full h-full pointer-events-none opacity-80">
      <motion.img initial={{ scale: 1 }} whileInView={{ scale: 1.05 }} transition={{ duration: 10, ease: "linear" }}
        src={media('asset_happening_bg', happeningBg)} alt="Background"
        className="w-full md:w-[496px] h-full object-cover object-center blur-[2px]" />
    </div>
    <div className="relative z-10 flex flex-col items-center justify-center gap-2 px-4 w-full text-center">
      <FadeIn className="flex flex-col items-center justify-center">
        <h2 className="text-[28px] md:text-[42px] font-black text-[#F6CFCD] uppercase leading-[1.2] tracking-[-0.02em] text-center">
          {c('happening_title', 'Is Happening Now')}
        </h2>
        <p className="text-[#F6CFCD] text-[12px] font-bold uppercase tracking-[-0.02em] opacity-90 mt-2 text-center">
          {c('happening_sub', 'What once felt distant is now evident')}
        </p>
      </FadeIn>
    </div>
  </section>
);

const UNGoalSection = ({ c, media }) => (
  <section className="w-full bg-[#F4F8FF] pt-12 md:pt-24 pb-8 flex flex-col items-center justify-center">
    <div className="w-full max-w-[1344px] flex flex-col items-center px-4 lg:px-0">
      <div className="flex flex-col items-center w-full mb-12 md:mb-16">
        <FadeIn className="flex flex-col items-center">
          <div className="w-[64px] h-[64px] flex justify-center items-center mb-1">
            <img src={media('asset_un_logo', unLogo)} alt="UN Logo" className="w-[60px] h-[50px] object-contain grayscale opacity-80" />
          </div>
          <span className="text-[#306CE5] text-[12px] font-bold uppercase tracking-[-0.02em] leading-[1.3] text-center mb-4">
            {c('un_tag', 'Sign to protect clean air')}
          </span>
        </FadeIn>
        <FadeIn delay={0.05} className="flex flex-col items-center w-full">
          <h2 className="text-[28px] md:text-[38px] lg:text-[44px] font-black text-[#2B3547] uppercase leading-[1.2] tracking-[-0.02em] text-center w-full">
            {c('un_title', 'WE CALL ON THE UNITED NATIONS TO RECOGNIZE CLEAN AIR AS A HUMAN RIGHT')}
          </h2>
          <p className="text-[#576680] text-[15px] font-normal leading-[1.4] text-center mt-4 mb-8">
            {c('un_sub', 'Not symbolic. Enforceable. Measurable.')}
          </p>
        </FadeIn>
      </div>
      <div className="flex flex-col lg:flex-row gap-[24px] w-full items-center justify-center mb-12">
        {[
          { vk: 'asset_mask_woman_video', vf: maskWomanVideo, nk: 'un_card1_num', nd: '7 MILLION', tk: 'un_card1_text', td: "DEATHS EVERY YEAR — THAT'S 13 PEOPLE DYING EVERY MINUTE FROM SOMETHING AS BASIC AS BREATHING", d: 0.15 },
          { vk: 'asset_smog_city_video', vf: smogCityVideo, nk: 'un_card2_num', nd: '99% HUMANITY', tk: 'un_card2_text', td: 'BREATHES UNSAFE AIR — WITH CHILDREN AND VULNERABLE COMMUNITIES AFFECTED MOST', d: 0.2 },
          { vk: 'asset_family_mask_video', vf: familyMaskVideo, nk: 'un_card3_num', nd: '30%', tk: 'un_card3_text', td: 'OF LUNG CANCER DEATHS WORLDWIDE ARE ATTRIBUTED TO OUTDOOR AIR POLLUTION', d: 0.25 },
        ].map((card, i) => (
          <FadeIn key={i} delay={card.d} className="relative w-full max-w-[370px] lg:max-w-none md:w-[432px] h-[480px] lg:h-[564px] rounded-[4px] flex-shrink-0 overflow-hidden group">
            <OptimizedVideo src={media(card.vk, card.vf)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute left-[16px] lg:left-[24px] bottom-[16px] lg:bottom-[24px] w-[calc(100%-32px)] lg:w-[384px] flex flex-col gap-[8px] pointer-events-none">
              <h3 className="text-[36px] font-black text-white uppercase leading-[1.4] tracking-[-0.02em]">{c(card.nk, card.nd)}</h3>
              <p className="text-[9px] lg:text-[12px] font-bold text-white uppercase leading-[1.3] tracking-[-0.02em]">{c(card.tk, card.td)}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const PetitionAboutSection = ({ c, media }) => {
  const items = [
    { k: 'about_item1', d: 'RECOGNIZING THE RIGHT TO BREATHE CLEAN AIR' },
    { k: 'about_item2', d: 'MAKING THAT RIGHT REAL, NOT JUST A PROMISE' },
    { k: 'about_item3', d: 'TURNING WORDS INTO CLEAR, MEASURABLE ACTION' },
    { k: 'about_item4', d: "PROTECTING PEOPLE'S HEALTH FROM PREVENTABLE HARM" },
    { k: 'about_item5', d: 'STOPPING THE SALE OF POLLUTION' },
  ];
  return (
    <section className="w-full bg-[#F4F8FF] py-16 lg:py-24 flex flex-col items-center justify-center">
      <div className="w-full max-w-[1116px] flex flex-col lg:flex-row items-center justify-between px-4 lg:px-0 gap-[40px] lg:gap-[80px]">
        <FadeIn direction="right" className="hidden lg:block w-full max-w-[370px] lg:max-w-[480px] flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[4px] overflow-hidden bg-black">
            <img src={media('asset_petition_about_image', petitionAboutImage)} alt="About Petition" className="w-full h-full object-cover" />
          </div>
        </FadeIn>
        <div className="flex flex-col items-center lg:items-start w-full text-center lg:text-left">
          <FadeIn direction="left" className="w-full">
            <h2 className="text-[28px] lg:text-[52px] font-black text-[#2B3547] uppercase leading-[1.1] tracking-[-0.04em] mb-8 lg:mb-12">
              {c('about_title', 'WHAT THIS PETITION IS ABOUT')}
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-[20px] w-full items-center lg:items-start">
            {items.map((item, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.05} direction="left" className="flex flex-col lg:flex-row items-center gap-[8px] lg:gap-[16px]">
                <div className="hidden lg:flex text-[#576680] flex-shrink-0 items-center justify-center w-[24px] h-[24px]">
                  <Check size={24} strokeWidth={3} />
                </div>
                <p className="text-[#2B3547] text-[11px] lg:text-[13px] font-bold uppercase leading-[1.4] tracking-wide text-center lg:text-left">
                  {c(item.k, item.d)}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HumanCost = ({ c, media }) => (
  <section className="bg-[#F4F8FF] py-12 md:pt-8 md:pb-24 px-4 w-full flex justify-center items-center overflow-hidden">
    <div className="w-full max-w-[1116px] flex flex-col gap-[24px] lg:gap-[16px] items-center lg:items-start">
      <FadeIn className="w-full max-w-[370px] lg:max-w-none h-[300px] lg:h-[500px] border-[2px] border-white/12 rounded-[4px] overflow-hidden relative bg-black flex-shrink-0">
        <OptimizedVideo src={media('asset_earth_video', earthVideo)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 pointer-events-none select-none" />
      </FadeIn>
      <div className="flex flex-col gap-[24px] lg:gap-[40px] w-full max-w-[370px] lg:max-w-none">
        <FadeIn delay={0.1} className="flex flex-col gap-[16px] lg:gap-[4px] w-full items-center lg:items-start text-center lg:text-left">
          <h2 className="text-[28px] lg:text-[56px] font-black text-[#2B3547] uppercase leading-[1.2] tracking-[-0.04em]">
            {c('humancost_title', 'The Human Cost Of Inaction')}
          </h2>
          <p className="text-[#576680] text-[15px] font-normal leading-[1.4] max-w-none">
            {c('humancost_text', 'This is not a crisis of nature alone — it is a crisis of justice and ethics. To ignore this is not neutrality — it is complicity. To recognize it is to begin the work of justice.')}
          </p>
        </FadeIn>
        <FadeIn delay={0.2} className="flex flex-col lg:flex-row gap-[24px] w-full text-left">
          <div className="flex flex-row items-center gap-[8px] flex-1">
            <div className="text-[#576680] flex-shrink-0 flex items-center justify-center w-[24px] h-[24px]"><Feather size={18} strokeWidth={2.5} /></div>
            <p className="text-[#2B3547] text-[9px] font-medium uppercase leading-[1.6]">
              {c('humancost_point1', 'Air pollution is not only a public health crisis — it is a form of environmental injustice that harms down to those least responsible for its causes.')}
            </p>
          </div>
          <div className="flex flex-row items-center gap-[8px] flex-1">
            <div className="text-[#576680] flex-shrink-0 flex items-center justify-center w-[24px] h-[24px]"><Building2 size={18} strokeWidth={2.5} /></div>
            <p className="text-[#2B3547] text-[9px] font-medium uppercase leading-[1.6]">
              {c('humancost_point2', 'While pollution does not discriminate at the source, it does at the point of impact, striking hardest where protections are weakest.')}
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const DamageSection = ({ c, media }) => (
  <section className="w-full bg-[#F4F8FF] py-12 lg:py-24 flex flex-col items-center justify-center">
    <div className="w-full max-w-[1116px] flex flex-col lg:flex-row items-center justify-between px-4 lg:px-0 gap-[32px] lg:gap-0">
      <div className="w-full max-w-[370px] lg:max-w-none h-[480px] lg:w-[432px] lg:h-[600px] rounded-[4px] overflow-hidden order-1 lg:order-2">
        <FadeIn direction="left" className="w-full h-full">
          <img src={media('asset_damage_map', damageMap)} alt="Pollution Map" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </FadeIn>
      </div>
      <div className="flex flex-col items-center lg:items-start gap-[24px] lg:gap-[40px] w-full max-w-[370px] lg:max-w-[545px] order-2 lg:order-1 text-center lg:text-left">
        <FadeIn>
          <h2 className="text-[28px] lg:text-[56px] font-black text-[#2B3547] uppercase leading-[1.2] tracking-[-0.04em]">
            {c('damage_title', 'WHEN DAMAGE CAN NO LONGER BE IGNORED')}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-[#576680] text-[13px] lg:text-[15px] font-normal leading-[1.4] w-full">
            {c('damage_text', 'Air pollution is a form of slow violence — "a violence that occurs gradually and out of sight, a violence of delayed destruction dispersed across time and space." — Rob Nixon')}
          </p>
        </FadeIn>
        <FadeIn delay={0.2} className="mt-2 lg:mt-4 flex justify-center lg:justify-start w-full">
          <a href={c('damage_btn_url', 'https://climatetrace.org')} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#2B3547] text-white px-[28px] py-[16px] rounded-[8px] text-[12px] font-black uppercase tracking-wide hover:scale-105 transition-transform duration-300">
            {c('damage_btn', 'CLIMATETRACE.ORG')}
          </a>
        </FadeIn>
      </div>
    </div>
  </section>
);

const SolutionSection = ({ c, media }) => (
  <section className="w-full bg-[#F4F8FF] pt-12 pb-[140px] lg:pt-24 lg:pb-24 flex flex-col items-center justify-center">
    <div className="w-full max-w-[1116px] flex flex-col lg:flex-row items-center justify-between px-4 lg:px-0 gap-[32px] lg:gap-0">
      <div className="w-full max-w-[370px] lg:max-w-none h-[480px] lg:w-[432px] lg:h-[600px] rounded-[4px] overflow-hidden order-1 bg-black">
        <FadeIn direction="right" className="w-full h-full">
          <OptimizedVideo src={media('asset_petition_about_video', petitionAboutVideo)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </FadeIn>
      </div>
      <div className="flex flex-col items-center lg:items-start gap-[24px] lg:gap-[40px] w-full max-w-[370px] lg:max-w-[545px] order-2 text-center lg:text-left">
        <FadeIn direction="left">
          <h2 className="text-[28px] lg:text-[56px] font-black text-[#2B3547] uppercase leading-[1.1] tracking-[-0.04em]">
            {c('solution_title', "THIS DOESN'T HAVE TO STAY THIS WAY")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1} direction="left">
          <p className="text-[#576680] text-[13px] lg:text-[15px] font-normal leading-[1.4]">
            {c('solution_text', 'We believe the right to breathe clean air must be affirmed as a basic and actionable human right — protected through shared standards, public transparency, and systems of accountability.')}
          </p>
        </FadeIn>
      </div>
    </div>
  </section>
);

const Footer = React.forwardRef(({ c }, ref) => (
  <footer ref={ref} className="w-full bg-[#F4F8FF] pt-[140px] lg:pt-24 pb-6 lg:pb-8 flex justify-center items-center overflow-hidden">
    <div className="w-full max-w-[1440px] px-6 lg:px-[100px] xl:px-[162px] flex flex-col lg:flex-row justify-between items-end gap-[32px] lg:gap-0">
      <FadeIn direction="right" className="w-full lg:w-auto">
        <h2 className="text-[28px] md:text-[48px] font-black text-[#2B3547] uppercase leading-[1.1] tracking-[-0.04em] text-center lg:text-left whitespace-nowrap">
          {c('footer_title', 'JOIN THE DISCUSSION')}
        </h2>
      </FadeIn>
      <FadeIn delay={0.2} direction="left" className="w-full lg:w-auto">
        <div className="flex flex-row flex-wrap justify-center lg:justify-end items-end gap-[24px] lg:gap-[40px] mb-2">
          <a href={c('discord_url', '#')} target="_blank" rel="noopener noreferrer">
            <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-[8px] group cursor-pointer hover:-translate-y-1 transition-transform">
              <img src={discordIcon} alt="Discord" className="w-[32px] h-[32px] object-contain" />
              <span className="text-[9px] font-bold text-[#576680] uppercase tracking-wide">Discord</span>
            </motion.div>
          </a>
          <a href={c('whatsapp_url', '#')} target="_blank" rel="noopener noreferrer">
            <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-[8px] group cursor-pointer hover:-translate-y-1 transition-transform">
              <img src={whatsappIcon} alt="Whatsapp" className="w-[32px] h-[32px] object-contain" />
              <span className="text-[9px] font-bold text-[#576680] uppercase tracking-wide">Whatsapp</span>
            </motion.div>
          </a>
        </div>
      </FadeIn>
    </div>
  </footer>
));

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const { c, media } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petitionCount, setPetitionCount] = useState(1400);

  useEffect(() => {
    const interval = setInterval(() => setPetitionCount(p => p + 1), 4500);
    return () => clearInterval(interval);
  }, []);

  const formattedCount = petitionCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const lightSectionRef = useRef(null);
  const footerRef = useRef(null);
  const [isBlueTheme, setIsBlueTheme] = useState(false);

  // ── КЛЮЧОВЕ ВИПРАВЛЕННЯ ──
  // useScroll має бути завжди — НЕ всередині умови
  const { scrollY, scrollYProgress } = useScroll({
    target: lightSectionRef,
    offset: ["start end", "start start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 1],
    [window.innerWidth < 768 ? "30px" : "60px", "0px"]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (lightSectionRef.current) {
        const rect = lightSectionRef.current.getBoundingClientRect();
        setIsBlueTheme(rect.top < window.innerHeight * 0.8);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const panelY = useTransform(scrollY, () => {
    if (!footerRef.current) return 0;
    const footerTop = footerRef.current.getBoundingClientRect().top;
    const isMobile = window.innerWidth < 768;
    const panelHeight = isMobile ? 173 : 72;
    const panelCenterY = window.innerHeight - 24 - panelHeight / 2;
    return panelCenterY > footerTop ? footerTop - panelCenterY : 0;
  });

  return (
    <div className="antialiased overflow-x-hidden bg-black">
      <GlobalStyles />

      <Hero c={c} media={media} />
      <FutureSection c={c} media={media} />
      <HappeningNow c={c} media={media} />

      {/* ── АНІМОВАНИЙ ПЕРЕХІД З ТЕМНОЇ НА БІЛУ ── */}
      <div className="w-full bg-[#1B1818]">
        <motion.div
          ref={lightSectionRef}
          style={{
            scale,
            borderRadius,
            transformOrigin: "top center",
            overflow: "hidden",
            backgroundColor: "#F4F8FF"
          }}
          className="relative w-full z-40 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
        >
          <UNGoalSection c={c} media={media} />
          <PetitionAboutSection c={c} media={media} />
          <HumanCost c={c} media={media} />
          <DamageSection c={c} media={media} />
          <SolutionSection c={c} media={media} />
          <Footer ref={footerRef} c={c} />
        </motion.div>
      </div>

      {/* ── ФІКСОВАНА ПАНЕЛЬ ВНИЗУ ── */}
      <motion.div
        className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-50 w-[370px] md:w-[593px] h-[173px] md:h-[72px] pointer-events-none flex justify-center items-center scale-90 md:scale-100 origin-bottom"
        style={{ y: panelY }}
      >
        <motion.div animate={{ opacity: isBlueTheme ? 0 : 1 }} transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`absolute inset-0 flex justify-center w-full ${!isBlueTheme ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <FixPanel theme="red" count={formattedCount}
            buttonText={c('panel_btn_red', "I DON'T WANT TO BUY THIS")}
            communityText={c('panel_community_btn', 'Our Community')}
            onButtonClick={() => setIsModalOpen(true)} />
        </motion.div>
        <motion.div animate={{ opacity: isBlueTheme ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`absolute inset-0 flex justify-center w-full ${isBlueTheme ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <FixPanel theme="blue" count={formattedCount}
            buttonText={c('panel_btn_blue', 'SIGN THE PETITION')}
            communityText={c('panel_community_btn', 'Our Community')}
            onButtonClick={() => setIsModalOpen(true)} />
        </motion.div>
      </motion.div>

      <PetitionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}