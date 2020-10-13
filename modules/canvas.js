import Rectangle from './rectangle.js'

class Canvas {

  #screen
  #buffer
  #pixelRatio
  #viewport
  #scaling
  #updating
  #children
  #resizeEvent

  constructor(elemenId, children) {
    this.resizeEvent = null
    this.children = children
    const ref = document.getElementById(elemenId)
    this.screen = ref.getContext('bitmaprenderer')
    this.buffer = new OffscreenCanvas(this.screen.canvas.width, this.screen.canvas.height).getContext('2d', { alpha: false, desynchronized: true })
    this.pixelRatio = window.devicePixelRatio
    this.render = this.render.bind(this)
    this.onResize = this.onResize.bind(this)
    this.viewport = new Rectangle(0, 0, 100, 50)
    this.scaling = new Rectangle(1, 1, 0, 0)
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  onResize() {
    const wrapper = this.screen.canvas.parentElement
    const nextWidth = wrapper.clientWidth * this.pixelRatio
    const nextHeight = wrapper.clientHeight * this.pixelRatio

    if (nextWidth !== this.viewport.width || nextHeight !== this.viewport.height) {
      this.resizeEvent = {
        width: wrapper.clientWidth * this.pixelRatio,
        height: wrapper.clientHeight * this.pixelRatio,
      }
    }
  }

  render() {
    this.screen.imageSmoothingEnabled = false
    this.screen.transferFromImageBitmap(this.buffer.canvas.transferToImageBitmap())
  }

  update(currentTime) {
    if (this.updating) {
      return
    }
    this.updating = true
    if (this.resizeEvent) {
      this.buffer.canvas.width = this.resizeEvent.width
      this.buffer.canvas.height = this.resizeEvent.height
      this.resizeEvent = null

      const w = (this.viewport.width * this.pixelRatio)
      const h = (this.viewport.height * this.pixelRatio)

      const aspectW = Math.abs(this.buffer.canvas.width / (this.viewport.width * this.pixelRatio))
      const aspectH = Math.abs(this.buffer.canvas.height / (this.viewport.height * this.pixelRatio))
      const aspect = Math.min(aspectH, aspectW)

      this.scaling.x = this.pixelRatio * aspect,
      this.scaling.y = this.pixelRatio * aspect
      this.scaling.width = (this.buffer.canvas.width - (w * aspect)) / 2
      this.scaling.height = (this.buffer.canvas.height - (h * aspect)) / 2
    }

    this.buffer.imageSmoothingEnabled = false

    this.buffer.setTransform(this.scaling.x, 0, 0, this.scaling.y, this.scaling.width, this.scaling.height)
    this.buffer.fillStyle = "white"
    this.buffer.fillRect(0, 0, this.viewport.width, this.viewport.height)
    this.children.forEach((child) => {
      child.render(this.viewport, this.buffer, currentTime)
    })
    this.updating = false
    this.render()
  }

}

export default Canvas;
