import Link from "next/link";
import ThemeToggle from "@/components/navigation/ThemeToggle";
import Workbench from "@/components/workbench/Workbench";
export default function Page() {
  return <><header className="border-b border-line bg-surface"><nav aria-label="App" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
    <div className="flex items-center gap-6"><Link href="/" className="font-serif text-xl font-semibold">VeriDoc</Link><span className="hidden gap-5 text-sm text-mute sm:flex"><span>Documents</span><span>Verifications</span><span>Settings</span></span></div>
    <div className="flex items-center gap-2"><ThemeToggle /><Link href="/workbench" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white dark:text-bg">New verification</Link></div></nav></header><main><Workbench /></main></>;
}
