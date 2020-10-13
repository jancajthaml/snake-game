
class Controls {

  #snake
  #lastTimeUpdate
  #lastPressedKey
  #keysBuffer

  constructor(snake) {
    this.snake = snake
    this.keysBuffer = []
    this.lastPressedKey = 'ArrowRight'
    this.lastTimeUpdate = Number.MIN_SAFE_INTEGER

    window.addEventListener('keydown', (event) => {
      const index = this.keysBuffer.indexOf(event.code)
      if (index == -1) {
        this.keysBuffer.push(event.code)
      }
    })
  }

  updateDirection() {
    if (this.keysBuffer.length == 0) {
      return
    }

    switch (this.lastPressedKey) {
      case undefined: {
        this.lastPressedKey = this.keysBuffer.pop()
        break
      }

      case 'ArrowUp': {
        this.keysBuffer = this.keysBuffer.filter((key) => key !== 'ArrowDown')
        this.lastPressedKey = this.keysBuffer.pop() || this.lastPressedKey
        break
      }

      case 'ArrowDown': {
        this.keysBuffer = this.keysBuffer.filter((key) => key !== 'ArrowUp')
        this.lastPressedKey = this.keysBuffer.pop() || this.lastPressedKey
        break
      }

      case 'ArrowLeft': {
        this.keysBuffer = this.keysBuffer.filter((key) => key !== 'ArrowRight')
        this.lastPressedKey = this.keysBuffer.pop() || this.lastPressedKey
        break
      }

      case 'ArrowRight': {
        this.keysBuffer = this.keysBuffer.filter((key) => key !== 'ArrowLeft')
        this.lastPressedKey = this.keysBuffer.pop() || this.lastPressedKey
        break
      }

      default: {
        break
      }

    }

    switch (this.lastPressedKey) {

      case 'ArrowUp': {
        this.snake.direction = 'up'
        break
      }

      case 'ArrowDown': {
        this.snake.direction = 'down'
        break
      }

      case 'ArrowLeft': {
        this.snake.direction = 'left'
        break
      }

      case 'ArrowRight': {
        this.snake.direction = 'right'
        break
      }

    }
  }

  update(currentTime) {
    if (((currentTime - this.lastTimeUpdate) * this.snake.speed) >= 1000) {
      this.updateDirection()
      this.lastTimeUpdate = currentTime
    }
  }

}

export default Controls
