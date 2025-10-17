#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "${SCRIPT_DIR}/.env.slack" ]]; then
  echo "❌ .env.slack not found. Fill in your Slack credentials first."
  echo "   Expected file: ${SCRIPT_DIR}/.env.slack"
  exit 1
fi

echo "📦 Loading Slack credentials from .env.slack"
set -a
source "${SCRIPT_DIR}/.env.slack"
set +a

if [[ -z "${SLACK_BOT_TOKEN:-}" || -z "${SLACK_SIGNING_SECRET:-}" || -z "${SLACK_APP_LEVEL_TOKEN:-}" ]]; then
  echo "❌ Missing Slack credentials. Please update .env.slack:"
  echo "   SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_LEVEL_TOKEN"
  exit 1
fi

DEFAULT_AGENT="${CREWX_DEFAULT_AGENT:-quickstart}"

echo "🚀 Starting CrewX Slack bot (agent: ${DEFAULT_AGENT})"
echo "   Press Ctrl+C to stop."

exec crewx slack --mode execute --agent "${DEFAULT_AGENT}" --log
