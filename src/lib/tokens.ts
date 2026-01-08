import { randomBytes } from 'crypto'

/**
 * Generate a secure public token for customer portal access
 * Uses 16 bytes (128 bits) of entropy, encoded as 32-char hex string
 */
export function generatePublicToken(): string {
  return randomBytes(16).toString('hex')
}

/**
 * Validate a public token format
 * Must be a 32-character hex string
 */
export function isValidToken(token: string): boolean {
  return /^[a-f0-9]{32}$/i.test(token)
}

/**
 * Generate a shareable URL for a project
 */
export function getPublicUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  return `${baseUrl}/view/${token}`
}
