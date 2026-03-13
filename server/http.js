import { URL } from 'node:url'
import {
  addPlayersToGame,
  createGame,
  getGameById,
  getScoreboard,
  listGames,
  saveScores,
} from './repositories/gameRepository.js'

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) return {}

  const raw = Buffer.concat(chunks).toString('utf8')
  return JSON.parse(raw)
}

function notFound(res) {
  json(res, 404, { error: 'Resource not found' })
}

function badRequest(res, message) {
  json(res, 400, { error: message })
}

function hasValidPlayers(players) {
  return Array.isArray(players) && players.length > 0
}

export async function requestListener(req, res) {
  const method = req.method || 'GET'
  const url = new URL(req.url || '/', 'http://localhost')
  const pathname = url.pathname

  try {
    if (method === 'POST' && pathname === '/games') {
      const game = await createGame()
      return json(res, 201, game)
    }

    if (method === 'GET' && pathname === '/games') {
      const games = await listGames()
      return json(res, 200, games)
    }

    if (method === 'GET' && /^\/games\/\d+$/.test(pathname)) {
      const gameId = pathname.split('/')[2]
      const game = await getGameById(gameId)
      return game ? json(res, 200, game) : notFound(res)
    }

    if (method === 'POST' && /^\/games\/\d+\/players$/.test(pathname)) {
      const gameId = pathname.split('/')[2]
      const payload = await readJsonBody(req)

      if (!hasValidPlayers(payload.players)) {
        return badRequest(res, 'players is required')
      }

      const existing = await getGameById(gameId)
      if (!existing) return notFound(res)

      const game = await addPlayersToGame(gameId, payload.players)
      return json(res, 200, game)
    }

    if (method === 'PUT' && /^\/games\/\d+\/score$/.test(pathname)) {
      const gameId = pathname.split('/')[2]
      const payload = await readJsonBody(req)

      if (!hasValidPlayers(payload.players)) {
        return badRequest(res, 'players is required')
      }

      const existing = await getGameById(gameId)
      if (!existing) return notFound(res)

      const game = await saveScores(gameId, payload.players)
      return json(res, 200, game)
    }

    if (method === 'GET' && pathname === '/scoreboard') {
      const scoreboard = await getScoreboard()
      return json(res, 200, scoreboard)
    }

    return notFound(res)
  } catch (error) {
    if (error instanceof SyntaxError) {
      return badRequest(res, 'invalid JSON body')
    }

    return json(res, 500, {
      error: 'internal server error',
      details: error.message,
    })
  }
}
