import * as React from 'react';
import { Square, SquareType } from '../types/Square';
import Phase from '../types/Phase';
import { Position } from '../types/Position';
import Direction from '../types/Direction';
import SquareView from './SquareView';
import { MAP_SIZE_Y, MAP_SIZE_X, getPos } from '../Const';

type Props = {
    board: Square[][];
    turn_player_id: number;
    phase: Phase;
    selectSquare: (pos: Position) => void;
    unSelectSquare: (pos: Position) => void;
    putArrow: (pos: Position, dir: Direction) => void;
    movePiece: (from: Position, to: Position, player_id: number) => void;
}

type State = {
    touchPos?: Position,
    isSelecting: boolean
}

class Component extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isSelecting: false
        }
    }
    // reduxのお気持ちとしてはcomponentを純粋にしたい（状態を持たない)

    // (render()内で)勝敗判定

    // phaseによってboardにわたす関数は変える

    isLoss(): boolean {
        return true;
    }

    culcDirection = (from: Position, to: Position): Direction => {
        return Direction.NON;
    }

    canPutArrow = (pos: Position, dir: Direction): boolean => {
        if(dir === Direction.NON) return false;
        return true;
    }

    canMove = (pos: Position, player_id: number): boolean => {
        return true;
    }

    culcMove = (pos: Position): Position => {
        return {x: 1, y: 1};
    }

    onTouchPutArrowStart = (e: React.TouchEvent, pos: Position) => {
        e.preventDefault();
        if(!this.props.board[pos.y][pos.x].canPut) return;
        this.props.selectSquare(pos);
        this.setState({
            touchPos: {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY},
            isSelecting: true
        });
    }

    onTouchPutArrowEnd = (e: React.TouchEvent, pos: Position) => {
        e.preventDefault();
        if(!this.state.isSelecting || !this.state.touchPos) return;

        this.props.unSelectSquare(pos);
        this.setState({ isSelecting: false });
        const dir = this.culcDirection(this.state.touchPos, {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY});
        if (!this.canPutArrow(pos, dir)) return;
        this.props.putArrow(pos, dir);
    }

    onTouchMoveStart = (e: React.TouchEvent, pos: Position) => {
        e.preventDefault();
        if(this.props.board[pos.y][pos.x].type !== SquareType.PIECE || this.props.board[pos.y][pos.x].player_id !== this.props.turn_player_id) return;
        this.props.selectSquare(pos);
        this.setState({
            touchPos: {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY},
            isSelecting: true
        });
    }

    onTouchMoveEnd = (e: React.TouchEvent, pos: Position) => {
        e.preventDefault();
        if(!this.state.isSelecting || !this.state.touchPos) return;

        this.props.unSelectSquare(pos);
        this.setState({ isSelecting: false });
        const dir = this.culcDirection(this.state.touchPos, {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY});
        if (!this.canMove(pos, this.props.turn_player_id)) return;
        this.props.movePiece(pos, this.culcMove({x: pos.x + getPos(dir).x, y: pos.y+getPos(dir).y}), this.props.turn_player_id);
    }

    renderSquareView = (pos: Position) => {
        const onTouchStart = this.props.phase === Phase.PUT_ARROW ? this.onTouchPutArrowStart : this.onTouchMoveStart;
        const onTouchEnd = this.props.phase === Phase.PUT_ARROW ? this.onTouchPutArrowEnd : this.onTouchMoveEnd;
        return <SquareView square={this.props.board[pos.y][pos.x]} onTouchStart={(e) => onTouchStart(e, pos)} onTouchEnd={(e) => onTouchEnd(e, pos)} />;
    }

    renderBoard() {
        const rendered = [];
        for (var i=1;i<=MAP_SIZE_Y;++i){
            for(var j=1;j<=MAP_SIZE_X;++j){
                rendered.push(this.renderSquareView({y:i, x:j}));
            }
            rendered.push(<br />);
        }
        return rendered;
    }


    render() {
        const boardView = this.renderBoard();
        if(this.isLoss()) {
        }

        return (
            <div>
                {boardView}
            </div>
        )
    }
}

export default Component;
