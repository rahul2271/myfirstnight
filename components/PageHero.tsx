import { Reveal } from './Reveal';

export function PageHero({ eyebrow, title, intro, dark = false }: { eyebrow: string; title: string; intro?: string; dark?: boolean }) {
  return (
    <section className={`relative grain overflow-hidden pt-52 pb-24 md:pb-32 px-6 md:px-16 text-center ${dark ? 'bg-mfn-midnight text-mfn-silk' : 'bg-mfn-blush text-mfn-midnight'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,155,106,0.20),transparent_65%)]" />
      <Reveal className="relative z-10 max-w-4xl mx-auto">
        <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold block mb-6">{eyebrow}</span>
        <h1 className="font-serif font-light leading-[0.95] tracking-tight text-5xl md:text-8xl mb-8">{title}</h1>
        {intro && <p className="text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto opacity-70">{intro}</p>}
      </Reveal>
    </section>
  );
}
