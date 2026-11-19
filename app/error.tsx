'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[80vh] pt-52 pb-32 px-6 flex flex-col items-center justify-center text-center">
      <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold mb-6">A moment, please</span>
      <h1 className="font-serif font-light text-5xl md:text-7xl mb-6 leading-none">Something slipped</h1>
      <p className="text-sm font-light text-mfn-midnight/60 max-w-md mb-12">
        We couldn’t load this page just now. Please try again, or return to the archive.
      </p>
      <div className="flex gap-8 items-center">
        <button onClick={reset} className="bg-mfn-midnight text-mfn-silk px-10 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500">
          Try again
        </button>
        <Link href="/" className="link-lux text-[10px] uppercase tracking-[0.4em]">Home</Link>
      </div>
    </div>
  );
}
