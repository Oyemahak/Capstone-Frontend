// src/components/layout/Container.jsx
export default function Container({ children, className = "" }) {
  return <div className={`container-edge ${className}`}>{children}</div>;
}