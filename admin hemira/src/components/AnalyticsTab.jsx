import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Repeat, 
  Smartphone, 
  Globe, 
  Laptop, 
  Apple, 
  Monitor, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { subscribeVisitors, subscribeDailyStats, seedDemoAnalyticsIfEmpty } from '../services/analyticsService';

export default function AnalyticsTab({ showToast }) {
  const [visitors, setVisitors] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'week', 'all'

  useEffect(() => {
    // Initialiser les données si la collection est vierge
    seedDemoAnalyticsIfEmpty();

    const unsubVisitors = subscribeVisitors((data) => {
      setVisitors(data);
      setLoading(false);
    });

    const unsubDaily = subscribeDailyStats((data) => {
      setDailyStats(data);
    });

    return () => {
      unsubVisitors();
      unsubDaily();
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayStats = dailyStats.find(d => d.date === today) || {};

  // Calculs sur l'ensemble des visiteurs
  const totalUniqueVisitors = visitors.length;
  const todayVisitors = visitors.filter(v => v.lastVisitDate === today);
  const todayUniqueCount = todayStats.uniqueVisitorsCount || todayVisitors.length;

  // Calcul du nombre de revisites (visiteurs ayant visité >= 2 fois)
  const totalRevisits = visitors.reduce((acc, v) => acc + Math.max(0, (v.visitCount || 1) - 1), 0);
  const todayRevisits = todayStats.revisitsCount !== undefined 
    ? todayStats.revisitsCount 
    : todayVisitors.reduce((acc, v) => acc + Math.max(0, (v.todayVisitCount || 1) - 1), 0);

  // Répartition par appareil
  const deviceCounts = {
    Android: 0,
    iPhone: 0,
    Windows: 0,
    Mac: 0,
    iPad: 0,
    Linux: 0,
    Autre: 0
  };

  visitors.forEach(v => {
    const dev = v.device || 'Autre';
    if (deviceCounts[dev] !== undefined) {
      deviceCounts[dev]++;
    } else {
      deviceCounts.Autre = (deviceCounts.Autre || 0) + 1;
    }
  });

  // Appareil le plus utilisé
  let topDevice = 'Android';
  let topDeviceCount = 0;
  Object.entries(deviceCounts).forEach(([dev, count]) => {
    if (count > topDeviceCount) {
      topDeviceCount = count;
      topDevice = dev;
    }
  });
  const topDevicePercentage = totalUniqueVisitors > 0 ? Math.round((topDeviceCount / totalUniqueVisitors) * 100) : 0;

  // Répartition par pays
  const countryCounts = {};
  visitors.forEach(v => {
    const c = v.country || 'Cameroun';
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  const sortedCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topCountry = sortedCountries.length > 0 ? sortedCountries[0][0] : 'Cameroun';
  const topCountryCount = sortedCountries.length > 0 ? sortedCountries[0][1] : 0;
  const topCountryPercentage = totalUniqueVisitors > 0 ? Math.round((topCountryCount / totalUniqueVisitors) * 100) : 0;

  // Formatage de date relative
  const formatTimeAgo = (date) => {
    if (!date) return 'Récemment';
    const now = new Date();
    const diffSec = Math.floor((now - new Date(date)) / 1000);
    if (diffSec < 60) return "À l'instant";
    if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `Il y a ${Math.floor(diffSec / 3600)} h`;
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Android': return <Smartphone size={17} color="#10B981" />;
      case 'iPhone': return <Smartphone size={17} color="var(--admin-coral)" />;
      case 'iPad': return <Smartphone size={17} color="var(--admin-gold)" />;
      case 'Mac': return <Apple size={17} color="var(--admin-accent)" />;
      case 'Windows': return <Monitor size={17} color="#3B82F6" />;
      default: return <Laptop size={17} color="var(--admin-text-muted)" />;
    }
  };

  const filteredVisitors = visitors.filter(v => {
    if (timeFilter === 'today') return v.lastVisitDate === today;
    return true;
  });

  return (
    <div>
      {/* Header Banner */}
      <div className="admin-card" style={{ 
        background: 'linear-gradient(135deg, var(--admin-navy) 0%, #152A4A 100%)', 
        color: '#fff', 
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px' }}>
            <Activity size={16} color="var(--admin-gold)" />
            <span>Audience & Trafic en Temps Réel</span>
          </div>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>
            Tableau de Bord des Statistiques HEMIRA
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '650px', fontSize: '14.5px', marginBottom: '20px' }}>
            Suivi automatique et précis de chaque visiteur unique, décompte des revisites quotidiennes, détection du modèle d'appareil (Android, iPhone, Mac, Windows) et provenance géographique.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '6px 14px', 
              borderRadius: '8px', 
              fontSize: '12.5px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <CheckCircle2 size={15} color="#34D399" />
              <span>Aujourd'hui : <strong>{todayUniqueCount}</strong> visiteurs uniques</span>
            </span>

            <span style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '6px 14px', 
              borderRadius: '8px', 
              fontSize: '12.5px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <Repeat size={15} color="var(--admin-gold)" />
              <span><strong>{todayRevisits}</strong> revisites récurrentes</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '28px' }}>
        {/* KPI 1 : Visiteurs Uniques */}
        <div className="admin-card" style={{ padding: '22px', background: 'var(--admin-card-inner)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc">Visiteurs Uniques (Total)</span>
              <h3 style={{ fontSize: '32px', margin: '6px 0', color: 'var(--admin-text-main)', fontWeight: 900 }}>
                {totalUniqueVisitors}
              </h3>
              <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <TrendingUp size={14} /> {todayUniqueCount} aujourd'hui
              </span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.25)', borderRadius: '12px', color: 'var(--admin-accent)' }}>
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* KPI 2 : Nombre de Revisites */}
        <div className="admin-card" style={{ padding: '22px', background: 'var(--admin-card-inner)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc">Revisites & Sessions</span>
              <h3 style={{ fontSize: '32px', margin: '6px 0', color: 'var(--admin-text-main)', fontWeight: 900 }}>
                {totalRevisits}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--admin-gold)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Repeat size={14} /> {todayRevisits} revisites aujourd'hui
              </span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: '12px', color: 'var(--admin-gold)' }}>
              <Repeat size={22} />
            </div>
          </div>
        </div>

        {/* KPI 3 : Appareil le plus utilisé */}
        <div className="admin-card" style={{ padding: '22px', background: 'var(--admin-card-inner)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc">Appareil le plus utilisé</span>
              <h3 style={{ fontSize: '26px', margin: '6px 0', color: 'var(--admin-text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getDeviceIcon(topDevice)}
                <span>{topDevice}</span>
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--admin-coral)', fontWeight: 700 }}>
                {topDevicePercentage}% du trafic total
              </span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(240, 98, 77, 0.12)', border: '1px solid rgba(240, 98, 77, 0.25)', borderRadius: '12px', color: 'var(--admin-coral)' }}>
              <Smartphone size={22} />
            </div>
          </div>
        </div>

        {/* KPI 4 : Pays le plus actif */}
        <div className="admin-card" style={{ padding: '22px', background: 'var(--admin-card-inner)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="admin-card-desc">Pays n°1 des visites</span>
              <h3 style={{ fontSize: '26px', margin: '6px 0', color: 'var(--admin-text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{topCountry}</span>
              </h3>
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
                {topCountryCount} visiteurs ({topCountryPercentage}%)
              </span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', color: '#10B981' }}>
              <Globe size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid : Breakdown Appareils & Pays */}
      <div className="form-grid" style={{ marginBottom: '28px' }}>
        {/* Colonne 1 : Répartition par Modèle d'Appareil */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <Smartphone size={18} color="var(--admin-coral)" />
                Répartition par Type d'Appareil
              </h3>
              <p className="admin-card-desc">Part de marché des systèmes d'exploitation</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'Android', count: deviceCounts.Android, color: '#10B981', icon: <Smartphone size={16} /> },
              { name: 'iPhone / iOS', count: deviceCounts.iPhone + deviceCounts.iPad, color: 'var(--admin-coral)', icon: <Smartphone size={16} /> },
              { name: 'Windows PC', count: deviceCounts.Windows, color: '#3B82F6', icon: <Monitor size={16} /> },
              { name: 'Mac (macOS)', count: deviceCounts.Mac, color: 'var(--admin-gold)', icon: <Apple size={16} /> },
              { name: 'Linux & Autre', count: deviceCounts.Linux + deviceCounts.Autre, color: 'var(--admin-text-muted)', icon: <Laptop size={16} /> }
            ].map(item => {
              const pct = totalUniqueVisitors > 0 ? Math.round((item.count / totalUniqueVisitors) * 100) : 0;
              return (
                <div key={item.name} style={{ background: 'var(--admin-card-inner)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: item.color }}>{item.icon}</span>
                      <strong style={{ fontSize: '14px', color: 'var(--admin-text-main)' }}>{item.name}</strong>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                      {item.count} <span style={{ color: 'var(--admin-text-muted)', fontWeight: 500 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'var(--admin-border)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: item.color, borderRadius: '10px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne 2 : Provenance Géographique */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <Globe size={18} color="var(--admin-teal)" />
                Origine Géographique (Top Pays)
              </h3>
              <p className="admin-card-desc">Pays d'où proviennent les visiteurs</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sortedCountries.length === 0 ? (
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Aucune donnée géographique enregistrée.</p>
            ) : (
              sortedCountries.map(([country, count], idx) => {
                const pct = totalUniqueVisitors > 0 ? Math.round((count / totalUniqueVisitors) * 100) : 0;
                return (
                  <div key={country} style={{ background: 'var(--admin-card-inner)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '6px', 
                          background: 'var(--admin-card-bg)', 
                          border: '1px solid var(--admin-border)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '11px', 
                          fontWeight: 800,
                          color: 'var(--admin-coral)'
                        }}>
                          #{idx + 1}
                        </span>
                        <strong style={{ fontSize: '14px', color: 'var(--admin-text-main)' }}>{country}</strong>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                        {count} visites <span style={{ color: 'var(--admin-text-muted)', fontWeight: 500 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '7px', background: 'var(--admin-border)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--admin-coral), var(--admin-gold))', borderRadius: '10px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Live Visitors Feed Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Users size={18} color="var(--admin-accent)" />
              Journal des Visiteurs Récents ({filteredVisitors.length})
            </h3>
            <p className="admin-card-desc">
              Visualisez le nombre de visites par utilisateur, l'appareil détecté et la dernière activité
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`lang-tab-btn ${timeFilter === 'all' ? 'active' : ''}`}
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
              onClick={() => setTimeFilter('all')}
            >
              Tous les visiteurs
            </button>
            <button
              type="button"
              className={`lang-tab-btn ${timeFilter === 'today' ? 'active' : ''}`}
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
              onClick={() => setTimeFilter('today')}
            >
              Aujourd'hui uniquement
            </button>
          </div>
        </div>

        {filteredVisitors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-text-muted)' }}>
            Aucun visiteur enregistré pour cette période.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Visiteur</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Appareil & Modèle</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Navigateur</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Localisation</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nombre de Visites</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Dernière Visite</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((v, idx) => {
                  const visits = Number(v.visitCount) || 1;
                  const isRecurring = visits > 1;

                  return (
                    <tr 
                      key={v.id || idx} 
                      style={{ 
                        borderBottom: '1px solid var(--admin-border)', 
                        transition: 'background-color 0.2s',
                        background: idx % 2 === 0 ? 'transparent' : 'var(--admin-card-inner)'
                      }}
                    >
                      {/* Visiteur ID */}
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: v.lastVisitDate === today ? '#10B981' : 'var(--admin-text-dim)' 
                          }} />
                          <span>{v.visitorId ? v.visitorId.slice(0, 14) : `Visiteur #${idx + 1}`}</span>
                        </div>
                      </td>

                      {/* Appareil & Modèle */}
                      <td style={{ padding: '14px', color: 'var(--admin-text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getDeviceIcon(v.device)}
                          <div>
                            <strong style={{ display: 'block', fontSize: '13px' }}>{v.device || 'Inconnu'}</strong>
                            <span style={{ fontSize: '11.5px', color: 'var(--admin-text-muted)' }}>{v.deviceModel || v.deviceCategory || 'Mobile'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Navigateur */}
                      <td style={{ padding: '14px', color: 'var(--admin-text-main)' }}>
                        <span style={{ 
                          padding: '3px 8px', 
                          background: 'var(--admin-card-inner)', 
                          border: '1px solid var(--admin-border)', 
                          borderRadius: '6px', 
                          fontSize: '12px' 
                        }}>
                          {v.browser || 'Navigateur standard'}
                        </span>
                      </td>

                      {/* Localisation */}
                      <td style={{ padding: '14px', color: 'var(--admin-text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="var(--admin-coral)" />
                          <span>{v.city ? `${v.city}, ` : ''}{v.country || 'Cameroun'}</span>
                        </div>
                      </td>

                      {/* Nombre de visites (Revisites) */}
                      <td style={{ padding: '14px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: 700,
                          background: isRecurring ? 'rgba(217, 119, 6, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: isRecurring ? 'var(--admin-gold)' : '#10B981',
                          border: isRecurring ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          {isRecurring ? <Repeat size={12} /> : <CheckCircle2 size={12} />}
                          <span>{visits > 1 ? `1 visiteur a visité ${visits} fois` : '1 visiteur (1ère visite)'}</span>
                        </span>
                      </td>

                      {/* Dernière visite */}
                      <td style={{ padding: '14px', color: 'var(--admin-text-muted)', fontSize: '12.5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} />
                          <span>{formatTimeAgo(v.lastVisit)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
