import { lancerDes } from '../service/lancerDes'

const DICE_COUNT = 5
const MAX_ROLLS = 3

export class YamsTurnState {
  constructor() {
    this.reset()
  }

  reset() {
    this.diceValues = Array(DICE_COUNT).fill(null)
    this.selectedForReroll = Array(DICE_COUNT).fill(false)
    this.rollsUsed = 0
  }

  get rollsRemaining() {
    return MAX_ROLLS - this.rollsUsed
  }

  canSelectDice() {
    return this.rollsUsed > 0 && this.rollsRemaining > 0
  }

  toggleDieSelection(index) {
    if (!this.canSelectDice()) return
    if (index < 0 || index >= DICE_COUNT) return

    this.selectedForReroll[index] = !this.selectedForReroll[index]
  }

  getSelectedDiceCount() {
    return this.selectedForReroll.filter(Boolean).length
  }

  getDiceValues() {
    return [...this.diceValues]
  }

  roll() {
    if (this.rollsRemaining <= 0) {
      throw new Error('Aucun lancer restant pour ce tour.')
    }

    const indicesToRoll = this.rollsUsed === 0
      ? Array.from({ length: DICE_COUNT }, (_, index) => index)
      : this.selectedForReroll
          .map((isSelected, index) => (isSelected ? index : -1))
          .filter(index => index !== -1)

    if (indicesToRoll.length === 0) {
      throw new Error('Selectionnez au moins un de a relancer.')
    }

    const rollResults = lancerDes(indicesToRoll.length)

    indicesToRoll.forEach((dieIndex, resultIndex) => {
      this.diceValues[dieIndex] = rollResults[resultIndex]
    })

    this.rollsUsed += 1
    this.selectedForReroll.fill(false)
  }
}
