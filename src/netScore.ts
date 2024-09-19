//Main Function File

//Handle Input URL File

//Read urls in loop

//Per URL Operations (within loop)
//1. get github repo name and owner (strings)
//      -NOTE: this function will likely need to be async for handleURL.ts
//2. pass repo name and owner into metric scoring functions
//      -only the functions that will use the Github Rest/GraphQL API
//3. metric scoring will return values
//4. calculate net score of package
//5. print output (to CLI)

import {handleURL} from './handleURL' //CONFIRMED NECESSARY
import {getBusFactor} from './busFactor' //CONFIRMED NECESSARY
import * as fs from 'fs' //CONFIRMED NECESSARY
async function main() {
    const GITHUB_TOKEN = `YOUR GITHUB TOKEN HERE`; //enter your own github fine-grained personal access token here
    const f_path = './Sample Url File.txt';
    const f_file = fs.readFileSync(f_path, 'utf-8');
    const lines: string[] = f_file.split(/\r?\n/);
    for (const line of lines) { //for each URL in sample file
        const repoinfo = await handleURL(line);
        if (!repoinfo) {
            console.error ("Error: URL not compatible. Please enter github.com or npmjs.com URL\n");
            return;
        }
        else {
            //Logic for using repoinfo to get bus factor data
            const owner = repoinfo['owner'];
            const repo = repoinfo['repo'];
            console.log('Repo: ', repo, ' Owner: ', owner); //print output for testing purposes
            const busFactor = await getBusFactor(owner, repo, GITHUB_TOKEN);
            if (!busFactor) {
                console.error ("Error: Could not get number of contributors\n");
                return;
            }
            console.log('Has bus factor of ', busFactor.toFixed(2));
        }
    }
}
main();
