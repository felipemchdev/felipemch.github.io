// Note: This API will be replaced by use cache when it reaches stability.
import { unstable_cache } from 'next/cache';

const revalidate = 60;
const MINUTES_5 = 60 * 5;
const HOURS_1 = 60 * 60;
const HOURS_12 = 60 * 60 * 12;

// TODO: Implement option to switch between info for authenticated user and other users.
export async function getUser(username) {
    console.log('Fetching user data for', username);
    console.time('getUser');
    const res = await fetch('https://api.github.com/users/' + username, {
        headers: { Authorization: `token ${process.env.GH_TOKEN}` },
        next: { revalidate }
    });
    console.timeEnd('getUser');
    return res.json();
}

export async function getRepos(username) {
    console.log('Fetching repos for', username);
    console.time('getRepos');
    const res = await fetch('https://api.github.com/users/' + username + '/repos', {
        headers: { Authorization: `token ${process.env.GH_TOKEN}` },
        next: { revalidate: HOURS_1 }
    });
    if (!res.ok) {
        console.error('GitHub API returned an error.', res.status, res.statusText);
        return [];
    }
    console.timeEnd('getRepos');
    return res.json();
}

export async function getSocialAccounts(username) {
    console.log('Fetching social accounts for', username);
    console.time('getSocialAccounts');
    const res = await fetch('https://api.github.com/users/' + username + '/social_accounts', {
        headers: { Authorization: `token ${process.env.GH_TOKEN}` },
        next: { revalidate: HOURS_12 }
    });
    console.timeEnd('getSocialAccounts');
    return res.json();
}

export const getPinnedRepos = unstable_cache(async (username) => {
    console.log('Fetching pinned repos for', username);
    console.time('getPinnedRepos');
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `token ${process.env.GH_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `{user(login: "${username}") {pinnedItems(first: 6, types: REPOSITORY) {nodes {... on Repository {name}}}}}` }),
    });
    if (!res.ok) {
        console.error('GitHub graphql returned an error.', res.status, res.statusText);
        return [];
    }
    const pinned = await res.json();
    console.timeEnd('getPinnedRepos');
    const names = pinned.data.user.pinnedItems.nodes.map((node) => node.name);
    return names;
}, ['getPinnedRepos'], { revalidate: HOURS_12 });

export const getUserOrganizations = unstable_cache(async (username) => {
    console.log('Fetching organizations for', username);
    console.time('getUserOrganizations');
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `token ${process.env.GH_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `{user(login: "${username}") {organizations(first: 6) {nodes {name,websiteUrl,url,avatarUrl,description}}}}`
        }),
    });
    console.timeEnd('getUserOrganizations');
    const orgs = await res.json();

    if (!res.ok) {
        console.error('GitHub graphql returned an error.', res.status, res.statusText, orgs);
        return { data: { user: { organizations: { nodes: [] } } } };
    }
    return orgs;
}, ['getUserOrganizations'], { revalidate: HOURS_12 });

export const getVercelProjects = unstable_cache(async () => {
    console.log('Fetching Vercel projects');
    console.time('getVercelProjects');
    const res = await fetch('https://api.vercel.com/v9/projects?limit=100', {
        headers: { Authorization: `Bearer ${process.env.VC_TOKEN}` },
        next: { revalidate: HOURS_12 }
    });
    console.timeEnd('getVercelProjects');
    return res.json();
});

/** Cache revalidated every 12 hours. */
export const getNextjsLatestRelease = unstable_cache(async () => {
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `token ${process.env.GH_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `{
                repository(name: "next.js", owner: "vercel") {
                    latestRelease {
                        tagName
                    }
                }
            }`
        }),
        next: { revalidate: HOURS_12 },
    });
    if (!res.ok) {
        console.error('GitHub API returned an error.', res.status, res.statusText);
        return [];
    }
    return res.json();
});

export const getRepositoryPackageJson = unstable_cache(async (username, reponame) => {
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `token ${process.env.GH_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `{
                repository(name: "${reponame}", owner: "${username}") {
                    object(expression: "HEAD:package.json") {
                        ... on Blob {
                            text
                        }
                    }
                }
            }`
        }),
        next: { revalidate: HOURS_12 },
    });
    if (!res.ok) {
        console.error('GitHub API returned an error.', res.status, res.statusText);
        return [];
    }
    return res.json();
});

export async function getRecentUserActivity(username) {
    console.log('Fetching recent activity for', username);
    console.time('getRecentUserActivity');
    const res = await fetch('https://api.github.com/users/' + username + '/events?per_page=100', {
        headers: { Authorization: `token ${process.env.GH_TOKEN}` },
        next: { revalidate: MINUTES_5 }
    });
    const response = await res.json();
    let page = 2;
    if (res.headers.get('link')) {
        let nextLink = res.headers.get('link').split(',').find((link) => link.includes('rel="next"'));
        while (nextLink) {
            const nextRes = await fetch('https://api.github.com/users/' + username + '/events?per_page=100&page=' + page, {
                headers: { Authorization: `token ${process.env.GH_TOKEN}` },
                next: { revalidate: MINUTES_5 }
            });
            const nextResponse = await nextRes.json();
            if (nextResponse.message === 'Not Found') {
                break;
            }
            response.push(...nextResponse);
            page++;
            nextLink = nextRes.headers.get('link')?.split(',')?.find((link) => link.includes('rel="next"'));
        }
    }
    console.timeEnd('getRecentUserActivity');
    return response;
}

export const getTrafficPageViews = async (username, reponame) => {
    const res = await fetch('https://api.github.com/repos/' + username + '/' + reponame + '/traffic/views', {
        headers: { Authorization: `token ${process.env.GH_TOKEN}` },
        next: { revalidate: HOURS_1 }
    });
    const response = await res.json();
    return response;
};

export const getDependabotAlerts = unstable_cache(async (username, reponame) => {
    const res = await fetch('https://api.github.com/repos/' + username + '/' + reponame + '/dependabot/alerts', {
        headers: { Authorization: `token ${process.env.GH_TOKEN}` },
        next: { revalidate: HOURS_12 }
    });

    if (!res.ok) {
        console.error('GitHub API returned an error.', res.status, res.statusText);
        return [];
    }

    return res.json();
});

export async function getIsAppLayoutRepo(username, reponame) {
    const urlPagesApp = `https://api.github.com/repos/${username}/${reponame}/contents/app/page.jsx`;
    const urlAppLayout = `https://api.github.com/repos/${username}/${reponame}/contents/app/layout.jsx`;

    try {
        const [ isPagesRes, isAppLayoutRes ] = await Promise.all([
            fetch(urlPagesApp, {
                headers: { Authorization: `token ${process.env.GH_TOKEN}` },
                next: { revalidate: HOURS_1 }
            }),
            fetch(urlAppLayout, {
                headers: { Authorization: `token ${process.env.GH_TOKEN}` },
                next: { revalidate: HOURS_1 }
            }),
        ]);

        const isPages = isPagesRes.status === 200;
        const isAppLayout = isAppLayoutRes.status === 200;

        return isPages && isAppLayout;
    } catch (error) {
        console.error('Error fetching repo contents:', error);
        return false;
    }
}
