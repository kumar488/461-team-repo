import axios from 'axios';

import fetch from 'node-fetch';

async function fetchReadme(repoUrl: string): Promise<string | null> {
    // Extract the user/repo format from the URL
    const regex = /github\.com\/([^\/]+\/[^\/]+)\/?$/;
    const match = repoUrl.match(regex);
    
    if (!match) {
        console.error('Invalid GitHub repository URL');
        return null;
    }
    
    const repo = match[1];
    const readmeUrl = `https://raw.githubusercontent.com/${repo}/main/README.md`;

    try {
        const response = await fetch(readmeUrl);
        if (!response.ok) {
            throw new Error(`Error fetching README: ${response.statusText}`);
        }
        const readmeText = await response.text();
        return readmeText;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchLicense(repoUrl: string): Promise<string | null> {
    // Extract the user/repo format from the URL
    const regex = /github\.com\/([^\/]+\/[^\/]+)\/?$/;
    const match = repoUrl.match(regex);
    
    if (!match) {
        console.error('Invalid GitHub repository URL');
        return null;
    }
    
    const repo = match[1];
    const licenseUrl = `https://raw.githubusercontent.com/${repo}/main/LICENSE`;

    try {
        const response = await fetch(licenseUrl);
        if (!response.ok) {
            throw new Error(`Error fetching license: ${response.statusText}`);
        }
        const licenseText = await response.text();
        return licenseText;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function containsLicensePhrase(readme: string, phrase: string): boolean {
    const regex = new RegExp(phrase, 'i'); // case-insensitive search
    return regex.test(readme);
}

async function checkLicenseInReadme(repoUrl: string) {
    const readme = await fetchReadme(repoUrl);
    const license = await fetchLicense(repoUrl);
    if (readme) {
        const hasLicenseR = containsLicensePhrase(readme, 'MIT License');
        console.log(`The README ${hasLicenseR ? 'contains' : 'does not contain'} the phrase "MIT License".`);
        if ((!hasLicenseR) && license) {
            const hasLicenseL = containsLicensePhrase(license, 'MIT License');
            console.log(`The LICENSE ${hasLicenseL ? 'contains' : 'does not contain'} the phrase "MIT License".`);
        }
    }
    
}

// Example usage
//const repositoryUrl = 'https://github.com/someuser/somerepo';
//checkLicenseInReadme(repositoryUrl);