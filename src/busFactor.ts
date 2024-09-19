import axios from 'axios';
export async function getBusFactor(owner: string, repo: string, pat: string): Promise<number | null> {
    try {
      const response = await axios.get('https://api.github.com/repos/' + owner + '/' + repo + '/contributors', {
        headers: {
          'Authorization': 'token ' + pat,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          per_page: 100,
          page: 1
        }
      });
      const numContributors = response.data.length;
      const minAcceptableContributors = 10;
      const maxAcceptableContributors = 100;
      const busFactor = (numContributors - minAcceptableContributors) / (maxAcceptableContributors - minAcceptableContributors);
      return busFactor;
    }
    catch (error) {
      console.error(`Error fetching repository info: ${error}`);
      return null;
    }
}