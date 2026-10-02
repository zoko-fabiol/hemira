import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle, 
  Palette, 
  Briefcase, 
  Award, 
  Users, 
  Home,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  Globe
} from 'lucide-react';
import { subscribeVisitors, subscribeDailyStats } from '../services/analyticsService';

export default function DashboardTab({ 
  theme, 
  settings, 
  content, 
  setActiveTab, 
  showToast 
}) {
  const [visitors, setVisitors] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    const unsubV = subscribeVisitors(setVisitors);
    const unsubD = subscribeDailyStats(setDailyStats);
    return () => {
      unsubV?.();
      unsubD?.();
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayVisitors = visitors.filter(v => v.lastVisitDate === today);
  const totalVisitorsCount = visitors.length;
  const todayVisitorsCount = todayVisitors.length;
  const todayRevisitsCount = todayVisitors.reduce((acc, v) => acc + Math.max(0, (v.todayVisitCount || 1) - 1), 0);

  const servicesCount = content?.services?.services?.length || content?.home?.services?.length || 6;
  const casesCount = content?.caseStudies?.cases?.length || 5;

  return (
    <div>
      {/* Welcome banner */}
      <div className="admin-card" style={{ 
        background: 'linear-gradient(135deg, var(--admin-navy) 0%, #1A365D 100%)', 
        color: '#fff', 
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px' }}>
            <Sparkles size={16} color="var(--admin-gold)" />
            <span>Panneau de Contrôle & CMS Firebase</span>
          </div>
          <h2 style={{ color: '#fff', fontSize: '26px', marginBottom: '10px' }}>
            Gestion intégrale du site HEMIRA Travel & Services
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '650px', fontSize: '15px', marginBottom: '24px' }}>
            Modifiez chaque texte, couleur principale, service, réalisation, image et logo en temps réel.
            Toutes les modifications sont enregistrées directement sur votre Firebase <strong>hemira-7716d</strong>.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              className="admin-btn admin-btn-coral"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={16} />
              <span>Consulter les statistiques en direct</span>
            </button>
            <button 
              className="admin-btn admin-btn-outline"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', background: 'transparent' }}
              onClick={() => setActiveTab('theme')}
            >
              <Palette size={16} />
              <span>Modifier les couleurs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="form-grid-4" style={{ marginBottom: '28px' }}>
        {/* Case 1 : Statistiques des visites */}
        <div 
          className="admin-card" 
          style={{ 
            cursor: 'pointer', 
            background: 'var(--admin-card-inner)', 
            transition: 'all 0.25s ease',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 4px 20px -8px rgba(56, 189, 248, 0.25)'
          }} 
          onClick={() => setActiveTab('analytics')}
          title="Cliquez pour ouvrir les statistiques détaillées"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc" style={{ color: 'var(--admin-accent)', fontWeight: 700 }}>
                Visites du site
              </span>
              <h3 style={{ fontSize: '36px', margin: '6px 0', color: 'var(--admin-text-main)', fontWeight: 900 }}>
                {totalVisitorsCount} <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>uniques</span>
              </h3>
              <span style={{ fontSize: '12.5px', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <TrendingUp size={14} /> 
                {todayVisitorsCount > 0 ? `${todayVisitorsCount} auj.` : 'Suivi en direct'}
                {todayRevisitsCount > 0 ? ` (${todayRevisitsCount} rev.)` : ''}
              </span>
            </div>
            <div style={{ padding: '14px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '14px', color: '#38BDF8' }}>
              <BarChart3 size={26} />
            </div>
          </div>
        </div>
        <div 
          className="admin-card" 
          style={{ cursor: 'pointer', background: 'var(--admin-card-inner)', transition: 'transform 0.25s ease, border-color 0.25s ease' }} 
          onClick={() => setActiveTab('services')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc">Services enregistrés</span>
              <h3 style={{ fontSize: '36px', margin: '6px 0', color: 'var(--admin-text-main)', fontWeight: 900 }}>{servicesCount}</h3>
              <span style={{ fontSize: '12.5px', color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <CheckCircle size={14} /> Modifiables & extensibles
              </span>
            </div>
            <div style={{ padding: '14px', background: 'rgba(74, 127, 184, 0.15)', border: '1px solid rgba(74, 127, 184, 0.3)', borderRadius: '14px', color: 'var(--admin-teal)' }}>
              <Briefcase size={26} />
            </div>
          </div>
        </div>

        <div 
          className="admin-card" 
          style={{ cursor: 'pointer', background: 'var(--admin-card-inner)', transition: 'transform 0.25s ease, border-color 0.25s ease' }} 
          onClick={() => setActiveTab('case-studies')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc">Réalisations & missions</span>
              <h3 style={{ fontSize: '36px', margin: '6px 0', color: 'var(--admin-text-main)', fontWeight: 900 }}>{casesCount}</h3>
              <span style={{ fontSize: '12.5px', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <CheckCircle size={14} /> Missions avec défis & résultats
              </span>
            </div>
            <div style={{ padding: '14px', background: 'rgba(201, 169, 104, 0.15)', border: '1px solid rgba(201, 169, 104, 0.3)', borderRadius: '14px', color: 'var(--admin-gold)' }}>
              <Award size={26} />
            </div>
          </div>
        </div>

        <div 
          className="admin-card" 
          style={{ cursor: 'pointer', background: 'var(--admin-card-inner)', transition: 'transform 0.25s ease, border-color 0.25s ease' }} 
          onClick={() => setActiveTab('theme')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc">Charte graphique active</span>
              <div style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: theme?.navy || '#0E1F3D', border: '1px solid rgba(255,255,255,0.2)' }} title="Navy" />
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: theme?.coral || '#4A7FB8', border: '1px solid rgba(255,255,255,0.2)' }} title="Coral/Accent" />
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: theme?.gold || '#C9A968', border: '1px solid rgba(255,255,255,0.2)' }} title="Gold" />
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: theme?.teal || '#6FA0D0', border: '1px solid rgba(255,255,255,0.2)' }} title="Teal" />
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--admin-text-muted)' }}>
                Variables CSS dynamiques
              </span>
            </div>
            <div style={{ padding: '14px', background: 'rgba(240, 98, 77, 0.15)', border: '1px solid rgba(240, 98, 77, 0.3)', borderRadius: '14px', color: 'var(--admin-coral)' }}>
              <Palette size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Accès direct aux modules</h3>
            <p className="admin-card-desc">Cliquez pour modifier directement une partie spécifique</p>
          </div>
        </div>

        <div className="form-grid">
          {[
            { id: 'analytics', title: 'Statistiques & Visiteurs', desc: 'Consultez les visiteurs uniques, revisites, appareils et pays en direct', icon: BarChart3, color: '#38BDF8' },
            { id: 'theme', title: 'Couleurs & Thème', desc: 'Personnalisez les tons Navy, Corail, Doré, Cyan en temps réel', icon: Palette, color: 'var(--admin-coral)' },
            { id: 'identity', title: 'Logo & Identité', desc: 'Mettez en ligne un nouveau logo et modifiez les slogans officiels', icon: ImageIcon, color: 'var(--admin-accent)' },
            { id: 'services', title: 'Services de Voyage', desc: 'Ajoutez, modifiez ou supprimez des services (billets, visa, hôtels...)', icon: Briefcase, color: 'var(--admin-teal)' },
            { id: 'case-studies', title: 'Nos Réalisations', desc: 'Ajoutez de nouvelles missions et études de cas avec images', icon: Award, color: 'var(--admin-gold)' },
            { id: 'home', title: "Page d'accueil & Stats", desc: 'Modifiez les grands titres, les chiffres clés et les engagements', icon: Home, color: 'var(--admin-coral)' },
            { id: 'about', title: 'À propos & Fondatrices', desc: 'Gérez les présentations et photos de Jeanne Helene et Miriam', icon: Users, color: 'var(--admin-accent)' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                style={{ 
                  padding: '16px 18px', 
                  border: '1px solid var(--admin-border)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  background: 'var(--admin-card-inner)',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => setActiveTab(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: 'var(--admin-card-bg)', 
                    border: '1px solid var(--admin-border)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: item.color, 
                    flexShrink: 0 
                  }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '15px', color: 'var(--admin-text-main)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</strong>
                    <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</span>
                  </div>
                </div>
                <ArrowRight size={18} color="var(--admin-text-muted)" style={{ flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
