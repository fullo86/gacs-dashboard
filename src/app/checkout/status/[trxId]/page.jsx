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
      if (data && data.success) {
        setStatus(data.status);
        setDetail(data);

        if (data.status === "paid") {
          router.push(`/payment/success/${trxId}`);
        } else if (data.status === "expired") {
          router.push(`/payment/expired/${trxId}`);
        }
      }
    } catch (error) {
      console.error("Failed fetch payment status", error);
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
    if (detail && detail.expiry_time) {
      const diff = dayjs(detail.expiry_time).diff(dayjs(), "second");
      setExpiryTime(diff > 0 ? diff : 0);
    }
  }, [detail]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">
          Loading payment status...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
          Status Pembayaran
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Order ID
        </p>
        <p className="font-mono text-sm text-gray-700 dark:text-gray-300 mb-6 text-center">
          {trxId}
        </p>

        {/* PENDING */}
        {status === "pending" && (
          <>
            <p className="text-center text-yellow-500 font-semibold mb-4">
              ⏳ Menunggu Pembayaran
            </p>

            {detail?.payment_type === "bank_transfer" && (
              <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Virtual Account
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {detail.va_number}
                </p>
                <p className="uppercase text-sm text-gray-600 dark:text-gray-300">
                  {detail.bank}
                </p>
              </div>
            )}

            {detail?.payment_type === "qris" && (
              <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  QRIS
                </p>
                <img
                  src={detail.qr_url}
                  alt="QRIS"
                  className="mx-auto max-w-[220px]"
                />
              </div>
            )}

            {detail?.payment_type === "gopay" && (
              <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  GoPay
                </p>
                <img
                  src={detail.gopay_url}
                  alt="GoPay"
                  className="mx-auto max-w-[220px]"
                />
              </div>
            )}

            {expiryTime !== null && expiryTime > 0 && (
              <div className="flex flex-col items-center mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Batas Waktu Pembayaran
                </p>

                <CountdownCircleTimer
                  isPlaying
                  duration={expiryTime}
                  size={120}
                  strokeWidth={6}
                  colors={["#facc15", "#f97316", "#ef4444"]}
                  colorsTime={[expiryTime, expiryTime / 2, 0]}
                  onComplete={() =>
                    router.push(`/payment/expired/${trxId}`)
                  }
                >
                  {({ remainingTime }) => (
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {remainingTime}s
                    </span>
                  )}
                </CountdownCircleTimer>
              </div>
            )}

            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              Silakan selesaikan pembayaran sebelum waktu habis.
            </p>
          </>
        )}

        {status === "paid" && (
          <p className="text-center text-green-500 font-semibold">
            ✅ Pembayaran Berhasil
          </p>
        )}

        {status === "expired" && (
          <p className="text-center text-red-500 font-semibold">
            ❌ Pembayaran Kedaluwarsa
          </p>
        )}

        {status === "failed" && (
          <p className="text-center text-red-500 font-semibold">
            ❌ Pembayaran Gagal
          </p>
        )}
      </div>
    </div>
  );
}
