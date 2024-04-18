const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

//the default size used for all 1/1 blocks, lower values run faster, higher values have more correct physics
const blockSize = 50

let engine = Matter.Engine.create()
// Matter.Render.run(Matter.Render.create({
//     element: document.body,
//     engine: engine
// }))


let currentWorld = world1
let currentLevel

let showJumpZones = false

const viewport = { //cords are in blocksize
    min: { x: 0, y: 0 },
    max: { x: 0, y: 0 },
    scale: 0, //used to know at what size to render
    targetScale: 15, //how many blocks to show each direction
    freezeTime: 1000,
    freezeStart: 0
}

let playerLink
let matterLinks = []
let jumpZones = []
let killBlocks = []
let checkpoints = []
let gateways = []
let keys = []
let unlockables = []
let spawn = { x: undefined, y: undefined }
let levelSpawn = { x: undefined, y: undefined } //this is where you entered the level, used for level resets

let particles = []
let particleEmitters = []

const jumpZoneColor = '#00f6'

function clearScreen() {

    //clear outside the level
    ctx.fillStyle = currentWorld.settings.backgroundColor.outside
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //clear inside the level
    ctx.fillStyle = currentWorld.settings.backgroundColor.inside
    const scale = viewport.scale
    ctx.fillRect(
        -viewport.min.x * scale,
        -viewport.min.y * scale,
        currentLevel.grid[0].length * scale,
        currentLevel.grid.length * scale
    )
}

function updateViewport() {
    const vWidth = viewport.max.x - viewport.min.x
    const vHeight = viewport.max.y - viewport.min.y

    const scale = Math.min(
        window.innerWidth / vWidth,
        window.innerHeight / vHeight
    )
    canvas.width = vWidth * scale
    canvas.height = vHeight * scale

    viewport.scale = scale
}

function renderBlocks() {
    function rotatePoint(x, y, radians, centerX, centerY) {

        let translatedX = x - centerX
        let translatedY = y - centerY

        let rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians)
        let rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians)

        return {
            x: rotatedX + centerX,
            y: rotatedY + centerY
        }
    }
    const scale = viewport.scale
    matterLinks.forEach((link) => {
        const block = link.block
        const body = link.body
        const offset = link.offset

        const originX = ((body.position.x - offset.min.x) / blockSize - viewport.min.x) * scale
        const originY = ((body.position.y - offset.min.y) / blockSize - viewport.min.y) * scale

        let sprite = block.sprite

        //if the block is a checkpoint, and is the currently loaded checkpoint, change the sprite that renders
        if (block.checkpointSprite != undefined && link.startX == spawn.x && link.startY == spawn.y)
            sprite = block.checkpointSprite

        sprite.forEach((layer) => {
            const pathLengthOffset = layer.outline?.connectEnds != false ? 2 : 0
            const path = layer.path
            ctx.beginPath()
            for (let index = 0; index < layer.path.length + pathLengthOffset; index++) {
                let point = path[index % path.length]
                point = rotatePoint(
                    originX + point.x * scale,
                    originY + point.y * scale,
                    body.angle,
                    (body.position.x / blockSize - viewport.min.x) * scale,
                    (body.position.y / blockSize - viewport.min.y) * scale
                )
                ctx.lineTo(point.x, point.y)
            }
            if (layer.color != undefined) {
                ctx.fillStyle = layer.color
                ctx.fill()
            }
            if (layer.outline != undefined) {
                ctx.lineWidth = layer.outline.lineWidth * scale
                ctx.strokeStyle = layer.outline.color
                ctx.stroke()
            }
        })

        if (block.jumpZone && block.physics.static && showJumpZones) {
            ctx.beginPath()
            block.jumpZone.forEach((point) =>
                ctx.lineTo(originX + point.x * scale, originY + point.y * scale)
            )
            ctx.fillStyle = jumpZoneColor
            ctx.fill()
        }
    })
}

function renderParticles() {
    particleEmitters.forEach((emitter, index) => {
        if (!engine.world.bodies.includes(emitter.body)) particleEmitters.splice(index, 1)
        else if (Math.random() < emitter.chance)
            particles.push({
                color: emitter.color,
                speed: emitter.speed,
                direction: Math.random(),
                age: 0, //goes up to 100 then dies
                decay: emitter.decay,
                size: Math.random() * (emitter.size.max - emitter.size.min) + emitter.size.min,
                x: emitter.body.position.x / blockSize + (emitter.x ? emitter.x : 0),
                y: emitter.body.position.y / blockSize + (emitter.y ? emitter.y : 0),
                turn: emitter.turn,
            })
    })

    particles.forEach((particle, index) => {
        //render the particle
        ctx.fillStyle = `rgb(${particle.color.r},${particle.color.g},${particle.color.b},${(100 - particle.age) / 100})`
        ctx.beginPath()
        ctx.arc((particle.x - viewport.min.x) * viewport.scale, (particle.y - viewport.min.y) * viewport.scale, particle.size * viewport.scale, 0, Math.PI * 2)
        ctx.fill()

        //update the particle
        particle.x += particle.speed * blockSize * Math.cos(particle.direction * Math.PI * 2)
        particle.y += particle.speed * blockSize * Math.sin(particle.direction * Math.PI * 2)
        if (particle.turn) particle.direction += Math.random() * 2 * particle.turn - particle.turn
        particle.age += particle.decay
        if (particle.age == 100) particles.splice(index, 1)
    })
}

function moveViewport() {
    if (Date.now() - viewport.freezeStart < viewport.freezeTime) return
    const playerX = playerLink.body.position.x / blockSize
    const playerY = playerLink.body.position.y / blockSize
    const targetX1 = playerX - viewport.targetScale / 2
    const targetY1 = playerY - viewport.targetScale / 2
    const targetX2 = playerX + viewport.targetScale / 2
    const targetY2 = playerY + viewport.targetScale / 2

    viewport.min.x = Math.max(-.05, viewport.min.x + (targetX1 - viewport.min.x) / 25)
    viewport.min.y = Math.max(-.05, viewport.min.y + (targetY1 - viewport.min.y) / 25)
    viewport.max.x = Math.min(currentLevel.grid[0].length + .05, viewport.max.x + (targetX2 - viewport.max.x) / 25)
    viewport.max.y = Math.min(currentLevel.grid.length + .05, viewport.max.y + (targetY2 - viewport.max.y) / 25)
}

function render() {
    updateViewport()
    clearScreen()
    moveViewport()
    renderBlocks()
    renderParticles()
    requestAnimationFrame(render)
}


let lastDeltaTime = 0

function addBody(x, y, path, options = {}) {
    let bounds = { min: { x: Infinity, y: Infinity }, max: { x: -Infinity, y: -Infinity } }

    let pointsList = ''
    for (let pointIndex = 0; pointIndex < path.length; pointIndex++) {
        const point = path[pointIndex]
        pointsList = pointsList + point.x * blockSize + ' '
        pointsList = pointsList + point.y * blockSize + ' '

        bounds.min.x = Math.min(bounds.min.x, point.x * blockSize + x)
        bounds.min.y = Math.min(bounds.min.y, point.y * blockSize + y)
        bounds.max.x = Math.max(bounds.max.x, point.x * blockSize + x)
        bounds.max.y = Math.max(bounds.max.y, point.y * blockSize + y)

    }
    const body = Matter.Bodies.fromVertices(x, y, Matter.Vertices.fromPath(pointsList), options, true)
    let offset = { min: {}, max: {} }
    offset.min.x = bounds.min.x - body.bounds.min.x
    offset.min.y = bounds.min.y - body.bounds.min.y
    offset.max.x = bounds.max.x - body.bounds.max.x
    offset.max.y = bounds.max.y - body.bounds.max.y

    Matter.Body.setPosition(body, { x: x + offset.min.x - .5 * blockSize, y: y + offset.min.y - .5 * blockSize }, false)
    Matter.Composite.add(engine.world, [body])

    return { body, offset }
}

function loadLevel(level, x, y) {
    currentLevel = level

    //burn the old world to make way for the new
    Matter.World.clear(engine.world, true)
    engine.world.bodies = []
    matterLinks = []
    jumpZones = []
    killBlocks = []
    checkpoints = []
    keys = []
    spawn = { x: undefined, y: undefined }

    //set the gravity
    engine.world.gravity.x = currentWorld.settings.gravity.x
    engine.world.gravity.y = currentWorld.settings.gravity.y

    //create the walls of the level
    const width = currentLevel.grid[0].length * blockSize
    const height = currentLevel.grid.length * blockSize
    const levelWallThickness = 1_000_000 //one million blocks of wall
    Matter.World.addBody(engine.world, Matter.Bodies.rectangle(width / 2, -(levelWallThickness) * blockSize / 2, width + levelWallThickness * blockSize * 2, blockSize * levelWallThickness, { isStatic: true })) //top
    Matter.World.addBody(engine.world, Matter.Bodies.rectangle(width / 2, height + levelWallThickness * blockSize / 2, width + levelWallThickness * blockSize * 2, blockSize * levelWallThickness, { isStatic: true })) //bottom
    Matter.World.addBody(engine.world, Matter.Bodies.rectangle(-(levelWallThickness) * blockSize / 2, height / 2, blockSize * levelWallThickness, height + levelWallThickness * blockSize * 2, { isStatic: true })) //left
    Matter.World.addBody(engine.world, Matter.Bodies.rectangle(width + levelWallThickness * blockSize / 2, height / 2, blockSize * levelWallThickness, height + levelWallThickness * blockSize * 2, { isStatic: true })) //right

    //add an invisible jumpZone to the floor
    jumpZones.push(Matter.Bodies.rectangle(width / 2, height, width, blockSize * .1 / 2, { isStatic: true, isSensor: true }))

    //if this is hte first time loaded the level, save the cords and make the level fill the viewport for a little
    if (x != undefined) {
        levelSpawn = { x, y }

        //set the viewport to see the whole level
        viewport.min = { x: -.05, y: -.05 }
        viewport.max = { x: width / blockSize + .05, y: height / blockSize + .05 }

        //freeze the viewport to show the level
        viewport.freezeStart = Date.now()
    }
    x = levelSpawn.x
    y = levelSpawn.y

    //load the levels blocks
    for (let x = 0; x < currentLevel.grid[0].length; x++)
        for (let y = 0; y < currentLevel.grid.length; y++) {

            //I don't need to place a block for a 0 on the grid
            if (currentLevel.grid[y][x] != 0) {

                //this is the shape and texture used for the block
                const block = currentWorld.blocks[currentLevel.key[currentLevel.grid[y][x] - 1]]

                //grab any physics options for the block
                let options = {}
                const physics = block.physics
                if (physics) {
                    if (physics.static != undefined) options.isStatic = physics.static
                    if (physics.density != undefined) options.density = physics.density
                    if (physics.friction != undefined) options.friction = physics.friction
                    if (physics.frictionAir != undefined) options.frictionAir = physics.frictionAir
                    if (physics.frictionStatic != undefined) options.frictionStatic = physics.frictionStatic
                    if (physics.mass != undefined) options.mass = physics.mass
                    if (physics.restitution != undefined) options.restitution = physics.restitution
                    if (physics.checkpoint) { options.isStatic = true; options.isSensor = true }
                    if (physics.gateway) { options.isStatic = true; options.isSensor = true }
                    if (physics.key) { options.isStatic = true; options.isSensor = true }
                }

                //add the block
                let { body, offset } = addBody(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, block.path, options)
                matterLinks.push({ block, body, offset, startX: x, startY: y })

                //add the jumpZone, if any
                let jumpZone
                if (block.jumpZone)
                    if (block.physics?.static) {
                        jumpZone = addBody(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, block.jumpZone, { isStatic: true, isSensor: true }).body
                        jumpZones.push(jumpZone)
                    } else
                        console.error('Non static blocks cannot have a jumpZone, jumpZone generation skipped.')

                //find all composite bodies
                let bodies = []
                while (body.id != body.parent.id) body = body.parent
                bodies.push(body)
                addChildren(body)
                function addChildren(body) {
                    if (body.parts == undefined) return
                    for (let child of body.parts) {
                        if (!bodies.includes(child)) {
                            bodies.push(child)
                            addChildren([child])
                        }
                    }
                }

                //add to the killBlocks if needed
                if (block.physics?.killer) bodies.forEach(body => killBlocks.push({ ...body, fullReload: block.physics.fullReload }))

                //add to the checkpoints if needed
                if (block.physics?.checkpoint) bodies.forEach(body => checkpoints.push({ ...body, x, y }))

                //add the emitter, if needed
                if (block.emitters) block.emitters.forEach(emitter => particleEmitters.push({ ...emitter, body }))

                //add the gateway, if needed
                if (block.physics?.gateway) {
                    if (currentLevel.gateways == undefined) throw new Error('Levels with gateways must have a gateway link list')
                    let link
                    currentLevel.gateways.forEach(gateway => {
                        if (gateway.from.x == x && gateway.from.y == y) link = gateway
                    })
                    if (link == undefined) throw new Error('Gateway link list is missing a gateway in the grid')
                    bodies.forEach(body => gateways.push({ body, link }))
                }

                //add the key, if needed
                if (block.physics?.key) bodies.forEach(body => keys.push(body))

                //add the unlockables, if needed
                if (block.physics?.unlockable) bodies.forEach(body => unlockables.push({ ...body, jumpZone }))
            }
        }


    //add the player
    const block = currentWorld.blocks[currentWorld.settings.player]

    //grab any physics options for the block
    let options = {}
    const physics = block.physics
    if (physics) {
        if (physics.density != undefined) options.density = physics.density
        if (physics.friction != undefined) options.friction = physics.friction
        if (physics.frictionAir != undefined) options.frictionAir = physics.frictionAir
        if (physics.frictionStatic != undefined) options.frictionStatic = physics.frictionStatic
        if (physics.mass != undefined) options.mass = physics.mass
        if (physics.restitution != undefined) options.restitution = physics.restitution
    }

    //add the block
    const { body, offset } = addBody(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, block.path, options)
    matterLinks.push({ block, body, offset, startX: x, startY: y })

    //hold on to the player if needed
    playerLink = matterLinks[matterLinks.length - 1]
    spawn = { x, y }

    //add the emitter, if any
    if (block.particles)
        particleEmitters.push({ ...block.particles, body })
}

loadLevel(currentWorld.levels[currentWorld.settings.start.level], currentWorld.settings.start.x, currentWorld.settings.start.y)

function respawn() {
    let body = playerLink.body
    Matter.Body.setVelocity(body, { x: 0, y: 0 })
    Matter.Body.setAngle(body, 0)
    Matter.Body.setAngularVelocity(body, 0)
    Matter.Body.setPosition(body, { x: spawn.x * blockSize + playerLink.offset.min.x, y: spawn.y * blockSize + playerLink.offset.min.y })
}

function movePlayer(deltaTime) {
    const player = playerLink.body
    if (pressedKeys.includes('d') || pressedKeys.includes('ArrowRight'))
        Matter.Body.applyForce(
            player,
            { x: player.position.x + blockSize / 2, y: player.position.y - blockSize / 2 },
            { x: currentWorld.settings.movement.sidePower * deltaTime, y: 0 }
        )
    if (pressedKeys.includes('a') || pressedKeys.includes('ArrowLeft'))
        Matter.Body.applyForce(
            player,
            { x: player.position.x - blockSize / 2, y: player.position.y - blockSize / 2 },
            { x: -currentWorld.settings.movement.sidePower * deltaTime, y: 0 }
        )
    if ((pressedKeys.includes('w') || pressedKeys.includes('ArrowUp') || pressedKeys.includes(' ')) && Matter.Query.collides(player, jumpZones).length > 0)
        Matter.Body.setVelocity(
            player,
            { x: 0, y: -currentWorld.settings.movement.jumpPower }
        )
}

let lastTime = Date.now()
function update() {
    //calculate deltaTime for physics
    const deltaTime = Math.min(Date.now() - lastTime, 50)
    lastDeltaTime = deltaTime
    lastTime = Date.now()


    movePlayer(deltaTime)

    //tick Matter
    Matter.Engine.update(engine, deltaTime)

    //plan the next update
    setTimeout(update, 0)
}

//run all the collision events
Matter.Events.on(engine, 'collisionStart', (e) => {

    //run thru every collision
    for (let index = 0; index < e.pairs.length; index++) {
        let bodyA = e.pairs[index].bodyA
        let bodyB = e.pairs[index].bodyB

        //check if the player was one of the bodies
        if (bodyA.id == playerLink.body.id || bodyB.id == playerLink.body.id) {

            // console.log(bodyA,bodyB)

            //check for killer blocks
            for (let subIndex = 0; subIndex < killBlocks.length; subIndex++)
                if (bodyA.id == killBlocks[subIndex].id || bodyB.id == killBlocks[subIndex].id) {
                    for (let i = 0; i < 100; i++) particles.push({
                        color: currentWorld.settings.particles.death,
                        speed: Math.random() / 1000,
                        direction: Math.random(),
                        age: 0, //goes up to 100 then dies
                        decay: 1,
                        size: Math.random() / 25,
                        x: playerLink.body.position.x / blockSize,
                        y: playerLink.body.position.y / blockSize,
                    })
                    if (killBlocks[subIndex].fullReload)
                        loadLevel(currentLevel)
                    else
                        respawn()
                }

            //check for checkpoints
            for (let subIndex = 0; subIndex < checkpoints.length; subIndex++)
                if (bodyA.id == checkpoints[subIndex].id || bodyB.id == checkpoints[subIndex].id) {
                    if (!(spawn.x == checkpoints[subIndex].x && spawn.y == checkpoints[subIndex].y))
                        for (let i = 0; i < 100; i++) particles.push({
                            color: currentWorld.settings.particles.checkpoint,
                            speed: Math.random() / 1000,
                            direction: Math.random(),
                            age: 0, //goes up to 100 then dies
                            decay: 1,
                            size: Math.random() / 25,
                            x: checkpoints[subIndex].x + .5,
                            y: checkpoints[subIndex].y + .5
                        });
                    [spawn.x, spawn.y] = [checkpoints[subIndex].x, checkpoints[subIndex].y]
                }

            //check for gateways
            for (let subIndex = 0; subIndex < gateways.length; subIndex++) {
                const gateway = gateways[subIndex]
                if (bodyA.id == gateway.body.id || bodyB.id == gateway.body.id) {
                    for (let i = 0; i < 100; i++) particles.push({
                        color: currentWorld.settings.particles.gateway,
                        speed: Math.random() / 1000,
                        direction: Math.random(),
                        age: 0, //goes up to 100 then dies
                        decay: 1,
                        size: Math.random() / 25,
                        x: playerLink.body.position.x / blockSize,
                        y: playerLink.body.position.y / blockSize
                    })
                    loadLevel(currentWorld.levels[gateway.link.level], gateway.link.to.x, gateway.link.to.y)
                }
            }

            //check for keys
            for (let subIndex = 0; subIndex < keys.length; subIndex++) {
                if (bodyA.id == keys[subIndex].id || bodyB.id == keys[subIndex].id) {
                    let bodies = []
                    let body = keys[subIndex]
                    while (body.id != body.parent.id) body = body.parent
                    bodies.push(body)
                    addChildren(body)
                    function addChildren(body) {
                        if (body.parts == undefined) return
                        for (let child of body.parts) {
                            if (!bodies.includes(child)) {
                                bodies.push(child)
                                addChildren([child])
                            }
                        }
                    }
                    bodies.forEach(body => {
                        matterLinks = matterLinks.filter(link => link.body.id != body.id)
                        Matter.Composite.remove(engine.world, body, true)
                    })
                    for (let i = 0; i < 100; i++) particles.push({
                        color: currentWorld.settings.particles.key,
                        speed: Math.random() / 1000,
                        direction: Math.random(),
                        age: 0, //goes up to 100 then dies
                        decay: 1,
                        size: Math.random() / 25,
                        x: keys[subIndex].position.x / blockSize,
                        y: keys[subIndex].position.y / blockSize
                    })
                    unlockables.forEach(body => {
                        if (body.jumpZone == undefined) {
                            let bodies = []
                            while (body.id != body.parent.id) body = body.parent
                            bodies.push(body)
                            addChildren(body)
                            function addChildren(body) {
                                if (body.parts == undefined) return
                                for (let child of body.parts) {
                                    if (!bodies.includes(child)) {
                                        bodies.push(child)
                                        addChildren([child])
                                    }
                                }
                            }
                            bodies.forEach(body => {
                                matterLinks = matterLinks.filter(link => link.body.id != body.id)
                                Matter.Composite.remove(engine.world, body, true)
                            })        
                            matterLinks = matterLinks.filter(link => link.body.id != body.id)
                            Matter.Composite.remove(engine.world, body, true)
                        } else {
                            jumpZones = jumpZones.filter(link => link.id != body.jumpZone.id)
                            Matter.Composite.remove(engine.world, body.jumpZone, true)
                            matterLinks = matterLinks.filter(link => link.body.id != body.id)
                            Matter.Composite.remove(engine.world, Matter.Composite.get(engine.world, body.id, 'body'), true)
                        }
                    })
                    unlockables = []
                }
            }
        }
    }
})


//keep track of what keys are pressed
let pressedKeys = []
document.addEventListener('keydown', (e) => {
    if (!pressedKeys.includes(e.key))
        pressedKeys.push(e.key)
})
document.addEventListener('keyup', (e) => {
    if (pressedKeys.includes(e.key))
        pressedKeys.splice(pressedKeys.indexOf(e.key), 1)
})
document.addEventListener('keypress', (e) => {
    if (e.key == 'r') {
        for (let i = 0; i < 100; i++) particles.push({
            color: currentWorld.settings.particles.death,
            speed: Math.random() / 1000,
            direction: Math.random(),
            age: 0, //goes up to 100 then dies
            decay: 1,
            size: Math.random() / 25,
            x: playerLink.body.position.x / blockSize,
            y: playerLink.body.position.y / blockSize,
        })
        loadLevel(currentLevel)
    }
    if (e.key == 's') showJumpZones = !showJumpZones
})

//start the first update
update()

requestAnimationFrame(render)


//joke idea, remove the deltaTime cap, and add some logic to keep players inside bounds, and create a level that uses deltaTime glitching to play