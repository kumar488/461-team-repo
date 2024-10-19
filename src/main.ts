import * as fs from 'fs';
import { RunProject } from './netScore'; 
import logger from './logger';

export async function processUrlsFromFile(urlFile: string): Promise<number> {

    const result = await checkEnvVariables(); 
    if (result === 1) { 
        logger.debug("RC: 1");
        logger.close();
        return 1; // Return 1 instead of calling process.exit
    }

    logger.debug(`Processing URLS from file: ${urlFile}`);

    // Check if the file exists
    if (!fs.existsSync(urlFile)) {
        logger.info("File does not exist");
        logger.debug("RC: 1");
        logger.close();
        return 1;
    }

    // Read and process the file
    try {
        const fileContents = fs.readFileSync(urlFile, 'utf-8');
        await RunProject(urlFile); // Process the URLs using your function

        logger.debug("RC: 0");
        logger.close();
        return 0; // Return 0 instead of calling process.exit
    } catch (error: any) {
        logger.info("Error reading the file");
        logger.debug(`Error: ${error.message}`);

        logger.debug("RC: 1");
        logger.close();
        return 1; // Return 1 instead of calling process.exit
    }
}

async function checkEnvVariables() {
    if (!process.env.LOG_FILE) {
        logger.info("Environment variable LOG_FILE is not defined");
        return 1;
    }

    if (!process.env.GITHUB_TOKEN) {
        logger.info("Environment variable GITHUB_TOKEN is not defined");
        return 1;
    }

    logger.debug("Environment variables are set");
    return 0;
}

if (require.main === module) {
    const urlFile = process.argv[2]; // The second argument is the file path
    processUrlsFromFile(urlFile)
        .then((exitCode) => {
            process.exit(exitCode); // Exit with the returned status code
        })
        .catch((err) => {
            console.error("Unexpected error:", err);
            process.exit(1); // Exit with failure if an error occurs
        });
}