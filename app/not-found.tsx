import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] pt-52 pb-32 px-6 flex flex-col items-center justify-center text-center">
      <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold mb-6">Error 404</span>
      <h1 className="font-serif font-light text-6xl md:text-8xl mb-6 leading-none">Lost in the evening</h1>
      <p className="text-sm font-light text-mfn-midnight/60 max-w-md mb-12">
        The piece you are looking for is no longer here. Let us help you find something just as beautiful.
      </p>
      <Link href="/discover" className="bg-mfn-midnight text-mfn-silk px-10 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500">
        Explore the Archive
      </Link>
    </div>
  );
}
