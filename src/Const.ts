import Direction from "./types/Direction";
import { Position } from "./types/Position";

export const MAP_SIZE_Y = 7;
export const MAP_SIZE_X = 7;
export const PLAYER_NUMBER = 2;
export const PLAYER_POS = [
    [
        [1, 3], [1, 5], [7, 1], [7, 5]
    ],
    [
        [3, 1], [3, 7], [5, 1], [5, 7]
    ]
]

export const getPos = (dir: Direction): Position => {
    switch(dir) {
        case Direction.UP:
            return {x: 0, y: -1};
        case Direction.DOWN:
            return {x: 0, y: 1};
        case Direction.LEFT:
            return {x: -1, y: 0};
        case Direction.RIGHT:
            return {x: 1, y:0};
        default:
            return {x: 0, y: 0}
    }
}