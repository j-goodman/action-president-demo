let canvas = null
let ctx = null
let frameRate = 100

let setupCanvas = () => {
    // Assign canvas variables, set canvas size, and draw panels
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    resizeEvent()
}

let resizeEvent = () => {
    // Set the canvas width and height to the screensize of the reader's device
    canvas.height = window.innerHeight
    canvas.width = canvas.getBoundingClientRect().width
    drawPanels()
}

function Panel (obj) {
    // Panel object class
    this.frames = obj.frames
    this.frame = 0
    this.name = obj.name
    this.image = document.createElement('img')
    this.image.src = obj.imageSource
}

let drawPanels = () => {
    // Render all panels onto the canvas
    // (to do: only render the panels within the reader's field of vision)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let objectiveScroll = window.scrollY
    let totalFrames = 0
    let totalAnchor = 0
    panels.map((panel, index) => {
        anchor = totalAnchor
        totalAnchor += height(panel, canvas)
        let slide = panel.frames * frameRate
        if (objectiveScroll > anchor && objectiveScroll < anchor + slide) {
            objectiveScroll = anchor
            // Set the current frame based on scroll position
            panel.frame = Math.floor(
                (window.scrollY - anchor) / (slide) * panel.frames - totalFrames
            )
        } else if (objectiveScroll > anchor + slide) {
            objectiveScroll -= slide
        }
        totalFrames += panel.frames
        let scrollOffset = anchor - objectiveScroll
        let frameOffset = panel.frame * canvas.width
        ctx.drawImage(
            panel.image,
            0 - frameOffset,
            scrollOffset,
            canvas.width * panel.frames,
            height(panel, canvas)
        )
    })
}

let height = (panel, canvas) => {
    // Return the height that an image should be drawn with
    return panel.image.height * canvas.width / (panel.image.width / panel.frames)
}

let panels = [
    new Panel ({
        name: 'panel-one.png',
        imageSource: 'images/panel-one.png',
        frames: 38,
    }),
    new Panel ({
      name: 'space-jump',
      imageSource: 'images/space-jump.png',
      frames: 36,
    }),
]

window.addEventListener('load', setupCanvas)
window.addEventListener('scroll', drawPanels)
window.addEventListener('resize', resizeEvent)
