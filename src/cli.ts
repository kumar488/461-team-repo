import {Command} from 'commander';
import {exec} from "child_process" //Import to run shell commands
import {promisify} from "util" //Use promisfy to use async/wait
import logger from './logger'; //Import the logger
import fs from 'fs'; //Import the file system module

const execAsync = promisify(exec);

const program = new Command();

program
    .name("run")

program
    .command('install')
    .description('Install dependencies')
    .action(async () => {
        logger.info("Installing dependencies...");
        const modules = ['jest', 'axios', 'dotenv', 'commander', 'winston', 'fakethingy12ewfwfew']; //List of modules to install
        const modulesString = modules.join(' '); //Convert the list to a string
        try {
            const {stdout, stderr} = await execAsync('npm install ' + modulesString); //Run npm install

            logger.info(`${modules.length} dependencies installed successfully`);

            if (stderr) { logger.debug(`Error installing dependencies: ${stderr}`); } //Output any errors
            logger.on('finish', () => { 
                process.exit(0);  // Exit after logs are flushed
            });
        }
        catch (error: any) { //Error installing dependencies
            logger.info("Error installing dependencies");
            if(error.stdout) { logger.debug(`Output:\n${error.stdout}`); } //Output the results from npm install
            if(error.stderr) { logger.debug(`Errors:\n${error.stderr}`); } //Output any errors
            logger.on('finish', () => {
                process.exit(1);  // Exit after logs are flushed
            });
        }
    });

program
    .command('test')
    .description("Run test cases")
    .action (async () => {
        logger.info("Running test cases");
        //Run test cases through Jest
        try {
            const {stdout, stderr} = await execAsync('npx jest'); //Run test cases
            logger.info("Test Output: \n", stdout); //Output the results from jest
            if (stderr) { logger.debug(`Test Errors:\n${stderr}`); } //Output any errors
            logger.info("Test cases ran successfully");
            logger.on('finish', () => {
                process.exit(0);
            });

        } catch (error: any) { //test cases failed
            logger.info('Error running test cases');
            if(error.stdout) { logger.debug(`Test Output:\n${error.stdout}`); } //Output the results from jest
            if(error.stderr) { logger.debug(`Test Errors:\n${error.stderr}`); } //Output any errors
            logger.on('finish', () => {
                process.exit(1);  
            });
        }
    });

program
    .argument("<urlFile>", "Path to the URL file")
    .description("Process a url file")
    .action((urlFile) => {
        logger.info(`Processing URLS from file: ${urlFile}`);
        // Process the file using the URL handling function

        if (!fs.existsSync(urlFile)) { //Check if the file exists
            logger.info("File does not exist");
            logger.on('finish', () => {process.exit(1);});
        }

        //Read the file and process URLs
        try {
            const fileContents = fs.readFileSync(urlFile, 'utf-8'); //Read the file
            const urls = fileContents.split('\n'); //Split the file contents by new line

            logger.debug(`Found ${urls.length} URLs in the file.`);

            urls.forEach((url, index) => {
                logger.debug(`Processing URL: ${url}`);
                //Url processing logic here
            });

            logger.info("URLs processed successfully");
            logger.on('finish', () => {
                process.exit(0);
            });

        } catch (error: any) { //Error reading the file
            logger.info("Error reading the file");
            logger.debug(`Error: ${error.message}`);
            logger.on('finish', () => {
                process.exit(1);
            });
        }
    });

//Handle unknown commands
program.on('command:*', () => {
    logger.info('error: unknown command');
    logger.on('finish', () => {
        process.exit(1);
    });
});

program.parse(process.argv)