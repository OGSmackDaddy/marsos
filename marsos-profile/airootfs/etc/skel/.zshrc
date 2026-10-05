# marsOS Cyber Sol .zshrc
# Environment
export EDITOR="nano"
export VISUAL="kate"
export BROWSER="firefox"
export PAGER="less"

# Keybindings
bindkey -e
bindkey '^[[A' history-beginning-search-backward
bindkey '^[[B' history-beginning-search-forward

# Aliases
alias ls="ls --color=auto"
alias ll="ls -lah --color=auto"
alias la="ls -A --color=auto"
alias cls="clear"
alias update="sudo pacman -Syu"
alias mars-update="marsos update"
alias mars-doctor="marsos doctor"
alias ff="fastfetch"

# Source plugins if installed
[[ -f /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ]] && source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
[[ -f /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh ]] && source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# Initialize Starship prompt
if command -v starship &> /dev/null; then
    eval "$(starship init zsh)"
fi

# Run fastfetch on interactive shell launch
if [[ -o interactive ]] && command -v fastfetch &> /dev/null; then
    fastfetch
fi
