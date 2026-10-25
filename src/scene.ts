import { Container, Graphics, Text } from 'pixi.js';
import { CONFIG } from './config';

export class GameScene {
    readonly root = new Container();
    readonly tokens: Container[] = [];
    readonly tokenStarts: { x: number; y: number }[] = [];

    private readonly playAreaLayer = new Container();
    private readonly containerBackLayer = new Container();
    private readonly tokensLayer = new Container();
    private readonly containerFrontLayer = new Container();

    constructor() {
        //Order of layers
        this.root.addChild(
            this.playAreaLayer,
            this.containerBackLayer,
            this.tokensLayer,
            this.containerFrontLayer,
        );

        this.buildPlayArea();
        this.buildContainer();
        this.buildTokens();
    }

    private buildPlayArea() {
        const { x, y, width, height } = CONFIG.layout.playArea;
        const area = new Graphics()
            .roundRect(x, y, width, height, 24)
            .fill(CONFIG.colors.playArea)
            .stroke({ width: 3, color: CONFIG.colors.playAreaBorder });
        this.playAreaLayer.addChild(area);
    }

    private buildContainer() {
        const { x, y, width, height, frontTopOffset } = CONFIG.layout.container;

        const back = new Graphics()
            .roundRect(x, y, width, height, 20)
            .fill(CONFIG.colors.containerBack);
        this.containerBackLayer.addChild(back);

        const front = new Graphics()
            .roundRect(x, y + frontTopOffset, width, height - frontTopOffset, 20)
            .fill(CONFIG.colors.containerFront)
            .stroke({ width: 4, color: CONFIG.colors.containerFrontBorder });
        this.containerFrontLayer.addChild(front);
    }

    private buildTokens() {
        const values = CONFIG.tokenValues;
        values.forEach((value, index) => {
            const token = this.createToken(value);
            const start = this.getTokenStart(index, values.length);
            this.tokenStarts.push(start);
            token.position.set(start.x, start.y);
            this.tokensLayer.addChild(token);
            this.tokens.push(token);
        });
    }

    private getTokenStart(index: number, count: number) {
        const { x, y, width, height } = CONFIG.layout.playArea;
        return {
            x: x + (width * (index + 1)) / (count + 1),
            y: y + height / 2,
        };
    }

    get tokenTarget() {
        const { x, y, width, frontTopOffset } = CONFIG.layout.container;
        return {
            x: x + width / 2,
            y: y + frontTopOffset + CONFIG.layout.token.radius,
        };
    }

    get impactPoint() {
        const { x, y, width, frontTopOffset } = CONFIG.layout.container;
        return { x: x + width / 2, y: y + frontTopOffset };
    }

    get containerCenter() {
        const { x, y, width, height } = CONFIG.layout.container;
        return { x: x + width / 2, y: y + height / 2 };
    }

    resetTokens() {
        this.tokens.forEach((token, i) => {
            token.position.set(this.tokenStarts[i].x, this.tokenStarts[i].y);
            token.scale.set(1);
            token.visible = true;
        });
    }

    private createToken(value: number): Container {
        const token = new Container();

        const disc = new Graphics()
            .circle(0, 0, CONFIG.layout.token.radius)
            .fill(CONFIG.colors.token)
            .stroke({ width: 4, color: CONFIG.colors.tokenBorder });

        const label = new Text({
            text: String(value),
            style: {
                fontFamily: 'Arial',
                fontSize: 32,
                fontWeight: 'bold',
                fill: CONFIG.colors.tokenLabel,
            },
        });
        label.anchor.set(0.5);

        token.addChild(disc, label);
        return token;
    }

}