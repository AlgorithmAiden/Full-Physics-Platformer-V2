const testWorld = {
    blocks: {
        player: {
            physics: {
                restitution: .5
            },
            path: [
                { x: .25, y: .25 },
                { x: .75, y: .25 },
                { x: .75, y: .75 },
                { x: .25, y: .75 }
            ],
            sprite: [
                {
                    path: [
                        { x: .25, y: .25 },
                        { x: .75, y: .25 },
                        { x: .75, y: .75 },
                        { x: .25, y: .75 }
                    ],
                    color: '#666',
                    outline: {
                        color: '#fff',
                        lineWidth: .025,
                        connectEnds: true
                    }
                },
                {
                    path: [
                        { x: .35, y: .35 },
                        { x: .45, y: .35 },
                        { x: .45, y: .45 },
                        { x: .35, y: .45 }
                    ],
                    color: '#600',
                    outline: {
                        color: '#f00',
                        lineWidth: .025,
                        connectEnds: true
                    }
                },
                {
                    path: [
                        { x: .55, y: .35 },
                        { x: .65, y: .35 },
                        { x: .65, y: .45 },
                        { x: .55, y: .45 }
                    ],
                    color: '#060',
                    outline: {
                        color: '#0f0',
                        lineWidth: .025,
                        connectEnds: true
                    }
                },
                {
                    path: [
                        { x: .35, y: .55 },
                        { x: .65, y: .55 },
                        { x: .65, y: .65 },
                        { x: .35, y: .65 }
                    ],
                    color: '#006',
                    outline: {
                        color: '#00f',
                        lineWidth: .025,
                        connectEnds: true
                    }
                }
            ]

        },
        basicSolid: {
            jumpZone: [
                { x: .05, y: 0 },
                { x: .95, y: 0 },
                { x: .95, y: -.1 },
                { x: .05, y: -.1 }
            ],
            physics: {
                static: true
            },
            path: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 0, y: 1 }
                    ],
                    color: '#333', //if color is undefined the shape is not filled
                }
            ]
        },
        '2block': {
            physics: {
                static: false
            },
            path: [
                { x: 0, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 1 },
                { x: 0, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: 2, y: 0 },
                        { x: 2, y: 1 },
                        { x: 0, y: 1 }
                    ],
                    color: '#333', //if color is undefined the shape is not filled
                    outline: {
                        color: '#666',
                        lineWidth: .025, //relative to grid scale (eg 1 would mean a lines thickness is the same as the size of a 1/1 block)
                        connectEnds: true //if true the first point of the path is added to the end of the path
                    }
                }
            ]

        },
        offsetBlock: {
            physics: {
                static: false
            },
            path: [
                { x: 0 + 1, y: 0 + 1 },
                { x: 1 + 1, y: 0 + 1 },
                { x: 1 + 1, y: 1 + 1 },
                { x: 0 + 1, y: 1 + 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0 + 1, y: 0 + 1 },
                        { x: 1 + 1, y: 0 + 1 },
                        { x: 1 + 1, y: 1 + 1 },
                        { x: 0 + 1, y: 1 + 1 }
                    ],
                    color: '#333', //if color is undefined the shape is not filled
                    outline: {
                        color: '#666',
                        lineWidth: .025, //relative to grid scale (eg 1 would mean a lines thickness is the same as the size of a 1/1 block)
                        connectEnds: true //if true the first point of the path is added to the end of the path
                    }
                }
            ]
        },
        concave: {
            physics: {
                static: false,
                frictionAir: 1,
            },
            path: [
                { x: 0, y: 0 },
                { x: .25, y: 0 },
                { x: .5, y: .25 },
                { x: .75, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: .25 },
                { x: .75, y: .5 },
                { x: 1, y: .75 },
                { x: 1, y: 1 },
                { x: .75, y: 1 },
                { x: .5, y: .75 },
                { x: .25, y: 1 },
                { x: 0, y: 1 },
                { x: 0, y: .75 },
                { x: .25, y: .5 },
                { x: 0, y: .25 },
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: .25, y: 0 },
                        { x: .5, y: .25 },
                        { x: .75, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: .25 },
                        { x: .75, y: .5 },
                        { x: 1, y: .75 },
                        { x: 1, y: 1 },
                        { x: .75, y: 1 },
                        { x: .5, y: .75 },
                        { x: .25, y: 1 },
                        { x: 0, y: 1 },
                        { x: 0, y: .75 },
                        { x: .25, y: .5 },
                        { x: 0, y: .25 },
                    ],
                    color: '#333', //if color is undefined the shape is not filled
                    outline: {
                        color: '#666',
                        lineWidth: .025, //relative to grid scale (eg 1 would mean a lines thickness is the same as the size of a 1/1 block)
                        connectEnds: true //if true the first point of the path is added to the end of the path
                    }
                },
                {
                    path: [
                        { x: .4, y: .4 },
                        { x: .6, y: .4 },
                        { x: .6, y: .6 },
                        { x: .4, y: .6 }
                    ],
                    color: '#666', //if color is undefined the shape is not filled
                    outline: {
                        color: '#000',
                        lineWidth: .025, //relative to grid scale (eg 1 would mean a lines thickness is the same as the size of a 1/1 block)
                        connectEnds: true //if true the first point of the path is added to the end of the path
                    }
                }
            ]
        },
        killer: {
            particles: {
                color: { r: 255, g: 0, b: 0 },
                speed: .00025,
                size: { min: .01, max: .05 }, //scaled to blocks
                chance: .5,
                decay: 1,
            },
            physics: {
                killer: true,
                fullReload: true
            },
            path: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 0, y: 1 }
                    ],
                    color: '#300', //if color is undefined the shape is not filled
                    outline: {
                        color: '#600',
                        lineWidth: .025, //relative to grid scale (eg 1 would mean a lines thickness is the same as the size of a 1/1 block)
                        connectEnds: true //if true the first and second point of the path is added to the end of the path
                    }
                }
            ]
        },
        checkpoint: {
            particles: {
                color: { r: 0, g: 255, b: 0 },
                speed: .001,
                size: { min: .01, max: .05 }, //scaled to blocks
                chance: .025,
                decay: 5,
            },
            physics: {
                checkpoint: true //this will make the block a sensor, and static
            },
            path: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 0, y: 1 }
                    ],
                    color: '#0606', //if color is undefined the shape is not filled
                }
            ],
            checkpointSprite: [ //renders when the checkpoint is the currently selected spawn
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 0, y: 1 }
                    ],
                    color: '#0f06', //if color is undefined the shape is not filled
                }
            ]
        },
    },
    levels: {
        test: {
            key: [
                'basicSolid',
                '2block',
                'offsetBlock',
                'concave',
                'player',
                'killer',
                'checkpoint'
            ],
            grid: [ //the grid must have a constant width and height
                [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 1],
                [0, 0, 4, 7, 0, 7, 0, 2, 0, 0, 2, 0, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 2, 0, 1, 1, 1],
                [0, 0, 0, 0, 0, 6, 0, 4, 4, 1, 1, 4, 1, 1, 1],
                [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 1, 1],
                [3, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 4, 1, 1, 1],
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                [0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1]
            ]
        },
        start: {
            key: [
                'basicSolid',
                'player'
            ],
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    },
    settings: {
        particles: {
            checkpoint: { r: 0, g: 255, b: 0 },
            death: { r: 255, g: 0, b: 0 },
            coin: { r: 127, g: 255, b: 0 }
        },
        backgroundColor: {
            inside: '#000',
            outside: '#666'
        },
        gravity: {
            x: 0,
            y: 1
        },
        movement: {
            jumpPower: 10,
            sidePower: .00005,
        },
        start: 'test',
        player: 'player'
    }
}
const world1 = {
    blocks: {
        basicSolid: {
            jumpZone: [
                { x: .05, y: 0 },
                { x: .95, y: 0 },
                { x: .95, y: -.1 },
                { x: .05, y: -.1 }
            ],
            path: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 0, y: 1 }
                    ],
                    color: '#333',
                    outline: {
                        lineWidth: .1,
                        color: '#666',
                        connectEnds: true
                    }
                }
            ],
            physics: {
                static: true
            }
        },
        player: {
            path: [
                { x: .25, y: .25 },
                { x: .75, y: .25 },
                { x: .75, y: .75 },
                { x: .25, y: .75 }
            ],
            sprite: [
                {
                    path: [
                        { x: .25, y: .25 },
                        { x: .75, y: .25 },
                        { x: .75, y: .75 },
                        { x: .25, y: .75 }
                    ],
                    color: '#666',
                    outline: {
                        color: '#fff',
                        lineWidth: .025,
                        connectEnds: true
                    }
                },
                {
                    path: [
                        { x: .35, y: .35 },
                        { x: .45, y: .35 },
                        { x: .45, y: .45 },
                        { x: .35, y: .45 }
                    ],
                    color: '#600',
                    outline: {
                        color: '#f00',
                        lineWidth: .025,
                        connectEnds: true
                    }
                },
                {
                    path: [
                        { x: .55, y: .35 },
                        { x: .65, y: .35 },
                        { x: .65, y: .45 },
                        { x: .55, y: .45 }
                    ],
                    color: '#060',
                    outline: {
                        color: '#0f0',
                        lineWidth: .025,
                        connectEnds: true
                    }
                },
                {
                    path: [
                        { x: .35, y: .55 },
                        { x: .65, y: .55 },
                        { x: .65, y: .65 },
                        { x: .35, y: .65 }
                    ],
                    color: '#006',
                    outline: {
                        color: '#00f',
                        lineWidth: .025,
                        connectEnds: true
                    }
                }
            ]

        },
    },
    levels: {
        intro: {
            key: [
                'basicSolid',
                'player'
            ],
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 2, 0]
            ]
        }
    },
    settings: {
        particles: {
            checkpoint: { r: 0, g: 255, b: 0 },
            death: { r: 255, g: 0, b: 0 },
            coin: { r: 127, g: 255, b: 0 }
        },
        backgroundColor: {
            inside: '#000',
            outside: '#666'
        },
        gravity: {
            x: 0,
            y: 1
        },
        movement: {
            jumpPower: 10,
            sidePower: .00005,
        },
        start: 'intro',
        player: 'player'
    }
}