"use strict";
class Splotch {
    constructor(parent, width, height, maxCanvasWidth = 1280) {
        // Colors
        this.clearColor = "black";
        this._drawColor = "white";
        if (!parent)
            throw 'Splotch was passed an undefined parent.';
        parent.innerHTML = '';
        let cWidth = parent.clientWidth; // parent.clientWidth > maxCanvasWidth ? maxCanvasWidth : parent.clientWidth;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', `${cWidth}`);
        this.canvas.setAttribute('height', `${cWidth / (width / height)}`);
        this._width = width;
        this._height = height;
        this.widthRatio = this.canvas.width / width;
        this.heightRatio = this.canvas.height / height;
        parent.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if (!context)
            throw "Could not get context";
        this._context = context;
        this.clear();
    }
    get context() { return this._context; }
    get width() { return this._width; }
    get height() { return this._height; }
    get drawColor() { return this._drawColor; }
    set drawColor(color) {
        this._drawColor = color;
        this.context.fillStyle = color;
    }
    // Drawing
    clear(color = null) {
        this.rect(0, 0, this.width, this.height, true, color ? color : this.clearColor);
    }
    rect(x, y, width, height, filled = true, color = null) {
        if (color) {
            this._context.fillStyle = color;
        }
        x *= this.widthRatio;
        y *= this.heightRatio;
        width *= this.widthRatio;
        height *= this.heightRatio;
        if (filled) {
            this._context.fillRect(x, y, width, height);
        }
        else {
            this._context.rect(x, y, width, height);
        }
        if (color) {
            this._context.fillStyle = this._drawColor;
        }
    }
}
