import {
  Section,
  Text,
  Button,
  Container,
} from "@react-email/components";
import BaseLayout from "..";

export default function ActivationEmail({ name, activationLink }) {
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
            Thank you for signing up! Please click the button below to activate your account and start using our services.
          </Text>

          {/* Button */}
          <Button
            href={activationLink}
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
            Activate Account
          </Button>

          {/* Note */}
          <Text style={{ fontSize: "12px", color: "#9ca3af", marginTop: "24px" }}>
            This link is valid for 24 hours.
          </Text>

          {/* Footer */}
          <Text style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>
            If you did not create this account, please ignore this email.
          </Text>
        </Container>
      </Section>
    </BaseLayout>
  );
}
