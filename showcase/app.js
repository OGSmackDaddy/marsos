/* ==============================================================================
   marsOS — Cyber Sol Edition | Interactive Desktop Logic
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let highestZ = 100;
  let activeWindow = 'win-terminal';
  let isPlayingAudio = false;

  // --- Elements ---
  const clockEl = document.getElementById('clock');
  const cpuStatEl = document.getElementById('cpu-stat');
  const ramStatEl = document.getElementById('ram-stat');
  const marsMenuBtn = document.getElementById('mars-menu-btn');
  const marsDropdown = document.getElementById('mars-dropdown');
  const ccTrigger = document.getElementById('control-center-trigger');
  const controlCenter = document.getElementById('control-center');
  const searchTrigger = document.getElementById('search-trigger');
  const spotlightOverlay = document.getElementById('spotlight-overlay');
  const spotlightInput = document.getElementById('spotlight-input');
  const spotlightResults = document.getElementById('spotlight-results');
  const activeAppName = document.getElementById('active-app-name');

  // --- Windows ---
  const windows = {
    'win-terminal': document.getElementById('win-terminal'),
    'win-installer': document.getElementById('win-installer'),
    'win-settings': document.getElementById('win-settings'),
    'win-doc': document.getElementById('win-doc')
  };

  const dockDots = {
    'win-terminal': document.querySelector('#dock-terminal .dock-dot'),
    'win-installer': document.getElementById('dot-installer'),
    'win-settings': document.getElementById('dot-settings'),
    'win-doc': document.getElementById('dot-doc')
  };

  // --- Clock & Telemetry Tick ---
  function updateClock() {
    const now = new Date();
    const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    clockEl.textContent = now.toLocaleDateString('en-US', opts);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Oscillating CPU & RAM
  setInterval(() => {
    const cpu = Math.floor(10 + Math.random() * 14);
    const ram = (2.3 + Math.random() * 0.3).toFixed(1);
    cpuStatEl.textContent = `${cpu}%`;
    ramStatEl.textContent = `${ram}G`;
  }, 2500);

  // --- Window Management ---
  function focusWindow(winId) {
    if (!windows[winId]) return;
    highestZ += 2;
    windows[winId].style.zIndex = highestZ;
    activeWindow = winId;

    Object.values(windows).forEach(win => win.classList.remove('active-window'));
    windows[winId].classList.add('active-window');

    // Update Top-bar Active App Name
    if (winId === 'win-terminal') activeAppName.textContent = 'Konsole';
    else if (winId === 'win-installer') activeAppName.textContent = 'Calamares';
    else if (winId === 'win-settings') activeAppName.textContent = 'Settings';
    else if (winId === 'win-doc') activeAppName.textContent = 'Kate';
  }

  function openWindow(winId) {
    const win = windows[winId];
    if (!win) return;
    win.classList.remove('hidden');
    if (dockDots[winId]) dockDots[winId].classList.remove('hidden');
    focusWindow(winId);
  }

  function closeWindow(winId) {
    const win = windows[winId];
    if (!win) return;
    win.classList.add('hidden');
    if (dockDots[winId]) dockDots[winId].classList.add('hidden');
    activeAppName.textContent = 'marsOS';
  }

  // Click on window to bring to front
  Object.keys(windows).forEach(id => {
    const win = windows[id];
    win.addEventListener('mousedown', () => focusWindow(id));
  });

  // Traffic Light Buttons
  document.querySelectorAll('.traffic-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      if (btn.classList.contains('close')) {
        closeWindow(targetId);
      } else if (btn.classList.contains('minimize')) {
        closeWindow(targetId);
      } else if (btn.classList.contains('maximize')) {
        const win = windows[targetId];
        win.classList.toggle('maximized');
        if (win.classList.contains('maximized')) {
          win.dataset.origTop = win.style.top;
          win.dataset.origLeft = win.style.left;
          win.dataset.origWidth = win.style.width;
          win.dataset.origHeight = win.style.height;
          win.style.top = '40px';
          win.style.left = '20px';
          win.style.width = 'calc(100vw - 40px)';
          win.style.height = 'calc(100vh - 140px)';
        } else {
          win.style.top = win.dataset.origTop || '100px';
          win.style.left = win.dataset.origLeft || '280px';
          win.style.width = win.dataset.origWidth || '720px';
          win.style.height = win.dataset.origHeight || '480px';
        }
      }
    });
  });

  // Window Dragging Logic
  document.querySelectorAll('.window-titlebar').forEach(titlebar => {
    let isDragging = false;
    let startX, startY, origLeft, origTop;
    const parentWin = titlebar.closest('.os-window');

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.traffic-btn')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parentWin.offsetLeft;
      origTop = parentWin.offsetTop;
      focusWindow(parentWin.id);

      function onMouseMove(moveEvent) {
        if (!isDragging) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        parentWin.style.left = `${origLeft + dx}px`;
        parentWin.style.top = `${origTop + dy}px`;
      }

      function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });

  // --- Dropdowns & Modals ---
  marsMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    marsDropdown.classList.toggle('hidden');
    controlCenter.classList.add('hidden');
  });

  ccTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    controlCenter.classList.toggle('hidden');
    marsDropdown.classList.add('hidden');
  });

  document.addEventListener('click', () => {
    marsDropdown.classList.add('hidden');
    controlCenter.classList.add('hidden');
  });

  marsDropdown.addEventListener('click', (e) => e.stopPropagation());
  controlCenter.addEventListener('click', (e) => e.stopPropagation());

  // Dropdown item actions
  document.getElementById('about-marsos-item').addEventListener('click', () => {
    marsDropdown.classList.add('hidden');
    openWindow('win-settings');
    switchSettingsTab('about');
  });

  document.getElementById('system-settings-item').addEventListener('click', () => {
    marsDropdown.classList.add('hidden');
    openWindow('win-settings');
  });

  document.getElementById('install-distro-item').addEventListener('click', () => {
    marsDropdown.classList.add('hidden');
    openWindow('win-installer');
  });

  document.getElementById('toggle-build-hub').addEventListener('click', () => {
    marsDropdown.classList.add('hidden');
    openWindow('win-settings');
    switchSettingsTab('build');
  });

  // Desktop Icons
  document.getElementById('desk-calamares').addEventListener('dblclick', () => openWindow('win-installer'));
  document.getElementById('desk-buildhub').addEventListener('dblclick', () => {
    openWindow('win-settings');
    switchSettingsTab('build');
  });
  document.getElementById('desk-readme').addEventListener('dblclick', () => openWindow('win-doc'));

  // --- Dock Triggers ---
  document.getElementById('dock-launcher').addEventListener('click', openSpotlight);
  document.getElementById('dock-terminal').addEventListener('click', () => {
    if (windows['win-terminal'].classList.contains('hidden')) openWindow('win-terminal');
    else focusWindow('win-terminal');
  });
  document.getElementById('dock-installer').addEventListener('click', () => {
    if (windows['win-installer'].classList.contains('hidden')) openWindow('win-installer');
    else focusWindow('win-installer');
  });
  document.getElementById('dock-settings').addEventListener('click', () => {
    if (windows['win-settings'].classList.contains('hidden')) openWindow('win-settings');
    else focusWindow('win-settings');
  });
  document.getElementById('dock-doc').addEventListener('click', () => {
    if (windows['win-doc'].classList.contains('hidden')) openWindow('win-doc');
    else focusWindow('win-doc');
  });

  // Theme Toggle Button
  const themes = ['crimson', 'amber', 'gold', 'neon'];
  let currentThemeIdx = 0;
  document.getElementById('dock-theme-toggle').addEventListener('click', () => {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    applyTheme(themes[currentThemeIdx]);
  });

  function applyTheme(name) {
    document.body.className = `theme-${name}`;
    document.querySelectorAll('.accent-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-theme') === name);
    });
  }

  // --- Spotlight / KRunner ---
  function openSpotlight() {
    spotlightOverlay.classList.remove('hidden');
    spotlightInput.value = '';
    spotlightInput.focus();
    renderSpotlightResults('');
  }

  function closeSpotlight() {
    spotlightOverlay.classList.add('hidden');
  }

  searchTrigger.addEventListener('click', openSpotlight);

  spotlightOverlay.addEventListener('click', (e) => {
    if (e.target === spotlightOverlay) closeSpotlight();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
      e.preventDefault();
      if (spotlightOverlay.classList.contains('hidden')) openSpotlight();
      else closeSpotlight();
    }
    if (e.key === 'Escape') {
      closeSpotlight();
      marsDropdown.classList.add('hidden');
      controlCenter.classList.add('hidden');
    }
  });

  const searchableItems = [
    { name: 'Konsole', desc: 'Cyber Sol Terminal & fastfetch telemetry', icon: '💻', action: () => openWindow('win-terminal') },
    { name: 'Install marsOS', desc: 'Calamares Graphical Installer', icon: '🔴', action: () => openWindow('win-installer') },
    { name: 'System Settings', desc: 'KDE Plasma 6 & Cyber Sol customizer', icon: '⚙️', action: () => openWindow('win-settings') },
    { name: 'Architecture Docs', desc: 'Kate reader with distro specifications', icon: '📜', action: () => openWindow('win-doc') },
    { name: 'Build Guide', desc: 'GitHub Actions & Docker build pipelines', icon: '⚡', action: () => { openWindow('win-settings'); switchSettingsTab('build'); } },
    { name: 'Switch Theme to Amber', desc: 'Martian atmospheric amber palette', icon: '🎨', action: () => applyTheme('amber') },
    { name: 'Switch Theme to Crimson', desc: 'High-contrast Cyber Sol red', icon: '🎨', action: () => applyTheme('crimson') },
  ];

  function renderSpotlightResults(query) {
    spotlightResults.innerHTML = '';
    const q = query.trim().toLowerCase();

    // Check if math calculation
    if (/^[0-9+\-*/^().\s]+$/.test(q) && /[+\-*/]/.test(q)) {
      try {
        const calcRes = Function(`'use strict'; return (${q})`)();
        const calcItem = document.createElement('div');
        calcItem.className = 'spotlight-item selected';
        calcItem.innerHTML = `
          <div class="spotlight-item-icon">🧮</div>
          <div>
            <div class="spotlight-item-name">${calcRes}</div>
            <div class="spotlight-item-desc">Calculation Result</div>
          </div>
        `;
        spotlightResults.appendChild(calcItem);
      } catch (err) {}
    }

    const filtered = searchableItems.filter(item => 
      item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );

    filtered.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `spotlight-item ${idx === 0 && !spotlightResults.children.length ? 'selected' : ''}`;
      el.innerHTML = `
        <div class="spotlight-item-icon">${item.icon}</div>
        <div>
          <div class="spotlight-item-name">${item.name}</div>
          <div class="spotlight-item-desc">${item.desc}</div>
        </div>
      `;
      el.addEventListener('click', () => {
        closeSpotlight();
        item.action();
      });
      spotlightResults.appendChild(el);
    });
  }

  spotlightInput.addEventListener('input', (e) => renderSpotlightResults(e.target.value));
  spotlightInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = spotlightResults.querySelector('.spotlight-item');
      if (first) first.click();
    }
  });

  // --- Settings Tabs ---
  function switchSettingsTab(tabName) {
    document.querySelectorAll('.settings-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('hidden', p.id !== `tab-${tabName}`);
    });
  }

  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => switchSettingsTab(tab.getAttribute('data-tab')));
  });

  document.querySelectorAll('.accent-chip').forEach(chip => {
    chip.addEventListener('click', () => applyTheme(chip.getAttribute('data-theme')));
  });

  // --- Interactive Terminal Simulation ---
  const terminalHistory = document.getElementById('terminal-history');
  const terminalInput = document.getElementById('terminal-input');

  const fastfetchBanner = `
<div class="term-ascii">
              .---.
           .-'     '-.         <span style="color:#FF6B00;font-weight:bold;">mars@cyber-sol</span>
         .'   _..._   '.       ──────────────────────────────────────────
        /   .'     '.   \\      <span class="term-stat-key">OS</span>         ➜  marsOS 2026.10 (Cyber Sol Edition)
       :   /   .-.   \\   :     <span class="term-stat-key">Base</span>       ➜  Arch Linux (Rolling Release)
       |  :   ( 🔴 )  :  |     <span class="term-stat-key">Kernel</span>     ➜  6.12.8-zen1-1-zen (Low-Latency)
       :   \\   '-'   /   :     <span class="term-stat-key">Uptime</span>     ➜  4 hours, 20 mins
        \\   '.     .'   /      <span class="term-stat-key">Packages</span>   ➜  1184 (pacman), 42 (flatpak)
         '.   '---'   .'       <span class="term-stat-key">Shell</span>      ➜  zsh 5.9 + Starship Cyber Prompt
           '-.     .-'         <span class="term-stat-key">Desktop</span>    ➜  KDE Plasma 6.2 (Wayland Compositor)
              '---'            <span class="term-stat-key">WM</span>         ➜  KWin (macOS Traffic Lights + Glass Blur)
          m a r s O S          <span class="term-stat-key">Theme</span>      ➜  Cyber Sol OLED (Kvantum Glass)
                               <span class="term-stat-key">CPU</span>        ➜  AMD Ryzen 9 7950X @ 5.70 GHz
                               <span class="term-stat-key">GPU</span>        ➜  AMD Radeon RX 7900 XTX (Vulkan 1.3)
                               <span class="term-stat-key">Memory</span>     ➜  2412MiB / 32768MiB (7%)
</div>
<div style="margin: 8px 0; color: #8b949e;">Type <b style="color: #FF2A55;">help</b> for available Martian commands.</div>
`;

  terminalHistory.innerHTML = fastfetchBanner;

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim();
      terminalInput.value = '';

      // Print prompt echo
      const echoDiv = document.createElement('div');
      echoDiv.innerHTML = `
        <div class="terminal-prompt-row" style="margin-top: 6px;">
          <span class="prompt-sig">[🔴 marsOS]</span>
          <span class="prompt-path">in ~/universe</span>
          <span class="prompt-arrow">❯</span>
          <span style="color: #fff;">${cmd}</span>
        </div>
      `;
      terminalHistory.appendChild(echoDiv);

      handleCommand(cmd);
      terminalHistory.parentElement.scrollTop = terminalHistory.parentElement.scrollHeight;
    }
  });

  function handleCommand(cmd) {
    const out = document.createElement('div');
    out.style.marginTop = '4px';

    const [prog, ...args] = cmd.split(' ');

    switch (prog.toLowerCase()) {
      case '':
        break;
      case 'help':
        out.innerHTML = `
          <div style="line-height: 1.6;">
            <b style="color: #FF2A55;">Available marsOS Commands:</b><br/>
            • <b style="color: #FF6B00;">fastfetch</b> / <b style="color: #FF6B00;">neofetch</b> — Display system telemetry & Mars ASCII art<br/>
            • <b style="color: #FF6B00;">marsos info</b> — Show kernel, Wayland session, and base specs<br/>
            • <b style="color: #FF6B00;">marsos doctor</b> — Health diagnostic check (audio, compositor, services)<br/>
            • <b style="color: #FF6B00;">calamares</b> / <b style="color: #FF6B00;">install</b> — Launch the live installer GUI<br/>
            • <b style="color: #FF6B00;">theme [crimson|amber|gold|neon]</b> — Change desktop accent system<br/>
            • <b style="color: #FF6B00;">ls</b> — List directory contents<br/>
            • <b style="color: #FF6B00;">uname -a</b> — View Linux kernel info<br/>
            • <b style="color: #FF6B00;">cat /etc/os-release</b> — Show distribution ID<br/>
            • <b style="color: #FF6B00;">clear</b> / <b style="color: #FF6B00;">cls</b> — Clear terminal screen
          </div>
        `;
        break;

      case 'fastfetch':
      case 'neofetch':
      case 'ff':
        out.innerHTML = fastfetchBanner;
        break;

      case 'marsos':
        if (args[0] === 'info') {
          out.innerHTML = `
            <div style="color: #34c759;">[✓] marsOS System Telemetry</div>
            <div>• Distro: marsOS 2026.10 (Cyber Sol Edition)</div>
            <div>• Base: Arch Linux (Rolling Release)</div>
            <div>• Kernel: 6.12.8-zen1-1-zen</div>
            <div>• Compositor: Wayland (120Hz Hardware Accelerated)</div>
          `;
        } else if (args[0] === 'doctor') {
          out.innerHTML = `
            <div style="color: #FF6B00; font-weight: bold;">=== marsOS System Health Diagnostic ===</div>
            <div>• Audio Server (PipeWire): <span style="color: #34c759;">ONLINE</span></div>
            <div>• Wayland Compositor: <span style="color: #34c759;">ONLINE (KWin Wayland)</span></div>
            <div>• Vulkan 1.3 Driver: <span style="color: #34c759;">READY (radv)</span></div>
            <div>• Systemd Failed Units: <span style="color: #34c759;">0 (All systems nominal)</span></div>
          `;
        } else {
          out.innerHTML = `<span style="color: #FF3B30;">Unknown marsos subcommand. Try 'marsos info' or 'marsos doctor'.</span>`;
        }
        break;

      case 'calamares':
      case 'install':
        openWindow('win-installer');
        out.innerHTML = `<span style="color: #34c759;">[+] Launching Calamares Live Installer...</span>`;
        break;

      case 'theme':
        if (args[0] && ['crimson', 'amber', 'gold', 'neon'].includes(args[0])) {
          applyTheme(args[0]);
          out.innerHTML = `<span style="color: #34c759;">[✓] Switched accent theme to '${args[0]}'!</span>`;
        } else {
          out.innerHTML = `<span>Usage: theme &lt;crimson|amber|gold|neon&gt;</span>`;
        }
        break;

      case 'ls':
        out.innerHTML = `
          <span style="color: #00F0FF;">build-docker/</span>   <span style="color: #00F0FF;">marsos-profile/</span>   <span style="color: #00F0FF;">showcase/</span>   <span style="color: #FFB300;">Architecture.md</span>   <span style="color: #34c759;">build.bat*</span>   README.md
        `;
        break;

      case 'uname':
        out.innerHTML = `Linux marsos-zenith 6.12.8-zen1-1-zen #1 ZEN SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`;
        break;

      case 'cat':
        if (args[0] === '/etc/os-release') {
          out.innerHTML = `
NAME="marsOS"<br/>
PRETTY_NAME="marsOS 2026 (Cyber Sol Edition)"<br/>
ID=marsos<br/>
ID_LIKE=arch<br/>
BUILD_ID=rolling<br/>
ANSI_COLOR="38;2;255;42;85"
          `;
        } else {
          out.innerHTML = `cat: ${args[0] || 'missing operand'}: No such file`;
        }
        break;

      case 'clear':
      case 'cls':
        terminalHistory.innerHTML = '';
        return;

      default:
        out.innerHTML = `<span style="color: #FF3B30;">zsh: command not found: ${prog}</span> (type 'help' for commands)`;
        break;
    }

    terminalHistory.appendChild(out);
  }

  // --- Calamares Installer Steps ---
  let currentStep = 1;
  const btnPrevStep = document.getElementById('btn-prev-step');
  const btnNextStep = document.getElementById('btn-next-step');
  const progressBar = document.getElementById('install-progress');
  const statusText = document.getElementById('install-status-text');

  function updateInstallerUI() {
    document.querySelectorAll('.installer-step').forEach(s => {
      const stepNum = parseInt(s.getAttribute('data-step'), 10);
      s.classList.toggle('active', stepNum === currentStep);
    });

    document.querySelectorAll('.step-view').forEach(v => {
      v.classList.add('hidden');
    });
    const activeView = document.getElementById(`step-${currentStep}`);
    if (activeView) activeView.classList.remove('hidden');

    btnPrevStep.disabled = currentStep === 1;

    if (currentStep === 4) {
      btnNextStep.textContent = 'Install Now 🚀';
    } else if (currentStep === 5) {
      btnNextStep.style.display = 'none';
      btnPrevStep.style.display = 'none';
      startSimulatedInstall();
    } else {
      btnNextStep.textContent = 'Next ❯';
      btnNextStep.style.display = 'block';
    }
  }

  btnNextStep.addEventListener('click', () => {
    if (currentStep < 5) {
      currentStep++;
      updateInstallerUI();
    }
  });

  btnPrevStep.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateInstallerUI();
    }
  });

  function startSimulatedInstall() {
    let progress = 0;
    const stages = [
      { p: 15, msg: 'Creating Btrfs subvolumes (@, @home, @snapshots)...' },
      { p: 35, msg: 'Unpacking Arch Linux core image...' },
      { p: 55, msg: 'Installing KDE Plasma 6 Wayland desktop suite...' },
      { p: 75, msg: 'Configuring Plymouth Cyber Sol boot splash...' },
      { p: 90, msg: 'Generating initramfs and systemd-boot entries...' },
      { p: 100, msg: 'marsOS installation complete! Ready to reboot.' }
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      progress += 2;
      progressBar.style.width = `${progress}%`;

      if (stageIdx < stages.length && progress >= stages[stageIdx].p) {
        statusText.textContent = stages[stageIdx].msg;
        stageIdx++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        statusText.innerHTML = `<b style="color: #34c759;">[✓] Installation Successful! Reboot into your new marsOS system.</b>`;
      }
    }, 120);
  }

  // --- Soundscape Toggle ---
  const playBtn = document.getElementById('media-play-btn');
  playBtn.addEventListener('click', () => {
    isPlayingAudio = !isPlayingAudio;
    playBtn.textContent = isPlayingAudio ? '⏸' : '▶';
  });
});
