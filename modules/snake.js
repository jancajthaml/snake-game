import Point from './point.js'

const SIZE = 10
const SPEED = 5

class Snake {

  #lastTime
  #points
  #lastPressedKey
  #keysBuffer

  constructor() {
    this.lastTime = window.performance.now()

    this.points = []
    for (let i = 0 ; i < 100 ; i++) {
      this.points.push(new Point(100+(i*SIZE),100))
    }

    this.keysBuffer = []
    this.lastPressedKey = 'ArrowDown'

    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
        const index = this.keysBuffer.indexOf(event.code)
        if (index == -1) {
          this.keysBuffer.push(event.code)
        }
      }
    })
  }

  updateDirection() {
    switch (this.lastPressedKey) {
      case undefined: {
        this.lastPressedKey = this.keysBuffer[this.keysBuffer.length - 1]
        break
      }

      case 'ArrowUp': {
        const keys = this.keysBuffer.filter((key) => key !== 'ArrowDown')
        const last = keys[keys.length - 1]
        if (last) {
          this.lastPressedKey = last
        }
        break
      }

      case 'ArrowDown': {
        const keys = this.keysBuffer.filter((key) => key !== 'ArrowUp')
        const last = keys[keys.length - 1]
        if (last) {
          this.lastPressedKey = last
        }
        break
      }

      case 'ArrowLeft': {
        const keys = this.keysBuffer.filter((key) => key !== 'ArrowRight')
        const last = keys[keys.length - 1]
        if (last) {
          this.lastPressedKey = last
        }
        break
      }

      case 'ArrowRight': {
        const keys = this.keysBuffer.filter((key) => key !== 'ArrowLeft')
        const last = keys[keys.length - 1]
        if (last) {
          this.lastPressedKey = last
        }
        break
      }

    }

    this.keysBuffer = []
  }

  move() {

    switch (this.lastPressedKey) {
      case 'ArrowUp' : {
        const head = this.points[this.points.length-1]
        const tail = this.points.shift()
        tail.x = head.x
        tail.y = head.y - SIZE
        this.points.push(tail)
        break
      }
      case 'ArrowDown' : {
        const head = this.points[this.points.length-1]
        const tail = this.points.shift()
        tail.x = head.x
        tail.y = head.y + SIZE
        this.points.push(tail)
        break
      }
      case 'ArrowLeft' : {
        const head = this.points[this.points.length-1]
        const tail = this.points.shift()
        tail.x = head.x - SIZE
        tail.y = head.y
        this.points.push(tail)
        break
      }
      case 'ArrowRight' : {
        const head = this.points[this.points.length-1]
        const tail = this.points.shift()
        tail.x = head.x + SIZE
        tail.y = head.y
        this.points.push(tail)
        break
      }
      default: {
        break
      }
    }
  }

  update(currentTime) {
    const delta = currentTime - this.lastTime
    const interval = 1000 / SPEED

    if (delta > interval) {
      this.updateDirection()
      this.move()
      this.lastTime = currentTime
    }
  }

  render(viewport, buffer) {
    buffer.lineCap = "round"
    buffer.lineJoin = "round"

    buffer.lineWidth = SIZE
    buffer.strokeStyle = "green"

    buffer.beginPath()

    const fistPoint = this.points[0]
    buffer.moveTo(fistPoint.x, fistPoint.y)

    this.points.forEach((point) => {
      buffer.lineTo(point.x, point.y)
    })
    buffer.stroke()

    buffer.strokeStyle = "white"
    buffer.lineWidth = SIZE - 2

    const lastPoint = this.points[this.points.length-1]
    buffer.beginPath()
    buffer.moveTo(lastPoint.x, lastPoint.y)
    buffer.lineTo(lastPoint.x, lastPoint.y)
    buffer.stroke()

  }

}

export default Snake
