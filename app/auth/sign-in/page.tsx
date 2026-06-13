import { AuthForm } from "@/components/auth/auth-form"

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f8f1de]">
      <AuthForm defaultMode="sign-in" />
    </main>
  )
}
