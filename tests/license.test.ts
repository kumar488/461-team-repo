import { getLicense, checkLicenseCompatibility, deleteRepo, cloneRepo } from '../src/license2'; // Import your getLicense function
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

describe('getLicense', () => {
    jest.setTimeout(240000); //set timeout to 60 seconds

    it('should return true for LGPLv2.1', () => {
        const content = 'GNU Lesser General Public License v2.1';
        const result = checkLicenseCompatibility(content);
        expect(result).toBe(true);
    });

    // Test case: Compatible with GPLv2
    it('should return true for GPLv2', () => {
        const content = 'GNU General Public License v2.0';
        const result = checkLicenseCompatibility(content);
        expect(result).toBe(true);
    });

    // Test case: Compatible with MIT License
    it('should return true for MIT License', () => {
        const content = 'MIT License';
        const result = checkLicenseCompatibility(content);
        expect(result).toBe(true);
    });

    // Test case: Compatible with BSD 2-Clause License
    it('should return true for BSD 2-Clause License', () => {
        const content = 'BSD 2-Clause License';
        const result = checkLicenseCompatibility(content);
        expect(result).toBe(true);
    });

    // Test case: Compatible with BSD 3-Clause License
    it('should return true for BSD 3-Clause License', () => {
        const content = 'BSD 3-Clause License';
        const result = checkLicenseCompatibility(content);
        expect(result).toBe(true);
    });

    // Test case: Compatible with Apache License 2.0
    it('should return true for Apache License 2.0', () => {
        const content = 'Apache License 2.0';
        const result = checkLicenseCompatibility(content);
        expect(result).toBe(true);
    });

    // Test case: Incompatible license
    it('should return false for an incompatible license', () => {
        const content = 'Proprietary License';
        const result = checkLicenseCompatibility(content);
        expect(result).toBe(false);
    });

    it('should throw an error when given invalid repo', async () => {
        const invalidRepo = 'invalidRepo';
        const invalidOwner = 'invalidOwner';

        await expect(cloneRepo(invalidOwner, invalidRepo))
          .rejects
          .toThrow(); 
    });

    it('should run without throwing an error', async () => {
        const repoName = 'repo';

        // Call deleteRepo and check if it resolves without throwing an error
        await expect(deleteRepo(repoName)).resolves.not.toThrow();
    });

});