import * as React from 'react';
import { Tool } from './Tools/Tool';
import { Palette } from './Palette';
import { PenTool } from './Tools/PenTool';
import { RectTool } from './Tools/RectTool';
import { LineTool } from './Tools/LineTool';
import { ArrowTool } from './Tools/ArrowTool';
import { SelectorTool } from './Tools/SelectorTool';
import { TextTool } from './Tools/TextTool';

interface ToolControllerProps {
    handleToolSelect(tool: Tool): void,
};

type ToolName = 'selector' | 'pen' | 'line' | 'arrow' | 'rect' | 'text';

interface ToolControllerState {
    selectedName: ToolName,
};

export class ToolController extends React.Component<ToolControllerProps, ToolControllerState>{
    private toolSet: Map<ToolName, Tool>;
    private selectedTool: Tool;
    public state: ToolControllerState;
    constructor(props: ToolControllerProps) {
        super(props);
        this.toolSet = new Map([
            ['selector' as ToolName, new SelectorTool()],
            ['pen', new PenTool()],
            ['line', new LineTool()],
            ['arrow', new ArrowTool()],
            ['rect', new RectTool()],
            ['text', new TextTool()]
        ]);
        this.state = {
            selectedName: "pen" as ToolName
        }
        this.selectedTool = this.toolSet.get(this.state.selectedName) as Tool;
        this.props.handleToolSelect(this.selectedTool);
    }
    handleChange = (event: any /*React.MouseEvent<HTMLInputElement>*/) => {
        let toolName = event.target.value;
        this.setState({
            selectedName: toolName
        }, () => this.selectNewTool(toolName));
    }
    selectNewTool = (toolName: ToolName) => {
        let tool = this.toolSet.get(toolName);
        if(!tool){
            throw Error(`Invalid tool ${toolName} selected.`);
        }
        this.selectedTool = tool;
        console.log(toolName, tool);
        this.props.handleToolSelect(tool);
    }
    setStrokeWidth = (width: number) => {
        this.toolSet.forEach( (tool: Tool, _) => {
            tool.setStrokeWidth(width);
        });
    }
    setColor = (color: string) => {
        this.toolSet.forEach( (tool: Tool, _) => {
            tool.setColor(color);
        });
    }
    toolListJSX(): Array<JSX.Element> {
        let toolJSX: Array<JSX.Element> = [];
        this.toolSet.forEach((tool: Tool, name: ToolName) => {

            let displayName = tool.getDisplayName();
            let icon = tool.getIcon();

            toolJSX.push(<label className="btn btn-outline-secondary" key={name}>
                <input type="radio" value={name} id={name}
                    checked={this.state.selectedName === name}
                    onClick={this.handleChange}
                    onChange={() => { }} />
                <i className={icon} title={displayName}></i>
            </label>);
        });
        return toolJSX;
    }
    render() {
        return (
            <>
                <div className="col-3 btn-group btn-group-toggle pb-2"
                    data-toggle="buttons">
                    {this.toolListJSX()}
                </div>
                <Palette
                    updateStrokeWidth={this.setStrokeWidth}
                    updateColor={this.setColor}
                />
            </>
        );
    }
}
