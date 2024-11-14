export function weight(measure: string, value: number, unit = 'g') {
    let result = { g: 0, kg: 0, lb: 0, oz: 0 };
    switch (measure) {
        case 'kg':
            result = {
                g: value * 1000,
                kg: value,
                lb: value * 2.20462,
                oz: value * 35.274,
            };
            break;
        case 'g':
            result = {
                g: value,
                kg: value / 1000,
                lb: value * 0.00220462,
                oz: value * 0.035274,
            };
            break;
        case 'lb':
            result = {
                g: value * 453.592,
                kg: value * 0.453592,
                lb: value,
                oz: value * 16,
            };
            break;
        case 'oz':
            result = {
                g: value * 28.3495,
                kg: value * 0.0283495,
                lb: value * 0.0625,
                oz: value,
            };
            break;
        default:
            result = {
                g: value,
                kg: value / 1000,
                lb: value * 0.00220462,
                oz: value * 0.035274,
            };
            break;
    }
    //return result.hasOwnProperty(unit) ? result[unit] : result['g'];
    return result;
}