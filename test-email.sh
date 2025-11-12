#!/bin/bash

# Test Email Sending Script
# Usage: ./test-email.sh PROJECT_ID SESSION_COOKIE

PROJECT_ID="${1}"
SESSION_COOKIE="${2}"

if [ -z "$PROJECT_ID" ] || [ -z "$SESSION_COOKIE" ]; then
  echo "Usage: ./test-email.sh PROJECT_ID SESSION_COOKIE"
  echo ""
  echo "To get SESSION_COOKIE:"
  echo "1. Open http://localhost:3001 in browser"
  echo "2. Log in"
  echo "3. Open DevTools → Application → Cookies"
  echo "4. Copy the value of the cookie (starts with 'sb-')"
  echo ""
  echo "To get PROJECT_ID:"
  echo "1. Go to Supabase Dashboard → Table Editor → projects"
  echo "2. Copy any project ID"
  exit 1
fi

echo "Testing email send for project: $PROJECT_ID"
echo ""

curl -X POST "http://localhost:3001/api/projects/$PROJECT_ID/send-estimate" \
  -H "Content-Type: application/json" \
  -H "Cookie: $SESSION_COOKIE" \
  -v

echo ""
echo ""
echo "If you see 'success: true' above, check the customer's email!"
