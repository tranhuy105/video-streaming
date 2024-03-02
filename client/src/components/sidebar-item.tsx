interface SidebarItemProps {
  children: React.ReactNode;
  label: string;
}

export const SidebarItem = ({
  children,
  label,
}: SidebarItemProps) => {
  return (
    <div className="flex items-center gap-6 px-4 py-2 hover:bg-neutral-800 w-full rounded-xl cursor-pointer transition-all duration-300">
      <div className="text-white/80">{children}</div>
      <p className="text-white/80 font-medium text-md">
        {label}
      </p>
    </div>
  );
};
