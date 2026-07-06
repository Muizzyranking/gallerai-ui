export function AuthBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-dot-grid bg-dot-grid opacity-60" />
      <div className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full bg-amber-glow blur-3xl opacity-70" />
      <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full bg-scan-glow blur-3xl opacity-80" />
    </div>
  );
}
