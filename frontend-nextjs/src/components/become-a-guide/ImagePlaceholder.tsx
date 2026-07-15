import { ImageIcon } from "lucide-react";

export default function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-[#F4F1E9] text-[#6E6A5C] ${className}`}
    >
      <ImageIcon size={22} strokeWidth={1.5} />
      <span className="text-[12px] font-medium">{label}</span>
    </div>
  );
}
