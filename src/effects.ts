import { Container, Graphics, type Ticker } from 'pixi.js';
import { CONFIG } from './config';
import { animate, easeOutCubic } from './tween';

type Point = { x: number; y: number };

export class Effects {
    readonly root = new Container();

    private readonly active = new Set<Graphics>();
    private readonly ticker: Ticker;
    private readonly impact: Point;
    private readonly center: Point;

    constructor(ticker: Ticker, impact: Point, center: Point) {
        this.ticker = ticker;
        this.impact = impact;
        this.center = center;
    }

    async hit() {
        const g = this.spawn();
        const { hitRingRadius, hitRingGrow } = CONFIG.effects;

        await animate(this.ticker, CONFIG.timing.hitMs, (p) => {
            g.clear()
                .circle(this.impact.x, this.impact.y, hitRingRadius + hitRingGrow * p)
                .stroke({ width: 2 + 6 * (1 - p), color: CONFIG.colors.hitRing, alpha: 1 - p });
        });

        this.despawn(g);
    }

    async activation() {
        const g = this.spawn();
        const { x, y } = this.center;
        const { activationParticles, activationReach } = CONFIG.effects;
        const { activationGlow, activationRing } = CONFIG.colors;

        await animate(this.ticker, CONFIG.timing.activationMs, (p) => {
            const envelope = 1 - p * p;
            g.clear();

            const pulse = 0.5 + 0.5 * Math.sin(p * Math.PI * 6);
            g.circle(x, y, 110 + 30 * pulse).fill({ color: activationGlow, alpha: 0.35 * envelope });

            for (let k = 0; k < 3; k++) {
                const q = (p * 2 + k / 3) % 1;
                g.circle(x, y, 60 + activationReach * q).stroke({
                    width: 2 + 8 * (1 - q),
                    color: activationRing,
                    alpha: (1 - q) * envelope,
                });
            }

            const dist = 40 + activationReach * easeOutCubic(p);
            for (let i = 0; i < activationParticles; i++) {
                const angle = (i / activationParticles) * Math.PI * 2;
                g.circle(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 7 * (1 - p) + 1).fill({
                    color: activationGlow,
                    alpha: envelope,
                });
            }
        });

        this.despawn(g);
    }

    clear() {
        this.active.forEach((g) => g.destroy());
        this.active.clear();
    }

    private spawn(): Graphics {
        const g = new Graphics();
        this.root.addChild(g);
        this.active.add(g);
        return g;
    }

    private despawn(g: Graphics) {
        this.active.delete(g);
        g.destroy();
    }
}