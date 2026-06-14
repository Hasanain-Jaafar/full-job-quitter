"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { Milestone } from "@/lib/milestones/actions"

interface MilestoneMiniListProps {
  milestones: Milestone[]
  compact?: boolean
}

export function MilestoneMiniList({ milestones, compact = false }: MilestoneMiniListProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {milestones.slice(0, compact ? 3 : 4).map((milestone, index) => (
        <motion.div
          key={milestone.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3"
        >
          {milestone.status === "completed" ? (
            <div className={`rounded-full bg-[#34c759]/10 flex items-center justify-center mt-0.5 ${compact ? "w-4 h-4" : "w-5 h-5"}`}>
              <Check size={compact ? 10 : 12} strokeWidth={2} className="text-[#34c759]" />
            </div>
          ) : (
            <div className={`rounded-full border-2 border-[#e8e0cc] mt-0.5 ${compact ? "w-4 h-4" : "w-5 h-5"}`} />
          )}
          <div className="flex-1">
            <p
              className={`font-medium ${
                milestone.status === "completed"
                  ? "text-[#8a8a8a] line-through"
                  : "text-[#1d1d1f]"
              } ${compact ? "text-xs" : "text-sm"}`}
            >
              {milestone.title}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
