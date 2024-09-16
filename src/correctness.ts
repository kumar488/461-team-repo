import axios from 'axios';
import logger from './logger';

export async function getCorrectness(ownerName: string, repoName: string, token: string) {
    //const token = process.env.GITHUB_TOKEN;
    let page = 1;
    const perPage = 100; //Max number of issues per page
    let allIssues: any[] = [];
    let hasMoreIssues = true;
    
    // Calculate the date for one month ago
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString();

    try {
        // Fetch all issues page by page until there are no more issues

        logger.debug(`Fetching issues for ${ownerName}/${repoName} since ${lastMonth}`);
        while(hasMoreIssues) {
            logger.debug(`Fetching page ${page} of issues...`);
            const apiURL = `https://api.github.com/repos/${ownerName}/${repoName}/issues?state=all&per_page=${perPage}&page=${page}&since=${lastMonth}`;

            const response = await axios.get(apiURL, {
                headers: {
                    Authorization: `token ${token}`
                }
            });

        const issues = response.data;
        logger.debug(`Fetched ${issues.length} issues`);
        
        //Filtering out pull requests
        const actualIssues = issues.filter((issue: any) => !issue.pull_request);
        logger.debug(`Found ${actualIssues.length} issues after filtering out pull requests`);

        // Append to allIssues array
        allIssues = [...allIssues, ...actualIssues];

        if (issues.length < perPage) {
            hasMoreIssues = false;
        } else {
            page++; //Move to the next page
        }
    }

    const totalIssues = allIssues.length;
    logger.debug(`Total issues found: ${totalIssues}`);

    if (totalIssues === 0) {
        logger.debug("No issues found in the last month");
        return 0; //No issues found
    }

    //count the number of closed issues
    const closedIssues = allIssues.filter((issue: any) => issue.state === 'closed').length;
    logger.debug(`Closed issues found: ${closedIssues}`);

    //Calculate correctness score as a ratio of closed to total issues
    const correctness = closedIssues / totalIssues;
    logger.info(`Correctness score for ${ownerName}/${repoName}: ${correctness}`);
    return correctness;

    } catch (error: any) {
        logger.info("Error fetching issues from GitHub");
        logger.error('Error Details: ${error.message}');
        return null;
    }
}