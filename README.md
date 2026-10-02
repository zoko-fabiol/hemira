# HEMIRA Travel & Services — Reproduction React & Firebase Complète

Projet complet prêt pour la production reproduisant et sublimant l'intégralité du site officiel **HEMIRA Travel & Services** (Douala, Akwa - Cameroun) ainsi que son **Chatbot officiel "Assistant HEMIRA"**.

## Pages & Structure reproduites
1. **Accueil (`/`)** : Slogan, Présentation, Chiffres clés (6 services, 2 associées, 1 contact unique, 7j/7), Recherche rapide de vols/visas/hôtels.
2. **Services (`/services`)** : Les 6 piliers de voyage avec modale et la section officielle *"Nos engagements envers vous"* (Un point de contact, Rapidité & Disponibilité, Confiance & Proximité).
3. **À Propos (`/about`)** : Présentation des fondatrices **Jeanne Hélène Epée Nsome** et **Miriam J. Nguemdo Epse Nouzeda**, histoire, vision et valeurs.
4. **Nos Réalisations (`/case-studies`)** : *"Exemples de voyages organisés par HEMIRA"* (billets d'urgence, visas d'affaires Dubaï, séminaire Kribi, visa étudiant Canada).
5. **Contact (`/contact`)** : Simulateur de devis Firestore, adresse Akwa (101 Rue du Bruix, Douala), téléphones et formulaire.

## Le Chatbot Officiel "Assistant HEMIRA"
- Bulle flottante en bas à droite avec indicateur de présence en ligne.
- Bilingue FR / EN dynamique selon la langue du site.
- Actions rapides : `🧭 Nos services`, `📞 Contact`, `💳 Tarifs & Devis`, `📍 Adresse Douala`.
- Saisie libre avec moteur de réponse contextuel et sauvegarde des conversations dans Firestore (`chat_inquiries`).

## Back-Office Administrateur Temps Réel
- Accès via le bouton discret **"Espace Pro"** dans la barre de navigation.
- Affichage en temps réel des demandes de devis transmises avec mise à jour des statuts (*En attente*, *Traité*).

## Installation et lancement
```bash
# 1. Installer les packages
npm install

# 2. Lancer en local
npm run dev

# 3. Compiler pour production
npm run build
```
