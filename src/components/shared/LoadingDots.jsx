export default function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
    </span>
  );
}
