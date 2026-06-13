"use client"

import { motion } from "framer-motion"
import { Repeat, Landmark, ArrowUpRight } from "lucide-react"
import type { Subscription, Loan } from "@/lib/finances/actions"
import { formatCurrency } from "@/lib/calculator/utils"

interface SubscriptionLoanCardProps {
  subscriptions: Subscription[]
  loans: Loan[]
}

export function SubscriptionLoanCard({ subscriptions, loans }: SubscriptionLoanCardProps) {
  const totalSubscriptions = subscriptions.reduce((sum, s) => sum + Number(s.amount), 0)
  const totalLoanRemaining = loans.reduce((sum, l) => sum + Number(l.remaining_amount), 0)
  const totalLoanPayment = loans.reduce((sum, l) => sum + Number(l.monthly_payment), 0)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Subscriptions & Loans</h3>
        <ArrowUpRight size={18} strokeWidth={1.75} className="text-white/60" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-xs text-white/60 mb-1">Monthly subs</p>
          <p className="text-xl font-semibold text-white">
            {formatCurrency(totalSubscriptions)}
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-xs text-white/60 mb-1">Loan remaining</p>
          <p className="text-xl font-semibold text-white">
            {formatCurrency(totalLoanRemaining)}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-auto">
        {subscriptions.slice(0, 3).map((sub, index) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f5c542]/20 flex items-center justify-center">
                <Repeat size={16} strokeWidth={1.75} className="text-[#f5c542]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{sub.name}</p>
                <p className="text-xs text-white/50">{sub.frequency}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-white">
              {formatCurrency(Number(sub.amount))}
            </span>
          </motion.div>
        ))}

        {loans.slice(0, 2).map((loan, index) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (subscriptions.length + index) * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Landmark size={16} strokeWidth={1.75} className="text-white/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{loan.name}</p>
                <p className="text-xs text-white/50">{formatCurrency(Number(loan.monthly_payment))}/mo</p>
              </div>
            </div>
            <span className="text-sm font-medium text-white">
              {formatCurrency(Number(loan.remaining_amount))}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Total monthly obligations</span>
          <span className="font-semibold text-white">
            {formatCurrency(totalSubscriptions + totalLoanPayment)}
          </span>
        </div>
      </div>
    </div>
  )
}
