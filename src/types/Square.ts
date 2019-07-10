import { Position } from "./Position";
import Direction from "./Direction";

export enum SquareType {
    EMPTY,
    ARROW,
    PIECE
}

export type Square = {
    pos: Position,
    type: SquareType,
    dir: Direction,
    player_id: number | null,
    canPut: boolean,
    isSelected: boolean
}
