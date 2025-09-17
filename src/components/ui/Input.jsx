export default function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 text-textMain placeholder:text-textSub/70 focus:outline-none focus:ring-2 focus:ring-primary ${props.className || ""}`}
    />
  );
}