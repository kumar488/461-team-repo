import axios from 'axios';
import logger from './logger';

export async function getResponsiveMaintainer(ownerName: string, repoName: string, token:string) {
    const perPage = 100; //Max number of issues per page
    let totalResponseTime = 0;
    let issuesWithResponse = 0;

    try {
        logger.info("Fetching issues for repo: ${ownerName}/${repoName}");

        const apiURL = `https://api.github.com/repos/${ownerName}/${repoName}/issues?state=open&per_page=${perPage}`;

        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `token ${token}`
            }
        });

        const issues = response.data;

        //Iterate over each issue to calculate the response time
        for (const issue of issues) {
            if (issue.pull_request) continue; //Skip pull requests

            const issueCreatedAt = new Date(issue.created_at).getTime();

            const commentsURL = issue.comments_url;
            const commentsResponse = await axios.get(commentsURL, {
                headers: {
                    Authorization: `token ${token}`
                }
            });

            const comments = commentsResponse.data;

            if(comments.length > 0) {
                const firstCommentTime = new Date(comments[0].created_at).getTime();
                const responseTime = (firstCommentTime - issueCreatedAt) / (1000 * 60 * 60); //Convert to hours

                totalResponseTime += responseTime;
                issuesWithResponse++;
                logger.debug(`Issue #${issue.number} has a response time of ${responseTime} hours`);

            }
        }

        if (issuesWithResponse === 0) {
            logger.debug("No issues with response time found");
            return 0; //No issues found
        }

        const avgResponseTime = totalResponseTime / issuesWithResponse;
        logger.debug(`Average response time for ${ownerName}/${repoName}: ${avgResponseTime} hours`);

        const responsiveMaintainerScore = Math.max(0, 1 - (Math.max(0, avgResponseTime - 24) / 24) * 0.25); //Lose points for every day of delay
        logger.info(`Responsive Maintainer score for ${ownerName}/${repoName}: ${responsiveMaintainerScore}`);

        return responsiveMaintainerScore;

    } catch (error : any) {
        logger.info('Error fetching issues');
        logger.debug(`Error details: ${error.message}`);
        return -1; //Error occurred
    }
}