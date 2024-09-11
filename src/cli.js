"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const child_process_1 = require("child_process"); //Import to run shell commands
const util_1 = require("util"); //Use promisfy to use async/wait
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const program = new commander_1.Command();
program
    .name("run");
program
    .command('install')
    .description('Install dependencies')
    .action(() => {
    console.log("Installing dependencies...");
    // Install required libraries
    process.exit(0);
});
program
    .command('test')
    .description("Run test cases")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running test cases");
    //Run test cases through Jest
    try {
        const { stdout, stderr } = yield execAsync('npx jest'); //Run test cases
        console.log("Test Output: \n", stdout); //Output the results from jest
        console.error("Test Errors:\n", stderr); //Output any errors
        console.log("Test cases ran successfully");
        process.exit(0); //Code ran successfully
    }
    catch (error) { //test cases failed
        console.error('Error running test cases');
        console.log("Test Output:\n", error.stdout); //Output the results from jest
        console.error("Test Errors:\n", error.stderr); //Output any errors
        process.exit(1);
    }
}));
program
    .command("process <urlFile>")
    .description("Process a url file")
    .action((urlFile) => {
    console.log(`Processing URLS from file: ${urlFile}`);
    // Process the file using the URL handling
    process.exit(0);
});
//Handle unknown commands
program.on('command:*', () => {
    console.error('error: unknown command');
    process.exit(1); //exit with error
});
program.parse(process.argv);
