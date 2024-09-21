import axios from "axios";
import fs from "fs";
import path from "path";
import logger from "./logger";
import util from "util";
import { exec } from "child_process";

const execAsync = util.promisify(exec);

export async function getLicense(ownerName: string, repoName: string): Promise<number> {
    let cloneDir = '';

    try {
        // Clone the repository into the licenseRepos folder
        cloneDir = await cloneRepo(ownerName, repoName);

        // Check for LICENSE file
        const licensePath = path.join(cloneDir, 'LICENSE');
        if (fs.existsSync(licensePath)) {
            const licenseContent = fs.readFileSync(licensePath, 'utf-8');
            logger.debug(`LICENSE file found for ${ownerName}/${repoName}`);
            return checkLicenseCompatibility(licenseContent) ? 1 : 0;
        }

        // Check for README.md file
        const readmePath = path.join(cloneDir, 'README.md');
        if (fs.existsSync(readmePath)) {
            const readmeContent = fs.readFileSync(readmePath, 'utf-8');
            logger.debug(`README.md file found for ${ownerName}/${repoName}`);
            return checkLicenseCompatibility(readmeContent) ? 1 : 0;
        }

        // If neither file is found, return 0 (incompatible)
        logger.debug(`No LICENSE or README.md file found for ${ownerName}/${repoName}`);
        return 0;

    } catch (error: any) {
        logger.info('Error occurred while getting license');
        logger.debug(`Error details: ${error.message}`);
        return 0;
    } finally {
        // Clean up the cloned repository
        if (cloneDir) {
            await deleteRepo(repoName); // Pass repoName to deleteRepo, not cloneDir
        }
    }
}

export function checkLicenseCompatibility(content: string) {
    const compatibleLicensesRegex = /LGPLv2\.1|Lesser General Public License v2\.1|GPLv2|General Public License v2|MIT License|BSD 2-Clause License|BSD 3-Clause License|Apache License 2\.0/i;
    const isCompatible = compatibleLicensesRegex.test(content);
    logger.debug(`License compatibility: ${isCompatible ? 'Compatible' : 'Incompatible'}`);
    return isCompatible;
}

// Function to clone a GitHub repo
export async function cloneRepo(ownerName: string, repoName: string): Promise<string> {
    const repoUrl = `https://github.com/${ownerName}/${repoName}.git`;
    const licenseReposDir = path.join(__dirname, 'licenseRepos');
    const cloneDir = path.join(licenseReposDir, repoName);

    try {
        // Ensure the licenseRepos directory exists, if not, create it
        if (!fs.existsSync(licenseReposDir)) {
            fs.mkdirSync(licenseReposDir);
            logger.info(`Created directory: ${licenseReposDir}`);
        }

        logger.debug(`Cloning repository from ${repoUrl} into ${cloneDir}...`);
        await execAsync(`git clone --no-checkout ${repoUrl} ${cloneDir}`);
        await execAsync(`cd ${cloneDir} && git sparse-checkout init --cone`);
        await execAsync(`cd ${cloneDir} && git sparse-checkout set LICENSE README.md`);
        await execAsync(`cd ${cloneDir} && git checkout`);
        logger.info(`Repository cloned successfully to ${cloneDir}`);
        return cloneDir;
    } catch (error: any) {
        logger.info(`Error cloning repository: ${error.message}`);
        throw error;
    }
}

export async function deleteRepo(repoName: string) {
    const cloneDir = path.join(__dirname, 'licenseRepos', repoName);

    try {
        logger.debug(`Deleting cloned repository at ${cloneDir}...`);
        await fs.promises.rm(cloneDir, { recursive: true, force: true });
        logger.info(`Repository deleted successfully at ${cloneDir}`);
    } catch (error: any) {
        logger.info(`Error deleting repository: ${error.message}`);
        throw error;
    }
}