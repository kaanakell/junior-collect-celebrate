export class ResultWindow{
    private readonly overlay: HTMLElement;
    private readonly totalEl: HTMLElement;
    private readonly closeBtn: HTMLButtonElement;
    private resolveClose: (() => void) | null = null;
    
    constructor() {
        this.overlay = document.getElementById('result')!;
        this.totalEl = document.getElementById('result-total')!;
        this.closeBtn = document.getElementById('result-close') as HTMLButtonElement;
        this.closeBtn.addEventListener('click', () => this.close());
    }

    show(total: number): Promise<void> {
        this.totalEl.textContent = `Total: ${total}`;
        this.overlay.hidden = false;
        this.closeBtn.focus();

        return new Promise((resolve) => {
            this.resolveClose = resolve;
        });
    }

    private close() {
        if(!this.resolveClose) return;

        this.overlay.hidden = true;
        const resolve = this.resolveClose;
        this.resolveClose = null;
        resolve();
    }
}