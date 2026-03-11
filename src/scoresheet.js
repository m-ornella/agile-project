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
let scores = {};

function initScores() {
  scores = {};
  [...UPPER_COMBOS, ...LOWER_COMBOS].forEach(c => {
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
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = combo.max;
    input.placeholder = '—';
    input.dataset.combo = combo.id;
    input.dataset.player = p;
    input.addEventListener('change', onScoreChange);
    input.addEventListener('focus', e => e.target.select());
    cell.appendChild(input);
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
    const input = document.createElement('input');
    input.type = 'number';
    input.readOnly = true;
    input.placeholder = '0';
    input.dataset.totalId = id;
    input.dataset.player = p;
    cell.appendChild(input);
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
    const input = document.createElement('input');
    input.type = 'text';
    input.readOnly = true;
    input.placeholder = '—';
    input.dataset.totalId = 'bonus';
    input.dataset.player = p;
    cell.appendChild(input);
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
    const input = document.createElement('input');
    input.type = 'number';
    input.readOnly = true;
    input.placeholder = '0';
    input.dataset.totalId = 'grand';
    input.dataset.player = p;
    cell.appendChild(input);
    tr.appendChild(cell);
  }

  tbody.appendChild(tr);
}

function onScoreChange(e) {
  const input = e.target;
  const combo = input.dataset.combo;
  const player = parseInt(input.dataset.player);
  const val = input.value === '' ? null : parseInt(input.value);

  const comboObj = [...UPPER_COMBOS, ...LOWER_COMBOS].find(c => c.id === combo);
  if (val !== null && comboObj && val > comboObj.max) {
    input.value = comboObj.max;
    scores[combo][player] = comboObj.max;
  } else {
    scores[combo][player] = val;
  }

  input.classList.toggle('filled', val !== null && input.value !== '');
  updateTotals(player);
}

function updateTotals(player) {
  const subUpper = UPPER_COMBOS.reduce((sum, c) => sum + (scores[c.id][player] || 0), 0);
  setTotal('subtotal_upper', player, subUpper);

  const bonus = subUpper >= 63 ? 35 : 0;
  document.querySelectorAll(`[data-total-id="bonus"][data-player="${player}"]`).forEach(inp => {
    inp.value = bonus > 0 ? '+35' : '';
  });

  setTotal('total_upper', player, subUpper + bonus);

  const totalLower = LOWER_COMBOS.reduce((sum, c) => sum + (scores[c.id][player] || 0), 0);
  setTotal('total_lower', player, totalLower);

  setTotal('grand', player, subUpper + bonus + totalLower);

  checkWinner();
}

function setTotal(id, player, value) {
  document.querySelectorAll(`[data-total-id="${id}"][data-player="${player}"]`).forEach(inp => {
    inp.value = value > 0 ? value : '';
  });
}

function checkWinner() {
  const allCombos = [...UPPER_COMBOS, ...LOWER_COMBOS];
  const allFilled = allCombos.every(c => scores[c.id].every(v => v !== null));
  if (!allFilled) return;

  const grandInputs = document.querySelectorAll('[data-total-id="grand"]');
  let max = -1, winnerIdx = -1;
  grandInputs.forEach((inp, i) => {
    const v = parseInt(inp.value) || 0;
    if (v > max) { max = v; winnerIdx = i; }
  });

  const name = document.querySelectorAll('.player-name-input')[winnerIdx]?.value || `Joueur ${winnerIdx + 1}`;
  showToast(`🏆 ${name} gagne avec ${max} points !`);
}

window.resetGrid = function () {
  if (!confirm('Réinitialiser toute la grille ?')) return;
  initScores();
  document.querySelectorAll('.score-cell input:not([readonly])').forEach(inp => {
    inp.value = '';
    inp.classList.remove('filled');
  });
  document.querySelectorAll('[data-total-id]').forEach(inp => { inp.value = ''; });
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