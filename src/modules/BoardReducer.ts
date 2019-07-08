import { PutArrowAction, MovePieceAction, MoveOnToNextPhaseAction, MoveOnToNextTurnAction, SelectSquareAction, UnSelectSquareAction } from "./BoardActions";
import { Square, SquareType } from "../types/Square";
import { MAP_SIZE_Y, MAP_SIZE_X, PLAYER_NUMBER, PLAYER_POS } from "../Const";
import Direction from "../types/Direction";
import { Position } from "../types/Position";
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
                pos: {x: i, y: j},
                type: SquareType.EMPTY,
                dir: null,
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
            board[pos[0]+1][pos[1]].canPut = true;
            board[pos[0]-1][pos[1]].canPut = true;
            board[pos[0]][pos[1]+1].canPut = true;
            board[pos[0]][pos[1]-1].canPut = true;
        })
    }

    return {
        board,
        phase: Phase.PUT_ARROW,
        turn_player_id: 0
    };
}

export const reducer = (state: State = init(), action: Actions): State => {
    switch (action.type) {
        case 'PUT_ARROW_ACTION':
            return {
                ...state,
                board: state.board.map(row => {
                    return row.map(square => {
                        return square.pos.x !== action.payload.pos.x || square.pos.y !== action.payload.pos.y
                        ? square
                        : {
                            ...square, 
                            type: SquareType.ARROW,
                            dir: action.payload.direction
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
            return {
                ...state,
                phase: state.phase === Phase.PUT_ARROW ? Phase.MOVE : Phase.PUT_ARROW
            }
        case 'MOVE_ON_TO_NEXT_TURN':
            return {
                ...state,
                turn_player_id: (state.turn_player_id + 1)%PLAYER_NUMBER
            }
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