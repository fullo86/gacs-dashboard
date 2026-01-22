"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { plans } from "./fetch";
import { Button } from "@/components/ui-elements/button";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const router = useRouter();

  const handleChoosePlan = async (plan) => {
    try {
      setLoadingPlan(plan.name);

      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: plan.name,
          gross_amount: plan.price,
          duration: plan.duration,
        }),
      });

      const data = await res.json();

      if (data.success) {
         router.push(`/checkout/${data.data.id}`);
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi error saat membuat transaksi.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 transition-colors">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Our Service Plans
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col justify-between rounded-lg p-6 ${
              plan.highlight
                ? "bg-white dark:bg-gray-800 border-2 border-blue-500 shadow-lg"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
            } transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {plan.name}
              </h2>
              <p className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                IDR {plan.price.toLocaleString()}
              </p>
              <ul className="mb-6 space-y-2 text-gray-700 dark:text-gray-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <span className="mr-2 text-green-500">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => handleChoosePlan(plan)}
              disabled={loadingPlan === plan.name}
              variant={plan.highlight ? "primary" : "outlineDark"}
              shape="rounded"
              className="mt-auto w-full"
            >
              {loadingPlan === plan.name ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </span>
              ) : (
                "Choose Plan"
              )}
            </Button>

            {/* <button
              onClick={() => handleChoosePlan(plan)}
              disabled={loadingPlan === plan.name}
              className={`mt-auto w-full rounded-lg py-3 font-medium ${
                plan.highlight
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              } transition`}
            >
              {loadingPlan === plan.name ? "Processing..." : "Choose Plan"}
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
