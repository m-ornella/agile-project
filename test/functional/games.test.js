import { after, before, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { setTimeout as delay } from 'node:timers/promises'
import { resetDatabase } from '../../server/repositories/gameRepository.js'

const execFileAsync = promisify(execFile)

let serverProcess

async function waitForServer(url, attempts = 30) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // Server is not up yet.
    }

    await delay(500)
  }

  throw new Error('Server did not start in time')
}

async function waitForMysql(attempts = 30) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      await execFileAsync('docker', ['compose', 'exec', '-T', 'mysql', 'mysqladmin', 'ping', '-h', '127.0.0.1', '-proot'])
      return
    } catch {
      // MySQL is not healthy yet.
    }

    await delay(1000)
  }

  throw new Error('MySQL did not become healthy in time')
}

async function httpRequest(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:3000${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  return {
    status: response.status,
    body: text ? JSON.parse(text) : null,
  }
}

before(async () => {
  await execFileAsync('docker', ['compose', 'up', '-d'], { cwd: process.cwd() })
  await waitForMysql()

  serverProcess = execFile('node', ['server/index.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '3000' },
  })

  await waitForServer('http://127.0.0.1:3000/games')
})

beforeEach(async () => {
  await resetDatabase()
})

after(async () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM')
  }
})

describe('games API', () => {
  it('creates a game and stores it in MySQL', async () => {
    const response = await httpRequest('/games', { method: 'POST' })

    assert.equal(response.status, 201)
    assert.equal(response.body.status, 'playing')
    assert.ok(Number.isInteger(response.body.id))
    assert.deepEqual(response.body.players, [])
  })

  it('associates players to a game', async () => {
    const game = await httpRequest('/games', { method: 'POST' })

    const response = await httpRequest(`/games/${game.body.id}/players`, {
      method: 'POST',
      body: JSON.stringify({
        players: [
          { name: 'Louis' },
          { name: 'Alice' },
        ],
      }),
    })

    assert.equal(response.status, 200)
    assert.equal(response.body.players.length, 2)
    assert.equal(response.body.players[0].name, 'Louis')
    assert.equal(response.body.players[1].name, 'Alice')
  })

  it('saves final scores and allows a saved game to be loaded', async () => {
    const game = await httpRequest('/games', { method: 'POST' })
    await httpRequest(`/games/${game.body.id}/players`, {
      method: 'POST',
      body: JSON.stringify({
        players: [
          { name: 'Louis' },
          { name: 'Alice' },
        ],
      }),
    })

    const update = await httpRequest(`/games/${game.body.id}/score`, {
      method: 'PUT',
      body: JSON.stringify({
        players: [
          { name: 'Louis', score: 120 },
          { name: 'Alice', score: 95 },
        ],
      }),
    })

    assert.equal(update.status, 200)
    assert.equal(update.body.status, 'finished')

    const savedGame = await httpRequest(`/games/${game.body.id}`)

    assert.equal(savedGame.status, 200)
    assert.equal(savedGame.body.players[0].score, 120)
    assert.equal(savedGame.body.players[1].score, 95)
  })

  it('returns a global scoreboard ordered by total score', async () => {
    const firstGame = await httpRequest('/games', { method: 'POST' })
    await httpRequest(`/games/${firstGame.body.id}/players`, {
      method: 'POST',
      body: JSON.stringify({
        players: [
          { name: 'Louis' },
          { name: 'Alice' },
        ],
      }),
    })
    await httpRequest(`/games/${firstGame.body.id}/score`, {
      method: 'PUT',
      body: JSON.stringify({
        players: [
          { name: 'Louis', score: 120 },
          { name: 'Alice', score: 95 },
        ],
      }),
    })

    const secondGame = await httpRequest('/games', { method: 'POST' })
    await httpRequest(`/games/${secondGame.body.id}/players`, {
      method: 'POST',
      body: JSON.stringify({
        players: [
          { name: 'Louis' },
          { name: 'Bob' },
        ],
      }),
    })
    await httpRequest(`/games/${secondGame.body.id}/score`, {
      method: 'PUT',
      body: JSON.stringify({
        players: [
          { name: 'Louis', score: 80 },
          { name: 'Bob', score: 110 },
        ],
      }),
    })

    const scoreboard = await httpRequest('/scoreboard')

    assert.equal(scoreboard.status, 200)
    assert.deepEqual(
      scoreboard.body.map(({ name, total_score }) => ({ name, total_score })),
      [
        { name: 'Louis', total_score: 200 },
        { name: 'Bob', total_score: 110 },
        { name: 'Alice', total_score: 95 },
      ],
    )
  })
})
