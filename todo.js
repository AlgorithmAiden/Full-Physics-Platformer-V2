const todo = {
    'Load levels with custom shaped blocks': {
        'Add walls around the level to keep the block in': 'Done',
        'Add a way to load a level from a grid using a static block shape': 'Done',
        'Add block shapes determined by a list of relative points': 'Done',
        'Give the blocks custom physics': 'Done'
    },
    'Custom textures mapped onto blocks': {
        'Add a viewport that fills the screen and scales': 'Done',
        'Load a texture to a non rotation not offset block': 'Done',
        'Shift textures to honor the viewport': 'Done',
        'Allow offset blocks': 'Done',
        'Allow rotated blocks': 'Done'
    },
    'Add death': {
        'Blocks that kill the player on collision': 'Done',
        'A respawn system': 'Done',
        'A key to restart the level': 'Done',
        'Checkpoints': 'Done',
        'Make checkpoints change texture based on spawn': 'Done'
    },
    'A proper player': {
        'Basic player controls that scale to deltaTime': 'Done',
        'Add jump zones to static blocks': 'Done'
    },
    'Particles': {
        'Create a system to make a burst of particles': 'Done',
        'Make getting a checkpoint show a burst of particles': 'Done',
        'Add death particles': 'Not Started',
        'Add coin collection particles': 'Not Started',
        'Add a way that blocks can emit particles': 'Done'
    },
    'Add gateways between levels': {

    },
    'Sounds': {
        'Add sounds when the player jumps': 'Not Started',
        'Add sounds when the player dies': 'Not Started',
        'Add sounds when the player collides with something, volume scaling with speed': 'Not Started',
        'Sounds for coin collection': 'Not Started'
    },
    'Collectables used to open gates (coins?)': {
        'Add a tag to blocks to make them a collectable': 'Not Started',
        'Add blocks that get removed when X collectables are collected of a specific type': 'Not Started',
        'Add a way that removable block can show how many collectables are needed': 'Not Started',
        'Add a hud to display collectables': 'Not Started'
    },
    'Saving / loading': {
        'Save the players progress to the browser': 'Not Started',
        'Add an option to load a save if it is detected on page load': 'Not Started',
        'Add a way to output saves / load custom sames': 'Not Started'
    },
    'A menu with level selection, sound options, and changeable key inputs': {},
    'Add world settings for custom physics settings / character shape': {
        'Add custom player shape / properties': 'Done',
        'Add custom gravity': 'Done',
        'Add a start location': 'Done',
        'Add custom movement strengths': 'Done'
    },
    'Add a good camera system': {
        'Make the camera follow the player using direction and speed': 'Not Started',
        'Keep the camera in bounds always': 'Not Started'
    },
    'Add more warnings': {
        'Warn if a level has no exit': 'Not Started',
        'Warn if a level has no player': 'Done',
        'Warn if a non static block has a jump zone': 'Done'
    },
    'MAKE DOCS': {
        'Make docs for basic level structure': 'Not Started',
        'Make docs for block physics effects': 'Not Started',
        'Make docs world settings': 'Not Started',
        'Make an "Intro to world creation" article': 'Not Started',
        'Make docs for checkpoint blocks': 'Not Started',
        'Make docs for killer blocks': 'Not Started',
        'Make docs for particle emitters': 'Not Started',
        'Make docs for collision sounds': 'Not Started',
        'Make docs for event sounds': 'Not Started',
        'Make docs for using collectables': 'Not Started'
    }
}

let message = '---TODO STATUS---'
Object.keys(todo).forEach(categoryName => {
    let done = true
    let inProgress = false
    const category = todo[categoryName]
    if (Object.keys(category).length > 0) {
        Object.keys(category).forEach(itemName => {
            if (category[itemName] != 'Done')
                done = false
            if (category[itemName] == 'In Progress')
                inProgress = true
        })
    } else done = false
    if (done) message += `\n${categoryName} (Done)`
    else if (!inProgress) message += `\n${categoryName} (Not Started)`
    else {
        message += `\n${categoryName} (In Progress)`
        Object.keys(category).forEach(itemName => {
            message += `\n * ${itemName} (${category[itemName]})`
        })
    }
})
console.info(message)