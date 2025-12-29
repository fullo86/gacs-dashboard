import { Text, Button, Section } from "@react-email/components";
import BaseLayout from "..";

export default function ResetPasswordEmail({ name, resetLink }) {
  return (
    <BaseLayout>
      <Section>
        <Text>Halo {name},</Text>
        <Text>Klik tombol di bawah untuk reset password Anda.</Text>

        <Button href={resetLink}>
          Reset Password
        </Button>
      </Section>
    </BaseLayout>
  );
}
