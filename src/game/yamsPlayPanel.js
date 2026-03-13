import { YamsTurnState } from './yamsTurnState'

export function initYamsPlayPanel({
  totalPlayers,
  getPlayerName,
  onMessage,
  onRollResult,
  onPlayerChange,
} = {}) {
  const panel = document.getElementById('playPanel')
  if (!panel) return null

  const activePlayerValue = document.getElementById('activePlayerValue')
  const rollsRemainingValue = document.getElementById('rollsRemainingValue')
  const rollButton = document.getElementById('rollButton')
  const diceButtons = Array.from(panel.querySelectorAll('.die-button'))
  const turnState = new YamsTurnState()

  let currentPlayer = 0

  const resolvePlayerName = playerIndex => {
    if (typeof getPlayerName === 'function') {
      return getPlayerName(playerIndex)
    }

    return `Joueur ${playerIndex + 1}`
  }

  const notify = message => {
    if (typeof onMessage === 'function') {
      onMessage(message)
    }
  }

  const render = () => {
    activePlayerValue.textContent = resolvePlayerName(currentPlayer)
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

  const handleRoll = () => {
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
        notify(`${resolvePlayerName(currentPlayer)} a termine son tour.`)
      }
    } catch (error) {
      notify(error.message)
    }
  }

  const advanceToNextPlayer = () => {
    currentPlayer = (currentPlayer + 1) % totalPlayers
    resetTurn()

    if (typeof onPlayerChange === 'function') {
      onPlayerChange(currentPlayer)
    }
  }

  const handleDieClick = event => {
    const dieIndex = Number(event.currentTarget.dataset.dieIndex)
    turnState.toggleDieSelection(dieIndex)
    render()
  }

  rollButton.addEventListener('click', handleRoll)
  diceButtons.forEach(button => button.addEventListener('click', handleDieClick))

  render()

  if (typeof onPlayerChange === 'function') {
    onPlayerChange(currentPlayer)
  }

  return {
    advanceToNextPlayer,
    reset() {
      currentPlayer = 0
      resetTurn()

      if (typeof onPlayerChange === 'function') {
        onPlayerChange(currentPlayer)
      }
    },
    destroy() {
      rollButton.removeEventListener('click', handleRoll)
      diceButtons.forEach(button => button.removeEventListener('click', handleDieClick))
    },
  }
}
