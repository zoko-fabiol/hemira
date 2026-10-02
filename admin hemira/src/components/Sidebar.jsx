import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3,
  Palette, 
  Image as ImageIcon, 
  Home, 
  Briefcase, 
  Award, 
  Users, 
  Type, 
  PhoneCall, 
  ExternalLink,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'analytics', label: 'Statistiques & Visiteurs', icon: BarChart3 },
    { id: 'theme', label: 'Couleurs & Thème', icon: Palette },
    { id: 'identity', label: 'Logo & Identité', icon: ImageIcon },
    { id: 'home', label: 'Page d\'accueil & Chiffres', icon: Home },
    { id: 'services', label: 'Services de voyage', icon: Briefcase },
    { id: 'case-studies', label: 'Nos réalisations', icon: Award },
    { id: 'about', label: 'À propos & Fondatrices', icon: Users },
    { id: 'texts', label: 'Textes & Navigation', icon: Type },
    { id: 'contact', label: 'Contact & Chatbot', icon: PhoneCall },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay backdrop for mobile */}
      <div 
        className={`admin-drawer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-brand-main">
            <div className="admin-brand-icon">H</div>
            <div className="admin-brand-info">
              <h2>HEMIRA Admin</h2>
              <span>CMS Plateforme</span>
            </div>
          </div>
          <button 
            type="button" 
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section-title">Navigation principale</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <a 
            href="http://localhost:5173/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="admin-btn admin-btn-outline"
            style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
          >
            <ExternalLink size={14} />
            <span>Voir le site public</span>
          </a>
        </div>
      </aside>
    </>
  );
}
