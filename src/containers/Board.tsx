import { State } from '../modules/BoardReducer';
import { connect } from 'react-redux';
import Board from '../components/Board'
import { Dispatch } from 'react';
import { Action } from 'redux';
import Direction from '../types/Direction';
import { putArrow, movePiece, selectSquare, unSelectSquare, MoveOnToNextPhase, moveOnToNextTurn } from '../modules/BoardActions';
import { Position } from '../types/Position';

const mapStateToProps = (state: State) => {
    return {
        board: state.board,
        phase: state.phase,
        turn_player_id: state.turn_player_id
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        selectSquare: (pos: Position) => {dispatch(selectSquare({pos:pos}))},
        unSelectSquare: (pos: Position) => {dispatch(unSelectSquare({pos:pos}))},
        putArrow: (pos: Position, dir: Direction) => {
            dispatch(putArrow({pos: pos, direction:dir}));
            dispatch(MoveOnToNextPhase());
        },
        movePiece: (from: Position, to: Position, player_id: number) => {
            dispatch(movePiece({fromPos: from, toPos: to, player_id: player_id}));
            dispatch(moveOnToNextTurn());
            dispatch(MoveOnToNextPhase());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board)
