const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

//variables auxiliares

let stage = 'start1'
let interval
let keys = []
const friction = 0.8
let frames = 0
let mainSpeed = 40
const obstacles = []
let level = 1
let probLogo
let probItem
let probVirus
let score = 0
let lifes = 10
let selected = 'boy'

const images = {
  background: './assets/background.jpg',
  player_girl: './assets/girl.png',
  player_boy: './assets/boy.png',
  virus: './assets/virus.png',
  cubrebocas: './assets/cubrebocas.png',
  gel: './assets/gel.png',
  distancia: './assets/distancia.png',
  logo: './assets/logo.png',
  logo_back: './assets/logo_back.jpg',
  hpbar00: './assets/hpBar00.png',
  hpbar01: './assets/hpBar01.png',
  hpbar02: './assets/hpBar02.png',
  hpbar03: './assets/hpBar03.png',
  hpbar04: './assets/hpBar04.png',
  hpbar05: './assets/hpBar05.png',
  hpbar06: './assets/hpBar06.png',
  hpbar07: './assets/hpBar07.png',
  hpbar08: './assets/hpBar08.png',
  hpbar09: './assets/hpBar09.png',
  hpbar10: './assets/hpBar10.png',
  loseL1: './assets/loseL1.gif',
  loseL2: './assets/loseL2.gif',
  loseL3: './assets/loseL3.gif',
  win: './assets/win.gif',
  startScreen1: './assets/startScreen1.gif',
  startScreen2: './assets/startScreen2.gif',
  startScreen3: './assets/startScreen3.gif',
  selectNino: './assets/selectNino.gif',
  selectNina: './assets/selectNina.gif',
}

//clases
class Background {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = images.background
    this.img.onload = () => this.draw()
  }

  draw() {
    this.x--
    if (this.x < -this.width) this.x = 0
    context.drawImage(this.img, this.x, this.y, this.width, this.height)
    context.drawImage(
      this.img,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    )
  }
}

class Player {
  constructor(gender) {
    this.x = 50
    this.y = 270
    this.width = 50
    this.height = 50
    this.img = new Image()
    this.img.src = images.player_girl
    this.speed = 100
    this.velX = 0
    this.velY = 0
  }

  draw() {
    context.drawImage(this.img, this.x, this.y, this.width, this.height)
  }

  isTouching(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    )
  }
}

class Obstacle {
  constructor(y, type) {
    this.x = canvas.width
    this.y = y
    this.width = 40
    this.height = 40
    this.type = type
    this.virus = new Image()
    this.virus.src = images.virus
    this.cubrebocas = new Image()
    this.cubrebocas.src = images.cubrebocas
    this.gel = new Image()
    this.gel.src = images.gel
    this.distancia = new Image()
    this.distancia.src = images.distancia
    this.logo = new Image()
    this.logo.src = images.logo
  }

  draw() {
    this.x--

    this.type === 'virus'
      ? context.drawImage(this.virus, this.x, this.y, this.width, this.height)
      : null
    this.type === 'cubrebocas'
      ? context.drawImage(
          this.cubrebocas,
          this.x,
          this.y,
          this.width,
          this.height
        )
      : null
    this.type === 'gel'
      ? context.drawImage(this.gel, this.x, this.y, this.width, this.height)
      : null
    this.type === 'distancia'
      ? context.drawImage(
          this.distancia,
          this.x,
          this.y,
          this.width,
          this.height
        )
      : null
    this.type === 'logo'
      ? context.drawImage(this.logo, this.x, this.y, this.width, this.height)
      : null
  }
}

const movePlayer = () => {
  keys[39] ? (player.velX < player.speed ? player.velX++ : null) : null

  keys[37] ? (player.velX > -player.speed ? player.velX-- : null) : null

  keys[40] ? (player.velY < player.speed ? player.velY++ : null) : null

  keys[38] ? (player.velY > -player.speed ? player.velY-- : null) : null

  player.x += player.velX
  player.velX *= friction

  player.y += player.velY
  player.velY *= friction
}

const generateObstacle = () => {
  if (frames % 70 === 0) {
    let y = 100
    do {
      y = Math.floor(Math.random() * (360 - y) + y)
      sortObstacle(y)
      if (Math.floor(Math.random() * 10 + 1) === 9) break
      y += 100
    } while (y <= 360)
  }
}

const sortObstacle = (y) => {
  const randomNum = Math.floor(Math.random() * 10 + 1)
  if (level === 1) {
    probLogo = 3
    probItem = 8
    probVirus = 10
  }
  if (level === 2) {
    probLogo = 2
    probItem = 6
    probVirus = 10
  }
  if (level === 3) {
    probLogo = 1
    probItem = 5
    probVirus = 10
  }

  randomNum <= probLogo ? obstacles.push(new Obstacle(y, 'logo')) : null

  if (randomNum > probLogo && randomNum <= probItem) {
    const randomItem = Math.floor(Math.random() * 3 + 1)
    randomItem === 1 ? obstacles.push(new Obstacle(y, 'gel')) : null
    randomItem === 2 ? obstacles.push(new Obstacle(y, 'distancia')) : null
    randomItem === 3 ? obstacles.push(new Obstacle(y, 'cubrebocas')) : null
  }

  randomNum > probItem && randomNum <= probVirus
    ? obstacles.push(new Obstacle(y, 'virus'))
    : null
}

const drawObstacles = () => {
  obstacles.forEach((obstacle) => obstacle.draw())
}

const collisions = () => {
  obstacles.forEach((obstacle) => {
    if (player.isTouching(obstacle)) {
      obstacle.x = -100
      obstacle.y = -100
      obstacle.type === 'logo' ? (score += 20) : null
      obstacle.type === 'cubrebocas' ? (score += 10) : null
      obstacle.type === 'gel' ? (score += 10) : null
      obstacle.type === 'distancia' ? (score += 10) : null
      obstacle.type === 'virus' ? lifes-- : null
    }
  })
}

const drawScore = (lifes) => {
  const logo_back = new Image()
  logo_back.src = images.logo_back
  context.drawImage(logo_back, 20, 20, 60, 60)
  const logo_camp = new Image()
  logo_camp.src = images.logo_back
  context.drawImage(logo_back, canvas.width - 80, 20, 60, 60)
  context.fillStyle = 'white'
  context.font = `20px 'Press Start 2P'`
  context.fillText(`Puntos: ${score}`, 120, 48)
  context.fillText(`Nivel: ${level}`, 120, 78)
  if (lifes === 10) {
    const hpbar10 = new Image()
    hpbar10.src = images.hpbar10
    context.drawImage(hpbar10, 400, 30, 250, 43)
  }
  if (lifes === 9) {
    const hpbar09 = new Image()
    hpbar09.src = images.hpbar09
    context.drawImage(hpbar09, 400, 30, 250, 43)
  }
  if (lifes === 8) {
    const hpbar08 = new Image()
    hpbar08.src = images.hpbar08
    context.drawImage(hpbar08, 400, 30, 250, 43)
  }
  if (lifes === 7) {
    const hpbar07 = new Image()
    hpbar07.src = images.hpbar07
    context.drawImage(hpbar07, 400, 30, 250, 43)
  }
  if (lifes === 6) {
    const hpbar06 = new Image()
    hpbar06.src = images.hpbar06
    context.drawImage(hpbar06, 400, 30, 250, 43)
  }
  if (lifes === 5) {
    const hpbar05 = new Image()
    hpbar05.src = images.hpbar05
    context.drawImage(hpbar05, 400, 30, 250, 43)
  }
  if (lifes === 4) {
    const hpbar04 = new Image()
    hpbar04.src = images.hpbar04
    context.drawImage(hpbar04, 400, 30, 250, 43)
  }
  if (lifes === 3) {
    const hpbar03 = new Image()
    hpbar03.src = images.hpbar03
    context.drawImage(hpbar03, 400, 30, 250, 43)
  }
  if (lifes === 2) {
    const hpbar02 = new Image()
    hpbar02.src = images.hpbar02
    context.drawImage(hpbar02, 400, 30, 250, 43)
  }
  if (lifes === 1) {
    const hpbar01 = new Image()
    hpbar01.src = images.hpbar01
    context.drawImage(hpbar01, 400, 30, 250, 43)
  }
  if (lifes <= 0) {
    const hpbar00 = new Image()
    hpbar00.src = images.hpbar00
    context.drawImage(hpbar00, 400, 30, 250, 43)
    stage = 'gameOver'
    //gameOver(score)
  }
}

const limits = () => {
  player.x > canvas.width - player.width || player.x + player.velX < 0
    ? (player.velX *= -2)
    : null

  player.y > canvas.height - player.height || player.y + player.velY < 100
    ? (player.velY *= -2)
    : null
}

//instancias
const background = new Background()
let player = new Player()

//funciones principales
const update = () => {
  stage === 'start1' ? start1() : null
  stage === 'start2' ? start2() : null
  stage === 'start3' ? start3() : null
  stage === 'selectPlayer' ? selectPlayer(selected) : null

  if (stage === 'game') {
    frames++
    context.clearRect(0, 0, canvas.width, canvas.height)
    background.draw()
    player.draw()
    movePlayer()
    generateObstacle()
    drawObstacles()
    collisions()
    limits()
    drawScore(lifes)
    checkLevel()
  }

  if (stage === 'gameOver') {
    gameOver(score)
    score = 0
    level = 1
    lifes = 10
    player = new Player()
  }
}

function start() {
  if (interval) return
  interval = setInterval(update, 1000 / mainSpeed)
}
const start1 = () => {
  const ss1 = new Image()
  ss1.src = images.startScreen1
  context.drawImage(ss1, 0, 0, canvas.width, canvas.height)
}

const start2 = () => {
  const ss2 = new Image()
  ss2.src = images.startScreen2
  context.drawImage(ss2, 0, 0, canvas.width, canvas.height)
}

const start3 = () => {
  const ss3 = new Image()
  ss3.src = images.startScreen3
  context.drawImage(ss3, 0, 0, canvas.width, canvas.height)
}

const selectPlayer = (selected) => {
  if (selected === 'boy') {
    const boySelected = new Image()
    boySelected.src = images.selectNino
    context.drawImage(boySelected, 0, 0, canvas.width, canvas.height)
    player.img.src = images.player_boy
  }
  if (selected === 'girl') {
    const girlSelected = new Image()
    girlSelected.src = images.selectNina
    context.drawImage(girlSelected, 0, 0, canvas.width, canvas.height)
    player.img.src = images.player_girl
  }
  //selected === 'boy' ? player.img.src = images.player_boy
}

const gameOver = (score) => {
  if (score < 300) {
    const loseL1 = new Image()
    loseL1.src = images.loseL1
    context.drawImage(loseL1, 0, 0, canvas.width, canvas.height)
  }
  if (score >= 300 && score < 800) {
    const loseL2 = new Image()
    loseL2.src = images.loseL2
    context.drawImage(loseL2, 0, 0, canvas.width, canvas.height)
  }
  if (score >= 800 && score < 1000) {
    const loseL3 = new Image()
    loseL3.src = images.loseL3
    context.drawImage(loseL3, 0, 0, canvas.width, canvas.height)
  }
  if (score > 1000) {
    const win = new Image()
    win.src = images.win
    context.drawImage(win, 0, 0, canvas.width, canvas.height)
  }
}

const checkLevel = () => {
  score >= 300 && score < 800 ? (level = 2) : null
  score >= 800 && score < 1000 ? (level = 3) : null
  if (level === 1) {
    clearInterval(interval)
    interval = setInterval(update, 1000 / 40)
  }
  if (level === 2) {
    clearInterval(interval)
    interval = setInterval(update, 1000 / 60)
  }
  if (level === 3) {
    clearInterval(interval)
    interval = setInterval(update, 1000 / 90)
  }
}

start()
//listeners
document.addEventListener('keydown', ({ keyCode }) => {
  keys[keyCode] = true
  key = keyCode
  switch (key) {
    case 13:
      if (stage === 'start1') {
        stage = 'start2'
        break
      }
      if (stage === 'start2') {
        stage = 'start3'
        break
      }
      if (stage === 'start3') {
        stage = 'selectPlayer'
        break
      }
      if (stage === 'selectPlayer') {
        stage = 'game'
        break
      }

      if (stage === 'gameOver') {
        stage = 'selectPlayer'
        break
      }

    case 37:
      stage === 'selectPlayer'
        ? selected === 'girl'
          ? (selected = 'boy')
          : (selected = 'girl')
        : null
      break

    case 39:
      stage === 'selectPlayer'
        ? selected === 'girl'
          ? (selected = 'boy')
          : (selected = 'girl')
        : null
      break
  }
})

document.addEventListener('keyup', ({ keyCode }) => {
  keys[keyCode] = false
})
