import type { Ticker } from 'pixi.js';
import { CONFIG } from './config';
import type { GameScene } from './scene';
import type { Hud } from './hud';
import { animate, easeInQuad, wait } from './tween';
import type {Effects} from './effects';
import type {ResultWindow} from './result-window';

type GameState = 'ready' | 'running' | 'result';

export class Game {
    private state: GameState = 'ready';
    private total = 0;
    private progress = 0;
    private runStartMs = 0;

    private readonly scene: GameScene;
    private readonly hud: Hud;
    private readonly effects: Effects;
    private readonly resultWindow: ResultWindow;
    private readonly ticker: Ticker;
    private readonly onStateChange: (state: GameState) => void;

    constructor(
        scene: GameScene,
        hud: Hud,
        effects: Effects,
        resultWindow: ResultWindow,
        ticker: Ticker,
        onStateChange: (state: GameState) => void,
    ) {
        this.scene = scene;
        this.hud = hud;
        this.effects = effects;
        this.resultWindow = resultWindow;
        this.ticker = ticker;
        this.onStateChange = onStateChange;
    }

    async play() {
        if (this.state !== 'ready') return;
        this.setState('running');

        this.runStartMs = performance.now();
        this.log('run start');

        this.log('reveal start');
        await this.reveal();
        this.log('reveal done');

        const flights: Promise<void>[] = [];
        for (let i = 0; i < CONFIG.tokenValues.length; i++) {
            if (i > 0) await wait(this.ticker, CONFIG.timing.launchIntervalMs);
            this.log(`launch token ${CONFIG.tokenValues[i]}`);
            flights.push(this.flyToken(i));
        }
        await Promise.all(flights);
        this.log('all effects finished');

        this.setState('result');
        this.log('result open');
        await this.resultWindow.show(this.total);
        this.log('result close');

        this.resetToReady();
        this.log('back to ready');
    }

    private async reveal() {
        await animate(this.ticker, CONFIG.timing.revealMs, (p) => {
            const scale = 1 + 0.2 * Math.sin(Math.PI * p);
            this.scene.tokens.forEach((token) => token.scale.set(scale));
        });
    }

    private async flyToken(index: number) {
        const token = this.scene.tokens[index];
        const start = this.scene.tokenStarts[index];
        const end = this.scene.tokenTarget;

        await animate(this.ticker, CONFIG.timing.flightMs, (p) => {
            token.x = start.x + (end.x - start.x) * p;
            token.y = start.y + (end.y - start.y) * easeInQuad(p);
        });

        await this.onArrival(index);
    }

    private async onArrival(index: number) {
        const value = CONFIG.tokenValues[index];
        this.scene.tokens[index].visible = false;

        this.total += value;
        this.progress += 1;
        this.hud.setTotal(this.total);
        this.hud.setProgress(this.progress);

        this.log(`arrival ${value} -> total ${this.total}, progress ${this.progress}/${CONFIG.tokenValues.length}`,);

        if(this.progress === CONFIG.tokenValues.length){
            this.log('activation start');
            await this.effects.activation();
            this.log('activation done');
        } else {
            await this.effects.hit();
        }
    }

    private resetToReady() {
        this.total = 0;
        this.progress = 0;
        this.hud.setTotal(0);
        this.hud.setProgress(0);
        this.scene.resetTokens();
        this.effects.clear();
        this.setState('ready');
    }

    private setState(state: GameState) {
        this.state = state;
        this.onStateChange(state);
    }

    private log(message: string) {
        const elapsed = Math.round(performance.now() - this.runStartMs);
        console.log(`[${String(elapsed).padStart(5)} ms] ${message}`);
    }
}