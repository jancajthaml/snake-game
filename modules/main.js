import Loop from './loop.js'
import Canvas from './canvas.js'

class Cross {

  #lastTime
  #counter

  constructor() {
    this.lastTime = Date.now().valueOf()
    this.counter = 0
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

    const text = `[${this.counter}]`

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
