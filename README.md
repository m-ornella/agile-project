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

## Installation

```bash
npm install
```

## Developpement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
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
