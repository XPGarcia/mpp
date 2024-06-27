"use client"

import { CreateAccountFormData } from "@/src/accounts/components/create-account-form/create-account-form"
import { CreateBudgetFormData } from "@/src/accounts/components/create-budget-form/create-budget-form"
import { Button } from "@/src/misc"
import { OnboardingCreateAccount } from "@/src/onboarding/components/onboarding-create-account"
import { OnboardingCreateBudget } from "@/src/onboarding/components/onboarding-create-budget"
import { OnboardingIntroduction } from "@/src/onboarding/components/onboarding-introduction"
import { OnboardingReview } from "@/src/onboarding/components/onboarding-review"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { AppRoutes } from "@/src/utils/routes"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

type OnboardingSteps = "introduction" | "create-account" | "select-budget" | "review"

export default function OnboardingPage() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<OnboardingSteps>("introduction")
  const [onboardFormData, setOnboardFormData] = useState({
    account: {
      name: "Personal account",
      startingBalance: 0,
      currency: "USD" as "USD",
    },
    budget: {
      name: "Balanced",
      living: 50,
      savings: 30,
      entertainment: 20,
    },
  })

  const { mutateAsync: onboardUser } = trpc.users.onboardUser.useMutation()

  const handleCreateAccount = (data: CreateAccountFormData) => {
    setOnboardFormData((prev) => ({
      ...prev,
      account: data,
    }))
    setCurrentStep("select-budget")
  }

  const handleCreateBudget = (data: CreateBudgetFormData) => {
    setOnboardFormData((prev) => ({
      ...prev,
      budget: data,
    }))
    setCurrentStep("review")
  }

  const handleOnboardUser = async () => {
    try {
      await onboardUser(onboardFormData)
      router.push(AppRoutes.dashboard)
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
    }
  }

  return (
    <>
      {currentStep === "introduction" && <OnboardingIntroduction onContinue={() => setCurrentStep("create-account")} />}
      {currentStep === "create-account" && (
        <OnboardingCreateAccount initialValues={onboardFormData.account} onContinue={handleCreateAccount} />
      )}
      {currentStep === "select-budget" && (
        <OnboardingCreateBudget initialValues={onboardFormData.budget} onContinue={handleCreateBudget} />
      )}
      {currentStep === "review" && <OnboardingReview onContinue={handleOnboardUser} />}
    </>
  )
}
