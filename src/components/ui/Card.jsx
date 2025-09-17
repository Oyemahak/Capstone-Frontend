export default function Card({ children, className = "" }) {
  return <div className={`card-surface ${className}`}>{children}</div>;
}
export function CardHeader({ children, className = "" }) {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>;
}
export function CardContent({ children, className = "" }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
export function CardTitle({ children }) {
  return <h3 className="text-lg font-extrabold">{children}</h3>;
}