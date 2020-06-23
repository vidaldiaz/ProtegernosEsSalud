const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

//variables auxiliares

let interval
let keys = []
const friction = 0.8
let frames = 0
const obstacles = []
let level = 1
let probLogo = 3
let probItem = 8
let probVirus = 10

const images = {
  background: './assets/background.jpg',
  player_girl: './assets/girl.png',
  virus: './assets/virus.png',
  cubrebocas: './assets/cubrebocas.png',
  gel: './assets/gel.png',
  distancia: './assets/distancia.png',
  logo: './assets/logo.png',
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
  constructor() {
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
  const y = Math.floor(Math.random() * (360 - 100) + 100)

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
  console.log(randomNum)
  if (frames % 70 === 0) {
    randomNum <= probLogo ? obstacles.push(new Obstacle(y, 'logo')) : null
    randomNum <= probLogo ? obstacles.push(new Obstacle(y + 100, 'logo')) : null

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
}

const drawObstacles = () => {
  console.log(obstacles)
  obstacles.forEach((obstacle) => obstacle.draw())
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
const player = new Player()

//funciones principales
const update = () => {
  frames++
  context.clearRect(0, 0, canvas.width, canvas.height)
  background.draw()
  player.draw()
  movePlayer()
  generateObstacle()
  drawObstacles()
  limits()
}

const start = () => {
  if (interval) return
  interval = setInterval(update, 1000 / 60)
}

//funciones auxiliares

//listeners
document.addEventListener('keydown', ({ keyCode }) => {
  keys[keyCode] = true
  key = keyCode
  switch (key) {
    case 13:
      return start()
      break
  }
})

document.addEventListener('keyup', ({ keyCode }) => {
  keys[keyCode] = false
})
