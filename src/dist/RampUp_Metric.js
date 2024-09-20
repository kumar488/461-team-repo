var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
// Placeholder for the GitHub token
var GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';
// If authentication is not needed, set Authorization_Needed to false
// If authentication is needed, set Authorization_Needed to true
var Authorization_Needed = false;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var fetch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('node-fetch'); })];
            case 1:
                fetch = (_a.sent())["default"];
                // Now you can use fetch
                fetch('https://api.github.com')
                    .then(function (response) { return response.json(); })
                    .then(function (data) { return console.log(data); })["catch"](function (error) { return console.error('Error:', error); });
                return [2 /*return*/];
        }
    });
}); })();
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
var expectedSections = 20;
// Function to get the default branch of a GitHub repository
// Needed to make sure we download the correct branch
// Because SOME people decide to use names other than 'main'
function getDefaultBranch(repoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, urlParts, _a, username, repo, apiUrl, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    urlParts = new URL(repoUrl);
                    _a = urlParts.pathname.split('/').filter(Boolean), username = _a[0], repo = _a[1];
                    apiUrl = "https://api.github.com/repos/" + username + "/" + repo;
                    if (!Authorization_Needed) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch(apiUrl, {
                            headers: {
                                'Authorization': "token " + GITHUB_TOKEN
                            }
                        })];
                case 1:
                    response = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fetch(apiUrl)];
                case 3:
                    response = _b.sent();
                    _b.label = 4;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch repository info: " + response.statusText);
                    }
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = _b.sent();
                    return [2 /*return*/, data.default_branch];
            }
        });
    });
}
// To Do:
// [1] Download a repository from GitHub
// Function to downloads a GitHub repository as a zip and extracts it to the specified directory.
function downloadGitHubRepo(repoUrl, destinationFolder) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultBranch, repoZipUrl, response, buffer, zipFilePath, zip, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getDefaultBranch(repoUrl)];
                case 1:
                    defaultBranch = _a.sent();
                    repoZipUrl = repoUrl + "/archive/refs/heads/" + defaultBranch + ".zip";
                    return [4 /*yield*/, fetch(repoZipUrl)];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to download repository: " + response.statusText);
                    }
                    return [4 /*yield*/, response.arrayBuffer()];
                case 3:
                    buffer = _a.sent();
                    zipFilePath = path.join(destinationFolder, 'repo.zip');
                    fs.writeFileSync(zipFilePath, Buffer.from(buffer));
                    zip = new AdmZip(zipFilePath);
                    zip.extractAllTo(destinationFolder, true);
                    // Remove the zip file after extraction
                    fs.unlinkSync(zipFilePath);
                    console.log("Repository downloaded and extracted to " + destinationFolder);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error downloading repository: " + error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
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
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var filePath = path.join(dirPath, file);
            var stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                files = readFiles(filePath);
                if (files.includes('README.md') == false) {
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
    var content = fs.readFileSync(path.join(files[1], files[0]), 'utf8');
    console.log(content);
    var score = 0;
    var sections = ['Table of Contents', 'Table of contents', 'Installation', 'Examples', 'Troubleshooting',
        'FAQ', 'Key features', 'Key features', 'Features', 'Version Support', 'Version support',
        'Support', 'Usage', 'License', 'Known Issues', 'Known issues', 'Commands', 'Setup',
        'Getting Started', 'Getting started', 'Settings', 'Configuration', 'Dependencies', 'Roadmap',
        'Development', 'Debugging', 'Testing', 'Details', 'Building', 'Legal', 'Changelog'];
    for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
        var section = sections_1[_i];
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
            console.log("Folder " + folderPath + " has been deleted.");
        }
        else {
            console.log("Folder " + folderPath + " does not exist.");
        }
    }
    catch (error) {
        console.error("Error deleting folder: " + error);
    }
}
function test_RampUp() {
    // Call the function to download the repository from GitHub
    downloadGitHubRepo('https://github.com/octocat/Hello-World', './');
    // Call the function to read all the files in the directory
    // Use './' to read the current directory
    // Use '../' to read the parent directory
    // Temporary Local Folder: ./temp_repo
    var dirPath = path.join(__dirname, './');
    console.log(dirPath);
    var files = readFiles(dirPath);
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
    setTimeout(function () {
        // Call the function to delete the repository from the local machine
        deleteFolder('./Hello-World-master');
    }, 1000);
}
