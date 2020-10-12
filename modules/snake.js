import Point from './point.js'
import Rectangle from './rectangle.js'

class Snake {

  #lastTimeRender
  #lastTimeUpdate
  #points
  #direction
  #dead
  #speed
  #viewport

  constructor() {
    this.lastTimeRender = window.performance.now()
    this.lastTimeUpdate = Number.MIN_SAFE_INTEGER
    this.dead = false
    this.speed = 5
    this.viewport = new Rectangle(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    this.points = []
    for (let i = 0 ; i < 30 ; i++) {
      this.points.push(new Point(30-i,2))
    }
    this.direction = 'right'
  }

  swapHeadAndTail() {
    if (this.points.length <= 1) {
      return
    }
    if (this.dead) {
      this.points.pop()
      return
    }

    const head = this.points[0]
    const tail = this.points.pop()
    tail.x = head.x
    tail.y = head.y
    this.points.unshift(tail)
  }

  moveTail(speed) {
    if (this.points.length < 3) {
      return
    }

    const tail = this.points[this.points.length-1]
    const tail_s = this.points[this.points.length-2]

    if (tail_s.y < tail.y) {
      tail.y -= speed
      tail.x = tail_s.x
    } else if (tail_s.y > tail.y) {
      tail.y += speed
      tail.x = tail_s.x
    } else if (tail_s.x < tail.x) {
      tail.x -= speed
      tail.y = tail_s.y
    } else if (tail_s.x > tail.x) {
      tail.x += speed
      tail.y = tail_s.y
    }
  }

  moveHead(speed) {
    if (this.dead || this.points.length < 3) {
      return
    }

    switch (this.direction) {
      case 'up' : {
        this.points[0].y -= speed
        break
      }
      case 'down' : {
        this.points[0].y += speed
        break
      }
      case 'left' : {
        this.points[0].x -= speed
        break
      }
      case 'right' : {
        this.points[0].x += speed
        break
      }
      default: {
        break
      }
    }
  }

  checkCollision() {
    let collided = false
    const head = this.points[0]
    head.x = Math.round(head.x)
    head.y = Math.round(head.y)
    if (head.x <= 1 || head.y <= 1 || head.x >= this.viewport.width - 1 || head.y >= this.viewport.height - 1) {
      collided = true
    } else {
      this.points.slice(1, this.points.length-1).forEach((point) => {
        if (head.x == point.x && head.y === point.y) {
          collided = true
          return
        }
      })
    }
    if (collided) {
      this.dead = true
      this.speed *= 3
    }
  }

  update(currentTime) {
    const delta = (currentTime - this.lastTimeUpdate) * this.speed
    const frameTime = (currentTime - this.lastTimeRender) / 1e3
    this.lastTimeRender = currentTime
    const moveSpeed = frameTime * this.speed

    this.moveTail(this.dead ? moveSpeed : Math.min(1, moveSpeed))
    if (this.dead && delta >= 1e3) {
      this.swapHeadAndTail()
      this.lastTimeUpdate = currentTime
    } else if (delta >= 1e3) {
      this.checkCollision()
      this.swapHeadAndTail()
      this.lastTimeUpdate = currentTime
    }
    this.moveHead(Math.min(1, moveSpeed))
  }

  render(viewport, buffer) {
    this.viewport = viewport

    buffer.lineCap = "square"
    buffer.lineJoin = "miter"

    buffer.lineWidth = 1
    buffer.strokeStyle = 'black'
    buffer.beginPath()
    buffer.moveTo(1, 1)
    buffer.lineTo(viewport.width-1, 1)
    buffer.lineTo(viewport.width-1, viewport.height-1)
    buffer.lineTo(1, viewport.height-1)
    buffer.closePath()
    buffer.stroke()

    buffer.lineCap = "square"
    buffer.lineJoin = "miter"
    buffer.lineWidth = 0.9
    buffer.strokeStyle = this.dead ? 'red' : "green"

    buffer.beginPath()
    this.points.forEach((point, idx) => {
      if (idx == 0) {
        buffer.moveTo(point.x, point.y)
      }
      buffer.lineTo(point.x, point.y)
    })
    buffer.stroke()
  }

}

export default Snake
