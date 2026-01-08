import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface ContractSignedEmailProps {
  contractorName: string;
  customerName: string;
  projectName: string;
  signedAt: string;
  dashboardUrl?: string;
}

export default function ContractSignedEmail({
  contractorName = 'Jason',
  customerName = 'John Smith',
  projectName = 'Living Room Refinishing',
  signedAt = new Date().toISOString(),
  dashboardUrl = 'https://tary.app/projects',
}: ContractSignedEmailProps) {
  const formattedDate = new Date(signedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Preview>🎉 {customerName} just signed your contract!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={emojiStyle}>🎉</Text>
            <Heading style={h1}>Contract Signed!</Heading>
          </Section>

          {/* Content */}
          <Section style={section}>
            <Text style={text}>Hi {contractorName},</Text>
            <Text style={text}>
              Great news! <strong>{customerName}</strong> has just signed the
              contract for:
            </Text>
            <Section style={projectBox}>
              <Text style={projectNameStyle}>{projectName}</Text>
              <Text style={signedDateStyle}>Signed on {formattedDate}</Text>
            </Section>
            <Text style={text}>
              The project status has been automatically updated to{' '}
              <strong>Approved</strong>. You can now proceed with scheduling and
              starting the work.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={button} href={dashboardUrl}>
              View Project Details
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from Tary.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
};

const header = {
  padding: '40px 24px',
  backgroundColor: '#059669',
  textAlign: 'center' as const,
};

const emojiStyle = {
  fontSize: '48px',
  margin: '0 0 16px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
  lineHeight: '1.3',
};

const section = {
  padding: '32px 24px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const projectBox = {
  backgroundColor: '#f0fdf4',
  padding: '20px',
  borderRadius: '8px',
  borderLeft: '4px solid #059669',
  margin: '24px 0',
};

const projectNameStyle = {
  color: '#166534',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const signedDateStyle = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const ctaSection = {
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#059669',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 32px',
  display: 'inline-block',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};
