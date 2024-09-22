import logger from '../src/logger';
import { test_RampUp, getRampUp } from '../src/RampUp_Metric';


describe('Calculate RampUp Score', () => {
    it('Should return score of 0, bad README.md', async () => {
        const url = "https://github.com/microsoft/TypeScript";
        var RU_score = await test_RampUp(url);
        logger.info(`Ramp up score for ${url}: ${RU_score}`);
        expect(RU_score).toBe(0);
    }); 
    it('Should return score of 0, invalid url', async () => {
        const url = "https://github.com/";
        var RU_score = await test_RampUp(url);
        logger.info(`Ramp up score for ${url}: ${RU_score}`);
        expect(RU_score).toBe(0);
    }); 
    it('Should return score', async () => {
        const url = "https://github.com/cloudinary/cloudinary_npm";
        var RU_score = await test_RampUp(url);
        logger.info(`Ramp up score for ${url}: ${RU_score}`);
        expect(RU_score).toBe(0);
    }); 
    it('Should return score, getrampUp', async () => {
        const url = "https://github.com/cloudinary/cloudinary_npm";
        var RU_score = await getRampUp("cloudinary", url, "Hi");
        logger.info(`Ramp up score for ${url}: ${RU_score}`);
        expect(RU_score).toBe(0);
        // expect(RU_score).toBeNull();
    }); 
    it('Should return score, test_RampUp', async () => {
        const url = "https://github.com/nullivex/nodist";
        var RU_score = await test_RampUp(url);
        logger.info(`Ramp up score for ${url}: ${RU_score}`);
        expect(RU_score).toBe(0);
    }); 
});
