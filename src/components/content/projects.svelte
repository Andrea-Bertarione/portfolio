
<script>
    import { onMount } from 'svelte';

    let projects = $state([]);
    let languages = $state([]);
    let topics = $state([]);

    let selectedLanguage = $state('');
    let selectedTopic = $state('');

    let showHero = $state(false);

    const updateData = async () => {
        const projectsRes = await fetch('/api/github-projects');
        if (projectsRes.ok) {
            projects = await projectsRes.json();
            if (projects.length > 0) {
                languages = [...new Set(projects.map(p => p.language).filter(Boolean))];
                topics = [...new Set(projects.flatMap(p => p.topics || []))];

                if (topics.length > 0) {
                                      
                    projects = projects.map(project => {
                        if (project.topics) {
                            const cleanTopics = [];
                            
                            project.topics.forEach(topic => {
                                if (topic.startsWith("color-")) {
                                    project.color = topic.replace("color-", "#");
                                } else if (topic.startsWith("image-")) {
                                    project.banner = topic.replace("image-", "");
                                } else {
                                    cleanTopics.push(topic);
                                }
                            });
                            
                            project.topics = cleanTopics;
                        }
                        return project;
                    });

                    topics = [...new Set(projects.flatMap(p => p.topics || []))];
                }
            }
        }
    }

    onMount(async () => {
        showHero = true;

        await updateData();
    });
</script>

{#if showHero}
    <section id="Projects" >
        <h2>Dynamic Projects</h2>
        <p><span class="gradient-text">They really are Dynamic</span> 😉</p>
        <div class="filters">
            <div>
                <label for="language">Filter by Language:</label>
                <select id="language" bind:value={selectedLanguage}>
                    <option value="">All</option>
                    {#each languages as language}
                        <option value={language}>{language}</option>
                    {/each}
                </select>
            </div>
            <div>
                <label for="topic">Filter by Topic:</label>
                <select id="topic" bind:value={selectedTopic}>
                    <option value="">All</option>
                    {#each topics as topic}
                        {#if topic && !topic.startsWith("color-") && !topic.startsWith("image-")}
                            <option value={topic}>{topic}</option>
                        {/if}
                    {/each}
                </select>
            </div>
            <div>
                <button onclick={updateData}>Refresh Projects</button>
            </div>
        </div>
        <div class="projects-container">
            {#if projects.length > 0}
                {#each projects as project}
                    <div class="project-card" style="background: {project.color} ; display: {(!selectedLanguage || project.language === selectedLanguage) && (!selectedTopic || project.topics?.includes(selectedTopic)) ? 'flex' : 'none'};">
                        <h3>{project.name}</h3>
                        {#if project.banner}
                            <img src="/{project.banner}.svg" alt={project.name} style="width: 100%; height: auto; border-radius: 8px;">
                        {/if}
                        <p>{project.description}</p>
                        <div>
                            <a class="project-link" href={project.html_url} target="_blank">View on GitHub</a>
                        </div>
                        <div class="topics">
                            <ul>
                                {#if project.language}
                                    <li class="language-bubble">{project.language}</li>
                                {/if}
                                {#if project.topics && project.topics.length > 0}
                                    {#each project.topics as topic}
                                        {#if topic && !topic.startsWith("color-") && !topic.startsWith("image-")}
                                            <li>{topic}</li>
                                        {/if}
                                    {/each}
                                {/if}
                            </ul>
                        </div>
                    </div>
                {/each}
            {:else}
                <p>No projects found.</p>
            {/if}
        </div>
    </section>
{/if}

<style>
    section {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    width: 100vw;
    min-height: 100vh;
    justify-content: start;
    align-items: center;
    padding: 80px 20px 60px;
    background: white;
}

h2 {
    margin-bottom: 8px;
    font-size: 3rem;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
}

section > p {
    margin-top: 0px;
    margin-bottom: 40px;
    font-size: 1.2rem;
    text-align: center;
    color: #666;
}

.gradient-text {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
}

.filters {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100%;
    max-width: 800px;
    margin: 0 0 50px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    flex-wrap: wrap;
}

.filters > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.filters label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.filters select {
    padding: 8px 12px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    background: white;
    font-size: 0.9rem;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
}

.filters select:hover {
    border-color: #4f46e5;
}

.filters select:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.filters button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.filters button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.projects-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    width: 100%;
    max-width: 1200px;
    justify-items: center;
}

.project-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 350px;
    min-height: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    position: relative;
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.project-card h3 {
    color: white;
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    padding: 20px 20px 16px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    background: inherit;
}

.project-card img {
    width: 100%;
    height: 160px;
    object-fit: contain;
    background: white;
    padding: 20px;
    justify-self: center;
    align-self: center;
}

.project-card > p {
    padding: 0 20px;
    margin: 16px 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: white;
    flex-grow: 1;
}

.project-card > div:nth-of-type(2) {
    padding: 0 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.project-link {
    display: inline-block;
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
    backdrop-filter: blur(10px);
}

.project-link:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
}

.topics {
    padding: 0 20px 20px;
    margin-top: auto;
}

.topics ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.topics li {
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.9);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.topics li:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
}

/* Special styling for language bubble */
.language-bubble {
    background: rgba(255, 255, 255, 0.35) !important;
    color: white !important;
    font-weight: 600 !important;
    border: 2px solid rgba(255, 255, 255, 0.4) !important;
    padding: 5px 12px !important;
    font-size: 0.75rem !important;
}

.language-bubble:hover {
    background: rgba(255, 255, 255, 0.45) !important;
    border-color: rgba(255, 255, 255, 0.6) !important;
    transform: scale(1.05);
}

/* Empty state styling */
.projects-container > p {
    grid-column: 1 / -1;
    text-align: center;
    font-size: 1.1rem;
    color: #888;
    padding: 60px 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 2px dashed #ddd;
}

/* Responsive design */
@media (max-width: 768px) {
    section {
        padding: 60px 15px 40px;
    }
    
    h2 {
        font-size: 2.5rem;
    }
    
    .filters {
        flex-direction: column;
        gap: 20px;
        padding: 20px 15px;
    }
    
    .filters > div {
        width: 100%;
    }
    
    .filters select {
        width: 100%;
        min-width: unset;
    }
    
    .projects-container {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .project-card {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    h2 {
        font-size: 2rem;
    }
    
    .project-card h3 {
        font-size: 1.2rem;
        padding: 16px 16px 12px;
    }
    
    .project-card > p {
        padding: 0 16px;
    }
    
    .project-card > div:nth-of-type(2) {
        padding: 0 16px 12px;
    }
    
    .topics {
        padding: 0 16px 16px;
    }
}

</style>
