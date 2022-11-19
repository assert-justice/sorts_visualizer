class Splotch{
    // Canvas fields
    private canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    get context(){return this._context;}

    // Internal dimensions
    private _width: number;
    get width(){return this._width;}
    private _height: number;
    get height(){return this._height;}
    private widthRatio: number;
    private heightRatio: number;

    // Colors
    clearColor: typeof this._context.fillStyle = "black";
    private _drawColor:typeof this.clearColor = "white"
    get drawColor(){return this._drawColor;}
    set drawColor(color: typeof this.clearColor){
        this._drawColor = color;
        this.context.fillStyle = color;
    }

    constructor(parent: Element | null, width: number, height: number, maxCanvasWidth: number = 1280){
        if(!parent) throw 'Splotch was passed an undefined parent.';
        parent.innerHTML = '';
        let cWidth = parent.clientWidth;// parent.clientWidth > maxCanvasWidth ? maxCanvasWidth : parent.clientWidth;
        
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', `${cWidth}`);
        this.canvas.setAttribute('height', `${cWidth / (width / height)}`);
        this._width = width; 
        this._height = height;
        this.widthRatio = this.canvas.width / width;
        this.heightRatio = this.canvas.height / height;
        parent.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if(!context) throw "Could not get context";
        this._context = context;
        this.clear();
    }

    // Drawing
    clear(color: typeof this.clearColor | null = null){
        this.rect(0, 0, this.width, this.height, true, color ? color : this.clearColor);
    }
    rect(x: number, y: number, width: number, height: number, filled: boolean = true, color:typeof this.clearColor | null = null): void{
        if(color){
            this._context.fillStyle = color;
        }
        x *= this.widthRatio;
        y *= this.heightRatio;
        width *= this.widthRatio;
        height *= this.heightRatio;
        if(filled){
            this._context.fillRect(x, y, width, height);
        }
        else{
            this._context.rect(x, y, width, height);
        }
        if(color){
            this._context.fillStyle = this._drawColor;
        }
    }

}