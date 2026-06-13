"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Calculator,
  Route,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signOut } from "@/lib/auth/actions"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/milestones", label: "Milestones", icon: Route },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/finances", label: "Finances", icon: Wallet },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white/70 backdrop-blur-xl border-r border-[#e8e0cc]"
    >
      <div className="p-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#1d1d1f]"
        >
          full-jog-quitter
        </Link>
      </div>

      <Separator className="bg-[#e8e0cc]" />

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-11 rounded-xl text-[#1d1d1f] ${
                  isActive
                    ? "bg-[#f5c542]/20 text-[#1d1d1f] hover:bg-[#f5c542]/25"
                    : "hover:bg-[#f8f1de]"
                }`}
              >
                <item.icon size={18} strokeWidth={1.75} />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 space-y-1">
        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 rounded-xl text-[#1d1d1f] hover:bg-[#f8f1de]"
          >
            <Settings size={18} strokeWidth={1.75} />
            Settings
          </Button>
        </Link>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 h-11 rounded-xl text-[#1d1d1f] hover:bg-[#f8f1de]"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sign out
          </Button>
        </form>
      </div>
    </motion.aside>
  )
}
