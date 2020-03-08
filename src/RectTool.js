import { Tool } from './Tool.js';

export class RectTool extends Tool {
    constructor(surfaceRef){
        super(surfaceRef);
        this.startX = null;
        this.startY = null;
    }
    handleEvent(event, context){
        console.log('rect event');
        if(event.type === "mousedown"){
            context.beginPath();
            this.startX = event.clientX - this.leftOffset;
            this.startY = event.clientY - this.topOffset;
        }
        else if(event.type === "mouseup"){
            context.fillStyle = this.color;
            let width = (event.clientX - this.leftOffset) - this.startX;
            let height = (event.clientY - this.topOffset) - this.startY;
            context.fillRect(this.startX, this.startY, width, height);
        }
        else if(this.mouseDown && event.type === "mousemove"){
        }
    }   

}