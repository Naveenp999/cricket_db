let express = require('express')
let api = express()

let sqlite3 = require('sqlite3')
let {open} = require('sqlite')
let path = require('path')
let db = null

const file_path = path.join(__dirname, 'cricketTeam.db')

api.use(express.json())

const makedbconnection = async () => {
  try {
    db = await open({
      filename: file_path,
      driver: sqlite3.Database,
    })
    api.listen(3000)
  } catch (error) {
    console.log(`error in databse ${error}`)
    process.exit(1)
  }
}

makedbconnection()

api.get('/players/', async (request, response) => {
  const code = `SELECT
               * 
               FROM 
               cricket_team;`
  const r = await db.all(code)
  const p = r.map(val => {
    return {
      playerId: val.player_id,
      playerName: val.player_name,
      jerseyNumber: val.jersey_number,
      role: val.role,
    }
  })
  response.send(p)
})

api.post('/players/', async (request, response) => {
  const body = request.body
  let {playerName, jerseyNumber, role} = body
  const code = `INSERT INTO
               cricket_team (player_name,jersey_number,role)
               VALUES  ('${playerName}','${jerseyNumber}','${role}');`
  const r = await db.run(code)
  response.send(`Player Added to Team`)
})

api.get('/players/:playerId/', async (request, response) => {
  const id = request.params.playerId
  const code = `SELECT
               * 
               FROM 
               cricket_team
               WHERE player_id=${id};`
  const r = await db.get(code)
  const p = {
    playerId: r.player_id,
    playerName: r.player_name,
    jerseyNumber: r.jersey_number,
    role: r.role,
  }
  response.send(p)
})

api.put('/players/:playerId/', async (request, response) => {
  const body = request.body
  let {playerId, playerName, jerseyNumber, role} = body
  const code = `UPDATE 
              cricket_team
              SET
              player_name:'${playerName}',jersey_number:${jerseyNumber},role:'${role}'
              WHERE player_id=${playerId}
               ;`
  const r = await db.run(code)
  const p = r.map(val => {
    return {
      playerName: val.player_name,
      jerseyNumber: val.jersey_number,
      role: val.role,
    }
  })
  response.send(p)
})

api.get('/players/:playerId/', async (request, response) => {
  const id = request.params.playerId
  const code = `DELETE
               FROM 
               cricket_team
               WHERE
               player_id:${id};`
  const r = await db.run(code)
  response.send('Player Removed')
})
