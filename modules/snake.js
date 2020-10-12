import Point from './point.js'

const SPEED = 2

class Snake {

  #lastTimeRender
  #lastTimeUpdate
  #points
  #direction
  #lastPressedKey
  #keysBuffer

  constructor() {
    this.lastTimeRender = window.performance.now()
    this.lastTimeUpdate = Number.MIN_SAFE_INTEGER

    this.points = []
    // FIXME jump occurs when last is swapped with first
    for (let i = 0 ; i < 30 ; i++) {
      this.points.push(new Point(1+i,1))
    }

    this.keysBuffer = []
    this.lastPressedKey = 'ArrowRight'
    this.direction = 'right'

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
    if (this.keysBuffer.length == 0) {
      return
    }
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

    switch (this.lastPressedKey) {

      case 'ArrowUp': {
        this.direction = 'up'
        break
      }

      case 'ArrowDown': {
        this.direction = 'down'
        break
      }

      case 'ArrowLeft': {
        this.direction = 'left'
        break
      }

      case 'ArrowRight': {
        this.direction = 'right'
        break
      }

    }

    this.keysBuffer = []
  }

  swapHeadAndTail() {
    const head = this.points[this.points.length-1]
    const tail = this.points.shift()
    tail.x = head.x
    tail.y = head.y
    this.points.push(tail)

    this.points.forEach((point) => {
      point.x = Math.round(point.x)
      point.y = Math.round(point.y)
    })
  }

  move(speed) {
    const tail = this.points[0]
    const tail_s = this.points[1]

    if (tail_s.y < tail.y) {
      tail.y -= speed
    } else if (tail_s.y > tail.y) {
      tail.y += speed
    } else if (tail_s.x < tail.x) {
      tail.x -= speed
    } else if (tail_s.x > tail.x) {
      tail.x += speed
    }

    switch (this.direction) {
      case 'up' : {
        const head = this.points[this.points.length-1]
        head.y -= speed
        break
      }
      case 'down' : {
        const head = this.points[this.points.length-1]
        head.y += speed
        break
      }
      case 'left' : {
        const head = this.points[this.points.length-1]
        head.x -= speed
        break
      }
      case 'right' : {
        const head = this.points[this.points.length-1]
        head.x += speed
        break
      }
      default: {
        break
      }
    }
  }

  update(currentTime) {
    const delta = (currentTime - this.lastTimeUpdate) * SPEED
    const frameTime = (currentTime - this.lastTimeRender) / 1e3
    this.lastTimeRender = currentTime
    const moveSpeed = frameTime * SPEED

    this.move(moveSpeed)

    if (delta >= 1e3) {
      this.updateDirection()
      this.swapHeadAndTail()
      this.lastTimeUpdate = currentTime
    }

  }

  render(viewport, buffer) {
    buffer.lineCap = "square"
    buffer.lineJoin = "square"

    buffer.lineWidth = 0.9
    buffer.strokeStyle = "green"

    buffer.beginPath()

    const fistPoint = this.points[0]
    buffer.moveTo(fistPoint.x, fistPoint.y)
    this.points.forEach((point) => {
      buffer.lineTo(point.x, point.y)
    })
    buffer.stroke()

  }

}

export default Snake
