import React from 'react';
import './Canvas.css';
import { ToolController } from './ToolController.js';
import { VersionController } from './VersionController.js';
import { MenuBar } from './MenuBar.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.versionController = new VersionController();
        this.state = {
            tool: null,
            title: null,
            loading: true,
            drawSurface: React.createRef(),
        };
    }
    componentDidMount(){
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey){
                switch(event.key){
                    case 'z':
                        this.versionController.undo(this.state.drawSurface);
                        break;
                    case 'y':
                        this.versionController.redo(this.state.drawSurface);
                        break;
                    default:
                }
            }
        });
        this.getCanvas();
    }
    handleToolSelect = tool => {
        this.setState({
            tool: tool
        });
    }
    handleInput = event => {
        let context = this.state.drawSurface.current.getContext('2d');
        let newItem = this.state.tool.handleEvent(event, context);
        if(newItem != null){
            this.versionController.push(newItem);
            if(!newItem.indicator){
                this.pushCanvas();
            }
            this.clearCanvas();
            this.versionController.redrawCanvas(this.state.drawSurface);
        }
        event.preventDefault();
    }
    clearCanvas = () => {
        let context = this.state.drawSurface.current.getContext('2d');
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
    }
    pushCanvas = () => {
        fetch(`http://localhost:8000/api/p/${this.props.match.params.id}`, {
            method: 'POST',
            body: JSON.stringify(this.versionController.versionHistory),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then( response => {
            if(response.status === 401){ // not logged in
                window.location.replace('http://localhost:8000/login');
            }
            else if(response.status === 403){ // not authorized
                alert('You do not have permissions to edit this item.');
                this.versionController.undo(this.state.drawSurface);
            }
        })
    }
    getCanvas = () => {
        fetch(`http://localhost:8000/api/p/${this.props.match.params.id}`)
        .then( response => {
            return response.json()
        })
        .then( data => {
            this.setState({
                title: data.title
            });
            for(const item of data.strokes){
                this.versionController.push(item);
            }
            this.versionController.redrawCanvas(this.state.drawSurface);
        });
        this.setState({
            loading: false
        });
    }
    zoomIn = () => {
        let ctx = this.state.drawSurface.current.getContext('2d');
        this.clearCanvas();
        ctx.scale(2, 2);
        this.versionController.redrawCanvas(this.state.drawSurface);
    }
    zoomOut = () => {
        let ctx = this.state.drawSurface.current.getContext('2d');
        this.clearCanvas();
        ctx.scale(0.5, 0.5);
        this.versionController.redrawCanvas(this.state.drawSurface);
    }
    render(){
        return(
            <div className="container col px-5 Canvas">
                <MenuBar 
                    title={this.state.title}
                    surface={this.state.drawSurface} 
                />
                <div className="row pl-5">
                    <ToolController 
                        surface={this.state.drawSurface}
                        handleToolSelect={this.handleToolSelect}
                    />
                    <div className="versionButtons pt-2 pl-5">
                        <button onClick={(event) => {
                            this.versionController.undo(this.state.drawSurface)
                        }}>
                            Undo
                        </button>
                        <button onClick={ (event) => {
                            this.versionController.redo(this.state.drawSurface)
                        }}>
                            Redo
                        </button>
                        <button onClick={ (event) => { 
                            this.clearCanvas();
                            this.versionController.wipeHistory()
                        }}>
                            Clear
                        </button>
                        <button onClick={this.zoomIn}>
                            Zoom In
                        </button>
                        <button onClick={this.zoomOut}>
                            Zoom Out
                        </button>
                    </div>
                </div>
                <canvas className="row" id="drawSurface" 
                    onMouseDown = {this.handleInput}
                    onMouseMove = {this.handleInput}                    
                    onMouseLeave = {this.handleInput}
                    onMouseUp = {this.handleInput}
                    height = { window.innerHeight * .9 }
                    width = { window.innerWidth * .95 }
                    ref = { this.state.drawSurface } />
            </div>
        )
    }
}

export default Canvas;
