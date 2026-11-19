'use client';

import { whatsappLink } from '../lib/config';
import { track } from '../lib/analytics';

import { useState, createContext, useContext, ReactNode } from 'react';

interface ConciergeContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ConciergeContext = createContext<ConciergeContextType | undefined>(undefined);

export function ConciergeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ConciergeContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ConciergeContext.Provider>
  );
}

export function useConcierge() {
  const context = useContext(ConciergeContext);
  if (!context) throw new Error('useConcierge must be used within a ConciergeProvider');
  return context;
}

// Trigger Button to place anywhere in your layout or header
export function ConciergeTrigger({ className = 'text-[10px] uppercase tracking-[0.3em] hover:text-mfn-nude transition-colors' }: { className?: string }) {
  const { setIsOpen } = useConcierge();

  return (
    <button 
      onClick={() => setIsOpen(true)}
      className={className}
    >
      Concierge
    </button>
  );
}

// Modal Content Component
export function ConciergeModal() {
  const { isOpen, setIsOpen } = useConcierge();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'Virtual Bridal Styling',
    preferredDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hand the request to the concierge on WhatsApp (needs NEXT_PUBLIC_WHATSAPP_NUMBER)
    const link = whatsappLink(
      `Hello MyFirstNight, I'd like to book: ${formData.serviceType}.\nName: ${formData.name}\nPhone: ${formData.phone}\nPreferred date: ${formData.preferredDate}`
    );
    track('lead');
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-mfn-silk text-mfn-midnight border border-mfn-midnight/10 p-8 md:p-14 rounded-sm shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
          className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.3em] hover:text-mfn-nude transition-colors"
        >
          Close [✕]
        </button>

        {isSubmitted ? (
          <div className="text-center py-10">
            <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-nude mb-3 block">White Glove Service</span>
            <h3 className="text-3xl font-serif font-light mb-4">Request Received</h3>
            <p className="text-xs font-light text-mfn-midnight/70 leading-relaxed mb-8">
              Thank you, {formData.name}. Our senior bridal consultant will connect with you via encrypted WhatsApp at your requested time to curate your private session.
            </p>
            <button
              onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
              className="bg-mfn-midnight text-mfn-silk px-8 py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-charcoal transition-colors"
            >
              Return to Archive
            </button>
          </div>
        ) : (
          <div>
            <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-nude mb-2 block">Private Appointments</span>
            <h2 className="text-3xl font-serif font-light mb-4">Book a Styling Concierge</h2>
            <p className="text-xs font-light text-mfn-midnight/70 leading-relaxed mb-8">
              Select your preferred service below for tailored sizing, custom trousseau curations, or anniversary gift box consultations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] mb-2 text-mfn-midnight/70">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-mfn-midnight/20 py-3 text-xs tracking-wider text-mfn-midnight placeholder:text-mfn-midnight/30 focus:outline-none focus:border-mfn-midnight transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] mb-2 text-mfn-midnight/70">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-mfn-midnight/20 py-3 text-xs tracking-wider text-mfn-midnight placeholder:text-mfn-midnight/30 focus:outline-none focus:border-mfn-midnight transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] mb-2 text-mfn-midnight/70">Service Type</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full bg-transparent border-b border-mfn-midnight/20 py-3 text-xs uppercase tracking-wider text-mfn-midnight focus:outline-none cursor-pointer"
                  >
                    <option value="Virtual Bridal Styling" className="bg-mfn-silk">Virtual Bridal Styling</option>
                    <option value="Trousseau Curation" className="bg-mfn-silk">Trousseau Curation</option>
                    <option value="Anniversary Gift Box Consultation" className="bg-mfn-silk">Anniversary Gift Box Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] mb-2 text-mfn-midnight/70">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-transparent border-b border-mfn-midnight/20 py-3 text-xs tracking-wider text-mfn-midnight focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-mfn-midnight text-mfn-silk py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-charcoal transition-colors shadow-lg cursor-pointer"
              >
                Confirm Appointment Request
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}