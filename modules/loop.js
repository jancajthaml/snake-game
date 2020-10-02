
class Loop {

  #lastTime
  #FPS
  #children

  constructor(fps, children) {
    this.children = children
    this.FPS = fps
    this.lastTime = Date.now().valueOf()
    this.onLoop = this.onLoop.bind(this)
    requestAnimationFrame(this.onLoop)
  }

  onLoop() {
    const now = Date.now().valueOf()
    const delta = now - this.lastTime
    const interval = 1000 / this.FPS

    if (delta > interval) {
      this.children.forEach((child) => {
        child.update(now)
      })
      this.lastTime = now - (delta - ((delta / interval) | 0) * interval)
    }
    requestAnimationFrame(this.onLoop)
  }

}

export default Loop;
