"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database"

export type ExpenseCategory = Tables<"expense_categories">
export type Expense = Tables<"expenses">
export type Subscription = Tables<"subscriptions">
export type Loan = Tables<"loans">

// Categories
export async function getCategories(): Promise<ExpenseCategory[]> {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return []

  const { data } = await supabase
    .from("expense_categories")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("name")

  return data ?? []
}

export async function addCategory(data: { name: string; color: string; budget_limit: number }) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase.from("expense_categories").insert({
    user_id: userData.user.id,
    ...data,
  })

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("expense_categories")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}

// Expenses
export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return []

  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("expense_date", { ascending: false })

  return data ?? []
}

export async function addExpense(data: {
  category_id: string | null
  name: string
  amount: number
  expense_date: string
  is_recurring: boolean
}) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase.from("expenses").insert({
    user_id: userData.user.id,
    ...data,
  })

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}

// Subscriptions
export async function getSubscriptions(): Promise<Subscription[]> {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return []

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("name")

  return data ?? []
}

export async function addSubscription(data: {
  name: string
  amount: number
  frequency: "monthly" | "yearly"
  next_due_date: string
}) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase.from("subscriptions").insert({
    user_id: userData.user.id,
    ...data,
  })

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}

// Loans
export async function getLoans(): Promise<Loan[]> {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return []

  const { data } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("name")

  return data ?? []
}

export async function addLoan(data: {
  name: string
  total_amount: number
  remaining_amount: number
  monthly_payment: number
  interest_rate: number
  due_date: string
}) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase.from("loans").insert({
    user_id: userData.user.id,
    ...data,
  })

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}

export async function deleteLoan(id: string) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("loans")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) return { error: error.message }
  revalidatePath("/(app)", "layout")
  return { success: true }
}
