export declare function getPrettyValue(number: any, digits?: number, separator?: string): string;
declare enum RoundingModes {
    CEILING = 0,
    DOWN = 1,
    FLOOR = 2,
    HALF_DOWN = 3,
    HALF_EVEN = 4,
    HALF_UP = 5,
    UNNECESSARY = 6,
    UP = 7
}
export declare function round(number: any, precision?: number, mode?: RoundingModes): string;
export {};
