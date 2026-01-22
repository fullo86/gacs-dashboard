"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui-elements/button";

export default function PaymentStatusPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/api/payment-status/${id}`);
        setData(res.data.data);

        const finalStatus = ["paid", "expired", "failed", "pending"];
        if (finalStatus.includes(res?.data?.data?.transaction_status.toLowerCase())) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStatus();
      interval = setInterval(fetchStatus, 5000);
    }

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!data) return null;

  const statusConfig = {
    pending: {
      title: "Waiting for Payment",
      desc: "Please complete the payment before the time runs out.",
      color:
        "border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-500 dark:bg-yellow-500/10 dark:text-yellow-400",
      icon: "⏳",
    },
    paid: {
      title: "Payment Successful",
      desc: "Payment successful and has been confirmed.",
      color:
        "border-green-400 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-500/10 dark:text-green-400",
      icon: "✅",
    },
    expired: {
      title: "Payment Expired",
      desc: "The payment time has expired.",
      color:
        "border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-500/10 dark:text-red-400",
      icon: "❌",
    },
    failed: {
      title: "Payment Failed",
      desc: "Payment failed to process.",
      color:
        "border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-500/10 dark:text-red-400",
      icon: "❌",
    },
  };

  const status =
    statusConfig[data?.transaction_status?.toLowerCase()] || {
      title: "Unknown Status",
      desc: "Payment status is unknown.",
      color:
        "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
      icon: "❔",
    };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Payment Status
      </h1>

      <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-700">
        <div
          className={`mb-8 flex items-center gap-4 rounded-xl border p-4 ${status.color}`}
        >
          <div className="text-3xl">{status.icon}</div>
          <div>
            <p className="text-lg font-semibold">{status.title}</p>
            <p className="text-sm opacity-80">{status.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Info label="Order ID" value={data.order_id} mono />
          <Info label="Payment Type" value="Transfer Bank" />
          <Info label="Bank" value={data.bank?.toUpperCase()} />
          <Info label="VA Number" value={data.va_number} mono />
          <Info label="Transaction Time" value={data.transaction_time} />
          <Info label="Status" value={data?.transaction_status?.toUpperCase()} />
        </div>

        <div className="mt-10 flex justify-end gap-3">
          {data?.transaction_status === "paid" && (
            <Button
              onClick={() => router.push("/dashboard")}
              variant="primary"
              shape="rounded"
              size="small"
              className="px-6 py-3 text-sm font-semibold"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">{label}</p>
      <p
        className={`text-sm font-semibold text-gray-900 dark:text-white ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}
