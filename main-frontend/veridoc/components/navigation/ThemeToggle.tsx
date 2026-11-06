"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => { const d = !dark; setDark(d); document.documentElement.classList.toggle("dark", d); localStorage.setItem("vd-theme", d ? "dark" : "light"); };
  return <button onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className="rounded-md p-2 text-mute hover:bg-sunken hover:text-ink">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
