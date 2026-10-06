#!/usr/bin/env bash
# shellcheck disable=SC2034

iso_name="marsos-cybersol"
iso_label="MARSOS_$(date +%Y%m)"
iso_publisher="marsOS Project <https://github.com/marsos/marsos>"
iso_application="marsOS Cyber Sol Edition Live/Rescue Media"
iso_version="$(date +%Y.%m.%d)"
install_dir="marsos"
build_modes=('iso')
bootmodes=('bios.syslinux' 'uefi.systemd-boot')
arch="x86_64"
pacman_conf="pacman.conf"
airootfs_image_type="squashfs"
airootfs_image_tool_options=('-comp' 'zstd' '-Xcompression-level' '19')
bootstrap_tarball_compression=('zstd' '-c' '-T0' '--auto-threads=logical' '--long' '-19')
file_permissions=(
  ["/etc/shadow"]="0:0:400"
  ["/etc/gshadow"]="0:0:400"
  ["/root"]="0:0:750"
  ["/etc/sudoers.d"]="0:0:750"
  ["/etc/sudoers.d/mars"]="0:0:440"
  ["/usr/bin/marsos-welcome"]="0:0:755"
  ["/usr/bin/marsos-cli"]="0:0:755"
  ["/etc/skel/Desktop/install-marsos.desktop"]="1000:1000:755"
)
