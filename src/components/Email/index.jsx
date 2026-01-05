import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";

export default function BaseLayout({ children }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f4f4f4", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "24px",
            maxWidth: "600px",
          }}
        >
          {children}
          <Section style={{ marginTop: "32px" }}>
            <Text style={{ fontSize: "12px", color: "#888" }}>
              © {new Date().getFullYear()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
