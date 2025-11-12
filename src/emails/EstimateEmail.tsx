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
  Row,
  Column,
} from '@react-email/components';

interface EstimateEmailProps {
  customerName: string;
  contractorName: string;
  contractorCompany: string;
  contractorEmail: string;
  contractorPhone: string;
  projectAddress: string;
  floorType: string;
  floorSize: string;
  finish: string;
  stain?: string;
  totalSqFt: number;
  totalCost: number;
  rooms: Array<{ name: string; sqft: number }>;
  hasTreads?: boolean;
  treadsCount?: number;
  hasRisers?: boolean;
  risersCount?: number;
}

export default function EstimateEmail({
  customerName = 'John Smith',
  contractorName = 'Jason Dixon',
  contractorCompany = 'The Best Hardwood Flooring Co.',
  contractorEmail = 'jason@thebesthardwoodfloor.com',
  contractorPhone = '(555) 123-4567',
  projectAddress = '123 Main St, City, ST 12345',
  floorType = 'Red Oak',
  floorSize = '2.5"',
  finish = 'Semi-Gloss',
  stain = 'Natural',
  totalSqFt = 850,
  totalCost = 8500,
  rooms = [
    { name: 'Living Room', sqft: 350 },
    { name: 'Kitchen', sqft: 250 },
  ],
  hasTreads = false,
  treadsCount = 0,
  hasRisers = false,
  risersCount = 0,
}: EstimateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Flooring Estimate from {contractorCompany}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{contractorCompany}</Heading>
            <Text style={headerContact}>
              {contractorEmail} • {contractorPhone}
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              Thank you for the opportunity to provide an estimate for your
              hardwood flooring project. Below are the details:
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Project Address */}
          <Section style={section}>
            <Heading style={h2}>Project Location</Heading>
            <Text style={addressText}>{projectAddress}</Text>
          </Section>

          <Hr style={hr} />

          {/* Floor Specifications */}
          <Section style={section}>
            <Heading style={h2}>Floor Specifications</Heading>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Floor Type:</td>
                  <td style={valueCell}>{floorType}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Size:</td>
                  <td style={valueCell}>{floorSize}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Finish:</td>
                  <td style={valueCell}>{finish}</td>
                </tr>
                {stain && (
                  <tr>
                    <td style={labelCell}>Stain:</td>
                    <td style={valueCell}>{stain}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Measurements */}
          <Section style={section}>
            <Heading style={h2}>Measurements</Heading>

            {rooms.length > 0 && (
              <>
                <Text style={subheading}>Rooms:</Text>
                <table style={table}>
                  <tbody>
                    {rooms.map((room, index) => (
                      <tr key={index}>
                        <td style={labelCell}>{room.name}:</td>
                        <td style={valueCell}>{room.sqft} sq ft</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {(hasTreads || hasRisers) && (
              <>
                <Text style={subheading}>Stairs:</Text>
                <table style={table}>
                  <tbody>
                    {hasTreads && treadsCount > 0 && (
                      <tr>
                        <td style={labelCell}>Treads:</td>
                        <td style={valueCell}>{treadsCount}</td>
                      </tr>
                    )}
                    {hasRisers && risersCount > 0 && (
                      <tr>
                        <td style={labelCell}>Risers:</td>
                        <td style={valueCell}>{risersCount}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

            <table style={totalTable}>
              <tbody>
                <tr>
                  <td style={totalLabelCell}>Total Square Footage:</td>
                  <td style={totalValueCell}>{totalSqFt} sq ft</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Total Cost */}
          <Section style={section}>
            <table style={costTable}>
              <tbody>
                <tr>
                  <td style={costLabelCell}>Total Estimate:</td>
                  <td style={costValueCell}>
                    ${totalCost.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Call to Action */}
          <Section style={section}>
            <Text style={text}>
              This estimate is valid for 30 days. If you have any questions or
              would like to move forward with this project, please don't
              hesitate to reach out.
            </Text>
            <Text style={text}>
              I look forward to working with you!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Best regards,
              <br />
              {contractorName}
              <br />
              {contractorCompany}
            </Text>
            <Text style={footerContact}>
              {contractorEmail} • {contractorPhone}
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
};

const header = {
  padding: '32px 24px',
  backgroundColor: '#1e40af',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px',
  padding: '0',
  lineHeight: '1.3',
};

const headerContact = {
  color: '#dbeafe',
  fontSize: '14px',
  margin: '0',
  padding: '0',
};

const section = {
  padding: '24px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const h2 = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
  padding: '0',
};

const subheading = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '16px 0 8px',
};

const addressText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  color: '#6b7280',
  fontSize: '15px',
  padding: '8px 0',
  width: '40%',
};

const valueCell = {
  color: '#1f2937',
  fontSize: '15px',
  padding: '8px 0',
  fontWeight: '500',
};

const totalTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '2px solid #e5e7eb',
};

const totalLabelCell = {
  color: '#1f2937',
  fontSize: '16px',
  padding: '8px 0',
  fontWeight: '600',
};

const totalValueCell = {
  color: '#1f2937',
  fontSize: '16px',
  padding: '8px 0',
  fontWeight: '700',
  textAlign: 'right' as const,
};

const costTable = {
  width: '100%',
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderRadius: '8px',
};

const costLabelCell = {
  color: '#166534',
  fontSize: '20px',
  fontWeight: '600',
  paddingRight: '16px',
};

const costValueCell = {
  color: '#166534',
  fontSize: '28px',
  fontWeight: '700',
  textAlign: 'right' as const,
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const footerContact = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};
