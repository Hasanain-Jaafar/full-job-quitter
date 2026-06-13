import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getFinancialGoal } from "@/lib/financial/actions"
import {
  getCategories,
  getExpenses,
  getSubscriptions,
  getLoans,
} from "@/lib/finances/actions"
import { FinanceManager } from "@/components/finances/finance-manager"

export default async function FinancesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect("/auth/sign-in")
  }

  const [goal, categories, expenses, subscriptions, loans] = await Promise.all([
    getFinancialGoal(),
    getCategories(),
    getExpenses(),
    getSubscriptions(),
    getLoans(),
  ])

  return (
    <FinanceManager
      goal={goal}
      categories={categories}
      expenses={expenses}
      subscriptions={subscriptions}
      loans={loans}
    />
  )
}
