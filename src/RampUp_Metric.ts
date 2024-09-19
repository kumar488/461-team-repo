const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Placeholder for the GitHub token
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';

// If authentication is not needed, set Authorization_Needed to false
// If authentication is needed, set Authorization_Needed to true
const Authorization_Needed = false;

(async () => {
    const fetch = (await import('node-fetch')).default;
    
    // Now you can use fetch
    fetch('https://api.github.com')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    })();

// Import the adm-zip module


// Milestone: 3
// Task 2:  - Implement Ramp-Up Metric
//          - Create Unit Test Cases
// Creation date: 10.16.2020
// Last modified: 10.16.2020

/*

/ To Do:
// Download a repository from GitHub
// Delete the repository from the local machine
// Implement the function to download the repository from GitHub
// Implement the function to delete the repository from the local machine

Ramp Up:
We can look at the documentation and check if it contains helpful sections
like installation, examples, troubleshooting, FAQ, etc in the README.

Havine more sections will give a higher score since it gives more information 
to new users.

The score will be normalized to fall between 0 and 1.

Sections that are considered helpful are:
- Table of [Cc]ontents 
- Installation
- Examples
- Troubleshooting
- FAQ
- Key [Ff]eatures
- Features
- Version [Ss]upport
- Support
- Usage
- License
- Known [Ii]ssues
- Commands
- Setup
- Getting [Ss]tarted
- Settings
- Configuration
- Dependencies
- Roadmap
- Development
- Debugging
- Testing
- Details
- Building
- Legal
- Changelog

The formula to calculate the score is:
score = (actual number of sections) / (expected number of sections)

*/

// Expected number of sections
const expectedSections = 20;

// Function to get the default branch of a GitHub repository
// Needed to make sure we download the correct branch
// Because SOME people decide to use names other than 'main'
async function getDefaultBranch(repoUrl) {
    var response;

    // Parse the repository URL to get the username and repository name
    const urlParts = new URL(repoUrl);
    // Split the pathname by '/' and remove any empty strings
    const [username, repo] = urlParts.pathname.split('/').filter(Boolean);
    // Construct the API URL to get the repository info
    const apiUrl = `https://api.github.com/repos/${username}/${repo}`;
    
    // Fetch the repository info
    // Add the GitHub token if authenticated requests are needed. Go to top of file to set the token.
    if (Authorization_Needed) {
        response = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });
    }
    else {
        response = await fetch(apiUrl);
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch repository info: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.default_branch;
}

// To Do:
// [1] Download a repository from GitHub
// Function to downloads a GitHub repository as a zip and extracts it to the specified directory.
async function downloadGitHubRepo(repoUrl, destinationFolder) {
    try {
        // Get the default branch name
        const defaultBranch = await getDefaultBranch(repoUrl);
        
        // Construct the URL to download the repository as a zip file
        const repoZipUrl = `${repoUrl}/archive/refs/heads/${defaultBranch}.zip`;

        // Fetch the zip file from GitHub
        const response = await fetch(repoZipUrl);
        if (!response.ok) {
            throw new Error(`Failed to download repository: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        
        // Write the zip file to a temporary location
        const zipFilePath = path.join(destinationFolder, 'repo.zip');
        fs.writeFileSync(zipFilePath, Buffer.from(buffer));
        
        // Extract the zip file
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(destinationFolder, true);
        
        // Remove the zip file after extraction
        fs.unlinkSync(zipFilePath);
        
        console.log(`Repository downloaded and extracted to ${destinationFolder}`);
    } catch (error) {
        console.error(`Error downloading repository: ${error}`);
    }
}


// Read through directory, read through every folder, and check if it contains README.md
// If it does, read the README file and check if it contains any of the sections mentioned above

// Function to read all the files in a directory
function readFiles(dirPath) {
    var files = fs.readdirSync(dirPath);

    // console.log(files);

    // Read current directory and check if README.md exists
    if (files.includes('README.md')) {
        files = ['README.md', dirPath];
    }
    // If README.md does not exist in the current directory, read through all the folders until it is found
    // If not found, return false (no README.md found)
    else {
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                files = readFiles(filePath);
                if(files.includes('README.md') == false) {
                    files = false;
                }
            }
        }
    }
    return files;
}

// Open README.md and check if it contains any of the sections mentioned above
// If it does, increment the score
// If it does not, do nothing
// Return the score
function checkSections(files) {
    console.log(files);
    // Find the index of README.md

    // Read the README.md file

    const content = fs.readFileSync(path.join(files[1], files[0]), 'utf8');

    
    console.log(content);

    let score = 0;
    const sections = [  'Table of Contents', 'Table of contents', 'Installation', 'Examples', 'Troubleshooting', 
                        'FAQ', 'Key features', 'Key features', 'Features', 'Version Support', 'Version support', 
                        'Support', 'Usage', 'License', 'Known Issues', 'Known issues', 'Commands', 'Setup', 
                        'Getting Started', 'Getting started', 'Settings', 'Configuration', 'Dependencies', 'Roadmap', 
                        'Development', 'Debugging', 'Testing', 'Details', 'Building', 'Legal', 'Changelog'];
    for (const section of sections) {
        if (content.includes(section)) {
            score++;
        }
    }
    // Return a float between 0 and 1
    return (score / expectedSections);
}



// To Do:
// [2] Delete the repository from the local machine
// Deletes the specified folder and its contents.
function deleteFolder(folderPath) {
    try {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`Folder ${folderPath} has been deleted.`);
        } else {
            console.log(`Folder ${folderPath} does not exist.`);
        }
    } catch (error) {
        console.error(`Error deleting folder: ${error}`);
    }
}

function test_RampUp() {
    // Call the function to download the repository from GitHub
    downloadGitHubRepo('https://github.com/octocat/Hello-World', './');

    // Call the function to read all the files in the directory
    // Use './' to read the current directory
    // Use '../' to read the parent directory
    // Temporary Local Folder: ./temp_repo
    const dirPath = path.join(__dirname, './');
    console.log(dirPath);
    const files = readFiles(dirPath);

    // If FALSE is returned, no README.md was found
    var score;
    if (files == false) {
        console.log('No README.md found');
        score = 0;
    }
    else {
        // Call the function to check if the README.md contains any of the sections mentioned above
        // Print the score to the terminal
        score = checkSections(files);
        
    }
    console.log("Score:", score);

    setTimeout(() => {
        // Call the function to delete the repository from the local machine
        deleteFolder('./Hello-World-master');
    }
    , 1000);
}



