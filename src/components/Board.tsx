import * as React from 'react';
import { Square, SquareType } from '../types/Square';
import Phase from '../types/Phase';
import { Position } from '../types/Position';
import Direction from '../types/Direction';
import SquareView from './SquareView';
import Arrow from './Arrow';
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
    isSelecting: boolean,
    selectedPos: Position,
}

class Component extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isSelecting: false,
            selectedPos: {x: 0, y: 0}
        }
    }

    isLoss(): boolean {
        if (this.props.phase === Phase.MOVE) {
            return this.props.board.filter(row => row.filter(square => {
                if(square.type !== SquareType.PIECE || square.player_id !== this.props.turn_player_id) return false;
                if(this.canMove(square.pos, Direction.UP, square.player_id))return true;
                if(this.canMove(square.pos, Direction.DOWN, square.player_id))return true;
                if(this.canMove(square.pos, Direction.LEFT, square.player_id))return true;
                if(this.canMove(square.pos, Direction.RIGHT, square.player_id))return true;
                return false;
            }).length !== 0).length === 0;
        } else {
            return this.props.board.filter(row => row.filter(square => square.canPut).length !== 0).length === 0;
        }
    }

    existLoop(map: Direction[][]): boolean {
        const visited: boolean[][] = new Array(MAP_SIZE_Y+2);
        const visiting: boolean[][] = new Array(MAP_SIZE_Y+2);
        for(var i=0;i<=MAP_SIZE_Y + 1;++i) {
            visited[i] = new Array(MAP_SIZE_X+2);
            visiting[i] = new Array(MAP_SIZE_X+2);
            for(var j=0;j<=MAP_SIZE_X+1;++j){
                visited[i][j]=false;
                visiting[i][j]=false;
            }
        }
        for(var i =0;i<=MAP_SIZE_Y+1; ++i){
            for(var j=0;j<=MAP_SIZE_X+1;++j){
                console.log(map[i][j]);
                if(this.hasVisited(map, visited, visiting, i, j))return true;
            }
        }
        return false;
    }

    hasVisited(map: Direction[][], visited: boolean[][], visiting: boolean[][], y: number, x: number): boolean {
        if(visited[y][x])return false;
        if(visiting[y][x])return true;
        if(map[y][x] !== Direction.NON) {
            visiting[y][x]=true;
            if(this.hasVisited(map, visited, visiting, y+getPos(map[y][x]).y, x+getPos(map[y][x]).x))return true;
            visiting[y][x]=false;
        }
        visited[y][x]=true;
        return false;
    }

    culcDirection = (from: Position, to: Position): Direction => {
        const vert = to.y - from.y;
        const holi = to.x - from.x;
        if (Math.max(Math.abs(vert), Math.abs(holi)) < 30) return Direction.NON;
        if (Math.abs(vert) > Math.abs(holi)) {
            return vert > 0 ? Direction.DOWN : Direction.UP;
        } else {
            return holi > 0 ? Direction.RIGHT : Direction.LEFT;
        }
    }

    canPutArrow = (pos: Position, dir: Direction): boolean => {
        if(dir === Direction.NON) return false;
        const map = this.props.board.map(row => {
            return row.map(square => square.pos.x === pos.x && square.pos.y === pos.y ? dir: square.dir === null ? Direction.NON : square.dir)
        })
        return !this.existLoop(map);
    }

    canMove = (pos: Position, dir: Direction, player_id: number): boolean => {
        if(dir === Direction.NON)return false;
        const dis = this.culcMove({x: pos.x + getPos(dir).x, y: pos.y + getPos(dir).y});
        return this.props.board[dis.y][dis.x].type !== SquareType.PIECE || this.props.board[dis.y][dis.x].player_id !== player_id;
    }

    culcMove = (pos: Position): Position => {
        let dis = pos;
        while(this.props.board[dis.y][dis.x].dir !== Direction.NON) {
            const dir = this.props.board[dis.y][dis.x].dir;
            dis.x += getPos(dir).x;
            dis.y += getPos(dir).y;
        }
        return dis;
    }

    onTouchPutArrowStart = (e: React.TouchEvent, pos: Position) => {
        e.preventDefault();
        if(!this.props.board[pos.y][pos.x].canPut) return;
        this.props.selectSquare(pos);
        this.setState({
            touchPos: {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY},
            isSelecting: true,
            selectedPos: pos
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
            isSelecting: true,
            selectedPos: pos
        });
    }

    onTouchMoveEnd = (e: React.TouchEvent, pos: Position) => {
        e.preventDefault();
        if(!this.state.isSelecting || !this.state.touchPos) return;

        this.props.unSelectSquare(pos);
        this.setState({ isSelecting: false });
        const dir = this.culcDirection(this.state.touchPos, {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY});
        if (!this.canMove(pos, dir, this.props.turn_player_id)) return;
        this.props.movePiece(pos, this.culcMove({x: pos.x + getPos(dir).x, y: pos.y+getPos(dir).y}), this.props.turn_player_id);
    }

    renderSquareView = (pos: Position) => {
        const onTouchStart = this.props.phase === Phase.PUT_ARROW ? this.onTouchPutArrowStart : this.onTouchMoveStart;
        const onTouchEnd = this.props.phase === Phase.PUT_ARROW ? this.onTouchPutArrowEnd : this.onTouchMoveEnd;
        return <SquareView key={pos.y*100+pos.x} square={this.props.board[pos.y][pos.x]} onTouchStart={(e) => onTouchStart(e, pos)} onTouchEnd={(e) => onTouchEnd(e, pos)} />;
    }

    renderBoard() {
        const rendered = [];
        for (var i=1;i<=MAP_SIZE_Y;++i){
            const temp = [];
            for(var j=1;j<=MAP_SIZE_X;++j){
                temp.push(this.renderSquareView({y:i, x:j}));
            }
            rendered.push(React.createElement('div', {className: "board-row", key: i}, temp))
        }
        return rendered;
    }


    render() {
        const boardView = this.renderBoard();
        if(this.isLoss()) {
            console.log('lose');
        }
        let dir={
            up: false,
            down: false,
            left: false,
            right: false
        };
        if (this.state.isSelecting) {
            if(this.props.phase === Phase.PUT_ARROW) {
                dir = {
                    up: this.canPutArrow(this.state.selectedPos, Direction.UP),
                    down: this.canPutArrow(this.state.selectedPos , Direction.DOWN),
                    left: this.canPutArrow(this.state.selectedPos , Direction.LEFT),
                    right: this.canPutArrow(this.state.selectedPos , Direction.RIGHT)
                }
            } else {
                dir = {
                    up: this.canMove(this.state.selectedPos, Direction.UP, this.props.turn_player_id),
                    down: this.canMove(this.state.selectedPos, Direction.DOWN, this.props.turn_player_id),
                    left: this.canMove(this.state.selectedPos, Direction.LEFT, this.props.turn_player_id),
                    right: this.canMove(this.state.selectedPos, Direction.RIGHT, this.props.turn_player_id)
                }
            }
        }

        return (
            <div>
                {boardView}
                <Arrow visible={this.state.isSelecting} dir={dir} pos={this.state.selectedPos}  />
            </div>
        )
    }
}

export default Component;
