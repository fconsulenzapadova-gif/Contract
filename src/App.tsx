import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home, FileText, Key, FileSignature, KeyRound, Menu } from 'lucide-react';
import './App.css';

// Import Pages
import { PurchaseProposal } from './pages/PurchaseProposal';
import { LeaseProposal } from './pages/LeaseProposal';
import { SalesAssignment } from './pages/SalesAssignment';
import { LeaseAssignment } from './pages/LeaseAssignment';
import { AntiMoneyLaundering } from './pages/AntiMoneyLaundering';
import { CommissionStatement } from './pages/CommissionStatement';

const Dashboard = () => (
  <div className="animate-fade-in p-8">
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Benvenuto in Contracts Pro</h1>
      <p className="text-muted text-lg mb-8">
        Seleziona un tipo di contratto per iniziare. Potrai compilare i dati a sinistra e visualizzarne un'anteprima impaginata a destra, pronta per il salvataggio o il download in PDF.
      </p>
      
      <div className="grid grid-cols-2 gap-6">
        {[
          { title: "Proposta d'Acquisto", description: "Per potenziali acquirenti che desiderano formulare un'offerta su un immobile in vendita.", icon: <FileText size={32} />, path: "/purchase-proposal", color: "text-blue-500" },
          { title: "Proposta di Locazione", description: "Per raccogliere offerte e dati completi di soggetti interessati ad affittare l'immobile.", icon: <Key size={32} />, path: "/lease-proposal", color: "text-emerald-500" },
          { title: "Incarico di Vendita", description: "Mandato per conferire l'esclusiva per la vendita di un immobile.", icon: <FileSignature size={32} />, path: "/sales-assign", color: "text-purple-500" },
          { title: "Incarico di Locazione", description: "Mandato per conferire la gestione e promozione per l'affitto di un immobile.", icon: <KeyRound size={32} />, path: "/lease-assign", color: "text-amber-500" },
          { title: "Informativa Antiriciclaggio", description: "Modulo non modificabile ai sensi del D.Lgs 231/07.", icon: <FileText size={32} />, path: "/aml", color: "text-gray-500" },
          { title: "Dichiarazione Provvigionale", description: "Modulo per il riconoscimento del compenso provvigionale all'agenzia.", icon: <FileSignature size={32} />, path: "/commission", color: "text-green-500" },
        ].map((item, i) => (
          <NavLink 
            key={i} 
            to={item.path}
            className="card hover-lift flex flex-col p-8 gap-4 text-left no-underline"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 bg-primary-light text-primary rounded-xl flex items-center justify-center`} style={{ width: '64px', height: '64px' }}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-xl text-main mb-1" style={{ color: 'var(--text-main)' }}>{item.title}</h3>
                <span className="text-sm font-medium text-primary">Crea documento &rarr;</span>
              </div>
            </div>
            <p className="text-muted mt-2">{item.description}</p>
          </NavLink>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className={`sidebar shadow-md ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="logo-icon">
              <Home size={20} />
            </div>
            <h2 className="sidebar-title font-heading text-xl truncate">Contracts Pro</h2>
          </div>
          
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Home size={18} />
              <span>Dashboard</span>
            </NavLink>
            <div className="nav-section-title">Contratti</div>
            <NavLink to="/purchase-proposal" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>Proposta d'Acquisto</span>
            </NavLink>
            <NavLink to="/lease-proposal" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Key size={18} />
              <span>Proposta di Locazione</span>
            </NavLink>
            <NavLink to="/sales-assign" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileSignature size={18} />
              <span>Incarico Vendita</span>
            </NavLink>
            <NavLink to="/lease-assign" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <KeyRound size={18} />
              <span>Incarico Locazione</span>
            </NavLink>
            <div className="nav-section-title mt-4">Moduli Aggiuntivi</div>
            <NavLink to="/aml" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>Antiriciclaggio</span>
            </NavLink>
            <NavLink to="/commission" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileSignature size={18} />
              <span>Provvigione</span>
            </NavLink>
          </nav>
        </aside>

        <main className="main-content flex flex-col">
          <div className="flex items-center p-4 bg-surface border-b border-border sticky top-0 z-20 w-full shadow-sm">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 text-text-main hover:text-primary transition-colors cursor-pointer"
              style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none' }}
              title={isSidebarOpen ? "Chiudi menu" : "Apri menu"}
            >
              <Menu size={26} strokeWidth={2.5} />
            </button>
            {!isSidebarOpen && (
              <h2 className="ml-4 sidebar-title font-heading text-xl m-0">Contracts Pro</h2>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/purchase-proposal" element={<PurchaseProposal />} />
              <Route path="/lease-proposal" element={<LeaseProposal />} />
              <Route path="/sales-assign" element={<SalesAssignment />} />
              <Route path="/lease-assign" element={<LeaseAssignment />} />
              <Route path="/aml" element={<AntiMoneyLaundering />} />
              <Route path="/commission" element={<CommissionStatement />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
