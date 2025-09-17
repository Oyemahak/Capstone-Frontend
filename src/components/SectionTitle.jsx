export default function SectionTitle({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} max-w-3xl mx-auto`}>
      {eyebrow && <div className="text-xs font-black tracking-widest text-primary uppercase">{eyebrow}</div>}
      <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">{title}</h2>
      {subtitle && <p className="mt-3 text-textSub">{subtitle}</p>}
    </div>
  );
}