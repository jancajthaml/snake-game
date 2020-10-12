import Rectangle from './rectangle.js'

const PIXEL_SIZE = 10

class Canvas {

  #screen
  #buffer
  #pixelRatio
  #viewport
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
    this.viewport = new Rectangle(0, 0, this.buffer.canvas.width, this.buffer.canvas.height)
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
      this.viewport.width = Math.round(this.resizeEvent.width / this.pixelRatio / PIXEL_SIZE)
      this.viewport.height = Math.round(this.resizeEvent.height / this.pixelRatio / PIXEL_SIZE)
      this.resizeEvent = null
    }
    this.buffer.imageSmoothingEnabled = false
    // FIXME calculate translate to center
    this.buffer.setTransform(this.pixelRatio * PIXEL_SIZE, 0, 0, this.pixelRatio * PIXEL_SIZE, 0, 0)
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
