export const CONFIG = {
    canvas: {
        width: 1280,
        height: 720,
        backgroundColor: '#1b1f3a',
        antialias: true,
    },

    //All duration values are in milliseconds
    timing: {
        revealMs: 600,
        launchIntervalMs: 200,
        flightMs: 450,
        activationMs: 1200,
        hitMs: 250,
    },

    //Token values, in launch order
    tokenValues: [10, 20, 30],

    layout: {
        playArea: { x: 240, y: 80, width: 800, height: 300 },
        token: { radius: 40 },
        //frontTopOffset: how far below the container's top edge the front panel starts
        container: { x: 480, y: 460, width: 320, height: 180, frontTopOffset: 50 },
        hud: { y: 40, pipRadius: 12, pipSpacing: 36 },
    },

    colors: {
        playArea: '#262b52',
        playAreaBorder: '#3d4480',
        containerBack: '#0d0f1f',
        containerFront: '#4a4fa3',
        containerFrontBorder: '#7378d6',
        token: '#ffc83d',
        tokenBorder: '#b8860b',
        tokenLabel: '#1b1f3a',
        hudText: '#ffffff',
        pipEmpty: '#3d4480',
        pipFilled: '#ffc83d',
        hitRing: '#7fe9ff',
        activationGlow: '#ffd84a',
        activationRing: '#ff6ad5',
    },

    effects: {
        hitRingRadius: 30,
        hitRingGrow: 50,
        activationParticles: 14,
        activationReach: 220,
    },
} as const;