import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  title?: string;
}

export function Logo({ className = "", title = "Revnet" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 288 140"
      fill="none"
      className={cn("min-w-8", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d="M287.451 69.6339L173.138 0.0389404L150.509 58.7621L54.0338 0.0389404L0.246094 139.618L142.096 80.5446L119.35 139.618L287.451 69.6339Z"
        fill="currentColor"
      />
    </svg>
  );
}
