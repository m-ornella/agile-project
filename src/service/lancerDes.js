/**
 * Lance un nombre donne de des a 6 faces.
 * @param {number} numberOfDice Nombre de des a lancer.
 * @returns {Record<number, number>} Objet: cle = index du de, valeur = resultat entre 1 et 6.
 */
export function lancerDes(nombreDeDes) {
  if (!Number.isInteger(nombreDeDes) || nombreDeDes <= 0) {
    throw new Error('Le nombre de dés doit etre un entier strictement positif.')
  }

  const results = {}

  for (let index = 0; index < nombreDeDes; index += 1) {
    results[index] = Math.floor(Math.random() * 6) + 1
  }

  return results
}
