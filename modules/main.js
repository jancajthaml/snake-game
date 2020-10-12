import Loop from './loop.js'
import Canvas from './canvas.js'
import Snake from './snake.js'
import Controls from './controls.js'

const snake = new Snake()
const controls = new Controls(snake)
const canvas = new Canvas('canvas', [snake])

window.addEventListener("load", function() {
  new Loop(30, [controls, snake, canvas]).run()
})
