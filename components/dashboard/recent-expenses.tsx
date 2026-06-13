"use client"

import { motion } from "framer-motion"
import type { Expense, ExpenseCategory } from "@/lib/finances/actions"
import { formatCurrency } from "@/lib/calculator/utils"

interface RecentExpensesProps {
  expenses: Expense[]
  categories: ExpenseCategory[]
}

export function RecentExpenses({ expenses, categories }: RecentExpensesProps) {
  const recent = expenses.slice(0, 5)

  return (
    <div className="space-y-4">
      {recent.length === 0 ? (
        <p className="text-sm text-[#8a8a8a]">No expenses recorded yet.</p>
      ) : (
        recent.map((expense, index) => {
          const category = categories.find((c) => c.id === expense.category_id)
          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${category?.color ?? "#8a8a8a"}15` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: category?.color ?? "#8a8a8a" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1d1d1f]">{expense.name}</p>
                  <p className="text-xs text-[#8a8a8a]">
                    {category?.name ?? "Uncategorized"} • {expense.expense_date}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#1d1d1f]">
                {formatCurrency(Number(expense.amount))}
              </span>
            </motion.div>
          )
        })
      )}
    </div>
  )
}
