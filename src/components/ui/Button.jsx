export default function Button({ className = "", variant = "primary", ...props }) {
  const base = "btn " + (variant === "outline" ? "btn-outline" : "btn-primary");
  return <button className={`${base} ${className}`} {...props} />;
}