import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <p className="section-subtitle mb-6">Error</p>
      <div className="tifinagh text-6xl md:text-8xl mb-6">ⵓⵀⵓ</div>
      <h1 className="font-serif text-2xl md:text-3xl mb-4">Page Not Found</h1>
      <p className="text-muted-foreground text-center max-w-md mb-12">
        The word or page you&apos;re looking for doesn&apos;t exist in our dictionary yet.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn-primary">
          Dictionary
        </Link>
        <Link href="/alphabet" className="btn-secondary">
          Tifinagh Alphabet
        </Link>
      </div>
    </div>
  );
}
