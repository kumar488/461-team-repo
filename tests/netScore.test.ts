import { calculateNetScore } from '../src/netScore';

describe('calculateNetScore', () => {
    it('should return null if any of the inputs are not between 0 and 1', async () => {
        const rampUp = 0.5;
        const correctness = 0.5;
        const busFactor = -4;
        const responsiveMaintainer = 0.5;
        const license = 0;
        const netScore = calculateNetScore(rampUp, correctness, busFactor, responsiveMaintainer, license);
        expect(netScore).toBeNull();
    });
    it('should return a value between 0 and 1 if license is 1', async () => {
        const rampUp = 0.5;
        const correctness = 0.5;
        const busFactor = 0.5;
        const responsiveMaintainer = 0.5;
        const license = 1;
        const netScore = calculateNetScore(rampUp, correctness, busFactor, responsiveMaintainer, license);
        expect(netScore).toBe(0.5);
    });
    it('should return 0 if license is 0', async () => {
        const rampUp = 0.5;
        const correctness = 0.5;
        const busFactor = 0.5;
        const responsiveMaintainer = 0.5;
        const license = 0;
        const netScore = calculateNetScore(rampUp, correctness, busFactor, responsiveMaintainer, license);
        expect(netScore).toBe(0.5);
    });
});