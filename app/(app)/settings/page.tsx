import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/profile/actions"
import { getFinancialGoal } from "@/lib/financial/actions"
import { ProfileForm } from "@/components/settings/profile-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect("/auth/sign-in")
  }

  const [profile, goal] = await Promise.all([
    getProfile(),
    getFinancialGoal(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Settings
        </h1>
        <p className="text-[#8a8a8a] mt-1">
          Craft your identity, escape plan, and motivation.
        </p>
      </div>

      <ProfileForm
        profile={profile}
        goal={goal}
        email={data.user.email ?? ""}
        userId={data.user.id}
      />
    </div>
  )
}
