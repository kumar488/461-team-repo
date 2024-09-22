import logger from '../src/logger';
import { test_RampUp, getRampUp } from '../src/RampUp_Metric';


describe('Calculate RampUp Score', () => {
    jest.setTimeout(10000); //set timeout to 10 seconds

    it('Should return score of 0, bad README.md', async () => {
        const url0 = "https://github.com/microsoft/TypeScript";
        var RU_score0 = await test_RampUp(url0);
        logger.info(`Ramp up score for ${url0}: ${RU_score0}`);
        expect(RU_score0).toBe(0);
    }); 
    it('Should return score of 0, invalid url', async () => {
        const url1 = "https://github.com/";
        var RU_score1 = await test_RampUp(url1);
        logger.info(`Ramp up score for ${url1}: ${RU_score1}`);
        expect(RU_score1).toBe(0);
    }); 
    it('Should return score', async () => {
        const url2 = "https://github.com/cloudinary/cloudinary_npm";
        var RU_score2 = await test_RampUp(url2);
        logger.info(`Ramp up score for ${url2}: ${RU_score2}`);
        expect(RU_score2).toBe(0);
    }); 
    it('getRampUp, Should return score of 0, bad README.md', async () => {
        const url3 = "https://github.com/microsoft/TypeScript";
        var RU_score3 = await getRampUp("cloudinary", url3, "Hi");
        logger.info(`Ramp up score for ${url3}: ${RU_score3}`);
        expect(RU_score3).toBe(0);
    }); 
    it('Should return score of 0, no README.md', async () => {
        const url4 = "https://github.com/octocat/Hello-World/";
        var RU_score4 = await test_RampUp(url4);
        logger.info(`Ramp up score for ${url4}: ${RU_score4}`);
        expect(RU_score4).toBe(0);
    }); 
});
