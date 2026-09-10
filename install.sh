#!/usr/bin/env bash
# Install wechat-publish skill for Claude Code / compatible agents.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/skills/wechat-publish"

detect_root() {
  if [[ -n "${CLAUDE_SKILLS_DIR:-}" ]]; then
    echo "$CLAUDE_SKILLS_DIR"
    return
  fi
  local candidates=(
    "$HOME/.claude/skills"
    "$HOME/.config/mimocode/skills"
  )
  for c in "${candidates[@]}"; do
    if [[ -d "$(dirname "$c")" ]]; then
      echo "$c"
      return
    fi
  done
  echo "$HOME/.claude/skills"
}

DEST_ROOT="$(detect_root)"
DEST="$DEST_ROOT/wechat-publish"

mkdir -p "$DEST_ROOT"
rm -rf "$DEST"
cp -R "$SRC" "$DEST"

if command -v node >/dev/null 2>&1; then
  node "$DEST/scripts/convert.js" --help >/dev/null
  echo "OK installed + CLI verified"
else
  echo "OK installed (warn: node not found; install Node.js >= 16)"
fi

echo "Skill path: $DEST"
echo "Trigger after new session: 转公众号 / 公众号排版 / wechat-publish"
