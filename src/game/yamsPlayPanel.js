import { YamsTurnState } from './yamsTurnState'

const TOTAL_PLAYERS = 4

export function initYamsPlayPanel({
  onMessage,
  onRollResult,
  onPlayerChange,
} = {}) {
  const panel = document.getElementById('playPanel')
  if (!panel) return

  const activePlayerValue = document.getElementById('activePlayerValue')
  const rollsRemainingValue = document.getElementById('rollsRemainingValue')
  const rollButton = document.getElementById('rollButton')
  const diceButtons = Array.from(panel.querySelectorAll('.die-button'))
  const playerNameInputs = Array.from(document.querySelectorAll('.player-name-input'))

  const turnState = new YamsTurnState()
  let currentPlayer = 0

  const getPlayerName = playerIndex => {
    const input = playerNameInputs[playerIndex]
    if (!input) return `Joueur ${playerIndex + 1}`

    const customName = input.value.trim()
    return customName || input.placeholder || `Joueur ${playerIndex + 1}`
  }

  const notify = message => {
    if (typeof onMessage === 'function') onMessage(message)
  }

  const render = () => {
    activePlayerValue.textContent = getPlayerName(currentPlayer)
    rollsRemainingValue.textContent = String(turnState.rollsRemaining)

    const canRoll = turnState.rollsRemaining > 0
    const firstRollPending = turnState.rollsUsed === 0
    const hasSelectedDice = turnState.getSelectedDiceCount() > 0

    rollButton.disabled = !canRoll || (!firstRollPending && !hasSelectedDice)

    if (firstRollPending) {
      rollButton.textContent = 'Lancer les 5 des'
    } else if (turnState.rollsRemaining > 0) {
      rollButton.textContent = 'Relancer les des selectionnes'
    } else {
      rollButton.textContent = 'Choisissez un score'
    }

    diceButtons.forEach((button, index) => {
      const value = turnState.diceValues[index]
      const isSelectable = turnState.canSelectDice()
      const isSelected = turnState.selectedForReroll[index]

      button.textContent = value === null ? '•' : String(value)
      button.disabled = !isSelectable
      button.classList.toggle('is-selected', isSelected)
      button.classList.toggle('is-empty', value === null)
      button.setAttribute('aria-pressed', isSelected ? 'true' : 'false')
    })
  }

  const resetTurn = () => {
    turnState.reset()
    render()
  }

  rollButton.addEventListener('click', () => {
    try {
      turnState.roll()
      render()

      if (typeof onRollResult === 'function') {
        onRollResult({
          playerIndex: currentPlayer,
          diceValues: turnState.getDiceValues(),
        })
      }

      if (turnState.rollsRemaining === 0) {
        notify(`${getPlayerName(currentPlayer)} a termine son tour.`)
      }
    } catch (error) {
      notify(error.message)
    }
  })

  const advanceToNextPlayer = () => {
    currentPlayer = (currentPlayer + 1) % TOTAL_PLAYERS
    resetTurn()

    if (typeof onPlayerChange === 'function') {
      onPlayerChange(currentPlayer)
    }
  }

  diceButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dieIndex = Number(button.dataset.dieIndex)
      turnState.toggleDieSelection(dieIndex)
      render()
    })
  })

  playerNameInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      if (index === currentPlayer) render()
    })
  })

  window.resetPlayPanel = () => {
    currentPlayer = 0
    resetTurn()

    if (typeof onPlayerChange === 'function') {
      onPlayerChange(currentPlayer)
    }
  }
  window.advanceToNextPlayer = advanceToNextPlayer

  render()

  if (typeof onPlayerChange === 'function') {
    onPlayerChange(currentPlayer)
  }
}
