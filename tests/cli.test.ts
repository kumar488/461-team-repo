import {exec} from "child_process"
import {promisify} from "util"

const execAsync = promisify(exec);

describe('CLI Tests', () => { //combines all tests related to the CLI
    //Test install command
    it('should display install message', async () => {
        //const {stdout, stderr} = await execAsync('./run install');
        const {stdout, stderr} = await execAsync('node src/cli.js install'); //Runs the install command 
        expect(stdout).toContain('Installing dependencies...');
        expect(stderr).toBe('');
    });

    //Test process command
    it('should display process message', async () => {
        const {stdout, stderr} = await execAsync('node src/cli.js process urls.txt');
        expect(stdout).toContain('Processing URLS from file: urls.txt');
        expect(stderr).toBe('');
    });

    // //Test invalid command
    // it('should display error message', async () => {
    //     const {stdout, stderr} = await execAsync('node src/cli.js invalid');
    //     //expect(stdout).toBe('');
    //     expect(stderr).toContain('error: unknown command');
    // });

});   

