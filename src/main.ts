import './style.css';
import { Application } from 'pixi.js';
import { CONFIG } from './config';
import { GameScene } from './scene';
import { Hud } from './hud';
import { Effects } from './effects';
import {ResultWindow} from './result-window';
import { Game } from './game';

async function main() {
  const app = new Application();

  await app.init({
    width: CONFIG.canvas.width,
    height: CONFIG.canvas.height,
    backgroundColor: CONFIG.canvas.backgroundColor,
    antialias: CONFIG.canvas.antialias,
  });

  const gameEl = document.getElementById('game')!;
  gameEl.appendChild(app.canvas);

  const fitToWindow = () => {
    const scale = Math.min(
      1,
      window.innerWidth / CONFIG.canvas.width,
      window.innerHeight / CONFIG.canvas.height,
    );
    gameEl.style.transform = `scale(${scale})`;
  };
  fitToWindow();
  window.addEventListener('resize', fitToWindow);

  const scene = new GameScene();
  const hud = new Hud(CONFIG.tokenValues.length);
  const effects = new Effects(app.ticker, scene.impactPoint, scene.containerCenter);
  const resultWindow = new ResultWindow();

  app.stage.addChild(scene.root, effects.root, hud.root);

  const playBtn = document.getElementById('play-btn') as HTMLButtonElement;

  const game = new Game(scene, hud, effects, resultWindow, app.ticker, (state) => {
    playBtn.disabled = state !== 'ready';
  });

  playBtn.addEventListener('click', () => {
    void game.play();
  });
}

main();