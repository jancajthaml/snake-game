import Loop from './loop.js'
import Canvas from './canvas.js'

class Cross {

  #lastTime
  #counter
  //#pressedKeys
  #lastPressedKey
  #keysBuffer

  constructor() {
    this.lastTime = window.performance.now()
    this.counter = 0
    this.keysBuffer = []
    this.lastPressedKey = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'][Math.floor(Math.random() * 4)],

    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
        const index = this.keysBuffer.indexOf(event.code)
        if (index == -1) {
          this.keysBuffer.push(event.code)
        }
      }
    })
  }

  update(currentTime) {
    const delta = currentTime - this.lastTime
    const interval = 1000 / 1

    if (delta > interval) {
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
      this.counter += Math.round(delta / interval)
      this.lastTime = currentTime
    }
  }

  render(viewport, buffer) {
    buffer.lineCap = "round";
    buffer.lineWidth = 10;
    buffer.strokeStyle = "blue"

    buffer.beginPath()
    buffer.moveTo(5, 5)
    buffer.lineTo(5, viewport.height-5)
    buffer.moveTo(5, viewport.height-5)
    buffer.lineTo(viewport.width-5, viewport.height-5)
    buffer.moveTo(viewport.width-5, viewport.height-5)
    buffer.lineTo(viewport.width-5, 5)
    buffer.moveTo(viewport.width-5, 5)
    buffer.lineTo(5, 5)
    buffer.moveTo(0, 0)
    buffer.lineTo(viewport.width, viewport.height)
    buffer.moveTo(viewport.width, 0)
    buffer.lineTo(0, viewport.height)
    buffer.stroke()

    buffer.font = 'bold 40px Arial';
    buffer.fillStyle = "red"

    const text = `[${this.counter} / [${this.keysBuffer.join('+')}] / ${this.lastPressedKey}]`

    const textW = buffer.measureText(text).width
    buffer.fillRect((viewport.width / 2) - textW / 2, (viewport.height / 2) - 22, textW, 42)
    buffer.fillStyle = "black"
    buffer.fillText(text, (viewport.width / 2) - textW / 2, (viewport.height / 2) + 10)
  }
}

const cross = new Cross()
const canvas = new Canvas('canvas', [cross])

window.addEventListener("load", function() {
  new Loop(60, [canvas, cross]).run()
})
