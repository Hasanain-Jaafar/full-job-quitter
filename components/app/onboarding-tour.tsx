"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Route, LayoutDashboard, ArrowRight, X } from "lucide-react"

const ONBOARDING_KEY = "fjq:onboarding-completed"

interface TourStep {
  target: string
  title: string
  description: string
  icon: React.ReactNode
}

const steps: TourStep[] = [
  {
    target: 'a[href="/calculator"]',
    title: "Start here",
    description: "Calculate your freedom number and set your escape plan.",
    icon: <Calculator size={20} strokeWidth={1.75} />,
  },
  {
    target: 'a[href="/milestones"]',
    title: "Set your path",
    description: "Build milestones that keep you motivated until quit day.",
    icon: <Route size={20} strokeWidth={1.75} />,
  },
  {
    target: 'a[href="/dashboard"]',
    title: "Track everything",
    description: "Watch your savings grow and your quit date get closer.",
    icon: <LayoutDashboard size={20} strokeWidth={1.75} />,
  },
]

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const completed = localStorage.getItem(ONBOARDING_KEY)
    if (!completed) {
      setIsVisible(true)
    }
  }, [])

  const updateTargetPosition = useCallback(() => {
    if (!isVisible) return
    const step = steps[currentStep]
    const target = document.querySelector(step.target) as HTMLElement | null
    if (target) {
      setTargetRect(target.getBoundingClientRect())
    }
  }, [isVisible, currentStep])

  useEffect(() => {
    updateTargetPosition()
    window.addEventListener("resize", updateTargetPosition)
    return () => window.removeEventListener("resize", updateTargetPosition)
  }, [updateTargetPosition])

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      completeTour()
    }
  }

  function completeTour() {
    setIsVisible(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true")
    }
  }

  if (!isVisible || !targetRect) return null

  const step = steps[currentStep]
  const tooltipWidth = 280
  const gap = 16
  const tooltipLeft = targetRect.right + gap
  const tooltipTop = targetRect.top + targetRect.height / 2

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Spotlight */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: targetRect.left - 8,
          top: targetRect.top - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
        }}
      >
        <motion.div
          layoutId="tour-spotlight"
          className="w-full h-full rounded-2xl ring-2 ring-[#f5c542] ring-offset-4 ring-offset-[#f8f1de]/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-white rounded-3xl shadow-xl border border-[#e8e0cc] p-5 w-[280px] pointer-events-auto"
          style={{
            left: Math.min(tooltipLeft, window.innerWidth - tooltipWidth - 24),
            top: Math.max(24, Math.min(tooltipTop - 80, window.innerHeight - 220)),
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5c542]/20 flex items-center justify-center text-[#1d1d1f]">
              {step.icon}
            </div>
            <button
              type="button"
              onClick={completeTour}
              className="w-8 h-8 rounded-full bg-[#f8f1de] flex items-center justify-center text-[#8a8a8a] hover:text-[#1d1d1f] transition-colors"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1">{step.title}</h3>
          <p className="text-sm text-[#8a8a8a] mb-5">{step.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-[#f5c542]" : "bg-[#e8e0cc]"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={completeTour}
                className="text-sm text-[#8a8a8a] hover:text-[#1d1d1f] transition-colors"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-9 px-4 rounded-xl bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white text-sm font-medium flex items-center"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
                <ArrowRight size={14} strokeWidth={2} className="ml-1.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
