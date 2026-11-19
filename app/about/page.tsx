import Link from 'next/link';
import { PageHero } from '../../components/PageHero';
import { Reveal } from '../../components/Reveal';

export const metadata = { title: 'Our Story', description: 'The philosophy behind MyFirstNight: quiet luxury, pure silk and absolute discretion.' };

const pillars = [
  ['Pure Mulberry Silk', 'Thermoregulating, hypoallergenic and exquisitely fluid against the skin.'],
  ['French Leavers Lace', 'Delicate, weightless lace finished with the precision of a French seam.'],
  ['Absolute Discretion', 'Plain outer packaging, no prices enclosed, and private concierge support.'],
];

export default function AboutPage() {
  return (
    <>
      <PageHero dark eyebrow="The House" title="Made for the Moments That Matter" intro="MyFirstNight began with a simple belief: the most intimate pieces in a woman’s wardrobe deserve the finest craft, and the most private service." />

      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <Reveal>
          <span className="text-mfn-gold text-2xl block mb-8">✧</span>
          <p className="font-serif text-3xl md:text-5xl font-light leading-[1.3]">
            Whether it is a wedding night, an anniversary, or an evening that is simply yours, we design for the quiet, unhurried moments, <span className="italic text-mfn-gold">never the loud ones.</span>
          </p>
        </Reveal>
      </section>

      <section className="border-y border-mfn-midnight/10 grid md:grid-cols-3">
        {pillars.map(([t, d], i) => (
          <Reveal key={t} delay={i * 120} className="p-12 md:p-16 md:border-r last:border-r-0 border-mfn-midnight/10">
            <span className="font-serif italic text-mfn-gold text-3xl">0{i + 1}</span>
            <h3 className="font-serif text-3xl font-light my-4">{t}</h3>
            <p className="text-sm font-light text-mfn-midnight/65 leading-relaxed">{d}</p>
          </Reveal>
        ))}
      </section>

      <section className="py-32 text-center">
        <Link href="/discover" className="bg-mfn-midnight text-mfn-silk px-12 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500">
          Explore the Archive
        </Link>
      </section>
    </>
  );
}
