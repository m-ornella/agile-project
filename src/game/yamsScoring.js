function countValues(diceValues) {
  return diceValues.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1
    return counts
  }, {})
}

function sumOf(diceValues) {
  return diceValues.reduce((sum, value) => sum + value, 0)
}

function hasStraight(uniqueValues, length) {
  let streak = 1

  for (let i = 1; i < uniqueValues.length; i += 1) {
    if (uniqueValues[i] === uniqueValues[i - 1] + 1) {
      streak += 1
      if (streak >= length) return true
    } else {
      streak = 1
    }
  }

  return false
}

export function computePossibleScores(diceValues) {
  if (!Array.isArray(diceValues) || diceValues.length !== 5) {
    throw new Error('Le calcul des scores requiert exactement 5 des.')
  }

  const counts = countValues(diceValues)
  const frequencies = Object.values(counts)
  const total = sumOf(diceValues)
  const uniqueSorted = Array.from(new Set(diceValues)).sort((a, b) => a - b)

  return {
    ones: diceValues.filter(v => v === 1).length * 1,
    twos: diceValues.filter(v => v === 2).length * 2,
    threes: diceValues.filter(v => v === 3).length * 3,
    fours: diceValues.filter(v => v === 4).length * 4,
    fives: diceValues.filter(v => v === 5).length * 5,
    sixes: diceValues.filter(v => v === 6).length * 6,
    three_kind: frequencies.some(c => c >= 3) ? total : 0,
    four_kind: frequencies.some(c => c >= 4) ? total : 0,
    full: (frequencies.includes(3) && frequencies.includes(2)) ? 25 : 0,
    small_str: hasStraight(uniqueSorted, 4) ? 30 : 0,
    large_str: hasStraight(uniqueSorted, 5) ? 40 : 0,
    yams: frequencies.includes(5) ? 50 : 0,
    chance: total,
  }
}
