import { initYamsPlayPanel } from './game/yamsPlayPanel'
import { computePossibleScores } from './game/yamsScoring'

const API_BASE_URL = 'http://localhost:3000'

const UPPER_COMBOS = [
  { id: 'ones', name: 'As', desc: 'Somme des 1', max: 5 },
  { id: 'twos', name: 'Deux', desc: 'Somme des 2', max: 10 },
  { id: 'threes', name: 'Trois', desc: 'Somme des 3', max: 15 },
  { id: 'fours', name: 'Quatre', desc: 'Somme des 4', max: 20 },
  { id: 'fives', name: 'Cinq', desc: 'Somme des 5', max: 25 },
  { id: 'sixes', name: 'Six', desc: 'Somme des 6', max: 30 },
]

const LOWER_COMBOS = [
  { id: 'three_kind', name: 'Brelan', desc: '3 des identiques - somme de tous', max: 30 },
  { id: 'four_kind', name: 'Carre', desc: '4 des identiques - somme de tous', max: 30 },
  { id: 'full', name: 'Full', desc: 'Brelan + Paire', max: 25 },
  { id: 'small_str', name: 'Petite Suite', desc: '4 des consecutifs', max: 30 },
  { id: 'large_str', name: 'Grande Suite', desc: '5 des consecutifs', max: 40 },
  { id: 'yams', name: 'YAMS', desc: '5 des identiques', max: 50 },
  { id: 'chance', name: 'Chance', desc: 'Somme de tous les des', max: 30 },
]

const ALL_COMBOS = [...UPPER_COMBOS, ...LOWER_COMBOS]

const setupPanel = document.getElementById('setupPanel')
const gameShell = document.getElementById('gameShell')
const playerCountInput = document.getElementById('playerCountInput')
const playerNameInput = document.getElementById('playerNameInput')
const addPlayerButton = document.getElementById('addPlayerButton')
const startGameButton = document.getElementById('startGameButton')
const addedPlayerList = document.getElementById('addedPlayerList')
const addedPlayersStatus = document.getElementById('addedPlayersStatus')
const playerCountHelp = document.getElementById('playerCountHelp')
const scoreHeaderRow = document.getElementById('scoreHeaderRow')
const scoreBody = document.getElementById('scoreBody')
const resetGameButton = document.getElementById('resetGameButton')

let players = []
let scores = {}
let activePlayerIndex = 0
let hasRolledThisTurn = false
let turnPossibleScores = null
let currentGameId = null
let playPanelController = null

function getTargetPlayerCount() {
  return Number.parseInt(playerCountInput.value, 10)
}

function isValidPlayerCount(value) {
  return Number.isInteger(value) && value > 0
}

function normalizePlayerName(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function getPlayerName(playerIndex) {
  return players[playerIndex]?.name || `Joueur ${playerIndex + 1}`
}

function updateSetupState() {
  const targetPlayerCount = getTargetPlayerCount()
  const countIsValid = isValidPlayerCount(targetPlayerCount)
  const playerCountReached = countIsValid && players.length === targetPlayerCount
  const playerCountExceeded = countIsValid && players.length > targetPlayerCount

  addPlayerButton.disabled = !countIsValid || playerCountReached
  startGameButton.disabled = !playerCountReached

  if (!countIsValid) {
    playerCountHelp.textContent = 'Renseignez un nombre de joueurs strictement positif.'
  } else if (playerCountExceeded) {
    playerCountHelp.textContent = 'Trop de joueurs ajoutes. Reinitialisez ou ajustez le nombre attendu.'
  } else if (playerCountReached) {
    playerCountHelp.textContent = 'Tous les joueurs sont renseignes. Vous pouvez lancer la partie.'
  } else {
    playerCountHelp.textContent = `Ajoutez encore ${targetPlayerCount - players.length} joueur(s).`
  }

  const suffix = players.length > 1 ? 's' : ''
  addedPlayersStatus.textContent = `${players.length} joueur${suffix} ajoute${suffix}`
}

function renderAddedPlayers() {
  addedPlayerList.innerHTML = ''

  if (players.length === 0) {
    const emptyItem = document.createElement('li')
    emptyItem.className = 'added-player-list-empty'
    emptyItem.textContent = 'Aucun joueur ajoute pour le moment.'
    addedPlayerList.appendChild(emptyItem)
    return
  }

  players.forEach((player, index) => {
    const item = document.createElement('li')
    item.className = 'added-player-item'
    item.innerHTML = `<span class="added-player-index">${index + 1}</span><span class="added-player-name">${player.name}</span>`
    addedPlayerList.appendChild(item)
  })
}

function initScores() {
  scores = {}
  ALL_COMBOS.forEach(combo => {
    scores[combo.id] = Array(players.length).fill(null)
  })
}

function buildHeader() {
  scoreHeaderRow.innerHTML = ''

  const comboHeader = document.createElement('th')
  comboHeader.className = 'col-combo'
  comboHeader.textContent = 'Combinaison'
  scoreHeaderRow.appendChild(comboHeader)

  players.forEach((player, index) => {
    const playerCell = document.createElement('th')
    playerCell.className = 'score-cell player-header-cell'
    playerCell.innerHTML = `
      <span class="player-chip-index">J${index + 1}</span>
      <span class="player-chip-name">${player.name}</span>
    `
    scoreHeaderRow.appendChild(playerCell)
  })
}

function buildTable() {
  scoreBody.innerHTML = ''

  addSectionTitle('Section Haute - Chiffres')
  UPPER_COMBOS.forEach(combo => addScoreRow(combo))
  addTotalRow('subtotal_upper', 'Sous-Total')
  addBonusRow()
  addTotalRow('total_upper', 'Total Section Haute')

  addSectionTitle('Section Basse - Combinaisons', true)
  LOWER_COMBOS.forEach(combo => addScoreRow(combo))
  addTotalRow('total_lower', 'Total Section Basse')

  addGrandTotalRow()
}

function addSectionTitle(label, isLower = false) {
  const row = document.createElement('tr')
  row.className = `section-title${isLower ? ' lower' : ''}`
  row.innerHTML = `<td colspan="${players.length + 1}">${label}</td>`
  scoreBody.appendChild(row)
}

function addScoreRow(combo) {
  const row = document.createElement('tr')
  row.className = 'score-row'
  row.dataset.comboId = combo.id

  const comboCell = document.createElement('td')
  comboCell.className = 'col-combo'
  comboCell.innerHTML = `
    <span class="combo-name">${combo.name}</span>
    <span class="combo-max">${combo.max} pts</span>
    <span class="combo-desc">${combo.desc}</span>
  `
  row.appendChild(comboCell)

  players.forEach((_, playerIndex) => {
    const scoreCell = document.createElement('td')
    scoreCell.className = 'score-cell'
    const value = document.createElement('span')
    value.className = 'score-value'
    value.dataset.combo = combo.id
    value.dataset.player = String(playerIndex)
    scoreCell.addEventListener('click', () => onTurnScoreClick(combo.id, playerIndex))
    scoreCell.appendChild(value)
    row.appendChild(scoreCell)
  })

  scoreBody.appendChild(row)
}

function addTotalRow(id, label) {
  const row = document.createElement('tr')
  row.className = 'total-row'

  const labelCell = document.createElement('td')
  labelCell.className = 'col-combo'
  labelCell.textContent = label
  row.appendChild(labelCell)

  players.forEach((_, playerIndex) => {
    const scoreCell = document.createElement('td')
    scoreCell.className = 'score-cell'
    const value = document.createElement('span')
    value.className = 'total-value'
    value.dataset.totalId = id
    value.dataset.player = String(playerIndex)
    scoreCell.appendChild(value)
    row.appendChild(scoreCell)
  })

  scoreBody.appendChild(row)
}

function addBonusRow() {
  const row = document.createElement('tr')
  row.className = 'bonus-row'

  const labelCell = document.createElement('td')
  labelCell.className = 'col-combo'
  labelCell.innerHTML = `
    <span class="combo-name">Bonus</span>
    <span class="combo-desc">+35 pts si Sous-Total >= 63</span>
  `
  row.appendChild(labelCell)

  players.forEach((_, playerIndex) => {
    const scoreCell = document.createElement('td')
    scoreCell.className = 'score-cell'
    const value = document.createElement('span')
    value.className = 'total-value'
    value.dataset.totalId = 'bonus'
    value.dataset.player = String(playerIndex)
    scoreCell.appendChild(value)
    row.appendChild(scoreCell)
  })

  scoreBody.appendChild(row)
}

function addGrandTotalRow() {
  const row = document.createElement('tr')
  row.className = 'grand-total-row'

  const labelCell = document.createElement('td')
  labelCell.className = 'col-combo'
  labelCell.textContent = 'TOTAL GENERAL'
  row.appendChild(labelCell)

  players.forEach((_, playerIndex) => {
    const scoreCell = document.createElement('td')
    scoreCell.className = 'score-cell'
    const value = document.createElement('span')
    value.className = 'total-value'
    value.dataset.totalId = 'grand'
    value.dataset.player = String(playerIndex)
    scoreCell.appendChild(value)
    row.appendChild(scoreCell)
  })

  scoreBody.appendChild(row)
}

function getScoreInput(comboId, playerIndex) {
  return document.querySelector(`[data-combo="${comboId}"][data-player="${playerIndex}"]`)
}

function setScore(comboId, playerIndex, value) {
  const input = getScoreInput(comboId, playerIndex)
  if (!input) return

  scores[comboId][playerIndex] = value
  input.textContent = String(value)
  input.classList.add('filled')
  input.classList.remove('suggested')

  updateTotals(playerIndex)
}

function clearTurnState() {
  hasRolledThisTurn = false
  turnPossibleScores = null
}

function renderTurnSuggestions() {
  ALL_COMBOS.forEach(combo => {
    const input = getScoreInput(combo.id, activePlayerIndex)
    if (!input) return

    const row = input.closest('.score-row')
    const committedScore = scores[combo.id][activePlayerIndex]
    const canShowSuggestion = committedScore === null && hasRolledThisTurn && !!turnPossibleScores

    if (committedScore !== null) {
      input.textContent = String(committedScore)
      input.classList.add('filled')
      input.classList.remove('suggested')
      if (row) row.classList.remove('is-turn-selectable')
      return
    }

    if (!canShowSuggestion) {
      input.textContent = ''
      input.classList.remove('suggested')
      if (row) row.classList.remove('is-turn-selectable')
      return
    }

    input.textContent = String(turnPossibleScores[combo.id] || 0)
    input.classList.add('suggested')
    if (row) row.classList.add('is-turn-selectable')
  })
}

function onRollResult({ playerIndex, diceValues }) {
  activePlayerIndex = playerIndex
  hasRolledThisTurn = true
  turnPossibleScores = computePossibleScores(diceValues)
  renderTurnSuggestions()
}

function onPlayerChange(playerIndex) {
  activePlayerIndex = playerIndex
  clearTurnState()
  renderTurnSuggestions()
}

function setTotal(id, playerIndex, value) {
  document.querySelectorAll(`[data-total-id="${id}"][data-player="${playerIndex}"]`).forEach(node => {
    node.textContent = value > 0 ? String(value) : ''
  })
}

function updateTotals(playerIndex) {
  const subUpper = UPPER_COMBOS.reduce((sum, combo) => sum + (scores[combo.id][playerIndex] || 0), 0)
  setTotal('subtotal_upper', playerIndex, subUpper)

  const bonus = subUpper >= 63 ? 35 : 0
  document.querySelectorAll(`[data-total-id="bonus"][data-player="${playerIndex}"]`).forEach(node => {
    node.textContent = bonus > 0 ? '+35' : ''
  })

  setTotal('total_upper', playerIndex, subUpper + bonus)

  const totalLower = LOWER_COMBOS.reduce((sum, combo) => sum + (scores[combo.id][playerIndex] || 0), 0)
  setTotal('total_lower', playerIndex, totalLower)
  setTotal('grand', playerIndex, subUpper + bonus + totalLower)

  void finalizeGameIfComplete()
}

async function saveGameScores() {
  if (!currentGameId) return

  const payload = {
    players: players.map((player, index) => ({
      id: player.id,
      name: player.name,
      score: Number(document.querySelector(`[data-total-id="grand"][data-player="${index}"]`)?.textContent || 0),
    })),
  }

  const response = await fetch(`${API_BASE_URL}/games/${currentGameId}/score`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Impossible de sauvegarder les scores de la partie.')
  }

  return response.json()
}

let gameSaved = false

async function finalizeGameIfComplete() {
  const allFilled = ALL_COMBOS.every(combo => scores[combo.id].every(value => value !== null))
  if (!allFilled || gameSaved) return

  let maxScore = -1
  let winnerIndex = -1

  players.forEach((player, index) => {
    const value = Number(document.querySelector(`[data-total-id="grand"][data-player="${index}"]`)?.textContent || 0)
    if (value > maxScore) {
      maxScore = value
      winnerIndex = index
    }
  })

  try {
    await saveGameScores()
    gameSaved = true
    showToast(`${getPlayerName(winnerIndex)} gagne avec ${maxScore} points. Partie sauvegardee.`)
  } catch (error) {
    showToast(error.message)
  }
}

function onTurnScoreClick(comboId, playerIndex) {
  if (playerIndex !== activePlayerIndex) return
  if (!hasRolledThisTurn || !turnPossibleScores) return
  if (scores[comboId][playerIndex] !== null) return

  const selectedScore = turnPossibleScores[comboId] || 0
  setScore(comboId, playerIndex, selectedScore)
  clearTurnState()
  renderTurnSuggestions()

  if (playPanelController) {
    playPanelController.advanceToNextPlayer()
  }
}

function resetGameUi() {
  players = []
  scores = {}
  activePlayerIndex = 0
  hasRolledThisTurn = false
  turnPossibleScores = null
  currentGameId = null
  gameSaved = false
  scoreHeaderRow.innerHTML = ''
  scoreBody.innerHTML = ''
  addedPlayerList.innerHTML = ''
  playerCountInput.value = ''
  playerNameInput.value = ''
  renderAddedPlayers()
  updateSetupState()

  if (playPanelController) {
    playPanelController.destroy()
    playPanelController = null
  }

  setupPanel.classList.remove('is-hidden')
  gameShell.classList.add('is-hidden')
}

function showToast(message) {
  const toast = document.getElementById('toast')
  toast.textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 3000)
}

async function startGame() {
  try {
    const gameResponse = await fetch(`${API_BASE_URL}/games`, { method: 'POST' })
    if (!gameResponse.ok) {
      throw new Error('Impossible de creer une nouvelle partie.')
    }

    const game = await gameResponse.json()

    const playersResponse = await fetch(`${API_BASE_URL}/games/${game.id}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        players: players.map(player => ({ name: player.name })),
      }),
    })

    if (!playersResponse.ok) {
      throw new Error('Impossible d\'ajouter les joueurs a la partie.')
    }

    const persistedGame = await playersResponse.json()
    currentGameId = persistedGame.id
    players = persistedGame.players.map(player => ({
      id: player.id,
      name: player.name,
    }))
    gameSaved = false

    initScores()
    buildHeader()
    buildTable()
    renderTurnSuggestions()

    playPanelController = initYamsPlayPanel({
      totalPlayers: players.length,
      getPlayerName,
      onMessage: showToast,
      onRollResult,
      onPlayerChange,
    })

    setupPanel.classList.add('is-hidden')
    gameShell.classList.remove('is-hidden')
    showToast(`Partie #${currentGameId} creee avec ${players.length} joueur(s).`)
  } catch (error) {
    const message = error instanceof TypeError
      ? 'API inaccessible. Verifiez que le backend est lance.'
      : error.message
    showToast(message)
  }
}

addPlayerButton.addEventListener('click', () => {
  const targetPlayerCount = getTargetPlayerCount()
  const playerName = normalizePlayerName(playerNameInput.value)

  if (!isValidPlayerCount(targetPlayerCount)) {
    showToast('Le nombre de joueurs doit etre un entier strictement positif.')
    return
  }

  if (!playerName) {
    showToast('Le nom du joueur est obligatoire.')
    return
  }

  if (players.length >= targetPlayerCount) {
    showToast('Le nombre de joueurs attendu est deja atteint.')
    return
  }

  if (players.some(player => player.name.toLowerCase() === playerName.toLowerCase())) {
    showToast('Ce joueur est deja ajoute.')
    return
  }

  players.push({ name: playerName })
  playerNameInput.value = ''
  renderAddedPlayers()
  updateSetupState()
  playerNameInput.focus()
})

playerCountInput.addEventListener('input', updateSetupState)

playerNameInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addPlayerButton.click()
  }
})

startGameButton.addEventListener('click', () => {
  void startGame()
})

resetGameButton.addEventListener('click', () => {
  if (!confirm('Reinitialiser la partie en cours et revenir a l\'ecran de preparation ?')) return
  resetGameUi()
  showToast('Retour a la preparation de partie.')
})

renderAddedPlayers()
updateSetupState()
