import Rectangle from './rectangle.js'

class Canvas {

  #screen
  #buffer
  #pixelRatio
  #viewport
  #updating
  #children

  constructor(elemenId, children) {
    this.children = children
    const buffer = document.createElement('canvas')
    this.buffer = buffer.getContext('2d', { alpha: false })
    const ref = document.getElementById(elemenId)
    this.screen = ref.getContext('2d', { alpha: false })
    this.pixelRatio = window.devicePixelRatio
    this.render = this.render.bind(this)
    this.onResize = this.onResize.bind(this)
    this.viewport = new Rectangle()
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  onResize() {
    const wrapper = this.screen.canvas.parentElement
    this.screen.canvas.width = this.buffer.canvas.width = wrapper.clientWidth * this.pixelRatio
    this.screen.canvas.height = this.buffer.canvas.height = wrapper.clientHeight * this.pixelRatio
    this.viewport.width = wrapper.clientWidth
    this.viewport.height = wrapper.clientHeight
  }

  render() {
    this.screen.drawImage(this.buffer.canvas, 0, 0)
  }

  update(currentTime) {
    if (this.updating) {
      return
    }
    this.updating = true
    this.buffer.fillStyle = "white"
    this.buffer.fillRect(0, 0, this.viewport.width, this.viewport.height)
    this.buffer.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    this.children.forEach((child) => {
      child.render(this.viewport, this.buffer)
    })
    this.updating = false
    this.render()
  }

}

export default Canvas;
