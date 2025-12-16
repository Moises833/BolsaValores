import { useState, useEffect } from 'react'
import './App.css'
import TradeDashboard from './TradeDashboard'
import { loadWeb3 } from './web3'

function App() {
  const [account, setAccount] = useState<string | null>(null);



  const connectWallet = async () => {
    try {
      const web3 = await loadWeb3();
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === -32002) {
        alert("MetaMask is already trying to connect. Please open the extension to confirm.");
      }
    }
  };

  useEffect(() => {
    // Check if we are already connected (permissions granted) without coercing popup
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          // Only request if not connected? 
          // Actually the user wants to connect on load? 
          // Let's NOT force connect on load to avoid spamming. 
          // ONLY connect if we have permission.
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <h1>Bolsa de Valores Blockchain</h1>
          {account && <div className="wallet-badge">🟢 Conectado</div>}
        </div>
      </header>
      <main>
        {!account ? (
          <div className="login-screen">
            <div className="login-card">
              <h2>Bienvenido</h2>
              <p>Conecta tu billetera para operar en el mercado de acciones.</p>
              <button className="connect-btn" onClick={connectWallet}>
                Conectar Billetera
              </button>
            </div>
          </div>
        ) : (
          <TradeDashboard account={account} />
        )}
      </main>
      <style>{`
        :root {
          --primary-color: #6366f1;
          --primary-hover: #4f46e5;
          --bg-dark: #0f172a;
          --card-bg: #1e293b;
          --text-light: #f8fafc;
          --text-gray: #94a3b8;
        }
        
        body {
          background-color: var(--bg-dark);
          color: var(--text-light);
          margin: 0;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        header {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #334155;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h1 {
          margin: 0;
          font-size: 1.5rem;
          background: linear-gradient(to right, #818cf8, #c084fc);
          -webkit-background-clip: text;
          color: transparent;
          font-weight: 700;
        }

        .wallet-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .login-screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .login-card {
          background: var(--card-bg);
          padding: 3rem;
          border-radius: 1rem;
          text-align: center;
          border: 1px solid #334155;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }

        .login-card h2 {
          margin-top: 0;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .login-card p {
          color: var(--text-gray);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .connect-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .connect-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  )
}

export default App
