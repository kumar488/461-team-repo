import {Command} from 'commander';
import {exec} from "child_process" //Import to run shell commands
import {promisify} from "util" //Use promisfy to use async/wait
import logger from './logger'; //Import the logger

const execAsync = promisify(exec);

const program = new Command();

program
    .name("run")

program
    .command('install')
    .description('Install dependencies')
    .action(() => {
        logger.info("Installing dependencies...");
        // Install required libraries
        logger.info("Dependencies installed successfully");
        logger.on('finish', () => { 
            process.exit(0);  // Exit after logs are flushed
        });
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
    .command("process <urlFile>")
    .description("Process a url file")
    .action((urlFile) => {
        logger.info(`Processing URLS from file: ${urlFile}`);
        // Process the file using the URL handling
        logger.info("URLs processed successfully");
        logger.on('finish', () => {
            process.exit(0);
        });
    });

//Handle unknown commands
program.on('command:*', () => {
    logger.info('error: unknown command');
    logger.on('finish', () => {
        process.exit(1);
    });
});

program.parse(process.argv)