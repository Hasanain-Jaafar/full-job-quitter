"use client"

import { motion } from "framer-motion"
import type { ExpenseCategory } from "@/lib/finances/actions"
import { formatCurrency } from "@/lib/calculator/utils"

interface ExpenseBarChartProps {
  categories: ExpenseCategory[]
  expensesByCategory: Record<string, number>
}

export function ExpenseBarChart({ categories, expensesByCategory }: ExpenseBarChartProps) {
  const data = categories.map((category) => ({
    name: category.name,
    amount: expensesByCategory[category.id] || 0,
    color: category.color,
    budget: Number(category.budget_limit),
  }))

  const maxAmount = Math.max(...data.map((d) => d.amount), ...data.map((d) => d.budget), 1)

  return (
    <div className="space-y-5">
      {data.length === 0 ? (
        <p className="text-sm text-[#8a8a8a]">No expense categories yet.</p>
      ) : (
        data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#1d1d1f]">{item.name}</span>
              <span className="text-[#8a8a8a]">
                {formatCurrency(item.amount)}
                {item.budget > 0 && (
                  <span className="ml-1">/ {formatCurrency(item.budget)}</span>
                )}
              </span>
            </div>
            <div className="h-3 bg-[#f8f1de] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((item.amount / maxAmount) * 100, 100)}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                className="h-full rounded-full"
                style={{ background: item.color }}
              />
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}
