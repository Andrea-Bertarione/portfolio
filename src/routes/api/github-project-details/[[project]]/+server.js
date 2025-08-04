import { json } from '@sveltejs/kit';
import { GITHUB_TOKEN } from '$env/static/private';

/** 
 * GET /api/github-project-details/[project]
 */
export async function GET({ params }) {
  const project = params.project;

  try {
    // Fetch README in HTML format
    const readmeRes = await fetch(`https://api.github.com/repos/Andrea-Bertarione/${project}/readme`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.html'
      }
    });

    let readmeHtml = '';
    if (readmeRes.ok) {
      readmeHtml = await readmeRes.text();
    } else if (readmeRes.status === 404) {
      readmeHtml = '<p>No README found.</p>';
    } else {
      throw new Error('Failed to fetch README');
    }

    // Fetch latest commit (most recent commit)
    const commitsRes = await fetch(`https://api.github.com/repos/Andrea-Bertarione/${project}/commits?per_page=1`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    });

    let latestCommit = null;
    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      if (commits.length > 0) {
        latestCommit = commits[0];
      }
    } else {
      throw new Error('Failed to fetch latest commit');
    }

    // Fetch repository metadata for created and updated dates
    const repoRes = await fetch(`https://api.github.com/repos/Andrea-Bertarione/${project}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    });

    let created_at = null;
    let updated_at = null;
    if (repoRes.ok) {
      const repoData = await repoRes.json();
      created_at = repoData.created_at || null;
      updated_at = repoData.updated_at || null;
    } else {
      // Optionally, handle repo metadata fetch error or ignore
    }

    return json(
      { 
        readmeHtml,
        latestCommit,
        created_at,
        updated_at
      },
      {
        headers: {
          'Cache-Control': 'max-age=300' // Cache for 5 minutes
        }
      }
    );
  } catch (error) {
    return json({ error: error.message || 'Failed to fetch project details' }, { status: 500 });
  }
}
