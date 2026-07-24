export default function BandStamp({
  label,
  band,
}: {
  label: string;
  band: number;
}) {
  return (
    <div
      className="inline-flex flex-col items-center justify-center
                 border-4 border-mark text-mark rounded-full
                 w-28 h-28 -rotate-6 select-none"
      style={{ borderStyle: "double" }}
    >
      <span className="font-mono text-xs tracking-widest uppercase">
        {label}
      </span>
      <span className="font-display text-3xl font-bold leading-none mt-1">
        {band}
      </span>
    </div>
  );
}
