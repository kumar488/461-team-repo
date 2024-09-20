import {handleURL} from './handleURL'
import {checkSections} from './RampUp_Metric'
import {getCorrectness} from './correctness'
import {getBusFactor} from './busFactor'
import {getResponsiveMaintainer} from './responsiveMaintainer'
// import {getLicense} from './license'
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

export async function RunProject() {
    const TOKEN: string = process.env.GITHUB_TOKEN || '';
    const f_path = './Sample Url File.txt';
    const f_file = fs.readFileSync(f_path, 'utf-8');
    const lines: string[] = f_file.split(/\r?\n/);

    let url_batch: string[] = [];
    for (const line of lines) { //for each URL in sample file
        url_batch.push(line);
        if (url_batch.length === 5) {
            await processBatch(url_batch, TOKEN);
        }
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
            //Logic for using repoinfo to calculate net score
            const owner = repoinfo['owner'];
            const repo = repoinfo['repo'];
            
            const netScoreStart = Date.now();

            //rampup call
            // const rampUp = await getRampUp(owner, repo, TOKEN);
            const rampUpEnd = Date.now();

            const correctness = await getCorrectness(owner, repo, TOKEN);
            const correctnessEnd = Date.now();

            const busFactor = await getBusFactor(owner, repo, TOKEN);
            const busFactorEnd = Date.now();

            //responsiveMaintainer call
            const responsiveMaintainerEnd = Date.now();

            //license call
            const licenseEnd = Date.now();

            //net score calculation
            let rampUp = 0;//for testing only
            let responsiveMaintainer = 0;//for testing only
            let license = 1;//for testing only
            const netScore = (0.20*rampUp + 0.30*correctness + 0.20*busFactor + 0.30*responsiveMaintainer) * license;
            const netScoreEnd = Date.now();

            //latency calculations (in seconds)
            const netScoreLatency = ((netScoreEnd - netScoreStart)/1000).toFixed(3);
            const rampUpLatency = ((rampUpEnd - netScoreStart)/1000).toFixed(3);
            const correctnessLatency = ((correctnessEnd - rampUpEnd)/1000).toFixed(3);
            const busFactorLatency = ((busFactorEnd - correctnessEnd)/1000).toFixed(3);
            const responsiveMaintainerLatency = ((responsiveMaintainerEnd - busFactorEnd)/1000).toFixed(3);
            const licenseLatency = ((licenseEnd - responsiveMaintainerEnd)/1000).toFixed(3);

            //print statements for testing
            console.log('Repo: ', repo, ' Owner: ', owner); //print output for testing purposes
            //add more for showing rest of metrics
            console.log('Has bus factor of ', busFactor.toFixed(2));
        }
    }
}