
class Controls {

  #snake
  #lastTime

  constructor(snake) {
    this.snake = snake
    this.keysBuffer = []
    this.lastPressedKey = 'ArrowRight'
    this.lastTime = Number.MIN_SAFE_INTEGER

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

    this.keysBuffer = []
  }

  update(currentTime) {
    const delta = (currentTime - this.lastTime) * this.snake.speed

    if (delta >= 1e3) {
      this.updateDirection()
      this.lastTime = currentTime
    }
  }

}

export default Controls
