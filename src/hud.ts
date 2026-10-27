import { Container, Graphics, Text } from 'pixi.js';
import { CONFIG } from './config';

export class Hud {
    readonly root = new Container();

    private readonly totalText: Text;
    private readonly progressText: Text;
    private readonly pips: Graphics[] = [];
    private readonly maxProgress: number;

    constructor(maxProgress: number) {
        this.maxProgress = maxProgress;

        const { x, width } = CONFIG.layout.playArea;
        const { y, fontSize, pipSpacing, pipOffset } = CONFIG.layout.hud;
        const textStyle = {
            fontFamily: 'Arial',
            fontSize,
            fontWeight: 'bold' as const,
            fill: CONFIG.colors.hudText,
        };

        //Total: left-aligned with the play area
        this.totalText = new Text({ text: 'Total: 0', style: textStyle });
        this.totalText.anchor.set(0, 0.5);
        this.totalText.position.set(x, y);

        //Progress text: right-aligned with the play area
        const right = x + width;
        this.progressText = new Text({ text: `0/${maxProgress}`, style: textStyle });
        this.progressText.anchor.set(1, 0.5);
        this.progressText.position.set(right, y);

        //Pip sit to the left of the progress text
        for (let i = 0; i < maxProgress; i++) {
            const pip = new Graphics();
            pip.position.set(right - pipOffset - (maxProgress - 1 - i) * pipSpacing, y);
            this.pips.push(pip);
            this.root.addChild(pip);
        }

        this.root.addChild(this.totalText, this.progressText);
        this.setProgress(0);
    }

    setTotal(total: number) {
        this.totalText.text = `Total: ${total}`;
    }

    setProgress(progress: number) {
        this.progressText.text = `${progress}/${this.maxProgress}`;
        this.pips.forEach((pip, i) => {
            const filled = i < progress;
            pip.clear()
                .circle(0, 0, CONFIG.layout.hud.pipRadius)
                .fill(filled ? CONFIG.colors.pipFilled : CONFIG.colors.pipEmpty);
        });
    }
}
