import Loop from './loop.js'
import Canvas from './canvas.js'
import Snake from './snake.js'

const snake = new Snake()
const canvas = new Canvas('canvas', [snake])

window.addEventListener("load", function() {
  new Loop(30, [canvas, snake]).run()
})
