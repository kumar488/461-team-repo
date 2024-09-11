import {Command} from 'commander';
import {exec} from "child_process" //Import to run shell commands
import {promisify} from "util" //Use promisfy to use async/wait

const execAsync = promisify(exec);

const program = new Command();

program
    .name("run")

program
    .command('install')
    .description('Install dependencies')
    .action(() => {
        console.log("Installing dependencies...");
        // Install required libraries
        process.exit(0)
    });

program
    .command('test')
    .description("Run test cases")
    .action (async () => {
        console.log("Running test cases");
        //Run test cases through Jest
        try {
            const {stdout, stderr} = await execAsync('npx jest'); //Run test cases
            console.log("Test Output: \n", stdout); //Output the results from jest
            console.error("Test Errors:\n", stderr); //Output any errors
            console.log("Test cases ran successfully");
            process.exit(0) //Code ran successfully

        } catch (error: any) { //test cases failed
            console.error('Error running test cases');
            console.log("Test Output:\n", error.stdout); //Output the results from jest
            console.error("Test Errors:\n", error.stderr); //Output any errors
            process.exit(1);
        }
    });

program
    .command("process <urlFile>")
    .description("Process a url file")
    .action((urlFile) => {
        console.log(`Processing URLS from file: ${urlFile}`);
        // Process the file using the URL handling
        process.exit(0)
    });

//Handle unknown commands
program.on('command:*', () => {
    console.error('error: unknown command');
    process.exit(1); //exit with error
});

program.parse(process.argv)