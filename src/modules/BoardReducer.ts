import { PutArrowAction, MovePieceAction, MoveOnToNextPhaseAction, MoveOnToNextTurnAction, SelectSquareAction, UnSelectSquareAction } from "./BoardActions";
import { Square, SquareType } from "../types/Square";
import { MAP_SIZE_Y, MAP_SIZE_X, PLAYER_NUMBER, PLAYER_POS, getPos } from "../Const";
import Direction from "../types/Direction";
import Phase from "../types/Phase";

type Actions = PutArrowAction
             | MovePieceAction 
             | MoveOnToNextPhaseAction
             | MoveOnToNextTurnAction
             | SelectSquareAction
             | UnSelectSquareAction;

export type State = {
    board: Square[][],
    phase: Phase;
    turn_player_id: number;
}

const init = (): State => {
    const board: Square[][] = new Array(MAP_SIZE_Y+2);
    for(var i=0;i<=MAP_SIZE_Y + 1;++i) {
        board[i] = new Array(MAP_SIZE_X+2);
        for(var j=0;j<=MAP_SIZE_X + 1; ++j) {
            board[i][j] = {
                pos: {x: j, y: i},
                type: SquareType.EMPTY,
                dir: Direction.NON,
                player_id: null,
                canPut: false,
                isSelected: false
            }
        }
    }

    for(var i=0; i<=MAP_SIZE_Y+1; ++i) {
        board[i][0].type = SquareType.ARROW;
        board[i][0].dir = Direction.RIGHT;

        board[i][MAP_SIZE_X+1].type = SquareType.ARROW;
        board[i][MAP_SIZE_X+1].dir = Direction.LEFT;
    }

    for(var j=0; j<=MAP_SIZE_X+1; ++j) {
        board[0][j].type = SquareType.ARROW;
        board[0][j].dir = Direction.DOWN;

        board[MAP_SIZE_Y+1][j].type = SquareType.ARROW;
        board[MAP_SIZE_Y+1][j].dir = Direction.UP;
    }

    for(var player_id=0; player_id<PLAYER_NUMBER; ++player_id) {
        PLAYER_POS[player_id].forEach(pos => {
            board[pos[0]][pos[1]].type = SquareType.PIECE;
            board[pos[0]][pos[1]].player_id = player_id;
        })
    }
    return updateCanPut({
        board,
        phase: Phase.PUT_ARROW,
        turn_player_id: 0
    });
}

const updateCanPut = (state: State): State => {
    if (state.phase === Phase.PUT_ARROW) {
        return {
            ...state,
            board: state.board.map(row => {
                return row.map(square => {
                    let canPut = false;
                    for(var dir in Direction) {
                        if(!isNaN(Number(dir)))continue;
                        if(square.pos.y === 0 || square.pos.y === MAP_SIZE_Y+1 || square.pos.x === 0 || square.pos.x === MAP_SIZE_X+1)continue;
                        canPut = canPut || (state.board[square.pos.y + getPos(dir).y][square.pos.x + getPos(dir).x].type === SquareType.PIECE
                                            && state.board[square.pos.y + getPos(dir).y][square.pos.x + getPos(dir).x].player_id === state.turn_player_id);
                    }
                    canPut = canPut && square.type === SquareType.EMPTY;                        
                    return {
                        ...square,
                        canPut: canPut
                    }
                })
            })
        }
    } else {
        return {
            ...state,
            board: state.board.map(row => {
                return row.map(square => {
                    return {
                        ...square,
                        canPut: square.type === SquareType.PIECE && square.player_id === state.turn_player_id
                    }
                })
            })
        }
    }
}

export const reducer = (state: State = init(), action: Actions): State => {
    switch (action.type) {
        case 'PUT_ARROW_ACTION':
            return {
                ...state,
                board: state.board.map(row => {
                    return row.map(square => {
                        return square.pos.x !== action.payload.pos.x || square.pos.y !== action.payload.pos.y
                        ? {
                            ...square,
                            canPut: false
                        }
                        : {
                            ...square, 
                            type: SquareType.ARROW,
                            dir: action.payload.direction,
                            canPut: false
                        }
                    })
                })
            }
        case 'MOVE_ACTION':
            return {
                ...state,
                board: state.board.map(row => {
                    return row.map(square => {
                        return square.pos.x === action.payload.fromPos.x && square.pos.y === action.payload.fromPos.y
                        ? {
                            ...square,
                            type: SquareType.EMPTY
                        } :
                        square.pos.x === action.payload.toPos.x && square.pos.y === action.payload.toPos.y
                        ? {
                            ...square,
                            type: SquareType.PIECE,
                            player_id: action.payload.player_id
                        } : square
                    })
                })
            }
        case 'MOVE_ON_TO_NEXT_PHASE':
            return updateCanPut({
                ...state,
                phase: state.phase === Phase.PUT_ARROW ? Phase.MOVE : Phase.PUT_ARROW
            })
        case 'MOVE_ON_TO_NEXT_TURN':
            return updateCanPut({
                ...state,
                turn_player_id: (state.turn_player_id + 1)%PLAYER_NUMBER
            })
        case 'SELECT_SQUARE':
            return {
                ...state,
                board: state.board.map(row => {
                    return row.map(square => {
                        return square.pos.x === action.payload.pos.x && square.pos.y === action.payload.pos.y
                        ? {
                            ...square,
                            isSelected: true
                        }: square
                    })
                })
            }
        case 'UN_SELECT_SQUARE_ACTION':
                return {
                    ...state,
                    board: state.board.map(row => {
                        return row.map(square => {
                            return square.pos.x === action.payload.pos.x && square.pos.y === action.payload.pos.y
                            ? {
                                ...square,
                                isSelected: false
                            }: square
                        })
                    })
                }
        default:
            return state;        
    }
}