import {handleURL} from './handleURL'
import {getRampUp} from './RampUp_Metric'
import {getCorrectness} from './correctness'
import {getBusFactor} from './busFactor'
import {getResponsiveMaintainer} from './responsiveMaintainer'
import {getLicense} from './license'
import logger from './logger';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

export async function RunProject(inputFilePath: string) {
    const TOKEN: string = process.env.GITHUB_TOKEN || '';
    const inputfile = fs.readFileSync(inputFilePath, 'utf-8');
    const lines: string[] = inputfile.split(/\r?\n/);

    let url_batch: string[] = [];
    for (const line of lines) { //for each URL in sample file
        url_batch.push(line);
        if (url_batch.length === 5) {
            await processBatch(url_batch, TOKEN);
            url_batch = [];
        }
    }

    //Handle last batch of URLs (for when the number of URLs is not a multiple of 5)
    if (url_batch.length > 0) {
        await processBatch(url_batch, TOKEN);
    }
}

export async function processBatch(url_batch: string[], TOKEN: string) {
    for (const url of url_batch) {
        const repoinfo = await handleURL(url);
        if (!repoinfo) {
            console.error ("Error: URL not compatible. Please enter github.com or npmjs.com URL\n");
            return;
        }
        else {
            const owner = repoinfo['owner'];
            const repo = repoinfo['repo'];
            await getNetScore(url, owner, repo, TOKEN);
            if (getNetScore === null) {
                logger.debug(`Error performing Net Score analysis for ${owner}/${repo}`);
            }
        }
    }
}

export async function getNetScore(url:string, owner:string, repo:string, TOKEN: string) {
    logger.debug(`Calculating Net Score for ${owner}/${repo}`);

    try {
        //Initialize Timer for Latency Calculations
        const netScoreStart = Date.now();

        //Get Ramp Up Metric Score and Latency
        const rampUp = await getRampUp(owner, url, TOKEN);
        const rampUpEnd = Date.now();
        if (rampUp === null) {
            logger.debug('Error getting Ramp Up metric score');
            return null;
        }

        //Get Correctness Metric Score and Latency
        const correctness = await getCorrectness(owner, repo, TOKEN);
        const correctnessEnd = Date.now();
        if (correctness === null) {
            logger.debug('Error getting Correctness metric score');
            return null;
        }

        //Get Bus Factor Metric Score and Latency
        const busFactor = await getBusFactor(owner, repo, TOKEN);
        const busFactorEnd = Date.now();
        if (busFactor === null) {
            logger.debug('Error getting Bus Factor metric score');
            return null;
        }

        //Get Responsive Maintainer Metric Score and Latency
        const responsiveMaintainer = await getResponsiveMaintainer(owner, repo, TOKEN);
        const responsiveMaintainerEnd = Date.now();
        if (responsiveMaintainer === null) {
            logger.debug('Error getting Responsive Maintainer metric score');
            return null;
        }

        //Get License Metric Score and Latency
        const license = await getLicense(owner, repo);
        const licenseEnd = Date.now();
        if (license === null) {
            logger.debug('Error getting License metric score');
            return null;
        }

        //Net Score Calculation and Latency
        const netScore = calculateNetScore(rampUp, correctness, busFactor, responsiveMaintainer, license);
        const netScoreEnd = Date.now();
        if (netScore === null) {
            logger.debug('Error computing Net Score');
            return null;
        }
        logger.info(`Net Score for ${owner}/${repo}: ${netScore}`);

        //Latency Calculations (in seconds)
        const netScoreLatency = ((netScoreEnd - netScoreStart)/1000).toFixed(3);
        const rampUpLatency = ((rampUpEnd - netScoreStart)/1000).toFixed(3);
        const correctnessLatency = ((correctnessEnd - rampUpEnd)/1000).toFixed(3);
        const busFactorLatency = ((busFactorEnd - correctnessEnd)/1000).toFixed(3);
        const responsiveMaintainerLatency = ((responsiveMaintainerEnd - busFactorEnd)/1000).toFixed(3);
        const licenseLatency = ((licenseEnd - responsiveMaintainerEnd)/1000).toFixed(3);

        logger.info(`Net Score Latency: ${netScoreLatency} seconds`);

        //Output Results
        const output_data = {
            URL: url,
            NetScore: netScore,
            NetScore_Latency: netScoreLatency,
            RampUp: rampUp,
            RampUp_Latency: rampUpLatency,
            Correctness: correctness,
            Correctness_Latency: correctnessLatency,
            BusFactor: busFactor,
            BusFactor_Latency: busFactorLatency,
            ResponsiveMaintainer: responsiveMaintainer,
            ResponsiveMaintainer_Latency: responsiveMaintainerLatency,
            License: license,
            License_Latency: licenseLatency
        }
        const json_output = JSON.stringify(output_data, null, 2);
        //Write Output to File
        // fs.writeFile('./output.json', json_output, (error) => {
        //     if (error) {
        //         logger.debug('Error writing output to file');
        //         return null;
        //     }
        //     else {
        //         logger.info('Output written to file');
        //         return 1;
        //     }
        // });
        //Write Output to Console
        console.log(json_output);
    }
    catch (error) {
        logger.debug(`Error calculating Net Score for ${owner}/${repo}`);
        return null;
    }
}

export function calculateNetScore(rampUp: number, correctness: number, busFactor: number, responsiveMaintainer: number, license: number) {
    //Handle Edge Cases: Validate Arguments
    if (rampUp < 0 || rampUp > 1 || correctness < 0 || correctness > 1 || busFactor < 0 || busFactor > 1 || 
    responsiveMaintainer < 0 || responsiveMaintainer > 1 || license < 0 || license > 1) {
        logger.debug(`Invalid Arguments: Arguments must be between 0 and 1`);
        return null;
    }

    const netScore = (0.20*rampUp + 0.30*correctness + 0.20*busFactor + 0.30*responsiveMaintainer) * license;
    return netScore;
}