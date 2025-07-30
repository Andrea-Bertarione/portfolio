import { json } from '@sveltejs/kit';
import { GITHUB_TOKEN } from '$env/static/private';

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/users/Andrea-Bertarione/repos?sort=updated&per_page=50', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Andrea-Portfolio'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    
    // Filter and enhance the data
    const projects = repos
      .filter(repo => !repo.fork && !repo.archived && repo.description)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        topics: repo.topics || [],
        language: repo.language,
        stars: repo.stargazers_count,
        demo: repo.homepage,
        github: repo.html_url,
        updated: repo.updated_at
      }))
      .slice(0, 12); // Limit to 12 projects

    return json(projects, {
      headers: {
        'Cache-Control': 'max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    return json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
