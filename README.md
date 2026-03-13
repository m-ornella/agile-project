# 🎲 Yams JS

> Un jeu de Yams jouable dans le navigateur, développé en JavaScript vanilla.

---

## 👥 L'équipe

| Nom | Rôle Scrum |
|-----|------------|
| Aymeric Barbot| Product Owner |
| Marie-Ornella Vitry | Scrum Master |
| Louis Brousse | Développeur |
| Samuel Vidal | Développeur |

---

## 🎯 La vision produit

**Quel problème résout ce projet ?**
Permettre de jouer au Yams directement dans un navigateur, sans installation, de manière simple et intuitive.

> En tant que **joueur**, ce projet permet de **jouer une partie de Yams complète en ligne, avec gestion des lancers, des dés et du tableau de score.**

---

## 📋 Product Backlog

| ID | User Story | MoSCoW | Statut |
|----|------------|--------|--------|
| US-01 | Afficher la grille visuelle des scores | Must | ⏳ En cours |
| US-02 | Créer une fonction de lancer paramétrable (X dés de 1 à 6) | Must | ⏳ En cours |
| US-03 | Sélectionner les dés à relancer | Must | ⏳ En cours |
| US-04 | Afficher les 5 dés et un bouton pour les lancer | Must | ⏳ En cours |
| US-05 | Calculer le score selon les dés enregistrés dans une case | Must | ❌ Reporté |
| US-06 | Verrouiller jusqu'à 4 dés pour le prochain lancer | Must | ❌ Reporté |
| US-07 | Valider et enregistrer ses dés dans une case du tableau | Must | ⏳ En cours |
| US-08 | Tirage aléatoire initial de 5 dés à 6 faces | Must | ⏳ En cours |
| US-09 | Additionner les scores de chaque case pour afficher le total | Must | ❌ Reporté |

---

## ✅ Ce qui a été livré (MVP)

> À compléter après chaque sprint.

Fonctionnalités démo-ables :
- À compléter

**Lancer le projet en local :**
```bash
# Cloner le repo
git clone https://github.com/m-ornella/agile-project.git

## L'equipe

| Membre | Role Scrum |
|---|---|
| Louis Brousse | Developpeur / integration |
| Samuel Vidal | Developpeur |
| Marie-Ornella Vitry | Scrum Master |
| Aymeric Barbot | Product Owner |

## La vision produit

En tant que joueur, ce produit permet de jouer une partie de Yams a plusieurs sur une interface web unique, avec une feuille de score interactive et des suggestions de points automatiques.

Probleme resolu : eviter le papier, les erreurs de calcul et la gestion manuelle des tours pendant une partie de Yams.

## Product Backlog complet

| # | User Story | MoSCoW | Story Points | Sprint | Statut |
|---|---|---|---|---|---|
| US-01 | En tant que joueur, je veux lancer les des pour generer un tirage aleatoire. | Must | 3 | Sprint 1 | ✅ Livre |
| US-02 | En tant que joueur, je veux voir une grille de score interactive pour suivre la partie. | Must | 5 | Sprint 1 | ✅ Livre |
| US-03 | En tant que joueur, je veux gerer un tour de jeu avec jusqu'a 3 lancers et selection des des a relancer. | Must | 5 | Sprint 1 | ✅ Livre |
| US-04 | En tant que joueur, je veux obtenir automatiquement les scores possibles selon mon tirage. | Must | 3 | Sprint 2 | ✅ Livre |
| US-05 | En tant que joueur, je veux une interface lisible sur differentes tailles d'ecran. | Should | 2 | Sprint 2 | ✅ Livre |
| US-06 | En tant que joueur, je veux des retours visuels clairs pour savoir qui joue et quelles actions sont possibles. | Should | 2 | Sprint 2 | ✅ Livre |
| US-07 | En tant que joueur, je veux pouvoir sauvegarder et reprendre une partie plus tard. | Could | 5 | Sprint 2 | ⏳ Reporte |

## Sprint 1 - Ce qui a ete livre

- Initialisation du projet Vite et structure du depot Git.
- Fonction de lancer de des aleatoire.
- Creation de la feuille de score interactive pour 4 joueurs.
- Mise en place du play panel avec joueur actif, lancers restants et relance selective.
- Vitesse reelle observee : **13 pts**.

## Sprint 2 - Ce qui a ete livre

- Calcul automatique des scores possibles selon les 5 des.
- Validation d'un score par clic dans la grille.
- Calcul des sous-totaux, bonus, total general et detection du gagnant.
- Ajustements UX et adaptation responsive pour eviter le scroll horizontal.
- Vitesse reelle observee : **7 pts**.

## Ce qui a ete reporte et pourquoi

- **US-07 Sauvegarde de partie** : non livree par manque de temps. La priorite a ete donnee a une boucle de jeu complete et demonstrable plutot qu'a la persistance.

## Notre Burn-up Chart

Description textuelle du burn-up :

| Sprint | Points livres cumules | Total backlog |
|---|---:|---:|
| Depart | 0 | 25 |
| Fin Sprint 1 | 13 | 25 |
| Fin Sprint 2 | 20 | 25 |

Lecture : l'equipe a livre un premier socle jouable au Sprint 1, puis a consolide le produit au Sprint 2 avec le calcul de score et l'UX. Le backlog restant est de **5 pts**.

Velocite Sprint 1 : **13 pts** | Sprint 2 : **7 pts**

## Nos decisions techniques

Stack choisie : **HTML, CSS, JavaScript, Vite**

Pourquoi : stack simple, rapide a mettre en place pendant l'atelier, suffisante pour produire une application front jouable sans surcout de framework.

1 decision d'architecture importante : **separer la logique metier du Yams en modules dedies**.

- `src/service/lancerDes.js` gere l'alea des lancers.
- `src/game/yamsTurnState.js` gere l'etat d'un tour.
- `src/game/yamsScoring.js` calcule les combinaisons possibles.
- `src/scoresheet.js` orchestre l'interface et les interactions utilisateur.

## Comment on a utilise l'IA

- Prompts qui ont bien marche : generation de structure de projet, aide sur la decoupe en modules, suggestions de logique de calcul de score et d'ameliorations UX.
- Ce que l'IA n'a pas su faire : garantir seule la coherence complete entre les regles du jeu, l'UX reelle et le branchement final dans l'interface.
- Temps gagne estime : **30 a 40 %** sur le bootstrap, certaines fonctions utilitaires et la mise en forme.

## Retrospective finale

| | Sprint 1 | Sprint 2 |
|---|---|---|
| ✓ Ce qui a marche | Bon decoupage initial, demarrage rapide, premiers increments visibles tres tot. | Meilleure finition produit, UX plus claire, responsive mieux gere. |
| △ Ce qu'on ameliorerait | Mieux formaliser les roles Scrum et les Story Points des le debut. | Mieux anticiper l'integration finale et garder `main`/`develop` synchronises plus souvent. |

## Lancer le projet en local

```bash
git clone https://github.com/m-ornella/agile-project.git
cd agile-project
npm install
npm run dev
```

Puis ouvrir l'URL affichee par Vite dans le navigateur.

## Lancer la base de donnees

L'application utilise MySQL pour sauvegarder les parties, reprendre une partie enregistree et calculer le scoreboard global.

```bash
cp .env.example .env
docker compose up -d
docker compose ps
```

Pour arreter la base :

```bash
docker compose down
```

## Monitorer la base avec Adminer

Adminer est disponible pour visualiser les tables, verifier les parties sauvegardees et lancer des requetes SQL.

URL :

```text
http://localhost:8080
```

Parametres de connexion :

- Systeme : `MySQL`
- Serveur : `mysql`
- Utilisateur : `root`
- Mot de passe : `root`
- Base de donnees : `yams`

Important :

- le champ `Serveur` doit etre `mysql` et non `db`
- attendre que le conteneur MySQL soit bien demarre avec `docker compose ps`

## Lancer le backend API

```bash
node server/index.js
```

Le serveur backend demarre par defaut sur `http://localhost:3000`.

## Tests fonctionnels

Les tests fonctionnels verifies pour l'US base de donnees couvrent :

- la creation d'une partie
- l'association des joueurs a une partie
- la sauvegarde des scores
- la reprise d'une partie sauvegardee
- le scoreboard global

Execution :

```bash
node --test test/functional/*.test.js
```

# kamban avec trello

lien trello: https://trello.com/invite/b/69b128c35d2e49140737d748/ATTI855e5e951a93f3e3b303b2a5964de6b6E5EAC80F/cours-agile

---

## ❌ Ce qui a été reporté et pourquoi

| US | Raison |
|----|--------|
| US-05 | Logique métier complexe — scoring de toutes les combinaisons Yams |
| US-09 | Dépend de US-05 |
| À compléter | À compléter |

---

## 🛠️ Nos décisions techniques

**Stack :**
- JavaScript Vanilla — choisi pour rester proche des fondamentaux, sans dépendance externe
- HTML/CSS — structure et style sans framework

**Décisions importantes :**
1. **Séparation logique / affichage** — les fonctions de calcul (lancerDes, calculScore) sont pures et indépendantes du DOM pour faciliter les tests
2. À compléter

---

## 🤖 Comment on a utilisé l'IA

**Prompts qui ont bien marché :**
- Génération des User Stories Scrum avec estimation en story points
- À compléter

**Prompts qui ont échoué :**
- À compléter

**Ce que l'IA n'a pas su faire :**
- À compléter

---

## 🔁 Rétrospective rapide

**1 chose qui a bien marché :**
> À compléter

**1 chose qu'on ferait différemment :**
> À compléter
