import { Section, Text, Button, Container } from "@react-email/components";
import BaseLayout from "..";

export default function ResetPasswordEmail({ name, resetLink }) {
  return (
    <BaseLayout>
      <Section style={{ backgroundColor: "#f9fafb", padding: "40px 0" }}>
        <Container style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "30px",
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          {/* Header */}
          <Text style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#111827" }}>
            Hi {name},
          </Text>

          {/* Body */}
          <Text style={{ fontSize: "16px", lineHeight: "24px", marginBottom: "24px", color: "#374151" }}>
            We received a request to reset your account password.  
            Please click the button below to create a new password.
          </Text>

          {/* Button */}
          <Button
            href={resetLink}
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
            Reset Password
          </Button>

          {/* Note */}
          <Text style={{ fontSize: "12px", color: "#9ca3af", marginTop: "24px" }}>
            This link is valid for 1 hour.  
            If you did not request a password reset, please ignore this email.
          </Text>
        </Container>
      </Section>
    </BaseLayout>
  );
}
