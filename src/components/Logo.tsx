export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4 30c4-2 8-3 14-3 6 0 9 2 14 2 8 0 14-4 28-4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M6 24c6-8 14-12 24-12 8 0 14 4 30 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="52" cy="14" r="2.5" fill="currentColor" />
    </svg>
  );
}
