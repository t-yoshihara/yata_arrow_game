import * as React from 'react';
import { Position } from '../types/Position';

type Props = {
    visible: boolean;
    dir: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }
    pos: Position
}

class Component extends React.Component<Props> {
    render() {
        if (!this.props.visible)return null;
        const sz = 41;
        const y = this.props.pos.y;
        const x = this.props.pos.x;
        const rendered = [];
        if (this.props.dir.up){
            const top = sz*(y-2);
            const left = sz*(x-1);
            rendered.push(<div className="arrow-up" style={{position:"absolute", top: top, left: left}} key="arrow-up" />)
        }
        if (this.props.dir.down){
            const top = sz*(y+0.5);
            const left = sz*(x-1);
            rendered.push(<div className="arrow-down" style={{position:"absolute", top: top, left: left}} key="arrow-down" />)
        }
        if (this.props.dir.left){
            const top = sz*(y-1);
            const left = sz*(x-2);
            rendered.push(<div className="arrow-left" style={{position:"absolute", top: top, left: left}} key="arrow-left" />)
        }
        if (this.props.dir.right){
            const top = sz*(y-1);
            const left = sz*(x+0.5);
            rendered.push(<div className="arrow-right" style={{position:"absolute", top: top, left: left}} key="arrow-right" />)
        }

        return (
            <div className="arrow">
                {rendered}
            </div>
        )
    }
}

export default Component;