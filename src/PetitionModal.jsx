import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

import unLogo from './assets/un_logo.png';
import modalBg from './assets/modal_bg.jpg';
import discordIcon from './assets/discord.png';
import whatsappIcon from './assets/whatsapp.png';
import openPetitionLogo from './assets/open-petition.png';
import avaazLogo from './assets/avaaz.png';
import changeOrgLogo from './assets/change-org.png';
import goPetitionLogo from './assets/gopetition.png';

const PetitionModal = ({ isOpen, onClose }) => {
  const [isSigned, setIsSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();

    try {
      const response = await fetch('http://localhost:3001/api/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email })
      });

      if (!response.ok) throw new Error('Server error');

      setIsSigned(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSigned(false);
      setError('');
    }, 300);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 } 
    },
    exit: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8"
        >
          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[1000px] max-h-[90vh] bg-[#F4F8FF] rounded-[24px] shadow-2xl overflow-y-auto flex flex-col items-center p-[20px] lg:p-[40px] relative"
          >
            
            <button 
              onClick={handleClose}
              className="absolute right-6 top-6 w-[32px] h-[32px] bg-[#2B3547] rounded-full flex justify-center items-center text-white hover:scale-110 shadow-md transition-all z-50"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <div className="w-full max-w-[936px] flex flex-col gap-[24px]">
              
              {/* ХЕДЕР */}
              <div className="flex flex-col lg:flex-row justify-center lg:items-center w-full gap-[16px]">
                <div className="flex flex-row items-center justify-center gap-[16px] w-full max-w-[726px]">
                  <img src={unLogo} alt="UN" className="w-[50px] lg:w-[60px] h-auto object-contain grayscale opacity-70" />
                  <h2 className="text-[11px] lg:text-[12px] font-bold text-[#2B3547] uppercase leading-[1.3] tracking-tight">
                    We call on the United Nations to recognize clean air as a universal human right — actionable, enforceable, and measurable.
                  </h2>
                </div>
              </div>

              {/* ГОЛОВНИЙ БЛОК */}
              <div className="flex flex-col lg:flex-row gap-[16px] w-full">
                
                {/* Картка 1: Форма / Успіх */}
                <div className="order-1 lg:order-2 w-full lg:w-[380px] h-[440px] bg-[#101112] rounded-[16px] p-[20px] flex flex-col relative overflow-hidden shadow-xl">
                  <AnimatePresence mode="wait">
                    {!isSigned ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-[32px] font-black text-[#E0EEFC] uppercase mb-4 leading-none">SIGN PETITION</h3>
                          <form id="petition-form" className="flex flex-col gap-3" onSubmit={handleSign}>
                            {[
                              { label: 'First Name', ref: firstNameRef, type: 'text' },
                              { label: 'Last Name', ref: lastNameRef, type: 'text' },
                              { label: 'Email', ref: emailRef, type: 'email' },
                            ].map(({ label, ref, type }) => (
                              <div key={label} className="flex flex-col gap-1">
                                <label className="text-[#E0EEFC] text-[9px] font-medium uppercase opacity-60">{label}</label>
                                <input
                                  ref={ref}
                                  required
                                  type={type}
                                  className="h-[44px] bg-white/5 border border-white/10 rounded-[12px] px-4 text-white outline-none focus:border-[#306CE5] transition-colors"
                                />
                              </div>
                            ))}

                            {error && (
                              <p className="text-red-400 text-[10px] uppercase font-medium">{error}</p>
                            )}

                            <p className="text-white/40 text-[9px] uppercase mt-1 leading-relaxed">By signing, you agree to our privacy policy.</p>
                          </form>
                        </div>

                        <button
                          type="submit"
                          form="petition-form"
                          disabled={isLoading}
                          className="w-full h-[52px] bg-gradient-to-b from-[#306CE5] to-[#4D85F7] rounded-[14px] text-white text-[13px] font-bold uppercase hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'SENDING...' : 'SIGN THE PETITION'}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 bg-[#306CE5] flex flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center mb-4">
                          <Check size={40} className="text-[#306CE5]" />
                        </div>
                        <h3 className="text-white text-[24px] font-black uppercase mb-2">Success!</h3>
                        <p className="text-white/90 text-[14px]">Thank you for your voice.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Картка 2: Картинка */}
                <div className="order-2 lg:order-1 relative w-full lg:flex-1 h-[320px] lg:h-[440px] rounded-[16px] overflow-hidden flex flex-col justify-end p-[24px] shadow-xl">
                  <img src={modalBg} alt="BG" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative z-10">
                    <p className="text-white text-[16px] mb-4 leading-snug">The UN must affirm clean air as a fundamental human right, equal to life and health.</p>
                    <button className="w-full h-[52px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[14px] text-white text-[12px] font-bold uppercase hover:bg-white/20 transition-all">
                      DOWNLOAD PETITION (PDF)
                    </button>
                  </div>
                </div>

                {/* Картка 3: Соцмережі */}
                <div className="order-3 w-full lg:w-[100px] h-auto lg:h-[440px] bg-[#FF7369] rounded-[16px] p-4 flex flex-row lg:flex-col items-center justify-center lg:justify-between gap-6 shadow-xl">
                  <h3 className="hidden lg:block text-white text-[10px] font-black uppercase text-center rotate-0">JOIN</h3>
                  <div className="flex flex-row lg:flex-col gap-8 lg:gap-6">
                    {[{ icon: discordIcon, name: 'Discord' }, { icon: whatsappIcon, name: 'Whatsapp' }].map((s) => (
                      <div key={s.name} className="flex flex-col items-center group cursor-pointer">
                        <img src={s.icon} alt={s.name} className="w-[32px] h-[32px] object-contain group-hover:scale-110 transition-transform" />
                        <span className="text-white text-[8px] font-bold mt-1 uppercase">{s.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="hidden lg:block" />
                </div>
              </div>

              {/* ФУТЕР */}
              <div className="grid grid-cols-2 lg:flex lg:flex-row justify-items-center justify-center items-center gap-y-[28px] gap-x-[16px] lg:gap-[40px] w-full mt-6 lg:mt-8">
                {[
                  { img: openPetitionLogo, text: 'OPENPETITION.EU', url: 'https://www.openpetition.eu/petition/online/petition-to-the-united-nations-make-clean-air-a-universal-human-right' },
                  { img: avaazLogo, text: 'SECURE.AVAAZ.ORG', url: 'https://secure.avaaz.org/community_petitions/en/united_nations_petition_to_the_united_nations_make_clean_air_a_universal_human_right/' },
                  { img: changeOrgLogo, text: 'CHANGE.ORG', url: 'https://www.change.org/p/petition-to-the-united-nations-make-clean-air-a-universal-human-right' },
                  { img: goPetitionLogo, text: 'GOPETITION.COM', url: 'https://gopetition.com/petitions/petition-to-the-united-nations-make-clean-air-a-universal-human-right.html' }
                ].map((partner) => (
                  <a
                    key={partner.text}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-center w-full group transition-all hover:scale-105"
                  >
                    <img src={partner.img} alt={partner.text} className="h-[24px] lg:h-[30px] object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <span className="text-[9px] lg:text-[10px] font-bold text-[#0D0D0D] uppercase tracking-wider">{partner.text}</span>
                  </a>
                ))}
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PetitionModal;