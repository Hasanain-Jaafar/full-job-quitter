"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { Milestone } from "@/lib/milestones/actions"

interface MilestoneMiniListProps {
  milestones: Milestone[]
}

export function MilestoneMiniList({ milestones }: MilestoneMiniListProps) {
  return (
    <div className="space-y-3">
      {milestones.slice(0, 4).map((milestone, index) => (
        <motion.div
          key={milestone.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3"
        >
          {milestone.status === "completed" ? (
            <div className="w-5 h-5 rounded-full bg-[#34c759]/10 flex items-center justify-center mt-0.5">
              <Check size={12} strokeWidth={2} className="text-[#34c759]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-[#e8e0cc] mt-0.5" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                milestone.status === "completed"
                  ? "text-[#8a8a8a] line-through"
                  : "text-[#1d1d1f]"
              }`}
            >
              {milestone.title}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
