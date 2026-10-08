import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3,
  Sparkles, 
  Image as ImageIcon, 
  FolderHeart,
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
  const sections = [
    {
      title: "Vue Générale",
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'analytics', label: 'Statistiques & Visiteurs', icon: BarChart3 }
      ]
    },
    {
      title: "Design Visuel",
      items: [
        { id: 'appearance', label: 'Apparence & Design (Direct)', icon: Sparkles, badge: 'Nouveau' }
      ]
    },
    {
      title: "Contenu Textes & Médias",
      items: [
        { id: 'media', label: 'Médiathèque Firestore', icon: FolderHeart, badge: 'Images' },
        { id: 'home', label: 'Accueil & Chiffres', icon: Home },
        { id: 'services', label: 'Services de voyage', icon: Briefcase },
        { id: 'case-studies', label: 'Nos réalisations', icon: Award },
        { id: 'about', label: 'À propos & Fondatrices', icon: Users },
        { id: 'texts', label: 'Textes & Navigation', icon: Type },
        { id: 'contact', label: 'Contact & Chatbot', icon: PhoneCall },
        { id: 'identity', label: 'Logo & Identité', icon: ImageIcon }
      ]
    }
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const publicSiteUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5175/`
    : 'http://localhost:5175/';

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
          {sections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '14px' }}>
              <div className="admin-nav-section-title">{sec.title}</div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelect(item.id)}
                    style={item.id === 'appearance' ? { 
                      background: isActive ? 'rgba(240, 98, 77, 0.15)' : 'rgba(240, 98, 77, 0.05)', 
                      borderColor: isActive ? 'var(--admin-coral)' : 'rgba(240, 98, 77, 0.2)' 
                    } : {}}
                  >
                    <Icon size={18} color={item.id === 'appearance' ? 'var(--admin-coral, #F0624D)' : 'currentColor'} />
                    <span style={item.id === 'appearance' ? { fontWeight: 700 } : {}}>{item.label}</span>
                    {item.badge && (
                      <span style={{ 
                        marginLeft: 'auto', 
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        borderRadius: '999px', 
                        background: 'var(--admin-coral, #F0624D)', 
                        color: '#fff', 
                        fontWeight: 700 
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a 
            href={publicSiteUrl} 
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
