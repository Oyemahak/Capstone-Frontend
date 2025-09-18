export default function SectionTitle({ eyebrow, title, centered=false, align="center" }) {
  const classes = centered ? "text-center" : (align === "left" ? "" : "text-center");
  return (
    <div className={`mb-8 ${classes}`}>
      {eyebrow && <div className="text-primary text-xs tracking-widest font-black uppercase">{eyebrow}</div>}
      {title && <h2 className="text-3xl md:text-4xl font-black mt-1">{title}</h2>}
    </div>
  );
}