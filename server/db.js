import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { config } from './config.js'

const execFileAsync = promisify(execFile)

function escapeValue(value) {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL'
  if (typeof value === 'boolean') return value ? '1' : '0'
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

async function runMysql(args) {
  const env = { ...process.env, MYSQL_PWD: config.db.password }
  const baseArgs = [
    `--host=${config.db.host}`,
    `--port=${config.db.port}`,
    `--user=${config.db.user}`,
    '--protocol=TCP',
    ...args,
  ]

  const { stdout } = await execFileAsync('mysql', baseArgs, { env })
  return stdout
}

export async function execute(sql) {
  await runMysql([config.db.name, '-e', sql])
}

export async function query(sql) {
  const stdout = await runMysql([
    config.db.name,
    '--batch',
    '--raw',
    '--skip-column-names',
    '-e',
    sql,
  ])

  return stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => line.split('\t'))
}

export async function insertAndGetId(sql) {
  const rows = await query(`${sql}; SELECT LAST_INSERT_ID();`)
  const lastRow = rows.at(-1)
  return Number(lastRow?.[0] || 0)
}

export async function ensurePlayer(name) {
  const safeName = escapeValue(name)
  return insertAndGetId(`
    INSERT INTO players (name)
    VALUES (${safeName})
    ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
  `)
}

export { escapeValue }
