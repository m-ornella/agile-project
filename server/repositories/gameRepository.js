import { ensurePlayer, escapeValue, execute, insertAndGetId, query } from '../db.js'

function mapGameRow(row) {
  return {
    id: Number(row[0]),
    status: row[1],
    created_at: row[2],
    finished_at: row[3],
  }
}

function mapPlayerRow(row) {
  return {
    id: Number(row[0]),
    name: row[1],
    score: Number(row[2]),
  }
}

export async function createGame() {
  const gameId = await insertAndGetId("INSERT INTO games (status) VALUES ('playing')")
  return getGameById(gameId)
}

export async function listGames() {
  const rows = await query(`
    SELECT id, status, created_at, COALESCE(finished_at, '')
    FROM games
    ORDER BY id DESC
  `)
  return rows.map(mapGameRow)
}

export async function getGameById(gameId) {
  const gameRows = await query(`
    SELECT id, status, created_at, COALESCE(finished_at, '')
    FROM games
    WHERE id = ${Number(gameId)}
    LIMIT 1
  `)

  if (gameRows.length === 0) {
    return null
  }

  const playerRows = await query(`
    SELECT p.id, p.name, gp.score
    FROM game_players gp
    JOIN players p ON p.id = gp.player_id
    WHERE gp.game_id = ${Number(gameId)}
    ORDER BY gp.id ASC
  `)

  return {
    ...mapGameRow(gameRows[0]),
    players: playerRows.map(mapPlayerRow),
  }
}

export async function addPlayersToGame(gameId, players) {
  for (const player of players) {
    const playerId = player.id ? Number(player.id) : await ensurePlayer(player.name)
    await execute(`
      INSERT INTO game_players (game_id, player_id, score)
      VALUES (${Number(gameId)}, ${playerId}, ${Number(player.score || 0)})
      ON DUPLICATE KEY UPDATE score = VALUES(score)
    `)
  }

  return getGameById(gameId)
}

export async function saveScores(gameId, players) {
  for (const player of players) {
    const playerId = player.id ? Number(player.id) : await ensurePlayer(player.name)
    await execute(`
      UPDATE game_players
      SET score = ${Number(player.score || 0)}
      WHERE game_id = ${Number(gameId)} AND player_id = ${playerId}
    `)
  }

  await execute(`
    UPDATE games
    SET status = 'finished', finished_at = NOW()
    WHERE id = ${Number(gameId)}
  `)

  return getGameById(gameId)
}

export async function getScoreboard() {
  const rows = await query(`
    SELECT
      players.id,
      players.name,
      COALESCE(SUM(game_players.score), 0) AS total_score
    FROM players
    JOIN game_players ON players.id = game_players.player_id
    GROUP BY players.id, players.name
    ORDER BY total_score DESC, players.name ASC
  `)

  return rows.map(row => ({
    player_id: Number(row[0]),
    name: row[1],
    total_score: Number(row[2]),
  }))
}

export async function resetDatabase() {
  await execute('SET FOREIGN_KEY_CHECKS = 0')
  await execute('TRUNCATE TABLE game_players')
  await execute('TRUNCATE TABLE games')
  await execute('TRUNCATE TABLE players')
  await execute('SET FOREIGN_KEY_CHECKS = 1')
}
