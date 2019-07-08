import * as React from 'react';
import { Square, SquareType } from '../types/Square';
import Direction from '../types/Direction';

type Props = {
    square: Square;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

class Component extends React.Component<Props> {

    getChar = (square: Square): string => {
        if (square.type === SquareType.EMPTY) return '□';
        if (square.type === SquareType.PIECE) {
            if (square.player_id === 0) return '♘';
            else return '♞';
        }
        if (square.type === SquareType.ARROW) {
            switch (square.dir) {
                case Direction.UP: return '↑';
                case Direction.DOWN: return '↓';
                case Direction.LEFT: return '←';
                case Direction.RIGHT: return '→';
            }
        }
        return '';
    }

    render() {
        const char = this.props.square.type
        return (
            <div onTouchStart={(e) => this.props.onTouchStart(e)} onTouchEnd={(e) => this.props.onTouchEnd(e)}>
                {this.getChar(this.props.square)}
            </div>
        )
    }
}

export default Component;