const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const canvasDiv = document.getElementById('canvasDiv')

let gridSize = 1
let gridDensity = 4

let mode = ''

let mouse = {
    x: 0,
    y: 0
}

let closestPoint

let selectedPoint = { x: 0, y: 0 }

let pathPath = []

let size, unitSize, blockCount, blockOffset

let spriteStack = []

let spriteElements = {
    fillColor: undefined,
    fillColorAlpha: undefined,
    outlineColor: undefined,
    outlineColorAlpha: undefined,
    outlineLineWidth: undefined,
    gridDensity: undefined,
    gridSize: undefined,
    pathRotation: undefined,
    pathScale: undefined
}

//all of these are for sprite creation
let doFill = true
let fillColor = '#000000'
let fillColorAlpha = 'ff'
let doOutline = true
let outlineColor = '#000000'
let outlineColorAlpha = 'ff'
let outlineLineWidth = .01
let doSpriteAdvancedPlacement = false
let spritePathRotation = 0
let spritePathScale = 1

//all of these are for block creation
let isBlockStatic = true
let isBlockKiller = false
let isBlockGateway = false
let isBlockCheckpoint = false
let isBlockKey = false
let isBlockUnlockable = false
let blockSelectedPath
let blockSelectedSprite
let blockSelectedSpriteSecondary
let blockJumpZonePath = []

//all of these are for level creation
let levelWidth = 10
let levelHeight = 10
let levelBlocks = []
let levelGateways = []
let levelGrid
let levelBrush = 0
let levelExportX = 0
let levelExportY = 0

//all of these are for world creation
let worldLevels = []
let worldSettingsParticles = {
    checkpoint: { r: 0, g: 255, b: 0 },
    death: { r: 255, g: 0, b: 0 },
    gateway: { r: 0, g: 0, b: 255 },
    key: { r: 255, g: 255, b: 0 }
}
let worldBackgroundColor = {
    inside: '#000000',
    outside: '#666666'
}
let worldGravity = {
    x: 0,
    y: 1
}
let worldMovement = {
    jumpPower: 10,
    sidePower: .00005
}
let worldStart = {
    level: undefined,
    x: 0,
    y: 0
}
let worldPlayer
let worldGatewayElement
let worldPreviewLevel



let saveData

try {
    saveData = JSON.parse(localStorage.getItem('saveData'))
    if (saveData == null)
        saveData = {
            worlds: {},
            levels: {},
            blocks: {},
            sprites: {},
            paths: {}
        }
    if (
        typeof saveData.worlds != 'object' ||
        typeof saveData.levels != 'object' ||
        typeof saveData.blocks != 'object' ||
        typeof saveData.sprites != 'object' ||
        typeof saveData.paths != 'object'
    ) throw 'bad type'
    localStorage.setItem('backupSaveData', saveData)
} catch {
    console.log(saveData)
    console.log(JSON.parse(localStorage.getItem('backupSaveData')))
    alert('saveData is corrupted, resting to last save')
    localStorage.setItem('saveData', localStorage.getItem('backupSaveData'))
}

//adds a panel to the inputs div that can take numbers, plus functions to manipulate the numbers
function addNumberInput(buttons, defaultValue, updateFunc, title, min = -Infinity, max = Infinity) {

    //create the wrapper to store all the buttons
    let wrapper = document.createElement('div')
    wrapper.classList.add('subInput')

    //only call the updateFunc when the value changes
    const fullUpdateFunc = () => {
        if (textArea.value.length == 0) textArea.value = lastValue
        else {
            textArea.value = Math.max(min, Math.min(max, Number(textArea.value)))
            if (lastValue != Number(textArea.value))
                updateFunc(Number(textArea.value))
            lastValue = Number(textArea.value)
        }
    }

    //create the textarea
    var textArea = document.createElement('textarea')
    textArea.value = defaultValue
    textArea.rows = 1
    textArea.cols = 5

    //store the last value for value validation
    let lastValue

    //run the updateFunc when the value changes
    textArea.addEventListener('change', () => {
        if (isNaN(Number(textArea.value)))
            textArea.value = lastValue
        else
            fullUpdateFunc()
    })

    //add the title
    let p = document.createElement('p')
    p.textContent = title
    wrapper.appendChild(p)

    //create the sub div
    let subDiv = document.createElement('div')
    subDiv.classList.add('subInput_subDiv')
    wrapper.appendChild(subDiv)

    //add all the buttons
    for (let button of buttons) {

        //if the button is 'value' add the actual textarea
        if (button == 'value')
            subDiv.appendChild(textArea)
        else {

            //add the button with a custom func
            let element = document.createElement('button')
            element.textContent = button.text
            element.onclick = () => {
                textArea.value = button.func(Number(textArea.value))
                fullUpdateFunc()
            }
            subDiv.appendChild(element)
        }
    }

    //update once
    fullUpdateFunc()

    //add the element
    document.getElementById('inputs').appendChild(wrapper)

    return wrapper
}

//adds a panel with buttons that do any func
function addButtonInput(buttons, title) {

    //create the wrapper to store all the buttons
    let wrapper = document.createElement('div')
    wrapper.classList.add('subInput')

    //add the title
    if (title != undefined) {
        let p = document.createElement('p')
        p.textContent = title
        wrapper.appendChild(p)
    }

    //create the sub div
    let subDiv = document.createElement('div')
    subDiv.classList.add('subInput_subDiv')
    wrapper.appendChild(subDiv)

    //add all the buttons
    for (let button of buttons) {
        if (typeof button == 'string') {
            let p = document.createElement('p')
            p.textContent = button
            subDiv.appendChild(p)
        } else {
            let element = document.createElement('button')
            element.textContent = button.text
            element.onclick = () => button.func(element)
            subDiv.appendChild(element)
        }
    }

    //add the element
    document.getElementById('inputs').appendChild(wrapper)

    return wrapper
}

//adds a dropdown menu of button rows
function addDropdownInput(items, title) {
    let wrapper = document.createElement('div')
    wrapper.classList.add('dropdown')

    let p = document.createElement('p')
    p.textContent = title
    wrapper.appendChild(p)

    let subWrapper = document.createElement('div')
    subWrapper.classList.add('dropdown_wrapper')
    wrapper.appendChild(subWrapper)

    for (let item of items) {
        let itemDiv = document.createElement('div')
        itemDiv.classList.add('dropdown_item')
        for (let button of item) {
            if (typeof button == 'string') {
                let p = document.createElement('p')
                p.textContent = button
                itemDiv.appendChild(p)
            } else {
                let element = document.createElement('button')
                element.textContent = button.text
                element.onclick = () => button.func(subWrapper, itemDiv)
                itemDiv.appendChild(element)
            }
        }
        subWrapper.appendChild(itemDiv)
    }
    document.getElementById('inputs').appendChild(wrapper)

    return wrapper
}

//adds a highlighted text input, along with input validation
function addFocusedTextInput(title, submitFunc, validateFunc) {
    let wrapper = document.createElement('div')
    wrapper.classList.add('focusedTextInput')

    let p = document.createElement('p')
    p.textContent = title
    wrapper.appendChild(p)

    let textarea = document.createElement('textarea')
    textarea.rows = 1
    textarea.cols = 5
    wrapper.appendChild(textarea)

    let cancel = document.createElement('button')
    cancel.innerText = 'Cancel'
    wrapper.appendChild(cancel)

    cancel.onclick = () => {
        document.getElementById('inputs').removeChild(wrapper)
    }

    let button = document.createElement('button')
    button.innerText = 'Submit'
    wrapper.appendChild(button)

    button.onclick = () => {
        if (validateFunc != undefined) {
            const result = validateFunc(textarea.value)
            if (result !== true) {
                textarea.value = (result === false ? '' : result)
                wrapper.classList.add('invalidInput')
                button.innerText = 'Invalid Input'
                setTimeout(() => {
                    if (result !== false)
                        textarea.value = ''
                    wrapper.classList.remove('invalidInput')
                    button.innerText = 'Submit'
                }, 1000)
                return
            }
        }

        document.getElementById('inputs').removeChild(wrapper)
        submitFunc(textarea.value)
    }

    document.getElementById('inputs').appendChild(wrapper)

    return wrapper
}

//adds a simple color input
function addColorInput(title, func, defaultColor = '#000000') {
    let wrapper = document.createElement('div')
    wrapper.classList.add('subInput')

    let p = document.createElement('p')
    p.textContent = title
    wrapper.appendChild(p)

    let subWrapper = document.createElement('div')
    subWrapper.classList.add('subInput_subDiv')
    wrapper.appendChild(subWrapper)

    let color = document.createElement('input')
    color.type = 'color'
    color.classList.add('colorInput')
    color.value = defaultColor
    subWrapper.appendChild(color)

    color.addEventListener("change", (e) => func(e.target.value))

    document.getElementById('inputs').appendChild(wrapper)

    return wrapper
}

function importSaveData(importData) {
    saveData.paths = { ...saveData.paths, ...importData.paths }
    saveData.sprites = { ...saveData.sprites, ...importData.sprites }
    saveData.blocks = { ...saveData.blocks, ...importData.blocks }
    saveData.levels = { ...saveData.levels, ...importData.levels }
    saveData.worlds = { ...saveData.worlds, ...importData.worlds }
    save()
}

function importWorld(world, name) {
    saveData.blocks = { ...saveData.blocks, ...world.blocks }
    saveData.levels = { ...saveData.levels, ...world.levels }
    saveData.worlds[name] = world
    save()
}

function createFileImport() {
    let wrapper = document.createElement('div')
    wrapper.classList.add('subInput')

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    fileInput.id = 'fileInput'
    fileInput.style.display = 'none'

    const label = document.createElement('label')
    label.htmlFor = 'fileInput'
    label.id = 'fileLabel'
    label.textContent = 'Import world / saveData'

    document.getElementById('inputs').appendChild(fileInput)
    document.getElementById('inputs').appendChild(label)


    fileInput.addEventListener('change', e => {
        const reader = new FileReader()
        const file = fileInput.files[0]
        const fileName = file.name.split('.json')[0]
        reader.onload = (e) => {
            const fileContent = e.target.result
            try {
                const jsonObject = JSON.parse(fileContent)
                if (jsonObject.paths != undefined)
                    importSaveData(jsonObject)
                else
                    importWorld(jsonObject, fileName)
            } catch (error) {
                console.error('Error parsing JSON!', error)
            }
        }
        reader.onerror = (e) => {
            console.error('Error reading file:', e)
        }

        reader.readAsText(file)
    })
}

function createDataExport() {
    addButtonInput([{
        text: 'Download saveData', func() {
            const blob = new Blob([JSON.stringify(saveData)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = 'saveData.json'
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }
    }])
}

//the majority of all the gui is in here
let navigationButtons = [
    {
        text: 'Path creator', func() {
            mode = 'path'
            clearInput()
            createFileImport()
            createDataExport()
            addButtonInput(navigationButtons, 'Mode selector')

            addDropdownInput([
                [{
                    text: 'Remove last point', func() {
                        if (pathPath.length > 0)
                            pathPath.pop()
                    }
                }],
                [{
                    text: 'Save path', func() {
                        addFocusedTextInput('Enter name for path', (value) => {
                            saveData.paths[value] = pathPath
                            pathPath = []
                            save()
                        }, (value) => (saveData.paths[value] == undefined) ? true : 'Name already taken')
                    }
                }],
                [{ text: 'Clear path', func() { pathPath = [] } }],
                [{
                    text: 'Load / Remove path', func() {
                        if (Object.keys(saveData.paths).length > 0) {
                            let items = [
                                [
                                    {
                                        text: 'Close menu', func(menu) {
                                            document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    }
                                ]
                            ]
                            for (let key of Object.keys(saveData.paths)) {
                                items.push([
                                    key,
                                    {
                                        text: 'Remove', func(menu, item) {
                                            delete saveData.paths[key]
                                            menu.removeChild(item)
                                            save()
                                            if (menu.children.length == 1)
                                                document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    },
                                    {
                                        text: 'Load', func() {
                                            pathPath = saveData.paths[key]
                                        }
                                    }
                                ])
                            }
                            addDropdownInput(items, 'Choose path')
                        }
                    }
                }
                ]], 'Path control buttons')

            addNumberInput([
                { text: '-.5', func(x) { return x - .5 } },
                'value',
                { text: '+.5', func(x) { return x + .5 } }
            ], gridSize, (x) => gridSize = x, 'Grid Size', 1)

            addNumberInput([
                { text: '/2', func(x) { return x / 2 } },
                { text: '-1', func(x) { return x - 1 } },
                'value',
                { text: '+1', func(x) { return x + 1 } },
                { text: '*2', func(x) { return x * 2 } }
            ], gridDensity, (x) => gridDensity = x, 'Grid Density (points per unit)', 1)
        }
    },
    {
        text: 'Sprite creator', func() {
            mode = 'sprite'
            clearInput()
            createFileImport()
            createDataExport()
            addButtonInput(navigationButtons, 'Mode selector')

            addDropdownInput([
                [{
                    text: 'Save sprite', func() {
                        addFocusedTextInput('Enter name for sprite', (value) => {
                            saveData.sprites[value] = spriteStack
                            save()
                        }, (value) => (saveData.sprites[value] == undefined) ? true : 'Name already taken')
                    }
                }],
                [{
                    text: 'Load / Remove sprite', func() {
                        if (Object.keys(saveData.sprites).length > 0) {
                            let items = [
                                [
                                    {
                                        text: 'Close menu', func(menu) {
                                            document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    }
                                ]
                            ]
                            for (let key of Object.keys(saveData.sprites)) {
                                items.push([
                                    key,
                                    {
                                        text: 'Remove', func(menu, item) {
                                            delete saveData.sprites[key]
                                            menu.removeChild(item)
                                            save()
                                            if (menu.children.length == 1)
                                                document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    },
                                    {
                                        text: 'Load', func() {
                                            spriteStack = saveData.sprites[key]
                                        }
                                    }
                                ])
                            }
                            addDropdownInput(items, 'Choose sprite')
                        }
                    }
                }],
                [{ text: 'Remove last layer of sprite', func() { spriteStack.pop() } }],
                [{ text: 'Clear sprite', func() { spriteStack = [] } }],
            ], 'Sprite control buttons')

            let doFillFunc = (self, first) => {
                if (!first) {
                    doFill = !doFill
                    self.textContent = doFill ? 'On' : 'Off'
                }

                if (doFill) {
                    navigationButtons.fillColor = addColorInput('Fill color', (color) => fillColor = color, fillColor)

                    navigationButtons.fillColorAlpha = addNumberInput(['value'], 1, (value) => {
                        fillColorAlpha = (value * 255).toString(16).padStart(2, '0').split('.')[0]
                    }, 'Fill color alpha', 0, 1)
                } else if (!first) {
                    let inputsElement = document.getElementById('inputs')
                    for (const key of ['fillColor', 'fillColorAlpha'])
                        inputsElement.removeChild(navigationButtons[key])
                }
            }

            addButtonInput([{ text: doFill ? 'On' : 'Off', func: doFillFunc }], 'Toggle fill')

            doFillFunc(undefined, true)

            const doOutlineFunc = (self, first) => {
                if (!first) {
                    doOutline = !doOutline
                    self.textContent = doOutline ? 'On' : 'Off'
                }
                if (doOutline) {
                    navigationButtons.outlineColor = addColorInput('Outline color', (color) => outlineColor = color, outlineColor)

                    navigationButtons.outlineColorAlpha = addNumberInput(['value'], 1, (value) => {
                        outlineColorAlpha = (value * 255).toString(16).padStart(2, '0').split('.')[0]
                    }, 'Outline color alpha', 0, 1)

                    navigationButtons.outlineLineWidth = addNumberInput(['value'], outlineLineWidth, (value) => outlineLineWidth = value, 'Outline width (in unit size)', 0)
                } else if (!first) {
                    let inputsElement = document.getElementById('inputs')
                    for (const key of ['outlineColor', 'outlineColorAlpha', 'outlineLineWidth'])
                        inputsElement.removeChild(navigationButtons[key])
                }
            }

            addButtonInput([{ text: doOutline ? 'On' : 'Off', func: doOutlineFunc }], 'Toggle outline')

            doOutlineFunc(undefined, true)

            let paths = []
            for (let key of Object.keys(saveData.paths)) {
                paths.push([
                    key,
                    {
                        text: 'Add', func() {
                            let layer = {
                                path: saveData.paths[key],
                            }
                            if (doFill) layer.color = fillColor + fillColorAlpha
                            if (doOutline) layer.outline = {
                                color: outlineColor + outlineColorAlpha,
                                lineWidth: outlineLineWidth
                            }
                            if (doSpriteAdvancedPlacement) {

                                //scale the outline too
                                if (doOutline)
                                    layer.outline.lineWidth *= spritePathScale

                                //scale, shift, and rotate the path
                                let originX = selectedPoint.x / unitSize - (gridSize - 1) / 2
                                let originY = selectedPoint.y / unitSize - (gridSize - 1) / 2
                                let radians = spritePathRotation * Math.PI * 2
                                layer.path = layer.path.map(point => ({
                                    x: point.x * spritePathScale,
                                    y: point.y * spritePathScale
                                })).map(point => ({
                                    x: point.x + originX,
                                    y: point.y + originY
                                })).map(point => ({
                                    x: originX + (point.x - originX) * Math.cos(radians) - (point.y - originY) * Math.sin(radians),
                                    y: originY + (point.x - originX) * Math.sin(radians) + (point.y - originY) * Math.cos(radians)
                                }))
                            }

                            //don't actually add the layer if I wouldn't show
                            if (doFill || doOutline)
                                spriteStack.push(layer)
                        }
                    }
                ])
            }
            addDropdownInput(paths, 'Add path')

            const doSpriteAdvancedPlacementFunc = (self, first) => {
                if (!first) {
                    doSpriteAdvancedPlacement = !doSpriteAdvancedPlacement
                    self.textContent = doSpriteAdvancedPlacement ? 'On' : 'Off'
                }
                if (doSpriteAdvancedPlacement) {
                    navigationButtons.gridSize = addNumberInput([
                        { text: '-.5', func(x) { return x - .5 } },
                        'value',
                        { text: '+.5', func(x) { return x + .5 } }
                    ], gridSize, (x) => gridSize = x, 'Grid Size', 1)

                    navigationButtons.gridDensity = addNumberInput([
                        { text: '/2', func(x) { return x / 2 } },
                        { text: '-1', func(x) { return x - 1 } },
                        'value',
                        { text: '+1', func(x) { return x + 1 } },
                        { text: '*2', func(x) { return x * 2 } }
                    ], gridDensity, (x) => gridDensity = x, 'Grid Density (points per unit)', 1)

                    navigationButtons.pathRotation = addNumberInput(['value',], spritePathRotation, (x) => spritePathRotation = x / 360, 'Path rotation', 0, 360)

                    navigationButtons.pathScale = addNumberInput(['value',], spritePathScale, (x) => spritePathScale = x, 'Path scale', 0)
                } else if (!first) {
                    let inputsElement = document.getElementById('inputs')
                    for (const key of ['gridSize', 'gridDensity', 'pathRotation', 'pathScale'])
                        inputsElement.removeChild(navigationButtons[key])
                }
            }

            addButtonInput([{ text: doSpriteAdvancedPlacement ? 'On' : 'Off', func: doSpriteAdvancedPlacementFunc }], 'Toggle advanced placement')

            if (doSpriteAdvancedPlacement) doSpriteAdvancedPlacementFunc(false, true)
        }
    },
    {
        text: 'Block creator', func() {
            mode = 'block'
            clearInput()
            createFileImport()
            createDataExport()
            addButtonInput(navigationButtons, 'Mode selector')

            blockSelectedPath = undefined
            blockSelectedSprite = undefined
            blockSelectedSpriteSecondary = undefined

            addDropdownInput([
                [{
                    text: 'Save block', func() {
                        addFocusedTextInput('Enter name for block', (value) => {
                            let physics = { static: isBlockStatic }
                            isBlockKiller ? physics.killer = true : null
                            isBlockGateway ? physics.gateway = true : null
                            isBlockCheckpoint ? physics.checkpoint = true : null
                            isBlockKey ? physics.key = true : null
                            isBlockUnlockable ? physics.unlockable = true : null

                            saveData.blocks[value] = {
                                path: blockSelectedPath,
                                sprite: blockSelectedSprite,
                                physics
                            }

                            if (blockJumpZonePath.length > 0) saveData.blocks[value].jumpZone = blockJumpZonePath

                            if (isBlockCheckpoint) saveData.blocks[value].checkpointSprite = blockSelectedSpriteSecondary

                            save()

                        }, (value) => (saveData.blocks[value] == undefined) ? true : 'Name already taken')
                    }
                }],
                [{
                    text: 'Load / Remove block', func() {
                        if (Object.keys(saveData.blocks).length > 0) {
                            let items = [
                                [
                                    {
                                        text: 'Close menu', func(menu) {
                                            document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    }
                                ]
                            ]
                            for (let key of Object.keys(saveData.blocks)) {
                                items.push([
                                    key,
                                    {
                                        text: 'Remove', func(menu, item) {
                                            delete saveData.blocks[key]
                                            menu.removeChild(item)
                                            save()
                                            if (menu.children.length == 1)
                                                document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    },
                                    {
                                        text: 'Load', func() {
                                            let block = saveData.blocks[key]

                                            if (block.jumpZone) blockJumpZonePath = block.jumpZone
                                            else blockJumpZonePath = []

                                            blockSelectedPath = block.path

                                            blockSelectedSprite = block.sprite

                                            isBlockStatic = block.physics.static
                                            isBlockKiller = false || block.physics.killer
                                            isBlockGateway = false || block.physics.gateway
                                            isBlockCheckpoint = false || block.physics.checkpoint
                                            isBlockKey = false || block.physics.key
                                            isBlockUnlockable = false || block.physics.unlockable

                                            blockSelectedSpriteSecondary = block.checkpointSprite
                                        }
                                    }
                                ])
                            }
                            addDropdownInput(items, 'Choose block')
                        }
                    }
                }],
                [{
                    text: 'Reset block', func() {
                        path = []

                        blockSelectedPath = undefined

                        blockSelectedSprite = undefined

                        isBlockStatic = true
                        isBlockKiller = false
                        isBlockGateway = false
                        isBlockCheckpoint = false
                        isBlockKey = false
                        isBlockUnlockable = false

                        blockSelectedSpriteSecondary = undefined
                    }
                }]
            ], 'Block control buttons')

            addDropdownInput([
                ['Static', { text: isBlockStatic ? 'true' : 'false', func(_, row) { isBlockStatic = !isBlockStatic; row.children[1].textContent = isBlockStatic ? 'true' : 'false' } }],
                ['Killer', { text: isBlockKiller ? 'true' : 'false', func(_, row) { isBlockKiller = !isBlockKiller; row.children[1].textContent = isBlockKiller ? 'true' : 'false' } }],
                ['Gateway', { text: isBlockGateway ? 'true' : 'false', func(_, row) { isBlockGateway = !isBlockGateway; row.children[1].textContent = isBlockGateway ? 'true' : 'false' } }],
                ['Checkpoint', { text: isBlockCheckpoint ? 'true' : 'false', func(_, row) { isBlockCheckpoint = !isBlockCheckpoint; row.children[1].textContent = isBlockCheckpoint ? 'true' : 'false' } }],
                ['Key', { text: isBlockKey ? 'true' : 'false', func(_, row) { isBlockKey = !isBlockKey; row.children[1].textContent = isBlockKey ? 'true' : 'false' } }],
                ['Unlockable', { text: isBlockUnlockable ? 'true' : 'false', func(_, row) { isBlockUnlockable = !isBlockUnlockable; row.children[1].textContent = isBlockUnlockable ? 'true' : 'false' } }]
            ], 'Physics')

            let paths = []
            for (let key of Object.keys(saveData.paths)) {
                paths.push([
                    {
                        text: key, func() {
                            blockSelectedPath = saveData.paths[key]
                        }
                    }
                ])
            }
            addDropdownInput(paths, 'Collision path')

            let sprites = []
            for (let key of Object.keys(saveData.sprites)) {
                sprites.push([
                    {
                        text: key, func() {
                            blockSelectedSprite = saveData.sprites[key]
                        }
                    }
                ])
            }
            addDropdownInput(sprites, 'Sprite')

            let sprites2 = []
            for (let key of Object.keys(saveData.sprites)) {
                sprites2.push([
                    {
                        text: key, func() {
                            blockSelectedSpriteSecondary = saveData.sprites[key]
                        }
                    }
                ])
            }
            addDropdownInput(sprites, 'Secondary sprite')

            addNumberInput([
                { text: '-.5', func(x) { return x - .5 } },
                'value',
                { text: '+.5', func(x) { return x + .5 } }
            ], gridSize, (x) => gridSize = x, 'Grid Size', 1)

            addNumberInput([
                { text: '/2', func(x) { return x / 2 } },
                { text: '-1', func(x) { return x - 1 } },
                'value',
                { text: '+1', func(x) { return x + 1 } },
                { text: '*2', func(x) { return x * 2 } }
            ], gridDensity, (x) => gridDensity = x, 'Grid Density (points per unit)', 1)

            addButtonInput([{
                text: 'Remove last point', func() {
                    if (path.length > 0)
                        path.pop()
                }
            }])
        }
    },
    {
        text: 'Level creator', func() {
            mode = 'level'
            clearInput()
            createFileImport()
            createDataExport()
            addButtonInput(navigationButtons, 'Mode selector')

            addDropdownInput([
                [{
                    text: 'Save level', func() {
                        addFocusedTextInput('Enter name for level', (value) => {
                            let usedKeys = []
                            for (let x = 0; x < levelWidth; x++)
                                for (let y = 0; y < levelHeight; y++)
                                    if (levelGrid[y][x] != 0 && !usedKeys.includes(levelGrid[y][x]))
                                        usedKeys.push(levelGrid[y][x])
                            usedKeys.sort()
                            let lastKey = 0
                            for (let index = 0; index < usedKeys.length; index++) {
                                let key = usedKeys[index]
                                if (lastKey + 1 != key) {
                                    levelBlocks.splice(lastKey, key - lastKey - 1)
                                    for (let x = 0; x < levelWidth; x++)
                                        for (let y = 0; y < levelHeight; y++)
                                            if (levelGrid[y][x] >= key)
                                                levelGrid[y][x] -= key - lastKey - 1
                                    for (let subIndex = index; subIndex < usedKeys.length; subIndex++)
                                        usedKeys[subIndex] -= key - lastKey - 1
                                }
                                lastKey = usedKeys[index]
                            }
                            if (levelBlocks.length > usedKeys.length)
                                levelBlocks.splice(usedKeys.length)

                            saveData.levels[value] = {
                                key: levelBlocks,
                                grid: levelGrid
                            }

                            save()

                        }, (value) => (saveData.levels[value] == undefined) ? true : 'Name already taken')
                    }
                }],
                [{
                    text: 'Load / Remove level', func() {
                        if (Object.keys(saveData.levels).length > 0) {
                            let items = [
                                [
                                    {
                                        text: 'Close menu', func(menu) {
                                            document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    }
                                ]
                            ]
                            for (let key of Object.keys(saveData.levels)) {
                                items.push([
                                    key,
                                    {
                                        text: 'Remove', func(menu, item) {
                                            delete saveData.levels[key]
                                            menu.removeChild(item)
                                            save()
                                            if (menu.children.length == 1)
                                                document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    },
                                    {
                                        text: 'Load', func() {
                                            let level = saveData.levels[key]
                                            levelBlocks = level.key
                                            levelGrid = level.grid
                                            levelWidth = levelGrid[0].length
                                            levelHeight = levelGrid.length
                                        }
                                    }
                                ])
                            }
                            addDropdownInput(items, 'Choose level')
                        }
                    }
                }],
                [{
                    text: 'Reset level', func() {
                        levelGrid = undefined
                        updateGrid()
                        levelBlocks = []
                        levelGateways = []
                        levelBrush = 0
                        levelExportX = 0
                        levelExportY = 0
                    }
                }]
            ], 'Level control buttons')


            function updateGrid() {
                if (levelGrid != undefined && levelGrid.length > 0 && levelGrid[0].length > 0) {

                    if (levelGrid[0].length < levelWidth)
                        for (let i = levelGrid[0].length; i < levelWidth; i++)
                            for (let y = 0; y < levelGrid.length; y++)
                                levelGrid[y].push(0)

                    else if (levelGrid[0].length > levelWidth)
                        for (let y = 0; y < levelGrid.length; y++)
                            levelGrid[y].splice(levelWidth)

                    else if (levelGrid.length > levelHeight)
                        levelGrid.splice(levelHeight)

                    if (levelGrid.length < levelHeight)
                        for (let i = levelGrid.length; i < levelHeight; i++)
                            levelGrid.push(new Array(levelWidth).fill(0))

                    else if (levelGrid.length > levelHeight)
                        levelGrid.splice(levelHeight)

                    levelExportX = Math.min(levelExportX, levelWidth)
                    levelExportX = Math.min(levelExportY, levelHeight)

                } else levelGrid = new Array(levelHeight).fill(0).map(() => new Array(levelWidth).fill(0))
            }

            addNumberInput([{ text: '-5', func(x) { return x - 5 } }, { text: '-1', func(x) { return x - 1 } }, 'value', { text: '+1', func(x) { return x + 1 } }, { text: '+5', func(x) { return x + 5 } }], levelWidth, (value) => { levelWidth = value; updateGrid() }, 'Level width', 1)
            addNumberInput([{ text: '-5', func(x) { return x - 5 } }, { text: '-1', func(x) { return x - 1 } }, 'value', { text: '+1', func(x) { return x + 1 } }, { text: '+5', func(x) { return x + 5 } }], levelHeight, (value) => { levelHeight = value; updateGrid() }, 'Level height', 1)

            let blocks = [
                [{
                    text: 'Eraser', func() {
                        levelBrush = 0
                    }
                }]
            ]
            for (let key of Object.keys(saveData.blocks)) {
                blocks.push([
                    {
                        text: key, func() {
                            if (!levelBlocks.includes(key))
                                levelBlocks.push(key)
                            levelBrush = levelBlocks.indexOf(key) + 1
                        }
                    }
                ])
            }
            addDropdownInput(blocks, 'Choose block')

            function toggleExport() {
                toggleExport.last = !toggleExport.last
                if (toggleExport.last) {
                    toggleExport.x = addNumberInput(['value'], 0, value => levelExportX = value, 'Start x', 0, levelWidth - 1)
                    toggleExport.y = addNumberInput(['value'], 0, value => levelExportY = value, 'Start y', 0, levelHeight - 1)
                } else {
                    for (let key of ['x', 'y']) {
                        document.getElementById('inputs').removeChild(toggleExport[key])
                    }
                    if (worldPlayer != undefined) {
                        let usedKeys = []
                        for (let x = 0; x < levelWidth; x++)
                            for (let y = 0; y < levelHeight; y++)
                                if (levelGrid[y][x] != 0 && !usedKeys.includes(levelGrid[y][x]))
                                    usedKeys.push(levelGrid[y][x])
                        usedKeys.sort()
                        let lastKey = 0
                        for (let index = 0; index < usedKeys.length; index++) {
                            let key = usedKeys[index]
                            if (lastKey + 1 != key) {
                                levelBlocks.splice(lastKey, key - lastKey - 1)
                                for (let x = 0; x < levelWidth; x++)
                                    for (let y = 0; y < levelHeight; y++)
                                        if (levelGrid[y][x] >= key)
                                            levelGrid[y][x] -= key - lastKey - 1
                                for (let subIndex = index; subIndex < usedKeys.length; subIndex++)
                                    usedKeys[subIndex] -= key - lastKey - 1
                            }
                            lastKey = usedKeys[index]
                        }
                        if (levelBlocks.length > usedKeys.length)
                            levelBlocks.splice(usedKeys.length)

                        let usedBlocks = { [worldPlayer]: saveData.blocks[worldPlayer] }
                        levelBlocks.forEach(key => usedBlocks[key] = saveData.blocks[key])

                        const jsonString = JSON.stringify({
                            blocks: usedBlocks,
                            levels: {
                                testLevel: {
                                    key: levelBlocks,
                                    grid: levelGrid
                                },
                            },
                            settings: {
                                particles: {
                                    checkpoint: worldSettingsParticles.checkpoint,
                                    death: worldSettingsParticles.death,
                                    gateway: worldSettingsParticles.gateway,
                                    key: worldSettingsParticles.key
                                },
                                backgroundColor: {
                                    inside: worldBackgroundColor.inside,
                                    outside: worldBackgroundColor.outside
                                },
                                gravity: {
                                    x: worldGravity.x,
                                    y: worldGravity.y
                                },
                                movement: {
                                    jumpPower: worldMovement.jumpPower,
                                    sidePower: worldMovement.sidePower,
                                },
                                start: {
                                    level: 'testLevel',
                                    x: levelExportX,
                                    y: levelExportY
                                },
                                player: worldPlayer
                            }
                        })
                        const blob = new Blob([jsonString], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)

                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'testLevel.json'
                        document.body.appendChild(link)
                        link.click()

                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                    }
                }
            }

            addButtonInput([{ text: 'Export level', func: toggleExport }])
        }
    },
    {
        text: 'World creator', func() {
            mode = 'world'
            clearInput()
            createFileImport()
            createDataExport()
            addButtonInput(navigationButtons, 'Mode selector')

            addDropdownInput([
                [{
                    text: 'Reset world', func() {
                        worldLevels = []
                        worldSettingsParticles = {
                            checkpoint: { r: 0, g: 255, b: 0 },
                            death: { r: 255, g: 0, b: 0 },
                            gateway: { r: 0, g: 0, b: 255 },
                            key: { r: 255, g: 255, b: 0 }
                        }
                        worldBackgroundColor = {
                            inside: '#000000',
                            outside: '#666666'
                        }
                        worldGravity = {
                            x: 0,
                            y: 1
                        }
                        worldMovement = {
                            jumpPower: 10,
                            sidePower: .00005
                        }
                        worldStart = {
                            level: undefined,
                            x: 0,
                            y: 0
                        }
                        worldPlayer = undefined

                    }
                }],
                [{
                    text: 'Remove level', func() {
                        if (Object.keys(worldLevels).length > 0) {
                            let levels = [
                                [{
                                    text: 'Close menu', func(menu) {
                                        document.getElementById('inputs').removeChild(menu.parentNode)
                                    }
                                }]
                            ]
                            for (let key of Object.keys(worldLevels)) {
                                levels.push([
                                    {
                                        text: key, func(subWrapper, itemDiv) {
                                            delete worldLevels[key]
                                            itemDiv.parentNode.removeChild(itemDiv)
                                            if (subWrapper.children.length == 1)
                                                document.getElementById('inputs').removeChild(subWrapper.parentNode)
                                        }
                                    }
                                ])
                            }
                            addDropdownInput(levels, 'Choose level')
                        }
                    }
                }],
                [{
                    text: 'Save world', func() {
                        if (
                            Object.keys(worldLevels).length > 0 &&
                            worldStart.level != undefined &&
                            worldPlayer != undefined
                        )
                            addFocusedTextInput('Enter name for world', value => {

                                //find all the used levels
                                let usedLevels = [worldStart.level]
                                function checkConnectedLevels(levelName) {
                                    let level = saveData.levels[levelName]
                                    if (level.gateways != undefined) {
                                        level.gateways.forEach(gateway => {
                                            if (!usedLevels.includes(gateway.level) && gateway.level != undefined) {
                                                usedLevels.push(gateway.level)
                                                checkConnectedLevels(gateway.level)
                                            }

                                        })
                                    }
                                }
                                checkConnectedLevels(worldStart.level)

                                //find all the used blocks
                                let usedBlocks = [worldPlayer]
                                usedLevels.forEach(levelName => {
                                    let level = saveData.levels[levelName]
                                    for (let x = 0; x < level.grid[0].length; x++)
                                        for (let y = 0; y < level.grid.length; y++)
                                            if (level.grid[y][x] > 0 && !usedBlocks.includes(level.key[level.grid[y][x] - 1]))
                                                usedBlocks.push(level.key[level.grid[y][x] - 1])
                                })

                                let saveLevels = {}
                                usedLevels.forEach(levelName => saveLevels[levelName] = saveData.levels[levelName])
                                let saveBlocks = {}
                                usedBlocks.forEach(blockName => saveBlocks[blockName] = saveData.blocks[blockName])

                                saveData.worlds[value] = {
                                    blocks: saveBlocks,
                                    levels: saveLevels,
                                    settings: {
                                        particles: {
                                            checkpoint: worldSettingsParticles.checkpoint,
                                            death: worldSettingsParticles.death,
                                            gateway: worldSettingsParticles.gateway,
                                            key: worldSettingsParticles.key
                                        },
                                        backgroundColor: {
                                            inside: worldBackgroundColor.inside,
                                            outside: worldBackgroundColor.outside
                                        },
                                        gravity: {
                                            x: worldGravity.x,
                                            y: worldGravity.y
                                        },
                                        movement: {
                                            jumpPower: worldMovement.jumpPower,
                                            sidePower: worldMovement.sidePower,
                                        },
                                        start: {
                                            level: worldStart.level,
                                            x: worldStart.x,
                                            y: worldStart.y
                                        },
                                        player: worldPlayer
                                    }
                                }

                                save()

                            }, (value) => (saveData.worlds[value] == undefined) ? true : 'Name already taken')
                    }
                }],
                [{
                    text: 'Load / Remove / Download world', func() {
                        if (Object.keys(saveData.worlds).length > 0) {
                            let items = [
                                [
                                    {
                                        text: 'Close menu', func(menu) {
                                            document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    }
                                ]
                            ]
                            for (let key of Object.keys(saveData.worlds)) {
                                items.push([
                                    key,
                                    {
                                        text: 'Remove', func(menu, item) {
                                            delete saveData.worlds[key]
                                            menu.removeChild(item)
                                            save()
                                            if (menu.children.length == 1)
                                                document.getElementById('inputs').removeChild(menu.parentNode)
                                        }
                                    },
                                    {
                                        text: 'Load', func() {
                                            let world = saveData.worlds[key]
                                            worldLevels = world.levels
                                            worldBackgroundColor = world.settings.backgroundColor
                                            worldGravity = world.settings.gravity
                                            worldMovement = world.settings.movement
                                            worldStart = world.settings.start
                                            worldPlayer = world.settings.player
                                        }
                                    },
                                    {
                                        text: 'Download', func() {
                                            const jsonString = JSON.stringify(saveData.worlds[key])
                                            const blob = new Blob([jsonString], { type: 'application/json' })
                                            const url = URL.createObjectURL(blob)

                                            const link = document.createElement('a')
                                            link.href = url
                                            link.download = `${key}.json`
                                            document.body.appendChild(link)
                                            link.click()

                                            document.body.removeChild(link)
                                            URL.revokeObjectURL(url)
                                        }
                                    }
                                ])
                            }
                            addDropdownInput(items, 'Choose world')
                        }
                    }
                }]
            ], 'World control buttons')

            let levels = []
            for (let key of Object.keys(saveData.levels)) {
                levels.push([
                    key,
                    {
                        text: 'Add', func() {
                            let level = saveData.levels[key]
                            let gateways = []
                            for (let x = 0; x < level.grid[0].length; x++)
                                for (let y = 0; y < level.grid.length; y++)
                                    if (level.grid[y][x] > 0 && saveData.blocks[level.key[level.grid[y][x] - 1]].physics.gateway)
                                        gateways.push({ from: { x, y }, to: {} })
                            if (gateways.length > 0)
                                level.gateways = gateways
                            worldLevels[key] = level
                        }
                    },
                    { text: 'Preview', func() { worldPreviewLevel = key } }
                ])
            }
            addDropdownInput(levels, 'Levels')

            addButtonInput([{
                text: 'Setup gateways', func() {
                    if (Object.keys(worldLevels).length > 0) {
                        if (worldGatewayElement != undefined)
                            worldGatewayElement.parentNode.removeChild(worldGatewayElement)

                        let items = [
                            [{
                                text: 'Close menu', func() {
                                    worldGatewayElement.parentNode.removeChild(worldGatewayElement)
                                    worldGatewayElement = undefined
                                }
                            }],
                            ['From', 'x,y', 'To', 'x', 'y']
                        ]
                        for (let levelName of Object.keys(worldLevels)) {
                            let level = worldLevels[levelName]
                            if (level.gateways != undefined) {
                                level.gateways.forEach(gateway => {
                                    items.push([
                                        levelName,
                                        `${gateway.from.x},${gateway.from.y}`,
                                        {
                                            text: gateway.level == undefined ? 'levelName' : gateway.level, func(subWrapper, itemDiv) {
                                                let buttons = Object.keys(worldLevels)
                                                    .map(name => ({
                                                        text: name, func(button) {
                                                            gateway.level = name
                                                            itemDiv.childNodes[2].textContent = name
                                                            button.parentNode.parentNode.parentNode.removeChild(button.parentNode.parentNode)
                                                        }
                                                    }))
                                                addButtonInput(buttons, 'Choose to level')
                                            }
                                        },
                                        {
                                            text: gateway.to.x == undefined ? 'x' : gateway.to.x, func(subWrapper, itemDiv) {
                                                addFocusedTextInput('Enter x', value => {
                                                    gateway.to.x = Number(value)
                                                    itemDiv.childNodes[3].textContent = value
                                                }, value => {
                                                    try {
                                                        if (Number(value) >= 0)
                                                            return true
                                                    }
                                                    catch { }
                                                    return 'Enter a positive number'
                                                })
                                            }
                                        },
                                        {
                                            text: gateway.to.y == undefined ? 'y' : gateway.to.y, func(subWrapper, itemDiv) {
                                                addFocusedTextInput('Enter y', value => {
                                                    gateway.to.y = Number(value)
                                                    itemDiv.childNodes[4].textContent = value
                                                }, value => {
                                                    try {
                                                        if (Number(value) >= 0)
                                                            return true
                                                    }
                                                    catch { }
                                                    return 'Enter a positive number'
                                                })
                                            }
                                        }
                                    ])
                                })
                            }
                        }
                        worldGatewayElement = addDropdownInput(items, 'Gateways')
                    }
                }
            }])

            function toggleMisc() {
                toggleMisc.last = !toggleMisc.last
                if (toggleMisc.last) {
                    if (toggleColor.last) toggleColor()

                    toggleMisc.gravityX = addNumberInput(['value'], worldGravity.x, value => worldGravity.x = value, 'World gravity x')
                    toggleMisc.gravityY = addNumberInput(['value'], worldGravity.y, value => worldGravity.y = value, 'World gravity y')

                    toggleMisc.jumpPower = addNumberInput(['value'], worldMovement.jumpPower, value => worldMovement.jumpPower = value, 'World movement jumpPower')
                    toggleMisc.sidePower = addNumberInput(['value'], worldMovement.sidePower, value => worldMovement.sidePower = value, 'World movement sidePower')
                    toggleMisc.playerBlock = addButtonInput([{
                        text: 'Choose player block', func() {
                            if (Object.keys(saveData.blocks).length > 0)
                                addDropdownInput(Object.keys(saveData.blocks).map(blockName => [{
                                    text: blockName,
                                    func(subWrapper) {
                                        worldPlayer = blockName
                                        subWrapper.parentNode.parentNode.removeChild(subWrapper.parentNode)
                                    }
                                }]), 'Choose block')
                        }
                    }])

                    toggleMisc.startX = addNumberInput(['value'], worldStart.x, value => worldStart.x = value, 'World start x')
                    toggleMisc.startY = addNumberInput(['value'], worldStart.y, value => worldStart.y = value, 'World start y')
                    toggleMisc.startLevel = addButtonInput([{
                        text: 'Choose start level', func() {
                            if (Object.keys(worldLevels).length > 0)
                                addDropdownInput(Object.keys(worldLevels).map(levelName => [{
                                    text: levelName,
                                    func(subWrapper) {
                                        worldStart.level = levelName
                                        subWrapper.parentNode.parentNode.removeChild(subWrapper.parentNode)
                                    }
                                }]), 'Choose level')
                        }
                    }])
                } else {
                    for (let key of ['gravityX', 'gravityY', 'jumpPower', 'sidePower', 'playerBlock', 'startX', 'startY', 'startLevel']) {
                        document.getElementById('inputs').removeChild(toggleMisc[key])
                    }
                }
            }

            const hexToRgb = hex => ({
                r: parseInt('0x' + (hex.split('').splice(1, 2).join(''))),
                g: parseInt('0x' + (hex.split('').splice(3, 2).join(''))),
                b: parseInt('0x' + (hex.split('').splice(5, 2).join('')))
            })

            const rgbToHex = rgb => `#${rgb.r.toString(16).padStart(2, 0)}${rgb.g.toString(16).padStart(2, 0)}${rgb.b.toString(16).padStart(2, 0)}`

            function toggleColor() {
                toggleColor.last = !toggleColor.last
                if (toggleColor.last) {
                    if (toggleMisc.last) toggleMisc()

                    toggleColor.inside = addColorInput('Inside background color', color => worldBackgroundColor.inside = color, worldBackgroundColor.inside)
                    toggleColor.outside = addColorInput('Outside background color', color => worldBackgroundColor.outside = color, worldBackgroundColor.outside)
                    toggleColor.checkpoint = addColorInput('Checkpoint particle color', color => worldSettingsParticles.checkpoint = hexToRgb(color), rgbToHex(worldSettingsParticles.checkpoint))
                    toggleColor.death = addColorInput('Death particle color', color => worldSettingsParticles.death = hexToRgb(color), rgbToHex(worldSettingsParticles.death))
                    toggleColor.gateway = addColorInput('Gateway particle color', color => worldSettingsParticles.gateway = hexToRgb(color), rgbToHex(worldSettingsParticles.gateway))
                    toggleColor.key = addColorInput('Key particle color', color => worldSettingsParticles.key = hexToRgb(color), rgbToHex(worldSettingsParticles.key))
                } else {
                    for (let key of ['inside', 'outside', 'checkpoint', 'death', 'gateway', 'key']) {
                        document.getElementById('inputs').removeChild(toggleColor[key])
                    }
                }
            }
            addButtonInput([{ text: 'Misc settings', func: toggleMisc }, { text: 'Color settings', func: toggleColor }], 'Toggle settings')

        }
    }
]

createFileImport()
createDataExport()
addButtonInput(navigationButtons, 'Mode selector')

//clear all the items from the inputs div
function clearInput() {
    document.getElementById('inputs').innerHTML = ''
}

function save() {
    localStorage.setItem('saveData', JSON.stringify(saveData))
}

function render() {

    if (mode == 'path') {

        size = Math.min(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
        unitSize = size / gridSize
        canvas.width = size
        canvas.height = size

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        blockCount = Math.ceil((gridSize - 1) / 2) * 2 + 1
        blockOffset = (1 - ((gridSize - 1) / 2) % 1) % 1

        for (let x = 0; x < blockCount; x++)
            for (let y = 0; y < blockCount; y++) {
                ctx.fillStyle = (x == Math.floor(blockCount / 2) && y == Math.floor(blockCount / 2)) ? '#666' : (x + y) % 2 == 0 ? '#151515' : '#333'

                ctx.fillRect((x - blockOffset) * unitSize, (y - blockOffset) * unitSize, unitSize, unitSize)
            }

        closestPoint = { distance: Infinity }

        ctx.fillStyle = '#36f'
        for (let x = 0; x < blockCount + 1; x++)
            for (let y = 0; y < blockCount + 1; y++)
                for (let subX = 1; subX < gridDensity + 1; subX++)
                    for (let subY = 1; subY < gridDensity + 1; subY++) {
                        const distance = ((mouse.x - (x - blockOffset + 1 / gridDensity * subX % 1) * unitSize) ** 2 + (mouse.y - (y - blockOffset + 1 / gridDensity * subY % 1) * unitSize) ** 2) ** (1 / 2) / unitSize * gridDensity / 2.5
                        let pointX = (x - blockOffset + 1 / gridDensity * subX % 1) * unitSize
                        let pointY = (y - blockOffset + 1 / gridDensity * subY % 1) * unitSize
                        if (distance < 1) {
                            ctx.fillStyle = `rgb(255,255,255,${1 - distance})`
                            ctx.beginPath()
                            ctx.arc(pointX, pointY, size / gridSize / 50, 0, Math.PI * 2)
                            ctx.fill()
                        }
                        if (closestPoint.distance > distance && pointX >= 0 && pointX <= canvas.width && pointY >= 0 && pointY <= canvas.height) closestPoint = { distance, x: pointX, y: pointY }
                    }

        ctx.fillStyle = '#0f0'
        ctx.beginPath()
        ctx.arc(closestPoint.x, closestPoint.y, size / gridSize / 50, 0, Math.PI * 2)
        ctx.fill()

        if (pathPath.length >= 1) {
            ctx.beginPath()
            for (let point of pathPath) {
                ctx.lineTo(
                    (point.x + (gridSize - 1) / 2) * unitSize,
                    (point.y + (gridSize - 1) / 2) * unitSize
                )
            }
            ctx.strokeStyle = '#f00'
            ctx.fillStyle = '#00f3'
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#f009'
            ctx.beginPath()
            ctx.arc(
                (pathPath[pathPath.length - 1].x + (gridSize - 1) / 2) * unitSize,
                (pathPath[pathPath.length - 1].y + (gridSize - 1) / 2) * unitSize,
                size / gridSize / 50, 0, Math.PI * 2)
            ctx.fill()
        }

    } else if (mode == 'sprite') {
        if (!doSpriteAdvancedPlacement) {
            gridSize = 1
            spriteStack.forEach(sprite =>
                sprite.path.forEach(point => {
                    gridSize = Math.max(Math.abs((point.x - 1) * 2 + 1), gridSize)
                    gridSize = Math.max(Math.abs((point.y - 1) * 2 + 1), gridSize)
                })
            )
        }

        size = Math.min(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
        unitSize = size / gridSize
        canvas.width = size
        canvas.height = size

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        blockCount = Math.ceil((gridSize - 1) / 2) * 2 + 1
        blockOffset = (1 - ((gridSize - 1) / 2) % 1) % 1

        for (let x = 0; x < blockCount; x++)
            for (let y = 0; y < blockCount; y++) {
                ctx.fillStyle = (x == Math.floor(blockCount / 2) && y == Math.floor(blockCount / 2)) ? '#6666' : (x + y) % 2 == 0 ? '#15151566' : '#3336'

                ctx.fillRect((x - blockOffset) * unitSize, (y - blockOffset) * unitSize, unitSize, unitSize)
            }

        spriteStack.forEach(layer => {
            if (layer.path.length >= 1) {
                ctx.beginPath()
                for (let point of layer.path) {
                    ctx.lineTo(
                        (point.x + (gridSize - 1) / 2) * unitSize,
                        (point.y + (gridSize - 1) / 2) * unitSize
                    )
                }
                if (layer.color != undefined) {
                    ctx.fillStyle = layer.color
                    ctx.fill()
                }
                if (layer.outline != undefined) {
                    ctx.strokeStyle = layer.outline.color
                    ctx.lineWidth = layer.outline.lineWidth * unitSize
                    ctx.stroke()
                }
            }
        })

        if (doSpriteAdvancedPlacement) {
            closestPoint = { distance: Infinity }

            ctx.fillStyle = '#36f'
            for (let x = 0; x < blockCount + 1; x++)
                for (let y = 0; y < blockCount + 1; y++)
                    for (let subX = 1; subX < gridDensity + 1; subX++)
                        for (let subY = 1; subY < gridDensity + 1; subY++) {
                            const distance = ((mouse.x - (x - blockOffset + 1 / gridDensity * subX % 1) * unitSize) ** 2 + (mouse.y - (y - blockOffset + 1 / gridDensity * subY % 1) * unitSize) ** 2) ** (1 / 2) / unitSize * gridDensity / 2.5
                            let pointX = (x - blockOffset + 1 / gridDensity * subX % 1) * unitSize
                            let pointY = (y - blockOffset + 1 / gridDensity * subY % 1) * unitSize
                            if (distance < 1) {
                                ctx.fillStyle = `rgb(255,255,255,${1 - distance})`
                                ctx.beginPath()
                                ctx.arc(pointX, pointY, size / gridSize / 50, 0, Math.PI * 2)
                                ctx.fill()
                            }
                            if (closestPoint.distance > distance && pointX >= 0 && pointX <= canvas.width && pointY >= 0 && pointY <= canvas.height) closestPoint = { distance, x: pointX, y: pointY }
                        }

            ctx.fillStyle = '#0f0'
            ctx.beginPath()
            ctx.arc(closestPoint.x, closestPoint.y, size / gridSize / 50, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#00f'
            ctx.beginPath()
            ctx.arc(selectedPoint.x, selectedPoint.y, size / gridSize / 50, 0, Math.PI * 2)
            ctx.fill()
        }
    } else if (mode == 'block') {

        size = Math.min(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
        unitSize = size / gridSize
        canvas.width = size
        canvas.height = size

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        blockCount = Math.ceil((gridSize - 1) / 2) * 2 + 1
        blockOffset = (1 - ((gridSize - 1) / 2) % 1) % 1

        for (let x = 0; x < blockCount; x++)
            for (let y = 0; y < blockCount; y++) {
                ctx.fillStyle = (x == Math.floor(blockCount / 2) && y == Math.floor(blockCount / 2)) ? '#666' : (x + y) % 2 == 0 ? '#151515' : '#333'

                ctx.fillRect((x - blockOffset) * unitSize, (y - blockOffset) * unitSize, unitSize, unitSize)
            }

        if (blockSelectedSprite != undefined)
            blockSelectedSprite.forEach(layer => {

                if (layer.path.length >= 1) {
                    ctx.beginPath()
                    for (let point of layer.path) {
                        ctx.lineTo(
                            (point.x + (gridSize - 1) / 2) * unitSize,
                            (point.y + (gridSize - 1) / 2) * unitSize
                        )
                    }
                    if (layer.color != undefined) {
                        ctx.fillStyle = layer.color
                        ctx.fill()
                    }
                    if (layer.outline != undefined) {
                        ctx.strokeStyle = layer.outline.color
                        ctx.lineWidth = layer.outline.lineWidth * unitSize
                        ctx.stroke()
                    }
                }
            })

        closestPoint = { distance: Infinity }

        ctx.fillStyle = '#36f'
        for (let x = 0; x < blockCount + 1; x++)
            for (let y = 0; y < blockCount + 1; y++)
                for (let subX = 1; subX < gridDensity + 1; subX++)
                    for (let subY = 1; subY < gridDensity + 1; subY++) {
                        const distance = ((mouse.x - (x - blockOffset + 1 / gridDensity * subX % 1) * unitSize) ** 2 + (mouse.y - (y - blockOffset + 1 / gridDensity * subY % 1) * unitSize) ** 2) ** (1 / 2) / unitSize * gridDensity / 2.5
                        let pointX = (x - blockOffset + 1 / gridDensity * subX % 1) * unitSize
                        let pointY = (y - blockOffset + 1 / gridDensity * subY % 1) * unitSize
                        if (distance < 1) {
                            ctx.fillStyle = `rgb(255,255,255,${1 - distance})`
                            ctx.beginPath()
                            ctx.arc(pointX, pointY, size / gridSize / 50, 0, Math.PI * 2)
                            ctx.fill()
                        }
                        if (closestPoint.distance > distance && pointX >= 0 && pointX <= canvas.width && pointY >= 0 && pointY <= canvas.height) closestPoint = { distance, x: pointX, y: pointY }
                    }

        ctx.fillStyle = '#0f0'
        ctx.beginPath()
        ctx.arc(closestPoint.x, closestPoint.y, size / gridSize / 50, 0, Math.PI * 2)
        ctx.fill()

        if (blockJumpZonePath.length >= 1) {
            ctx.beginPath()
            for (let point of blockJumpZonePath) {
                ctx.lineTo(
                    (point.x + (gridSize - 1) / 2) * unitSize,
                    (point.y + (gridSize - 1) / 2) * unitSize
                )
            }
            ctx.strokeStyle = '#f00'
            ctx.fillStyle = '#00f3'
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#f009'
            ctx.beginPath()
            ctx.arc(
                (blockJumpZonePath[blockJumpZonePath.length - 1].x + (gridSize - 1) / 2) * unitSize,
                (blockJumpZonePath[blockJumpZonePath.length - 1].y + (gridSize - 1) / 2) * unitSize,
                size / gridSize / 50, 0, Math.PI * 2)
            ctx.fill()
        }
    } else if (mode == 'level') {
        let gridSize = Math.max(levelWidth, levelHeight)

        size = Math.min(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
        unitSize = size / gridSize
        canvas.width = unitSize * levelWidth
        canvas.height = unitSize * levelHeight

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let x = 0; x < levelWidth; x++)
            for (let y = 0; y < levelHeight; y++) {
                ctx.fillStyle = (x + y) % 2 == 0 ? '#15151566' : '#3336'
                ctx.fillRect(x * unitSize, y * unitSize, unitSize, unitSize)
            }

        for (let x = 0; x < levelWidth; x++)
            for (let y = 0; y < levelHeight; y++)
                if (levelGrid[y][x] != 0) {

                    saveData.blocks[levelBlocks[levelGrid[y][x] - 1]].sprite.forEach(layer => {
                        ctx.beginPath()
                        for (let point of layer.path) {
                            ctx.lineTo(
                                (point.x + x) * unitSize,
                                (point.y + y) * unitSize
                            )
                        }
                        if (layer.color != undefined) {
                            ctx.fillStyle = layer.color
                            ctx.fill()
                        }
                        if (layer.outline != undefined) {
                            ctx.strokeStyle = layer.outline.color
                            ctx.lineWidth = layer.outline.lineWidth * unitSize
                            ctx.stroke()
                        }
                    })
                }
    } else if (mode == 'world') {
        if (worldPreviewLevel == undefined) {
            canvas.width = 0
            canvas.height = 0
        } else {
            let level = saveData.levels[worldPreviewLevel]

            gridSize = Math.max(level.grid[0].length, level.grid.length)

            size = Math.min(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
            unitSize = size / gridSize
            canvas.width = unitSize * level.grid[0].length
            canvas.height = unitSize * level.grid.length

            ctx.fillStyle = '#000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            for (let x = 0; x < level.grid[0].length; x++)
                for (let y = 0; y < level.grid.length; y++) {
                    ctx.fillStyle = (x + y) % 2 == 0 ? '#15151566' : '#3336'
                    ctx.fillRect(x * unitSize, y * unitSize, unitSize, unitSize)
                }

            for (let x = 0; x < level.grid[0].length; x++)
                for (let y = 0; y < level.grid.length; y++)
                    if (level.grid[y][x] != 0) {

                        saveData.blocks[level.key[level.grid[y][x] - 1]].sprite.forEach(layer => {
                            ctx.beginPath()
                            for (let point of layer.path) {
                                ctx.lineTo(
                                    (point.x + x) * unitSize,
                                    (point.y + y) * unitSize
                                )
                            }
                            if (layer.color != undefined) {
                                ctx.fillStyle = layer.color
                                ctx.fill()
                            }
                            if (layer.outline != undefined) {
                                ctx.strokeStyle = layer.outline.color
                                ctx.lineWidth = layer.outline.lineWidth * unitSize
                                ctx.stroke()
                            }
                        })
                    }
        }
    }
    requestAnimationFrame(render)
}
render()

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top

    if (mode == 'level' && e.buttons == 1)
        levelGrid[Math.floor(mouse.y / unitSize)][Math.floor(mouse.x / unitSize)] = levelBrush
})

canvas.addEventListener('click', () => {
    if (mode == 'path')
        pathPath.push({
            x: closestPoint.x / unitSize - (gridSize - 1) / 2,
            y: closestPoint.y / unitSize - (gridSize - 1) / 2
        })
    else if (mode == 'sprite' && doSpriteAdvancedPlacement)
        selectedPoint = closestPoint
    else if (mode == 'block')
        blockJumpZonePath.push({
            x: closestPoint.x / unitSize - (gridSize - 1) / 2,
            y: closestPoint.y / unitSize - (gridSize - 1) / 2
        })
    else if (mode == 'level')
        levelGrid[Math.floor(mouse.y / unitSize)][Math.floor(mouse.x / unitSize)] = levelBrush
})

document.addEventListener('DOMContentLoaded', function () {
    const dropArea = document.body;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    })

    function preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    dropArea.addEventListener('drop', handleDrop, false)

    function handleDrop(e) {
        let dt = e.dataTransfer
        let file = dt.files[0]

        processFile(file)
    }

    function processFile(file) {
        if (file.type === 'application/json') {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = function () {
                const jsonObject = JSON.parse(reader.result)
                if (jsonObject.paths != undefined)
                    importSaveData(jsonObject)
                else
                    importWorld(jsonObject, file.name)
            }
            reader.onerror = function () {
                console.error("Error reading file!")
            }
        }
    }
})