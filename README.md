# 🔴 marsOS — "Cyber Sol" Edition
> **The Most Beautiful & Clean Linux Distro Ever Seen.**
> An Arch Linux distribution fusing macOS elegance with Martian Cyber aesthetics.

[![Build marsOS Live ISO](https://github.com/OGSmackDaddy/marsos/actions/workflows/build-iso.yml/badge.svg)](https://github.com/OGSmackDaddy/marsos/actions/workflows/build-iso.yml)
[![Latest Build Artifact](https://img.shields.io/badge/Live%20ISO-Download%20(3.11%20GB)-FF2A55?style=flat&logo=archlinux)](https://github.com/OGSmackDaddy/marsos/actions/runs/37283438442)

---

## 💾 Quick Download & Flash

| Artifact | Version | Size | Direct Link |
| :--- | :--- | :--- | :--- |
| **marsOS Cyber Sol Edition** | `2026.10.05` | **3.11 GB** | [Download ISO from Actions Run #10](https://github.com/OGSmackDaddy/marsos/actions/runs/37283438442) *(Scroll to Artifacts)* |

### How to Flash:
- **Windows:** Download [Rufus](https://rufus.ie/), choose your USB flash drive, load the `.iso`, and select **DD Image mode**.
- **Cross-Platform:** Use [BalenaEtcher](https://etcher.balena.io/) or **Raspberry Pi Imager** (`Choose OS` -> `Use custom`).
- **Linux/macOS:**
  ```bash
  sudo dd if=marsos-cybersol-2026.10.05-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
  ```

---

## ⚡ The marsOS Philosophy

**marsOS** bridges the gap between the fluid, minimalist elegance of macOS and the uncompromising power, bleeding-edge performance, and rolling-release freedom of Arch Linux.

### 🌌 Visual DNA: Cyber Sol
- **Obsidian & OLED Depth**: True-black backdrops (`#070709`) and deep space frosted glass (`#0f1015cc` with Gaussian blur).
- **Martian Cyber Accents**: Electric Sol crimson (`#FF2A55`), atmospheric amber (`#FF6B00`), and neon telemetry indicators.
- **macOS Ergonomics with a Twist**:
  - **Unified Top Bar**: Native macOS-style Global Menu powered by KDE Plasma 6, with Martian status indicators, date-time, and unified Control Center.
  - **Centered Floating Glass Dock**: Frosted acrylic pill dock with parabolic magnification, active app pips, and smooth launch bounce.
  - **Martian KRunner / Spotlight**: Press `Super + Space` to summon the translucent HUD launcher for files, apps, calculations, and terminal commands.
  - **Left-Aligned Ruby Traffic Lights**: macOS window controls reimagined with Martian gem gradients (Crimson close, Solar minimize, Emerald expand).
  - **Fluid Gestures & Animations**: Buttery 120Hz/144Hz Wayland compositor with rounded corners and KWin blur.

---

## 🛠 Distro Architecture

| Component | Choice | Rationale |
| :--- | :--- | :--- |
| **Base System** | Arch Linux (Rolling Release) | Bleeding-edge packages, pacman + AUR access |
| **Kernel** | `linux-zen` | Low latency, tuned for high-performance interactive desktop use |
| **Display Server** | Wayland (`plasma-wayland-session`) | Tear-free rendering, fractional scaling, 1:1 trackpad gestures |
| **Desktop Environment** | KDE Plasma 6.2+ | Native Global Menu, lightweight Qt6 architecture, Kvantum blur |
| **Shell & Terminal** | `zsh` + Starship + `konsole` | Pre-configured Cyber Sol Martian prompt & Fastfetch telemetry |
| **Theme Engine** | Kvantum (Qt6) + Breeze-GTK | Unified dark glass styling across Qt and GTK applications |
| **Installer** | Calamares (Custom MarsOS Theme) | 1-click graphic installation with Btrfs snapshot support |
| **Audio Subsystem** | PipeWire + WirePlumber | Low-latency modern Linux audio |

---

## 🚀 Building the Live ISO

marsOS supports **two build workflows**: in the cloud via **GitHub Actions** (recommended for Windows users) and locally via **Docker / WSL2**.

### Option A: Cloud Build via GitHub Actions (Zero Local Setup)
1. Fork or push this repository to GitHub.
2. Navigate to the **Actions** tab.
3. Select **"Build marsOS ISO"** and click **"Run workflow"**.
4. GitHub Actions will provision an Arch Linux runner, build the ISO using `archiso`, compute SHA256 checksums, and publish the bootable `.iso` under GitHub Releases and Workflow Artifacts!

### Option B: Local Build via Docker (Windows / Linux / macOS)
Make sure **Docker Desktop** is running, then simply run:

```powershell
# On Windows (PowerShell):
cd build-docker
.\build.bat
```

Or on Linux / macOS:
```bash
cd build-docker
chmod +x build.sh
./build.sh
```

The resulting ISO will be generated in `dist/marsos-cyber-sol-x86_64.iso`.

### Option C: Native Arch Linux (`mkarchiso`)
If you are already running an Arch Linux system:
```bash
sudo pacman -S archiso git
sudo mkarchiso -v -w /tmp/archiso-work -o ./out ./marsos-profile
```

---

## 🖥 Live Interactive Web Simulator

marsOS includes an interactive in-browser simulator and design system preview. To experience the desktop interface right now:

```bash
cd showcase
# Open index.html in any modern browser or run a local server:
npx serve .
```

---

## 📂 Repository Structure

```
marsos/
├── .github/workflows/
│   └── build-iso.yml               # Automated GitHub Actions ISO build workflow
├── build-docker/
│   ├── Dockerfile                  # Arch Linux container with archiso tools
│   ├── build.sh                    # Containerized build script
│   └── build.bat                   # Windows one-click build script
├── marsos-profile/                 # Official archiso profile
│   ├── profiledef.sh               # ISO definition, permissions, bootloader
│   ├── packages.x86_64             # Curated package manifest
│   ├── pacman.conf                 # Pacman config with parallel downloads
│   └── airootfs/                   # Overlay filesystem
│       ├── etc/
│       │   ├── os-release          # marsOS OS identification
│       │   ├── lsb-release
│       │   ├── skel/               # Default user config (KDE Plasma 6, KWin, Dock)
│       │   └── calamares/          # Calamares graphical installer configs
│       └── usr/
│           ├── bin/                # Helper tools (marsos-welcome, marsos-cli)
│           └── share/
│               ├── backgrounds/    # Martian Cyber Sol wallpapers
│               └── plymouth/       # Plymouth boot splash theme
├── showcase/                       # Interactive live browser simulator
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

---

## 🔴 Martian Commands & Shortcuts

- `Super + Space`: Summon **Martian Spotlight (KRunner)**
- `Super + T`: Open **Konsole (Cyber Sol Terminal)**
- `Super + E`: Open **Dolphin (File Manager)**
- `Super + L`: Lock Screen (Frosted Martian Horizon)
- `Ctrl + Alt + T`: Quick Terminal
- `marsos info`: View distro metadata, kernel version, and live session stats
- `marsos update`: Synergized system update with pacman & AUR sync
- `marsos doctor`: Hardware, driver, and PipeWire health check diagnostic

---

## 📜 License
marsOS is open-source under the GPL-3.0 License. Arch Linux is a registered trademark of Levente Polyak.
