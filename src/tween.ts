import type { Ticker } from 'pixi.js';

export function animate(
    ticker: Ticker,
    durationMs: number,
    onUpdate: (progress: number) => void,): Promise<void> {
    return new Promise((resolve) => {
        let elapsedMs = 0;

        const tick = (t: Ticker) => {
            elapsedMs += t.deltaMS;
            const progress = Math.min(elapsedMs / durationMs, 1);
            onUpdate(progress);

            if (progress >= 1) {
                ticker.remove(tick);
                resolve();
            }
        };

        ticker.add(tick);
    });
}

export function wait(ticker: Ticker, durationMs: number): Promise<void> {
    return animate(ticker, durationMs, () => { });
}

export function easeInQuad(p: number): number {
    return p * p;
}

export function easeOutCubic(p: number): number {
    return 1 - Math.pow(1 - p, 3);
}