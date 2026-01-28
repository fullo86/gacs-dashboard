"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import dayjs from "dayjs";
import axios from "axios";

export default function PaymentStatusPage() {
  const { trxId } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expiryTime, setExpiryTime] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`/api/transaction/${trxId}`);
      const data = res.data.data;
      if (data && res.data.success && data.Detail_Transaction) {
        setDetail(data.Detail_Transaction);
        setStatus(data.Detail_Transaction.transaction_status || "pending");
      }
    } catch (error) {
      console.error("Failed to fetch payment status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      if (status === "pending") fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (detail?.expiry_time) {
      const diff = dayjs(detail.expiry_time).diff(dayjs(), "second");
      setExpiryTime(diff > 0 ? diff : 0);
    }
  }, [detail]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 animate-pulse">
        <p className="text-gray-400 text-lg">Loading payment status...</p>
      </div>
    );
  }

  const renderStatusBadge = () => {
    const statusMap = {
      pending: { color: "bg-yellow-500", icon: "⏳", text: "Waiting Payment" },
      paid: { color: "bg-green-500", icon: "✅", text: "Payment Successful" },
      expired: { color: "bg-red-500", icon: "❌", text: "Payment Expired" },
      failed: { color: "bg-red-500", icon: "⚠️", text: "Payment Failed" },
    };
    const s = statusMap[status] || statusMap.pending;
    return (
      <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-lg ${s.color}`}>
        {s.icon} {s.text}
      </span>
    );
  };

  const renderPaymentCard = () => {
    if (!detail) return null;
    const baseClasses = "p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow flex flex-col items-center gap-4 w-full";

    switch (detail.payment_type) {
      case "bca":
      case "bni":
      case "permata":
      case "otherbank":
      case "bank_transfer":
        return (
          <div className={baseClasses}>
            <p className="text-lg text-gray-500 dark:text-gray-400">Virtual Account</p>
            <p className="font-mono text-3xl text-gray-900 dark:text-white font-bold">{detail.va_number}</p>
            <p className="uppercase text-gray-600 dark:text-gray-300 text-lg">{detail.bank == "otherbank" ? "PERMATA" : detail.bank}</p>
          </div>
        );
      case "qris":
        return (
          <div className={baseClasses}>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">Scan QRIS to pay</p>
            <img src={detail.pdf_url} alt="QRIS" className="mx-auto max-w-[300px] rounded-md shadow-lg" />
          </div>
        );
      case "gopay":
        return (
          <div className={baseClasses}>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">Pay with GoPay</p>
            <img src={detail.gopay_url} alt="GoPay" className="mx-auto max-w-[300px] rounded-md shadow-lg" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-6 py-12">
      <div className="w-full max-w-5xl grid gap-12">

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center">Payment Status</h1>
          <div className="text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">Order ID</p>
            <p className="font-mono text-3xl text-gray-900 dark:text-white break-all">{detail.order_id}</p>
            <button
              onClick={() => navigator.clipboard.writeText(detail.order_id)}
              className="mt-4 text-sm px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Copy Order ID
            </button>
          </div>
          <div className="flex justify-center mt-6">{renderStatusBadge()}</div>
        </div>

        {status === "pending" && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 grid md:grid-cols-2 gap-12 items-center">
            {renderPaymentCard()}
            <div className="flex flex-col items-center justify-center gap-6">
              {expiryTime !== null && expiryTime > 0 && (
                <>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Payment Expiry Countdown</p>
                  <CountdownCircleTimer
                    isPlaying
                    duration={expiryTime}
                    size={180}
                    strokeWidth={8}
                    colors={["#facc15", "#f97316", "#ef4444"]}
                    onComplete={() => router.push(`/payment/expired/${trxId}`)}
                  >
                    {({ remainingTime }) => (
                      <span className="text-gray-900 dark:text-white font-bold text-2xl">{remainingTime}s</span>
                    )}
                  </CountdownCircleTimer>
                </>
              )}
              <button
                onClick={fetchStatus}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg"
              >
                Refresh Status
              </button>
            </div>
          </div>
        )}

        {status !== "pending" && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-6">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {status === "paid" && "✅ Payment Successful"}
              {status === "expired" && "❌ Payment Expired"}
              {status === "failed" && "⚠️ Payment Failed"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
