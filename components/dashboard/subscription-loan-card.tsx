"use client"

import { motion } from "framer-motion"
import { Repeat, Landmark, ArrowUpRight } from "lucide-react"
import type { Subscription, Loan } from "@/lib/finances/actions"
import { formatCurrency } from "@/lib/calculator/utils"

interface SubscriptionLoanCardProps {
  subscriptions: Subscription[]
  loans: Loan[]
  compact?: boolean
}

export function SubscriptionLoanCard({ subscriptions, loans, compact = false }: SubscriptionLoanCardProps) {
  const totalSubscriptions = subscriptions.reduce((sum, s) => sum + Number(s.amount), 0)
  const totalLoanRemaining = loans.reduce((sum, l) => sum + Number(l.remaining_amount), 0)
  const totalLoanPayment = loans.reduce((sum, l) => sum + Number(l.monthly_payment), 0)

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between ${compact ? "mb-4" : "mb-6"}`}>
        <h3 className={`font-semibold text-white ${compact ? "text-base" : "text-lg"}`}>Subscriptions & Loans</h3>
        <ArrowUpRight size={compact ? 16 : 18} strokeWidth={1.75} className="text-white/60" />
      </div>

      <div className={`grid grid-cols-2 ${compact ? "gap-3 mb-4" : "gap-4 mb-6"}`}>
        <div className={`bg-white/10 rounded-2xl ${compact ? "p-3" : "p-4"}`}>
          <p className={`text-white/60 mb-1 ${compact ? "text-[10px]" : "text-xs"}`}>Monthly subs</p>
          <p className={`font-semibold text-white ${compact ? "text-lg" : "text-xl"}`}>
            {formatCurrency(totalSubscriptions)}
          </p>
        </div>
        <div className={`bg-white/10 rounded-2xl ${compact ? "p-3" : "p-4"}`}>
          <p className={`text-white/60 mb-1 ${compact ? "text-[10px]" : "text-xs"}`}>Loan remaining</p>
          <p className={`font-semibold text-white ${compact ? "text-lg" : "text-xl"}`}>
            {formatCurrency(totalLoanRemaining)}
          </p>
        </div>
      </div>

      <div className={`flex-1 overflow-auto ${compact ? "space-y-3" : "space-y-4"}`}>
        {subscriptions.slice(0, compact ? 2 : 3).map((sub, index) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl bg-[#f5c542]/20 flex items-center justify-center ${compact ? "w-8 h-8" : "w-9 h-9"}`}>
                <Repeat size={compact ? 14 : 16} strokeWidth={1.75} className="text-[#f5c542]" />
              </div>
              <div>
                <p className={`font-medium text-white ${compact ? "text-xs" : "text-sm"}`}>{sub.name}</p>
                <p className={`text-white/50 ${compact ? "text-[10px]" : "text-xs"}`}>{sub.frequency}</p>
              </div>
            </div>
            <span className={`font-medium text-white ${compact ? "text-xs" : "text-sm"}`}>
              {formatCurrency(Number(sub.amount))}
            </span>
          </motion.div>
        ))}

        {loans.slice(0, compact ? 1 : 2).map((loan, index) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (subscriptions.length + index) * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl bg-white/10 flex items-center justify-center ${compact ? "w-8 h-8" : "w-9 h-9"}`}>
                <Landmark size={compact ? 14 : 16} strokeWidth={1.75} className="text-white/70" />
              </div>
              <div>
                <p className={`font-medium text-white ${compact ? "text-xs" : "text-sm"}`}>{loan.name}</p>
                <p className={`text-white/50 ${compact ? "text-[10px]" : "text-xs"}`}>{formatCurrency(Number(loan.monthly_payment))}/mo</p>
              </div>
            </div>
            <span className={`font-medium text-white ${compact ? "text-xs" : "text-sm"}`}>
              {formatCurrency(Number(loan.remaining_amount))}
            </span>
          </motion.div>
        ))}
      </div>

      <div className={`border-t border-white/10 ${compact ? "mt-4 pt-3" : "mt-6 pt-4"}`}>
        <div className={`flex items-center justify-between ${compact ? "text-xs" : "text-sm"}`}>
          <span className="text-white/60">Total monthly obligations</span>
          <span className="font-semibold text-white">
            {formatCurrency(totalSubscriptions + totalLoanPayment)}
          </span>
        </div>
      </div>
    </div>
  )
}
