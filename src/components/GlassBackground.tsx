// Soft gradient with blurred color orbs; the glass surfaces blur whatever sits behind them
export default function GlassBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100">
      <div className="absolute -left-24 -top-24 h-[32rem] w-[32rem] rounded-full bg-indigo-400/50 blur-3xl" />
      <div className="absolute -right-16 top-1/4 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/40 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/4 h-[32rem] w-[32rem] rounded-full bg-sky-400/45 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-violet-300/40 blur-3xl" />
    </div>
  );
}
