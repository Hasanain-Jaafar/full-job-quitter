import Link from "next/link"
import {
  Wallet,
  TrendingDown,
  
  Calendar,
  ArrowUpRight,
  Target,
  Route,
  Receipt,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { StatPill } from "@/components/dashboard/stat-pill"
import { ExpenseBarChart } from "@/components/dashboard/expense-bar-chart"
import { CircularProgress } from "@/components/dashboard/circular-progress"
import { SubscriptionLoanCard } from "@/components/dashboard/subscription-loan-card"
import { RecentExpenses } from "@/components/dashboard/recent-expenses"
import { MilestoneMiniList } from "@/components/dashboard/milestone-mini-list"
import { getFinancialGoal } from "@/lib/financial/actions"
import { getMilestones } from "@/lib/milestones/actions"
import {
  getCategories,
  getExpenses,
  getSubscriptions,
  getLoans,
} from "@/lib/finances/actions"
import { createClient } from "@/lib/supabase/server"
import { calculateRunway, formatCurrency, formatNumber } from "@/lib/calculator/utils"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const [goal, milestones, categories, expenses, subscriptions, loans] = await Promise.all([
    getFinancialGoal(),
    getMilestones(),
    getCategories(),
    getExpenses(),
    getSubscriptions(),
    getLoans(),
  ])

  const profile = userData.user
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userData.user.id)
        .single()
    : null

  const fullName = profile?.data?.full_name ?? userData.user?.email?.split("@")[0] ?? ""

  const completedMilestones = milestones.filter((m) => m.status === "completed").length
  const milestoneProgress = milestones.length > 0
    ? (completedMilestones / milestones.length) * 100
    : 0

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const totalSubscriptions = subscriptions.reduce((sum, s) => sum + Number(s.amount), 0)
  const totalLoanPayments = loans.reduce((sum, l) => sum + Number(l.monthly_payment), 0)
  const totalOutflows = totalExpenses + totalSubscriptions + totalLoanPayments

  const monthlyIncome = Number(goal?.monthly_income) || 0
  const netSavings = monthlyIncome - totalOutflows

  const expensesByCategory: Record<string, number> = {}
  expenses.forEach((expense) => {
    const categoryId = expense.category_id ?? "uncategorized"
    expensesByCategory[categoryId] = (expensesByCategory[categoryId] || 0) + Number(expense.amount)
  })

  const runway = goal
    ? calculateRunway({
        monthlyExpenses: totalOutflows || Number(goal.monthly_expenses),
        currentSavings: Number(goal.current_savings),
        monthlySavingsRate: netSavings > 0 ? netSavings : Number(goal.monthly_savings_rate),
        targetRunwayMonths: goal.target_runway_months,
      })
    : null

  const fundingProgress = goal && runway
    ? Math.min((Number(goal.current_savings) / runway.requiredSavings) * 100, 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <WelcomeHeader name={fullName} />
        <div className="flex flex-wrap gap-3">
          <StatPill label="Income" value={formatCurrency(monthlyIncome)} variant="default" />
          <StatPill label="Expenses" value={formatCurrency(totalOutflows)} variant="dark" />
          <StatPill label="Net savings" value={formatCurrency(netSavings)} variant="accent" />
          <StatPill
            label="Runway"
            value={`${formatNumber(runway?.currentRunwayMonths ?? 0, 1)} mo`}
            variant="default"
          />
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white rounded-3xl border-none shadow-sm p-6">
          <p className="text-sm text-[#8a8a8a] mb-1">Total savings</p>
          <p className="text-4xl font-semibold text-[#1d1d1f]">
            {formatCurrency(Number(goal?.current_savings) || 0)}
          </p>
          <div className="mt-4 h-1.5 bg-[#f8f1de] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f5c542] rounded-full"
              style={{ width: `${fundingProgress}%` }}
            />
          </div>
        </Card>

        <Card className="bg-white rounded-3xl border-none shadow-sm p-6">
          <p className="text-sm text-[#8a8a8a] mb-1">Freedom funded</p>
          <p className="text-4xl font-semibold text-[#1d1d1f]">
            {formatNumber(fundingProgress, 1)}%
          </p>
          <p className="text-sm text-[#8a8a8a] mt-2">
            Goal: {formatCurrency(runway?.requiredSavings ?? 0)}
          </p>
        </Card>

        <Card className="bg-white rounded-3xl border-none shadow-sm p-6">
          <p className="text-sm text-[#8a8a8a] mb-1">Months to freedom</p>
          <p className="text-4xl font-semibold text-[#1d1d1f]">
            {runway?.projectedMonthsToGoal ?? "—"}
          </p>
          <p className="text-sm text-[#8a8a8a] mt-2">
            {runway?.projectedQuitDate
              ? runway.projectedQuitDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Add your finances"}
          </p>
        </Card>

        <Card className="bg-white rounded-3xl border-none shadow-sm p-6">
          <p className="text-sm text-[#8a8a8a] mb-1">Active subscriptions</p>
          <p className="text-4xl font-semibold text-[#1d1d1f]">
            {subscriptions.length}
          </p>
          <p className="text-sm text-[#8a8a8a] mt-2">
            {formatCurrency(totalSubscriptions)}/mo
          </p>
        </Card>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Welcome / profile card */}
        <Card className="lg:col-span-4 bg-[#f5c542] rounded-3xl border-none shadow-sm overflow-hidden">
          <CardContent className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center mb-6">
                <Wallet size={32} strokeWidth={1.75} className="text-[#1d1d1f]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2">
                Your escape fund
              </h3>
              <p className="text-[#1d1d1f]/70">
                Track every dollar that brings you closer to quitting.
              </p>
            </div>
            <Link href="/finances">
              <Button className="mt-6 rounded-xl bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white">
                Manage finances
                <ArrowUpRight size={16} strokeWidth={1.75} className="ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Expense breakdown */}
        <Card className="lg:col-span-5 bg-white rounded-3xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Receipt size={18} strokeWidth={1.75} />
              Expense breakdown
            </CardTitle>
            <Link href="/finances">
              <Button variant="ghost" className="rounded-xl text-[#8a8a8a]">
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ExpenseBarChart categories={categories} expensesByCategory={expensesByCategory} />
          </CardContent>
        </Card>

        {/* Milestone progress */}
        <Card className="lg:col-span-3 bg-white rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Target size={18} strokeWidth={1.75} />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress
              value={milestoneProgress}
              label={`${completedMilestones}/${milestones.length}`}
              sublabel="completed"
            />
            <div className="w-full mt-6">
              <MilestoneMiniList milestones={milestones} />
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions & loans dark card */}
        <Card className="lg:col-span-4 bg-[#1d1d1f] rounded-3xl border-none shadow-sm">
          <CardContent className="p-6 h-full">
            <SubscriptionLoanCard subscriptions={subscriptions} loans={loans} />
          </CardContent>
        </Card>

        {/* Recent expenses */}
        <Card className="lg:col-span-4 bg-white rounded-3xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
              <TrendingDown size={18} strokeWidth={1.75} />
              Recent expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentExpenses expenses={expenses} categories={categories} />
          </CardContent>
        </Card>

        {/* Calendar / projected quit date */}
        <Card className="lg:col-span-4 bg-white rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Calendar size={18} strokeWidth={1.75} />
              Target timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[#8a8a8a]">Monthly runway target</span>
              <span className="font-semibold text-[#1d1d1f]">
                {goal?.target_runway_months ?? 0} months
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8a8a8a]">Required savings</span>
              <span className="font-semibold text-[#1d1d1f]">
                {formatCurrency(runway?.requiredSavings ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8a8a8a]">Current runway</span>
              <span className="font-semibold text-[#1d1d1f]">
                {formatNumber(runway?.currentRunwayMonths ?? 0, 1)} months
              </span>
            </div>
            <div className="h-24 bg-[#f8f1de] rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-[#8a8a8a]">Projected quit date</p>
                <p className="text-2xl font-semibold text-[#1d1d1f]">
                  {runway?.projectedQuitDate
                    ? runway.projectedQuitDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones section */}
      <Card className="bg-white rounded-3xl border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
            <Route size={18} strokeWidth={1.75} />
            Your roadmap
          </CardTitle>
          <Link href="/milestones">
            <Button variant="ghost" className="rounded-xl text-[#8a8a8a]">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {milestones.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[#8a8a8a] mb-4">
                No milestones yet. Create your roadmap to quitting.
              </p>
              <Link href="/milestones">
                <Button className="rounded-xl bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white">
                  Add milestones
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-2xl border-l-4 ${
                    milestone.status === "completed"
                      ? "bg-[#34c759]/5 border-[#34c759]"
                      : "bg-[#f8f1de] border-[#f5c542]"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      milestone.status === "completed"
                        ? "text-[#8a8a8a] line-through"
                        : "text-[#1d1d1f]"
                    }`}
                  >
                    {milestone.title}
                  </p>
                  {milestone.description && (
                    <p className="text-xs text-[#8a8a8a] mt-1">
                      {milestone.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
