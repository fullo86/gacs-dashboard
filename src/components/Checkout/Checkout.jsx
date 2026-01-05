export default function Checkout({ order }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/midtrans/charge", {
        method: "POST",
        body: JSON.stringify({
          order_id: order.order_id,
          gross_amount: order.gross_amount,
          customer: order.customer,
        }),
      });

      const data = await res.json();
      setResponse(data);

      if (data.success && data.data.redirect_url) {
        // redirect user ke Midtrans payment page
        window.location.href = data.data.redirect_url;
      }
    } catch (err) {
      setResponse({ success: false, message: err.message });
    }

    setLoading(false);
  };

  return (
    <div
      className={theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}
      style={{ padding: "1.5rem", borderRadius: "8px", border: "1px solid", borderColor: theme === "light" ? "#ccc" : "#555", maxWidth: "500px" }}
    >
      <button
        onClick={toggleTheme}
        style={{ marginBottom: "1rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}
      >
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      <h2 style={{ marginBottom: "1rem" }}>Checkout</h2>

      <div style={{ marginBottom: "1rem" }}>
        <h3>Ringkasan Pesanan</h3>
        <ul>
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.name} - Rp{item.price.toLocaleString()} x {item.qty}
            </li>
          ))}
        </ul>
        <p>Total: <strong>Rp{order.gross_amount.toLocaleString()}</strong></p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          cursor: "pointer",
          backgroundColor: theme === "light" ? "#4CAF50" : "#0F9D58",
          color: "white",
          border: "none",
          borderRadius: "5px",
          width: "100%",
        }}
      >
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>

      {response && (
        <div style={{ marginTop: "1rem", padding: "0.8rem", border: "1px solid", borderColor: theme === "light" ? "#ccc" : "#555", borderRadius: "5px" }}>
          <pre style={{ fontSize: "0.9rem" }}>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
