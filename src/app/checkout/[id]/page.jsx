"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/components/ui-elements/button";

export default function CheckoutPage() {
  const { id } = useParams(); 
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get(`/api/checkout/${id}`);

        if (res.status === 404 || !res.data.data) {
          router.push("/not-found"); 
          return;
        }
        
        setTransaction(res.data.data);        
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction(); 
  }, [id]);


    const handlePay = async () => {
      if (!paymentMethod) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please Choose Payment Method First",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      try {
        setPaying(true);
        const res = await axios.post(`/api/order/${id}`, { payment_method: paymentMethod });
        
        if (res.data.success) {
          router.push(`/checkout/status/${id}`);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: err.response?.data?.message || err.message,
        });
      } finally {
        setPaying(false);
      }
    };

  if (loading || !transaction || !transaction.User) return <p>Loading transaksi...</p>;
  const tax = transaction.gross_amount * 0.11
  const total = transaction.gross_amount + tax
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-6 dark:from-slate-900 dark:to-slate-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Payment Method */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-slate-900 dark:text-gray-100 dark:ring-slate-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Payment Method</h2>

          <div className="space-y-6">
            {/* Transfer Bank */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Transfer Bank</p>
              <div className="space-y-3">
                {["bca", "bri", "mandiri"].map((bank) => (
                  <label
                    key={bank}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={bank}
                      checked={paymentMethod === bank}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="font-medium">{bank.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* E-Wallet */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">E-Wallet</p>
              <div className="space-y-3">
                {["gopay"].map((wallet) => (
                  <label
                    key={wallet}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={wallet}
                      checked={paymentMethod === wallet}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="font-medium">{wallet.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* QRIS */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">QRIS</p>
              <div className="space-y-3">
                {["qris"].map((qris) => (
                  <label
                    key={qris}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={qris}
                      checked={paymentMethod === qris}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="font-medium">{qris.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-slate-900 dark:text-gray-100 dark:ring-slate-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Order Summary</h2>
          <div className="mb-4 border-b pb-4 space-y-2">
            {/* <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">Customer</p> */}

            <div className="flex justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-100">Name:</span>
              <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                {transaction.User.first_name} {transaction.User.last_name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-100">Phone:</span>
              <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                {transaction.User.phone}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-100">Email:</span>
              <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                {transaction.User.email}
              </span>
            </div>
          </div>


          <div className="space-y-3 border-b pb-4">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Service</p>
            <div className="flex justify-between">
              <span>{transaction.service}</span>
              <span>Rp {transaction.gross_amount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax 11%</span>
              <span>Rp {tax.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>

          <Button
            label={paying ? "Processing..." : "Pay Now"}
            variant="primary"
            size="lg"
            shape="rounded"
            onClick={handlePay}
            disabled={paying}
            className={paying ? "opacity-70 cursor-not-allowed" : ""}
          />
        </div>
      </div>
    </div>
  );
}
