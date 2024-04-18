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
                        lineWidth: .05,
                        color: '#666'
                    }
                }
            ],
            physics: {
                static: true
            }
        },
        triangleSolid1: {
            jumpZone: [
                { x: .05, y: 0 },
                { x: .95, y: 0 },
                { x: .95, y: -.1 },
                { x: .05, y: -.1 }
            ],
            path: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 0, y: 1 }
                    ],
                    color: '#333',
                    outline: {
                        lineWidth: .05,
                        color: '#666'
                    }
                }
            ],
            physics: {
                static: true
            }
        },
        slimSolid: {
            path: [
                { x: .4, y: 0 },
                { x: .6, y: 0 },
                { x: .6, y: 1 },
                { x: .4, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: .4, y: 0 },
                        { x: .6, y: 0 },
                        { x: .6, y: 1 },
                        { x: .4, y: 1 }
                    ],
                    color: '#333',
                    outline: {
                        lineWidth: .05,
                        color: '#666'
                    }
                }
            ],
            physics: {
                static: true
            }
        },
        supportSolid: {
            path: [
                { x: .4, y: 0 },
                { x: .6, y: 0 },
                { x: .6, y: .5 },
                { x: 1, y: 1 },
                { x: 0, y: 1 },
                { x: .4, y: .5 }
            ],
            sprite: [
                {
                    path: [
                        { x: .4, y: 0 },
                        { x: .6, y: 0 },
                        { x: .6, y: .5 },
                        { x: 1, y: 1 },
                        { x: 0, y: 1 },
                        { x: .4, y: .5 }
                    ],
                    color: '#333',
                    outline: {
                        lineWidth: .05,
                        color: '#666'
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
                        lineWidth: .025
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
                        lineWidth: .025
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
                        lineWidth: .025
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
                        lineWidth: .025
                    }
                }
            ]

        },
        gateway: {
            path: [
                { x: .1, y: .1 },
                { x: .9, y: .1 },
                { x: .9, y: .9 },
                { x: .1, y: .9 }
            ],
            sprite: [
                {
                    path: [
                        { x: .1, y: .1 },
                        { x: .9, y: .1 },
                        { x: .9, y: .9 },
                        { x: .1, y: .9 }
                    ],
                    color: '#003',
                    outline: {
                        lineWidth: .025,
                        color: '#006'
                    }
                },
                {
                    path: [
                        { x: .25, y: .45 },
                        { x: .45, y: .25 },
                        { x: .55, y: .25 },
                        { x: .75, y: .45 },
                        { x: .75, y: .55 },
                        { x: .55, y: .75 },
                        { x: .45, y: .75 },
                        { x: .25, y: .55 },
                    ],
                    color: '#00f',
                    outline: {
                        lineWidth: .05,
                        color: '#009'
                    }
                }
            ],
            physics: {
                gateway: true
            },
            emitters: [
                {
                    color: { r: 0, g: 0, b: 255 },
                    speed: .0001,
                    size: { min: .005, max: .05 },
                    decay: 1 / 5,
                    chance: .5,
                    turn: .1
                }
            ]
        },
        flatKiller: {
            path: [
                { x: 0, y: .8 },
                { x: .1, y: .5 },
                { x: .2, y: .8 },
                { x: .8, y: .8 },
                { x: .9, y: .5 },
                { x: 1, y: .8 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ],
            sprite: [
                {
                    path: [
                        { x: 0, y: .8 },
                        { x: .1, y: .5 },
                        { x: .2, y: .8 },
                        { x: .8, y: .8 },
                        { x: .9, y: .5 },
                        { x: 1, y: .8 },
                        { x: 1, y: 1 },
                        { x: 0, y: 1 }
                    ],
                    color: '#300',
                    outline: {
                        lineWidth: .05,
                        color: '#600'
                    }
                }
            ],
            physics: {
                static: true,
                killer: true
            },
            emitters: [
                {
                    color: { r: 255, g: 0, b: 0 },
                    speed: .0001,
                    size: { min: .005, max: .05 },
                    decay: 2.5,
                    chance: .05,
                    turn: .1,
                    x: .4,
                    y: -.3
                },
                {
                    color: { r: 255, g: 0, b: 0 },
                    speed: .0001,
                    size: { min: .005, max: .05 },
                    decay: 2.5,
                    chance: .05,
                    turn: .1,
                    x: -.4,
                    y: -.3
                }
            ]
        },
        checkpoint: {
            emitters: [
                {
                    color: { r: 0, g: 255, b: 0 },
                    speed: .001,
                    size: { min: .01, max: .05 }, //scaled to blocks
                    chance: .05,
                    decay: 5,
                    turn: .1
                }
            ],
            physics: {
                checkpoint: true //this will make the block a sensor, and static
            },
            path: [
                { x: .5, y: 0 },
                { x: .9, y: .5 },
                { x: .5, y: 1 },
                { x: .1, y: .5 }
            ],
            sprite: [
                {
                    path: [
                        { x: .5, y: 0 },
                        { x: .9, y: .5 },
                        { x: .5, y: 1 },
                        { x: .1, y: .5 }
                    ],
                    color: '#030',
                    outline: {
                        lineWidth: .025,
                        color: '#060'
                    }
                },
                {
                    path: [
                        { x: .35, y: .45 },
                        { x: .45, y: .35 },
                        { x: .55, y: .35 },
                        { x: .65, y: .45 },
                        { x: .65, y: .55 },
                        { x: .55, y: .65 },
                        { x: .45, y: .65 },
                        { x: .35, y: .55 },
                    ],
                    color: '#030',
                    outline: {
                        lineWidth: .05,
                        color: '#060'
                    }
                }
            ],
            checkpointSprite: [
                {
                    path: [
                        { x: .5, y: 0 },
                        { x: .9, y: .5 },
                        { x: .5, y: 1 },
                        { x: .1, y: .5 }
                    ],
                    color: '#030',
                    outline: {
                        lineWidth: .025,
                        color: '#060'
                    }
                },
                {
                    path: [
                        { x: .25, y: .45 },
                        { x: .45, y: .25 },
                        { x: .55, y: .25 },
                        { x: .75, y: .45 },
                        { x: .75, y: .55 },
                        { x: .55, y: .75 },
                        { x: .45, y: .75 },
                        { x: .25, y: .55 },
                    ],
                    color: '#0f0',
                    outline: {
                        lineWidth: .05,
                        color: '#090'
                    }
                }
            ],
        },
        key: {
            emitters: [
                {
                    color: { r: 255, g: 255, b: 0 },
                    speed: .000075,
                    size: { min: .01, max: .05 }, //scaled to blocks
                    chance: .5,
                    decay: 1
                }
            ],
            physics: {
                key: true,
                static: true
            },
            path: [
                { x: .25, y: .45 },
                { x: .45, y: .25 },
                { x: .55, y: .25 },
                { x: .75, y: .45 },
                { x: .75, y: .55 },
                { x: .55, y: .75 },
                { x: .45, y: .75 },
                { x: .25, y: .55 }
            ],
            sprite: [
                {
                    path: [
                        { x: .25, y: .45 },
                        { x: .45, y: .25 },
                        { x: .55, y: .25 },
                        { x: .75, y: .45 },
                        { x: .75, y: .55 },
                        { x: .55, y: .75 },
                        { x: .45, y: .75 },
                        { x: .25, y: .55 }
                    ],
                    color: '#ff0',
                    outline: {
                        lineWidth: .05,
                        color: '#990'
                    }
                }
            ]
        },
        unlockable: {
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
                        lineWidth: .05,
                        color: '#666'
                    }
                },
                {
                    path: [
                        { x: .1, y: .1 },
                        { x: .3, y: .1 },
                        { x: .1, y: .3 }
                    ],
                    color: '#330',
                    outline: {
                        lineWidth: .05,
                        color: '#660'
                    }
                },
                {
                    path: [
                        { x: .9, y: .1 },
                        { x: .9, y: .3 },
                        { x: .7, y: .1 }
                    ],
                    color: '#330',
                    outline: {
                        lineWidth: .05,
                        color: '#660'
                    }
                },
                {
                    path: [
                        { x: .9, y: .9 },
                        { x: .9, y: .7 },
                        { x: .7, y: .9 }
                    ],
                    color: '#330',
                    outline: {
                        lineWidth: .05,
                        color: '#660'
                    }
                },
                {
                    path: [
                        { x: .1, y: .9 },
                        { x: .1, y: .7 },
                        { x: .3, y: .9 }
                    ],
                    color: '#330',
                    outline: {
                        lineWidth: .05,
                        color: '#660'
                    }
                },
                {
                    path: [
                        { x: .5, y: .2 },
                        { x: .8, y: .5 },
                        { x: .5, y: .8 },
                        { x: .2, y: .5 }
                    ],
                    color: '#330',
                    outline: {
                        lineWidth: .05,
                        color: '#660'
                    }
                },
            ],
            physics: {
                static: true,
                unlockable: true
            }
        },
        unlockableKillerStar: {
            path: [
                { x: .5, y: 0 },
                { x: .6, y: .4 },
                { x: 1, y: .5 },
                { x: .6, y: .6 },
                { x: .5, y: 1 },
                { x: .4, y: .6 },
                { x: 0, y: .5 },
                { x: .4, y: .4 }
            ],
            sprite: [
                {
                    path: [
                        { x: .5, y: 0 },
                        { x: .6, y: .4 },
                        { x: 1, y: .5 },
                        { x: .6, y: .6 },
                        { x: .5, y: 1 },
                        { x: .4, y: .6 },
                        { x: 0, y: .5 },
                        { x: .4, y: .4 }
                    ],
                    color: '#300',
                    outline: {
                        lineWidth: .05,
                        color: '#600'
                    }
                },
                {
                    path: [
                        { x: .5, y: .35 },
                        { x: .65, y: .5 },
                        { x: .5, y: .65 },
                        { x: .35, y: .5 }
                    ],
                    color: '#330',
                    outline: {
                        lineWidth: .05,
                        color: '#660'
                    }
                },
            ],
            emitters: [
                {
                    color: { r: 255, g: 0, b: 0 },
                    speed: .0001,
                    size: { min: .005, max: .05 },
                    decay: 2.5,
                    chance: .05,
                    turn: .1,
                    x: 0,
                    y: -.5
                },
                {
                    color: { r: 255, g: 0, b: 0 },
                    speed: .0001,
                    size: { min: .005, max: .05 },
                    decay: 2.5,
                    chance: .05,
                    turn: .1,
                    x: 0,
                    y: .5
                },
                {
                    color: { r: 255, g: 0, b: 0 },
                    speed: .0001,
                    size: { min: .005, max: .05 },
                    decay: 2.5,
                    chance: .05,
                    turn: .1,
                    x: -.5,
                    y: 0
                },
                {
                    color: { r: 255, g: 0, b: 0 },
                    speed: .0001,
                    size: { min: .005, max: .05 },
                    decay: 2.5,
                    chance: .05,
                    turn: .1,
                    x: .5,
                    y: 0
                }
            ],
            physics: {
                static: true,
                killer: true,
                unlockable: true
            }
        },
    },
    levels: {
        intro_walls: {
            key: [
                'basicSolid',
                'slimSolid',
                'gateway'
            ],
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3]
            ],
            gateways: [
                {
                    from: { x: 24, y: 9 },
                    to: { x: 0, y: 8 },
                    level: 'intro_jumping'
                }
            ]
        },
        intro_jumping: {
            key: [
                'basicSolid',
                'gateway'
            ],
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            gateways: [
                {
                    from: { x: 24, y: 0 },
                    to: { x: 0, y: 8 },
                    level: 'intro_killers'
                }
            ]
        },
        intro_killers: {
            key: [
                'basicSolid',
                'gateway',
                'slimSolid',
                'supportSolid',
                'flatKiller',
                'checkpoint'
            ],
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
                [0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0],
                [0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0],
                [0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0],
                [1, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 5, 4, 5, 5, 4, 5, 5]
            ],
            gateways: [
                {
                    from: { x: 24, y: 0 },
                    to: { x: 9, y: 8 },
                    level: 'intro_keys'
                }
            ]
        },
        intro_keys: {
            key: [
                'basicSolid',
                'gateway',
                'flatKiller',
                'checkpoint',
                'key',
                'unlockable',
                'unlockableKillerStar',
                'triangleSolid1'
            ],
            grid: [
                [2, 6, 0, 0, 0, 0, 0, 0, 0, 0],
                [6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 6, 0, 0, 1, 5],
                [0, 8, 0, 0, 0, 0, 0, 0, 1, 6],
                [0, 0, 0, 0, 7, 0, 0, 7, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 6, 7, 0, 0, 6, 6, 1, 0, 0],
                [0, 6, 6, 1, 6, 6, 0, 6, 6, 0],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 1]
            ],
            gateways: [
                {
                    from: { x: 0, y: 0 },
                    to: { x: 0, y: 9 },
                    level: 'intro_walls'
                }
            ]
        }
    },
    settings: {
        particles: {
            checkpoint: { r: 0, g: 255, b: 0 },
            death: { r: 255, g: 0, b: 0 },
            gateway: { r: 0, g: 0, b: 255 },
            key: { r: 255, g: 255, b: 0 }
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
        start: {
            level: 'intro_walls',
            x: 0,
            y: 9
        },
        player: 'player'
    }
}