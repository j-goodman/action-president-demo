let canvas = null
let ctx = null
let frameRate = 100

let setupCanvas = () => {
    // Assign canvas variables, set canvas size, and draw panels
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    resizeEvent()
    document.getElementById('loader-note').innerText = ''
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
            let targetFrame = Math.floor(
                (window.scrollY - anchor) / (slide) * panel.frames - totalFrames
            )

            if (Math.abs(targetFrame - panel.frame) <= 1) {
                panel.frame = targetFrame
            } else {
                panel.frame += targetFrame < panel.frame ? -1 : 1;
            }
        } else if (objectiveScroll > anchor + slide) {
            objectiveScroll -= slide
        }

        totalFrames += panel.frames
        let scrollOffset = anchor - objectiveScroll
        let frameOffset = panel.frame * canvas.width

        if (scrollOffset > 0 && panel.frame > 0) {
            panel.frame -= 1
        } else if (scrollOffset < 0 && panel.frame < panel.frames - 1) {
            panel.frame += 1
        }

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
      name: 'color-one',
      imageSource: 'images/color-one.png',
      frames: 38,
    }),
    new Panel ({
      name: 'color-two',
      imageSource: 'images/color-two.png',
      frames: 29,
    }),
    new Panel ({
      name: 'color-three',
      imageSource: 'images/color-three.png',
      frames: 38,
    }),
    new Panel ({
      name: 'four-a',
      imageSource: 'images/four-a.png',
      frames: 35,
    }),
    new Panel ({
      name: 'four-b',
      imageSource: 'images/four-b.png',
      frames: 42,
    }),
    new Panel ({
      name: 'five-a',
      imageSource: 'images/five-a.png',
      frames: 47,
    }),
    new Panel ({
      name: 'five-b',
      imageSource: 'images/five-b.png',
      frames: 11,
    }),
    new Panel ({
      name: 'color-six',
      imageSource: 'images/color-six.png',
      frames: 15,
    }),
]

window.setInterval(drawPanels, 30)
window.addEventListener('load', setupCanvas)
window.addEventListener('resize', resizeEvent)
