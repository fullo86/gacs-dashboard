import {
  Section,
  Text,
  Button,
} from "@react-email/components";
import BaseLayout from "..";

export default function ActivationEmail({ name, activationLink }) {
  return (
    <BaseLayout>
      <Section>
        <Text>Halo {name},</Text>
        <Text>
          Terima kasih telah mendaftar.  
          Silakan klik tombol di bawah untuk mengaktifkan akun Anda.
        </Text>

        <Button
          href={activationLink}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "4px",
          }}
        >
          Aktivasi Akun
        </Button>

        <Text style={{ fontSize: "12px", color: "#666", marginTop: "16px" }}>
          Link ini berlaku selama 24 jam.
        </Text>
      </Section>
    </BaseLayout>
  );
}
