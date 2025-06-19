import './style.css'
import { solanaWallet } from './solana'

let isConnecting = false;

function updateUI() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  const topMenu = `
    <div class="top-menu">
      <div class="menu-left">
        <h2 class="logo">Wii</h2>
      </div>
      <div class="menu-right">
        <a href="https://twitter.com" target="_blank" class="social-icon" title="Follow us on X">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="#" class="social-icon" title="Google Account" id="google-account">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </a>
        <div class="wallet-icon" title="Wallet Status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          <span class="wallet-status ${solanaWallet.isConnected ? 'connected' : 'disconnected'}"></span>
        </div>
      </div>
    </div>
  `;
  
  if (solanaWallet.isConnected) {
    app.innerHTML = topMenu + `
      <div class="container">
        <div class="header">
          <h1>🚀 Solana Connected</h1>
          <div class="status connected">✅ Wallet Connected</div>
        </div>
        
        <div class="wallet-info">
          <div class="info-card">
            <h3>Wallet Address</h3>
            <p class="address">${solanaWallet.getAddress()}</p>
          </div>
          
          <div class="info-card">
            <h3>Balance</h3>
            <p class="balance" id="balance">Loading...</p>
          </div>
        </div>
        
        <button id="disconnect-btn" class="btn btn-secondary">
          Disconnect Wallet
        </button>
      </div>
    `;
    
    // Load balance
    solanaWallet.getBalance().then(balance => {
      const balanceEl = document.getElementById('balance');
      if (balanceEl) {
        balanceEl.textContent = `${balance.toFixed(4)} SOL`;
      }
    });
    
    document.getElementById('disconnect-btn')?.addEventListener('click', async () => {
      await solanaWallet.disconnect();
      updateUI();
    });
    
  } else {
    app.innerHTML = topMenu + `
      <div class="container">
        <div class="header">
          <h1>⚡ Connect to Solana</h1>
          <div class="status disconnected">❌ Wallet Disconnected</div>
        </div>
        
        <div class="connect-section">
          <p>Connect your Phantom wallet to get started</p>
          <button id="connect-btn" class="btn btn-primary" ${isConnecting ? 'disabled' : ''}>
            ${isConnecting ? 'Connecting...' : '🔗 Connect Phantom Wallet'}
          </button>
        </div>
        
        <div class="info">
          <p>Make sure you have Phantom wallet installed</p>
          <a href="https://phantom.app/" target="_blank">Download Phantom →</a>
        </div>
      </div>
    `;
    
    document.getElementById('connect-btn')?.addEventListener('click', async () => {
      if (isConnecting) return;
      
      isConnecting = true;
      updateUI();
      
      const success = await solanaWallet.connect();
      isConnecting = false;
      
      if (success) {
        updateUI();
      } else {
        alert('Failed to connect wallet. Make sure Phantom is installed.');
        updateUI();
      }
    });
  }

  // Add Google Account click handler
  document.getElementById('google-account')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Google Account integration coming soon!');
  });
}

// Initialize
updateUI();