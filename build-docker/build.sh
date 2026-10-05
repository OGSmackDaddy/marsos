#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "    🔴 marsOS 'Cyber Sol' Live ISO Builder"
echo "=========================================================="

PROFILE_DIR="${PROFILE_DIR:-/workspace/marsos-profile}"
OUTPUT_DIR="${OUTPUT_DIR:-/workspace/dist}"
WORK_DIR="${WORK_DIR:-/tmp/archiso-work}"

if [ ! -d "$PROFILE_DIR" ]; then
    echo "[-] Error: Profile directory '$PROFILE_DIR' not found!"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"
mkdir -p "$WORK_DIR"

echo "[+] Updating pacman keyring..."
pacman-key --init || true
pacman-key --populate archlinux || true

echo "[+] Starting mkarchiso build..."
echo "    Profile: $PROFILE_DIR"
echo "    Output : $OUTPUT_DIR"
echo "    Working: $WORK_DIR"

mkarchiso -v -w "$WORK_DIR" -o "$OUTPUT_DIR" "$PROFILE_DIR"

echo "[+] Calculating SHA256 checksums..."
cd "$OUTPUT_DIR"
sha256sum *.iso > sha256sum.txt

echo "=========================================================="
echo " [✓] Build completed successfully!"
echo "     ISO image saved to: $OUTPUT_DIR"
echo "=========================================================="
ls -lh "$OUTPUT_DIR"
