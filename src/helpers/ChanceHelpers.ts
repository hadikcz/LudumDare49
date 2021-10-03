import NumberHelpers from "helpers/NumberHelpers";

export default class ChanceHelpers {
    static percentage (targetPercent: number): boolean {
        return NumberHelpers.randomIntInRange(0, 100) <= targetPercent;
    }
}
