import { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
}

export default function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
