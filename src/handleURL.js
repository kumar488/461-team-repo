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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleURL = handleURL;
//Please note you will need 'npm install axios'
const axios_1 = __importDefault(require("axios"));
//This function takes in a github repo URL and returns the owner's name and repo's name
function gitURL(url) {
    url = url.replace(/\.git$/, '');
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    if (match && match[1] && match[2]) {
        return { owner: match[1], repo: match[2] };
    }
    return null;
    //NOTE: maybe add a warning/error message here if return null
}
//This function takes in any URL and returns owner's name and repo's name
function handleURL(url) {
    return __awaiter(this, void 0, void 0, function* () {
        //parse for packageName
        const regex = /npmjs\.com\/package\/([^\/]+)/;
        const packageName = url.match(regex);
        if (!(packageName && packageName[1])) {
            // return null;
            const result = gitURL(url);
            if (!result) {
                return null;
            }
            else {
                return result;
            }
        }
        //get axios data
        try {
            const axios_response = yield axios_1.default.get(`https://registry.npmjs.org/${packageName[1]}`);
            const response_data = axios_response.data;
            const unfiltered_URL = response_data.repository.url;
            const result = gitURL(unfiltered_URL);
            return result;
        }
        catch (error) {
            return null;
        }
    });
}
//Additional Functions
//1)Function to handle when a npm url is not hosted on github
//      -process could be handled with convertURL
//          -use regex condition after axios_response line
////////////////TESTING///////////////////////////////////////
// async function main() {
//     const repoinfo = await handleURL('https://www.npmjs.com/package/express');
//     console.log("result",repoinfo);
// }
// main();
