# marsOS ISO Builder Container
FROM archlinux:latest

LABEL maintainer="marsOS Core Team"
LABEL description="Containerized archiso build environment for marsOS"

# Initialize keyring and install build tools
RUN pacman-key --init && \
    pacman-key --populate archlinux && \
    pacman -Syu --noconfirm --needed \
      archiso \
      git \
      e2fsprogs \
      dosfstools \
      squashfs-tools \
      libisoburn \
      mtools \
      lynx \
      bash \
      coreutils \
      findutils \
      sed \
      grep && \
    rm -rf /var/cache/pacman/pkg/*

WORKDIR /workspace

ENTRYPOINT ["/workspace/build-docker/build.sh"]
