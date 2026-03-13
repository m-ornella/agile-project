# YAMS

Application web de feuille de score Yams multijoueur avec lancers de des, calcul des combinaisons et suivi des scores.

## L'equipe

| Membre | Role Scrum |
|---|---|
| Louis Brousse | Developpeur / integration |
| Samuel Vidal | Developpeur |
| m-ornella | Scrum Master *(a ajuster si besoin)* |
| Vydeuh | Product Owner *(a ajuster si besoin)* |

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
npm install
npm run dev
```

Puis ouvrir l'URL affichee par Vite dans le navigateur.
