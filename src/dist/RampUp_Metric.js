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
exports.__esModule = true;
exports.getRampUp = exports.test_RampUp = exports.deleteFolder = exports.checkSections = exports.readFiles = exports.downloadGitHubRepo = void 0;
var logger_1 = require("./logger");
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
var axios = require('axios');
// Placeholder for the GitHub token
var GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';
// If authentication is not needed, set Authorization_Needed to false
// If authentication is needed, set Authorization_Needed to true
var Authorization_Needed = false;
// logger.info(`Currently, Authorization Needed is set to: ${Authorization_Needed}`);
// logger.info("If authorization is needed, please set the GITHUB_TOKEN at the top of the file and Authorization_Needed to true.");
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
var expectedSections = 26;
// logger.info(`Expected number of sections: ${expectedSections}`);
// Function to get the default branch of a GitHub repository
// Needed to make sure we download the correct branch
// Because SOME people decide to use names other than 'main'
function getDefaultBranch(repoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, urlParts, _a, username, repo, apiUrl, data, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    urlParts = new URL(repoUrl);
                    _a = urlParts.pathname.split('/').filter(Boolean), username = _a[0], repo = _a[1];
                    apiUrl = "https://api.github.com/repos/" + username + "/" + repo;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    if (!Authorization_Needed) return [3 /*break*/, 3];
                    return [4 /*yield*/, axios.get(apiUrl, {
                            headers: {
                                'Authorization': "token " + GITHUB_TOKEN
                            }
                        })];
                case 2:
                    response = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, axios.get(apiUrl)];
                case 4:
                    response = _b.sent();
                    _b.label = 5;
                case 5:
                    data = response.data;
                    return [2 /*return*/, data.default_branch];
                case 6:
                    error_1 = _b.sent();
                    // console.log(`Error fetching default branch: ${error}`);
                    logger_1["default"].debug("Error fetching default branch: " + error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function downloadGitHubRepo(repoUrl, destinationFolder) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultBranch, urlParts, repoName, pathDefaultBranch, downloadUrl, response, zip, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (repoUrl == null) {
                        logger_1["default"].debug('Repository URL is null');
                        return [2 /*return*/];
                    }
                    else if (destinationFolder == null) {
                        logger_1["default"].debug('Destination folder is null');
                        return [2 /*return*/];
                    }
                    else if (repoUrl == "Skip") {
                        // Skip the download
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, getDefaultBranch(repoUrl)];
                case 2:
                    defaultBranch = _a.sent();
                    urlParts = new URL(repoUrl);
                    repoName = urlParts.pathname.split('/').filter(Boolean).pop();
                    pathDefaultBranch = "./" + repoName + "-" + defaultBranch;
                    downloadUrl = repoUrl + "/archive/" + defaultBranch + ".zip";
                    return [4 /*yield*/, axios.get(downloadUrl, {
                            responseType: 'arraybuffer'
                        })];
                case 3:
                    response = _a.sent();
                    // console.log(`Repository zip fetched`);
                    // Write the zip to a file
                    fs.writeFileSync(pathDefaultBranch + ".zip", response.data);
                    zip = new AdmZip(pathDefaultBranch + ".zip");
                    zip.extractAllTo(destinationFolder, true);
                    // console.log(`Repository downloaded and extracted to ${destinationFolder}`);
                    // Delete the zip file
                    fs.rmSync(pathDefaultBranch + ".zip");
                    // console.log(`Repository zip deleted`);
                    // Return the path to the extracted folder
                    logger_1["default"].info("Repository downloaded and extracted to " + destinationFolder);
                    return [2 /*return*/, pathDefaultBranch];
                case 4:
                    error_2 = _a.sent();
                    // console.log(`Error downloading repository: ${error}`);
                    logger_1["default"].debug("Error downloading repository: " + error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.downloadGitHubRepo = downloadGitHubRepo;
function readFiles(dirPath) {
    var files = fs.readdirSync(dirPath);
    console.log("Reading files from " + dirPath);
    // Read current directory and check if README.md exists
    if (files.includes('README.md')) {
        return ['README.md', dirPath];
    }
    // If README.md does not exist in the current directory, read through all the folders until it is found
    // If not found, return 'false' (no README.md found)
    else {
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var filePath = path.join(dirPath, file);
            var stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                var dir_files = readFiles(filePath);
                if (dir_files.includes('README.md')) {
                    return ['README.md', filePath];
                }
            }
        }
    }
    return 'false';
}
exports.readFiles = readFiles;
function checkSections(files) {
    // If files doesn't exist, return 0
    console.log('files: ' + files);
    if (files == null) {
        console.log("No files found in the directory");
        return 0;
    }
    // If README.md wasn't found, return 0
    else if (files == "false") {
        console.log("No README.md found");
        return 0;
    }
    console.log("Reading README.md from " + files[1] + "/" + files[0]);
    var content = fs.readFileSync(path.join(files[1], files[0]), 'utf8');
    console.log("README.md read");
    var score = 0;
    var sections = ['Table of Contents', 'Table of contents', 'Installation', 'Examples', 'Troubleshooting',
        'FAQ', 'Key Features', 'Key features', 'Features', 'Version Support', 'Version support',
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
    // logger.info(`Ramp up score: ${score / expectedSections}`);
    console.log('Count of sections: ' + score);
    return (score / expectedSections).toFixed(2);
}
exports.checkSections = checkSections;
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
exports.deleteFolder = deleteFolder;
function test_RampUp(url) {
    return __awaiter(this, void 0, void 0, function () {
        var filetoDelete, dirPath, files, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, downloadGitHubRepo(url, './')];
                case 1:
                    filetoDelete = _a.sent();
                    // logger.info(`Repository downloaded and extracted to ${filetoDelete}`);
                    // Wait for 1 second before reading the files
                    // This is to make sure the files are extracted before reading them
                    setTimeout(function () { }, 2000);
                    dirPath = path.join(__dirname, './');
                    files = readFiles(dirPath);
                    score = checkSections(files);
                    setTimeout(function () {
                        // Call the function to delete the repository from the local machine
                        deleteFolder(filetoDelete);
                    }, 1000);
                    // logger.info(`Ramp up score for ${url}: ${score}`);
                    console.log("Ramp up score for " + url + ": " + score);
                    return [2 /*return*/, score];
            }
        });
    });
}
exports.test_RampUp = test_RampUp;
function getRampUp(ownerName, repoName, token) {
    return __awaiter(this, void 0, void 0, function () {
        var filetoDelete_1, dirPath, files, score, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, downloadGitHubRepo(repoName, './')];
                case 1:
                    filetoDelete_1 = _a.sent();
                    dirPath = path.join(__dirname, './');
                    files = readFiles(dirPath);
                    score = checkSections(files);
                    setTimeout(function () {
                        deleteFolder(filetoDelete_1);
                    }, 1000);
                    // logger.info(`Ramp up score for ${ownerName}/${repoName}: ${score}`);
                    return [2 /*return*/, score];
                case 2:
                    error_3 = _a.sent();
                    // logger.info('Error fetching and calculating ramp up score');
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getRampUp = getRampUp;
// test_RampUp("https://github.com/cloudinary/cloudinary_npm");
// test_RampUp("https://github.com/octocat/Hello-World/");
// test_RampUp("https://github.com/nullivex/nodist");
// test_RampUp("https://github.com/lodash/lodash");
