import { Logo } from "@/components/revnet-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";

export function Header() {
  return (
    <header className="h-[var(--header-height)] flex justify-center z-10 sticky top-0">
      <div className="w-full grid grid-cols-[1fr_2fr_1fr] items-center gap-4 px-4 lg:px-8">
        <div className="flex">
          <Link href="/">
            <Logo className="text-primary" />
          </Link>
        </div>

        <div />

        <div className="flex items-center justify-end space-x-2 md:space-x-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
