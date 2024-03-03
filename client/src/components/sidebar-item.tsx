import { cn } from "@/lib/utils";

interface SidebarItemProps {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  paramsLabel: string;
  currentParam: string | null;
}

export const SidebarItem = ({
  children,
  label,
  onClick,
  currentParam,
  paramsLabel,
}: SidebarItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-6 px-4 py-2 hover:bg-neutral-800 w-full rounded-xl cursor-pointer transition-all duration-300",
        currentParam === paramsLabel && "bg-neutral-800"
      )}
      onClick={onClick}
    >
      <div className="text-white/80">{children}</div>
      <p className="text-white/80 font-medium text-md">
        {label}
      </p>
    </div>
  );
};
