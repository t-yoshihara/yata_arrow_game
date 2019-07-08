import { Action } from 'redux';
import Direction from '../types/Direction'
import { Position } from '../types/Position'

export type PutArrowPayload = {
    pos: Position,
    direction: Direction
}

export interface PutArrowAction extends Action {
    type: 'PUT_ARROW_ACTION',
    payload: PutArrowPayload
}

export const putArrow = (payload: PutArrowPayload): PutArrowAction => {
    return {
        type: 'PUT_ARROW_ACTION',
        payload
    }
}

export type MovePiecePayload = {
    fromPos: Position,
    toPos: Position,
    player_id: number
}

export interface MovePieceAction extends Action {
    type: 'MOVE_ACTION',
    payload: MovePiecePayload
}

export const movePiece = (payload: MovePiecePayload): MovePieceAction => {
    return {
        type: 'MOVE_ACTION',
        payload
    }
}

export interface MoveOnToNextTurnAction extends Action {
    type: 'MOVE_ON_TO_NEXT_TURN'
}

export const moveOnToNextTurn = (): MoveOnToNextTurnAction => {
    return {
        type: 'MOVE_ON_TO_NEXT_TURN'
    }
}

export interface MoveOnToNextPhaseAction extends Action {
    type: 'MOVE_ON_TO_NEXT_PHASE'
}

export const MoveOnToNextPhase = (): MoveOnToNextPhaseAction => {
    return {
        type: 'MOVE_ON_TO_NEXT_PHASE'
    }
}

export type SelectSquarePayload = {
    pos: Position
}

export interface SelectSquareAction extends Action {
    type: 'SELECT_SQUARE',
    payload: SelectSquarePayload
}

export const selectSquare = (payload: SelectSquarePayload): SelectSquareAction => {
    return {
        type: 'SELECT_SQUARE',
        payload: payload
    }
}

export type UnSelectSquarePayload = {
    pos: Position
}

export interface UnSelectSquareAction extends Action {
    type: 'UN_SELECT_SQUARE_ACTION',
    payload: UnSelectSquarePayload
}

export const unSelectSquare = (payload: UnSelectSquarePayload): UnSelectSquareAction => {
    return {
        type: 'UN_SELECT_SQUARE_ACTION',
        payload: payload
    }
}
