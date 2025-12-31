import { Section, Text, Button } from "@react-email/components";
import BaseLayout from "..";

export default function ResetPasswordEmail({ name, resetLink }) {
  return (
    <BaseLayout>
      <Section>
        <Text>Halo {name},</Text>

        <Text>
          Kami menerima permintaan untuk mereset password akun Anda.  
          Silakan klik tombol di bawah untuk mengganti password Anda.
        </Text>

        <Button
          href={resetLink}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "4px",
          }}
        >
          Reset Password
        </Button>

        <Text style={{ fontSize: "12px", color: "#666", marginTop: "16px" }}>
          Link ini berlaku selama 1 jam.  
          Jika Anda tidak meminta reset password, abaikan email ini.
        </Text>
      </Section>
    </BaseLayout>
  );
}
