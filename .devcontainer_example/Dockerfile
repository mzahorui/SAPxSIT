# syntax=docker/dockerfile:1
# FIX: Explicitly pin to "22-bookworm" to avoid unstable Debian Trixie (testing) updates
FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

ENV DEBIAN_FRONTEND=noninteractive

# 1. Install System Tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl wget zsh gnupg apt-transport-https software-properties-common build-essential \
    python3 python3-venv python3-pip unzip gzip tar trash-cli ripgrep universal-ctags \
    vim fd-find fzf tmux openjdk-17-jdk sqlite3 \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/* \
    && ln -s $(which fdfind) /usr/local/bin/fd

# 3. Install Cloud Foundry CLI (v8)
RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | gpg --dearmor -o /usr/share/keyrings/cli.cloudfoundry.org.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/cli.cloudfoundry.org.gpg] https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list \
    && apt-get update && apt-get install -y cf8-cli \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | bash \
    && mv $HOME/.local/bin/zoxide /usr/local/bin/

# 5. User Configuration
USER node
WORKDIR /home/node

# SAP Tools
RUN npm install -g @sap/cds-dk @ui5/cli mbt yo 

# Install Zsh Plugins & Tmux Plugin Manager
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && git clone https://github.com/joshskidmore/zsh-fzf-history-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-fzf-history-search \
    && git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

ENV DEBIAN_FRONTEND=dialog
