import { initYamsPlayPanel } from './game/yamsPlayPanel';
import { computePossibleScores } from './game/yamsScoring';

const UPPER_COMBOS = [
  { id: 'ones',   name: 'As',      desc: 'Somme des 1',  max: 5  },
  { id: 'twos',   name: 'Deux',    desc: 'Somme des 2',  max: 10 },
  { id: 'threes', name: 'Trois',   desc: 'Somme des 3',  max: 15 },
  { id: 'fours',  name: 'Quatre',  desc: 'Somme des 4',  max: 20 },
  { id: 'fives',  name: 'Cinq',    desc: 'Somme des 5',  max: 25 },
  { id: 'sixes',  name: 'Six',     desc: 'Somme des 6',  max: 30 },
];

const LOWER_COMBOS = [
  { id: 'three_kind', name: 'Brelan',       desc: '3 dés identiques — somme de tous', max: 30 },
  { id: 'four_kind',  name: 'Carré',         desc: '4 dés identiques — somme de tous', max: 30 },
  { id: 'full',       name: 'Full',          desc: 'Brelan + Paire',                   max: 25 },
  { id: 'small_str',  name: 'Petite Suite',  desc: '4 dés consécutifs',                max: 30 },
  { id: 'large_str',  name: 'Grande Suite',  desc: '5 dés consécutifs',                max: 40 },
  { id: 'yams',       name: 'YAMS',          desc: '5 dés identiques — 🏆',            max: 50 },
  { id: 'chance',     name: 'Chance',        desc: 'Somme de tous les dés',            max: 30 },
];

const NUM_PLAYERS = 4;
const ALL_COMBOS = [...UPPER_COMBOS, ...LOWER_COMBOS];

let scores = {};
let activePlayerIndex = 0;
let hasRolledThisTurn = false;
let turnPossibleScores = null;

function initScores() {
  scores = {};
  ALL_COMBOS.forEach(c => {
    scores[c.id] = Array(NUM_PLAYERS).fill(null);
  });
}

function buildTable() {
  const tbody = document.getElementById('scoreBody');
  tbody.innerHTML = '';

  addSectionTitle(tbody, '▲  Section Haute  —  Chiffres');
  UPPER_COMBOS.forEach(c => addScoreRow(tbody, c));
  addTotalRow(tbody, 'subtotal_upper', 'Sous-Total');
  addBonusRow(tbody);
  addTotalRow(tbody, 'total_upper', 'Total Section Haute');

  addSectionTitle(tbody, '▼  Section Basse  —  Combinaisons', true);
  LOWER_COMBOS.forEach(c => addScoreRow(tbody, c));
  addTotalRow(tbody, 'total_lower', 'Total Section Basse');

  addGrandTotalRow(tbody);
}

function addSectionTitle(tbody, label, isLower = false) {
  const tr = document.createElement('tr');
  tr.className = 'section-title' + (isLower ? ' lower' : '');
  tr.innerHTML = `<td colspan="${NUM_PLAYERS + 1}">${label}</td>`;
  tbody.appendChild(tr);
}

function addScoreRow(tbody, combo) {
  const tr = document.createElement('tr');
  tr.className = 'score-row';
  tr.dataset.comboId = combo.id;

  const td = document.createElement('td');
  td.className = 'col-combo';
  td.innerHTML = `
    <span class="combo-name">${combo.name}</span>
    <span class="combo-max">${combo.max} pts</span>
    <span class="combo-desc">${combo.desc}</span>
  `;
  tr.appendChild(td);

  for (let p = 0; p < NUM_PLAYERS; p++) {
    const cell = document.createElement('td');
    cell.className = 'score-cell';
    const value = document.createElement('span');
    value.className = 'score-value';
    value.dataset.combo = combo.id;
    value.dataset.player = p;
    cell.addEventListener('click', () => onTurnScoreClick(combo.id, p));
    cell.appendChild(value);
    tr.appendChild(cell);
  }

  tbody.appendChild(tr);
}

function addTotalRow(tbody, id, label) {
  const tr = document.createElement('tr');
  tr.className = 'total-row';

  const td = document.createElement('td');
  td.className = 'col-combo';
  td.textContent = label;
  tr.appendChild(td);

  for (let p = 0; p < NUM_PLAYERS; p++) {
    const cell = document.createElement('td');
    cell.className = 'score-cell';
    const value = document.createElement('span');
    value.className = 'total-value';
    value.dataset.totalId = id;
    value.dataset.player = p;
    cell.appendChild(value);
    tr.appendChild(cell);
  }

  tbody.appendChild(tr);
}

function addBonusRow(tbody) {
  const tr = document.createElement('tr');
  tr.className = 'bonus-row';

  const td = document.createElement('td');
  td.className = 'col-combo';
  td.innerHTML = `
    <span class="combo-name">Bonus</span>
    <span class="combo-desc">+35 pts si Sous-Total ≥ 63</span>
  `;
  tr.appendChild(td);

  for (let p = 0; p < NUM_PLAYERS; p++) {
    const cell = document.createElement('td');
    cell.className = 'score-cell';
    const value = document.createElement('span');
    value.className = 'total-value';
    value.dataset.totalId = 'bonus';
    value.dataset.player = p;
    cell.appendChild(value);
    tr.appendChild(cell);
  }

  tbody.appendChild(tr);
}

function addGrandTotalRow(tbody) {
  const tr = document.createElement('tr');
  tr.className = 'grand-total-row';

  const td = document.createElement('td');
  td.className = 'col-combo';
  td.textContent = '🏆  TOTAL GÉNÉRAL';
  tr.appendChild(td);

  for (let p = 0; p < NUM_PLAYERS; p++) {
    const cell = document.createElement('td');
    cell.className = 'score-cell';
    const value = document.createElement('span');
    value.className = 'total-value';
    value.dataset.totalId = 'grand';
    value.dataset.player = p;
    cell.appendChild(value);
    tr.appendChild(cell);
  }

  tbody.appendChild(tr);
}

function onTurnScoreClick(comboId, playerIndex) {
  if (playerIndex !== activePlayerIndex) return;
  if (!hasRolledThisTurn || !turnPossibleScores) return;
  if (scores[comboId][playerIndex] !== null) return;

  const selectedScore = turnPossibleScores[comboId] || 0;
  setScore(comboId, playerIndex, selectedScore);
  clearTurnState();
  renderTurnSuggestions();

  if (typeof window.advanceToNextPlayer === 'function') {
    window.advanceToNextPlayer();
  }
}

function getScoreInput(comboId, playerIndex) {
  return document.querySelector(`[data-combo="${comboId}"][data-player="${playerIndex}"]`);
}

function setScore(comboId, playerIndex, value) {
  const input = getScoreInput(comboId, playerIndex);
  if (!input) return;

  scores[comboId][playerIndex] = value;
  input.textContent = String(value);
  input.classList.add('filled');
  input.classList.remove('suggested');

  updateTotals(playerIndex);
}

function clearTurnState() {
  hasRolledThisTurn = false;
  turnPossibleScores = null;
}

function renderTurnSuggestions() {
  ALL_COMBOS.forEach(combo => {
    const input = getScoreInput(combo.id, activePlayerIndex);
    if (!input) return;

    const row = input.closest('.score-row');
    const committedScore = scores[combo.id][activePlayerIndex];
    const canShowSuggestion = committedScore === null && hasRolledThisTurn && !!turnPossibleScores;

    if (committedScore !== null) {
      input.textContent = String(committedScore);
      input.classList.add('filled');
      input.classList.remove('suggested');
      if (row) row.classList.remove('is-turn-selectable');
      return;
    }

    if (!canShowSuggestion) {
      input.textContent = '';
      input.classList.remove('suggested');
      if (row) row.classList.remove('is-turn-selectable');
      return;
    }

    input.textContent = String(turnPossibleScores[combo.id] || 0);
    input.classList.add('suggested');
    if (row) row.classList.add('is-turn-selectable');
  });
}

function onRollResult({ playerIndex, diceValues }) {
  activePlayerIndex = playerIndex;
  hasRolledThisTurn = true;
  turnPossibleScores = computePossibleScores(diceValues);
  renderTurnSuggestions();
}

function onPlayerChange(playerIndex) {
  activePlayerIndex = playerIndex;
  clearTurnState();
  renderTurnSuggestions();
}

function updateTotals(player) {
  const subUpper = UPPER_COMBOS.reduce((sum, c) => sum + (scores[c.id][player] || 0), 0);
  setTotal('subtotal_upper', player, subUpper);

  const bonus = subUpper >= 63 ? 35 : 0;
  document.querySelectorAll(`[data-total-id="bonus"][data-player="${player}"]`).forEach(inp => {
    inp.textContent = bonus > 0 ? '+35' : '';
  });

  setTotal('total_upper', player, subUpper + bonus);

  const totalLower = LOWER_COMBOS.reduce((sum, c) => sum + (scores[c.id][player] || 0), 0);
  setTotal('total_lower', player, totalLower);

  setTotal('grand', player, subUpper + bonus + totalLower);

  checkWinner();
}

function setTotal(id, player, value) {
  document.querySelectorAll(`[data-total-id="${id}"][data-player="${player}"]`).forEach(inp => {
    inp.textContent = value > 0 ? String(value) : '';
  });
}

function checkWinner() {
  const allFilled = ALL_COMBOS.every(c => scores[c.id].every(v => v !== null));
  if (!allFilled) return;

  const grandInputs = document.querySelectorAll('[data-total-id="grand"]');
  let max = -1, winnerIdx = -1;
  grandInputs.forEach((inp, i) => {
    const v = parseInt(inp.textContent) || 0;
    if (v > max) { max = v; winnerIdx = i; }
  });

  const name = document.querySelectorAll('.player-name-input')[winnerIdx]?.value || `Joueur ${winnerIdx + 1}`;
  showToast(`🏆 ${name} gagne avec ${max} points !`);
}

window.resetGrid = function () {
  if (!confirm('Réinitialiser toute la grille ?')) return;
  initScores();
  document.querySelectorAll('.score-value[data-combo]').forEach(inp => {
    inp.textContent = '';
    inp.classList.remove('filled', 'suggested');
  });
  document.querySelectorAll('.total-value[data-total-id]').forEach(inp => { inp.textContent = ''; });
  clearTurnState();
  activePlayerIndex = 0;
  renderTurnSuggestions();
  if (typeof window.resetPlayPanel === 'function') {
    window.resetPlayPanel();
  }
  showToast('Grille réinitialisée');
};

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

initScores();
buildTable();
initYamsPlayPanel({
  onMessage: showToast,
  onRollResult,
  onPlayerChange,
});
