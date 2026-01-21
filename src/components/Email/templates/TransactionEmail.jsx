import { Html, Body, Container, Section, Text, Button, Img, Hr } from "@react-email/components";

export default function TransactionEmail({ transaction }) {
  const {
    User,
    service,
    gross_amount,
    tax_amount,
    total_amount,
    payment_method,
    virtual_account,
    order_id,
    created_at,
    bank_name
  } = transaction;

  const formatCurrency = (amount) => `Rp ${amount.toLocaleString("id-ID")}`;

  const bankLogos = {
    bca: "/bankbca.png",
    mandiri: "/mandiri.png",
    bri: "/bankbri.png",
  };

  const bankLogoUrl = bank_name ? bankLogos[bank_name.toLowerCase()] : null;

  return (
    <Html>
      <Body style={{ margin: 0, padding: 0, backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif" }}>
        <Section style={{ padding: "20px 0" }}>
          <Container
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            {/* Header */}
            <Text style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#111827" }}>
              Hi {User.first_name} {User.last_name},
            </Text>

            <Text style={{ fontSize: "16px", lineHeight: "24px", marginBottom: "16px", color: "#374151" }}>
              Thank you for your transaction! Please complete your payment using the information below:
            </Text>

            {/* Payment Info */}
            {payment_method === "bank_transfer" && (
              <Section style={{ marginBottom: "24px" }}>
                {bankLogoUrl && (
                  <Img
                    src={bankLogoUrl}
                    alt={bank_name}
                    width={120}
                    style={{ display: "block", marginBottom: "12px" }}
                  />
                )}

                <Text style={{ fontWeight: "600", marginBottom: "4px" }}>Bank Name:</Text>
                <Text>{bank_name}</Text>

                <Text style={{ fontWeight: "600", marginTop: "12px", marginBottom: "4px" }}>Virtual Account Number:</Text>
                <Text>{virtual_account}</Text>

                <Text style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                  Please transfer the total amount to the virtual account above before the due date.
                </Text>
              </Section>
            )}

            {(payment_method === "gopay" || payment_method === "ewallet") && (
              <Section style={{ marginBottom: "24px" }}>
                <Text style={{ fontWeight: "600", marginBottom: "4px" }}>Payment Method:</Text>
                <Text>{payment_method.toUpperCase()}</Text>

                <Text style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                  Please complete your payment using your {payment_method} app.
                </Text>
              </Section>
            )}

            <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

            {/* Transaction Summary Table */}
            <Section style={{ marginBottom: "24px" }}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}>Order ID:</td>
                    <td style={{ padding: "4px 0" }}>{order_id}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}>Service:</td>
                    <td style={{ padding: "4px 0" }}>{service}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}>Transaction Date:</td>
                    <td style={{ padding: "4px 0" }}>{new Date(created_at).toLocaleString("id-ID")}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}>Amount:</td>
                    <td style={{ padding: "4px 0" }}>{formatCurrency(gross_amount)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "600", padding: "4px 0" }}>Tax / Fee (11%):</td>
                    <td style={{ padding: "4px 0" }}>{formatCurrency(tax_amount)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "700", padding: "4px 0", paddingTop: "8px" }}>Total:</td>
                    <td style={{ fontWeight: "700", padding: "4px 0", paddingTop: "8px" }}>{formatCurrency(total_amount)}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* View Transaction Button */}
            {/* <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              <Button
                href={`https://yourdomain.com/checkout/status/${order_id}`}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "14px 24px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View Transaction
              </Button>
            </Section> */}

            {/* Note */}
            <Text style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px", lineHeight: "18px" }}>
              If you did not make this transaction, please contact our support immediately.
            </Text>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}
