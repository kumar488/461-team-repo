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


// To Do:
// [1] Download a repository from GitHub




// Read through directory, read through every folder, and check if it contains README.md
// If it does, read the README file and check if it contains any of the sections mentioned above

// Funtion to read all the files in a directory
const fs = require('fs');
const path = require('path');

// Function to read all the files in a directory
// If it is a folder, save to the fol
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

// Call the function to read all the files in the directory
// Use './' to read the current directory
// Use '../' to read the parent directory
const dirPath = path.join(__dirname, '../');
const files = readFiles(dirPath);

// Print 'files' to terminal
console.log(files);

// Call the function to check if the README.md contains any of the sections mentioned above
// Print the score to the terminal
const score = checkSections(files);
console.log(score);


// To Do:
// [2] Delete the repository from the local machine
