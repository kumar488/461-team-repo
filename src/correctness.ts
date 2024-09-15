import axios from 'axios';
import {config} from 'dotenv';
import logger from './logger';

config();

export async function getCorrectness(ownerName: string, repoName: string) {
    const token = process.env.GITHUB_TOKEN;
    let page = 1;
    const perPage = 100; //Max number of issues per page
    const totalFetch = 200; //Number of issues to fetch
    let allIssues: any[] = [];
    let hasMoreIssues = true;
    
    // Calculate the date for one month ago
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString();

    try {
        // Fetch all issues page by page until there are no more issues
        while(hasMoreIssues) {
            const apiURL = `https://api.github.com/repos/${ownerName}/${repoName}/issues?state=all&per_page=${perPage}&page=${page}&since=${lastMonth}`;

            const response = await axios.get(apiURL, {
                headers: {
                    Authorization: `token ${token}`
                }
            });

        const issues = response.data;
        
        //Filtering out pull requests
        const actualIssues = issues.filter((issue: any) => !issue.pull_request);

        // Append to allIssues array
        allIssues = [...allIssues, ...actualIssues];

        if (issues.length < perPage) {
            hasMoreIssues = false;
        } else {
            page++; //Move to the next page
        }
    }

    const totalIssues = allIssues.length;

    if (totalIssues === 0) {
        return 0; //No issues found
    }

    //count the number of closed issues
    const closedIssues = allIssues.filter((issue: any) => issue.state === 'closed').length;

    //Calculate correctness score as a ratio of closed to total issues
    const correctness = closedIssues / totalIssues;
    return correctness;

    } catch (error) {
        logger.error("Error fetching issues from GitHub");
        return null;
    }
}