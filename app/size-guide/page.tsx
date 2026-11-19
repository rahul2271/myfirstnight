import { PageHero } from '../../components/PageHero';
import { SizeCalculator } from '../../components/SizeCalculator';

export const metadata = { title: 'Size Guide', description: 'Measure at home and find your bra size in under a minute.' };

const steps = [
  ['Underbust', 'Wrap a soft tape snugly around your ribcage, just beneath the bust. Keep it level and breathe out.'],
  ['Fullest bust', 'Measure around the fullest part of your bust, keeping the tape level and relaxed, not pulled tight.'],
  ['Calculate', 'Your band is the underbust rounded to the nearest even number. The difference to your bust sets the cup.'],
];

export default function SizeGuidePage() {
  return (
    <>
      <PageHero eyebrow="Client Care" title="Find Your Fit" intro="Two measurements, one minute. A guide only: every piece lists its own size notes, and our concierge can confirm privately." />
      <section className="max-w-5xl mx-auto px-6 md:px-16 py-24 grid md:grid-cols-3 gap-12">
        {steps.map(([t, d], i) => (
          <div key={t}>
            <span className="font-serif italic text-mfn-gold text-4xl">0{i + 1}</span>
            <h3 className="text-[11px] uppercase tracking-[0.35em] my-3">{t}</h3>
            <p className="text-sm font-light text-mfn-midnight/65 leading-relaxed">{d}</p>
          </div>
        ))}
      </section>
      <section className="px-6 pb-16"><SizeCalculator /></section>
      <section className="max-w-2xl mx-auto px-6 pb-32 text-center">
        <p className="text-sm font-light text-mfn-midnight/60 leading-relaxed">
          Between sizes, or measuring for a bridal set? Size up in the band if you prefer comfort, and message us for custom guidance.
        </p>
      </section>
    </>
  );
}
