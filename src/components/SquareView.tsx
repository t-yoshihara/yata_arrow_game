import * as React from 'react';
import { Square, SquareType } from '../types/Square';
import Direction from '../types/Direction';
import { Color } from 'csstype';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

type Props = {
    square: Square;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

class Component extends React.Component<Props> {
    targetElement: HTMLElement | null = null;

    componentDidMount() {
        // 2. Get a target element that you want to persist scrolling for (such as a modal/lightbox/flyout/nav). 
        // Specifically, the target element is the one we would like to allow scroll on (NOT a parent of that element).
        // This is also the element to apply the CSS '-webkit-overflow-scrolling: touch;' if desired.
        this.targetElement = document.querySelector('#targetElementId');
        if(this.targetElement)disableBodyScroll(this.targetElement);
      }

    getChar = (square: Square): string => {
        if (square.type === SquareType.EMPTY) return '';
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

    background = (square: Square): Color => {
        if (square.canPut) return '#FFC300';
        if (square.isSelected) return '#FF5733'
        return '#FFFFFF';
    }

    render() {
        const char = this.props.square.type
        return (
            <div className="square" style={{background: this.background(this.props.square)}} onTouchStart={(e) => this.props.onTouchStart(e)} onTouchEnd={(e) => this.props.onTouchEnd(e)}>
                {this.getChar(this.props.square)}
            </div>
        )
    }
}

export default Component;