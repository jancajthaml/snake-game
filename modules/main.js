import Loop from './loop.js'
import Canvas from './canvas.js'

class Cross {

  #lastTime
  #counter
  #keysBuffer
  #pressedKey

  constructor() {
    this.lastTime = Date.now().valueOf()
    this.counter = 0
    this.keysBuffer = []
    this.pressedKey = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'][Math.floor(Math.random() * 4)]

    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
        const index = this.keysBuffer.indexOf(event.code)
        if (index == -1) {
          this.keysBuffer.push(event.code)
        }
        this.pressedKey = event.code
      }
    })

    window.addEventListener('keyup', (event) => {
      if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
        const index = this.keysBuffer.indexOf(event.code)
        if (index != -1) {
          this.keysBuffer.splice(index, 1)
        }
        if (this.keysBuffer.length == 0) {
          this.pressedKey = event.code
        } else {
          this.pressedKey = this.keysBuffer[this.keysBuffer.length - 1]
        }
      }
    })
  }

  update(currentTime) {
    const delta = currentTime - this.lastTime
    const interval = 1000 / 2

    if (delta > interval) {
      this.counter += Math.round(delta / interval)
      this.lastTime = currentTime
    }
  }

  render(viewport, buffer) {
    buffer.lineCap = "round";
    buffer.lineWidth = 10;
    buffer.strokeStyle = "blue"

    buffer.strokeRect(5, 5, viewport.width-10, viewport.height-10)

    buffer.beginPath()
    buffer.moveTo(0, 0)
    buffer.lineTo(viewport.width, viewport.height)
    buffer.moveTo(viewport.width, 0)
    buffer.lineTo(0, viewport.height)
    buffer.stroke()

    buffer.font = 'bold 40px Arial';
    buffer.fillStyle = "red"

    const text = `[${this.counter} / [${this.keysBuffer.join('+')}] / ${this.pressedKey}]`

    const textW = buffer.measureText(text).width
    buffer.fillRect((viewport.width / 2) - textW / 2, (viewport.height / 2) - 22, textW, 42)
    buffer.fillStyle = "black"
    buffer.fillText(text, (viewport.width / 2) - textW / 2, (viewport.height / 2) + 10);

  }
}

const cross = new Cross()
const canvas = new Canvas('canvas', [cross])


window.addEventListener("load", function() {
  new Loop(60, [canvas, cross])
})
