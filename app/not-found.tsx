import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center text-charcoal">
      <div className="w-12 h-12 rounded-2xl bg-[#1F2024] text-white flex items-center justify-center font-black text-xl mb-4">
        T
      </div>
      <h1 className="text-2xl font-black">Page Not Found</h1>
      <p className="text-xs text-charcoal-muted mt-1 max-w-xs">
        The requested profile or route does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 px-5 py-2.5 rounded-full bg-[#1F2024] text-white text-xs font-semibold hover:bg-black transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
