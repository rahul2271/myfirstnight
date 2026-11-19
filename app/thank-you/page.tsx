import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="bg-mfn-silk text-mfn-midnight font-sans min-h-screen pt-52 pb-44 px-6 md:px-16 flex flex-col items-center justify-center selection:bg-mfn-nude selection:text-mfn-midnight">
      
      {/* Container */}
      <div className="max-w-3xl w-full text-center bg-white/50 backdrop-blur-md border border-mfn-midnight/10 p-12 md:p-20 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        
        {/* Subtitle Accent */}
        <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-nude mb-4 block">
          Order Confirmed ✦ Absolute Discretion Guaranteed
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight leading-tight">
          Thank you for your acquisition.
        </h1>

        {/* Elegant Note */}
        <p className="text-sm font-light text-mfn-midnight/70 leading-relaxed mb-10 max-w-xl mx-auto">
          Your trousseau selection is now being carefully prepared in our atelier. Every piece is wrapped in acid-free tissue, sealed with custom wax, and enclosed in weighted keepsake presentation boxes.
        </p>

        {/* Order Details Reference Box */}
        <div className="bg-[#F2ECE7] border border-mfn-midnight/10 p-8 mb-10 text-left rounded-sm space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60 border-b border-mfn-midnight/10 pb-3">
            <span>Status</span>
            <span className="text-mfn-midnight font-medium">Processing / Atelier Crafted</span>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60 pb-1">
            <span>Packaging Notice</span>
            <span className="text-mfn-midnight font-medium">Plain Outer Mailer (Zero Branding)</span>
          </div>
        </div>

        {/* Reassurance Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12 py-6 border-y border-mfn-midnight/10 text-[11px] font-light text-mfn-midnight/70">
          <div>
            <strong className="block text-mfn-midnight font-medium mb-1 uppercase tracking-wider text-[10px]">Email Confirmation</strong>
            Sent securely to your inbox.
          </div>
          <div>
            <strong className="block text-mfn-midnight font-medium mb-1 uppercase tracking-wider text-[10px]">Private Dispatch</strong>
            Shipped within 24–48 hours.
          </div>
          <div>
            <strong className="block text-mfn-midnight font-medium mb-1 uppercase tracking-wider text-[10px]">Concierge Access</strong>
            WhatsApp support active.
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            href="/discover"
            className="bg-mfn-midnight text-mfn-silk px-10 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-charcoal transition-colors shadow-lg"
          >
            Continue Exploring Archive
          </Link>
          <Link 
            href="/"
            className="border border-mfn-midnight/20 text-mfn-midnight px-10 py-5 text-[10px] uppercase tracking-[0.4em] hover:border-mfn-midnight transition-colors"
          >
            Return to Home
          </Link>
        </div>

      </div>

    </div>
  );
}