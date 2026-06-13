"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface WelcomeHeaderProps {
  name: string
}

export function WelcomeHeader({ name }: WelcomeHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-14 h-14 bg-[#f5c542] text-[#1d1d1f] text-lg font-semibold border-2 border-white shadow-sm">
        <AvatarFallback>{name ? name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-[#8a8a8a]">Welcome back,</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          {name || "Dreamer"}
        </h1>
      </div>
    </div>
  )
}
