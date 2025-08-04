<script>
    import { onMount } from 'svelte';
    import ProjectPreview from '../comp/projectPreview.svelte';

    let projects = $state([]);
    let languages = $state([]);
    let topics = $state([]);

    let selectedLanguage = $state('');
    let selectedTopic = $state('');
    let selectedProject = $state(null);

    let showHero = $state(false);

    // Your existing updateData function (unchanged)
    const updateData = async () => {
        const projectsRes = await fetch('/api/github-projects');
        if (projectsRes.ok) {
            projects = await projectsRes.json();
            if (projects.length > 0) {
                // Add slug generation
                let id = 0;
                projects = projects.map(project => ({
                    ...project,
                    id: id++,
                    slug: project.name.toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_-]+/g, '-')
                        .replace(/^-+|-+$/g, '')
                }));

                languages = [...new Set(projects.map(p => p.language).filter(Boolean))];
                topics = [...new Set(projects.flatMap(p => p.topics || []))];

                if (topics.length > 0) {
                    projects = projects.map(project => {
                        if (project.topics) {
                            const cleanTopics = [];
                            project.topicsHidden = true;
                            
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

    const selectProject = (project) => {
        selectedProject = project;
    }

    const selectLanguage = (language) => {
        if (language === selectedLanguage) {
            selectedLanguage = '';
        } else {
            selectedLanguage = language;
        }
    }

    function scrollToProjectsAndClearFlag() {
        const el = document.getElementById('Projects');
        if (el) {
            el.scrollIntoView({ behavior: 'instant' });
            import('$app/navigation').then(({ replaceState }) => {
            replaceState(
                "/",
                { scrollToProjects: false }
            );
            });
        } else {
            // Retry in a tick if not yet rendered
            setTimeout(scrollToProjectsAndClearFlag, 10);
        }
    }

    onMount(async () => {
        showHero = true;
        const skState = history.state?.['sveltekit:states'];
        if (skState && skState.scrollToProjects) {
            scrollToProjectsAndClearFlag();
        }

        await updateData();
    });
</script>

{#if showHero}
    <section id="Projects">
        <h2>Dynamic Projects</h2>
        <div class="wrapText">
            <p><span class="gradient-text">They really are Dynamic</span> 😉</p>
            <p class="hint">Hover to find out what 'Dynamic' means in this context</p>
        </div>
        
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
        </div>
        
        <div class="projects-container">
            {#if projects.length > 0}
                {#each projects as project}
                    <div
                        role="button"
                        tabindex="0"
                        aria-label="Expand project card"
                        onclick={() => selectProject(project)}
                        onkeydown={e => {
                            if (e.key === "Enter" || e.key === " ") {
                                selectProject(project);
                            }
                        }}
                        class="project-card"
                        style="background: {project.color}; display: {(!selectedLanguage || project.language === selectedLanguage) && (!selectedTopic || project.topics?.includes(selectedTopic)) ? 'flex' : 'none'};"
                    >
                        <div class="topics">
                            <ul>
                                {#if project.language}
                                    <button class="language-bubble" onclick={() => selectLanguage(project.language)} style="background: {project.color};">{project.language}</button>
                                {/if}
                                {#if project.topics && project.topics.length > 0}
                                    {#each project.topics as topic}
                                        {#if topic && !topic.startsWith("color-") && !topic.startsWith("image-") && !project.topicsHidden}
                                            <li>{topic}</li>
                                        {/if}
                                    {/each}
                                {/if}
                            </ul>
                        </div>
                        {#if project.banner}
                            <img src="/{project.banner}.svg" alt={project.name}>
                        {/if}
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <div>
                            <a class="project-link" href={project.github} target="_blank">View on GitHub</a>
                        </div>
                    </div>
                {/each}
            {:else}
                <p>No projects found.</p>
            {/if}
        </div>
    </section>
{/if}

<ProjectPreview 
    bind:selectedProject 
    {projects} 
/>

<style>
    section {
        display: flex;
        flex-direction: column;
        max-width: 100%;
        width: 100%;
        min-height: 100vh;
        justify-content: start;
        align-items: center;
        background: white;
    }

    h2 {
        margin-bottom: 8px;
        font-size: 3rem;
        font-weight: 600;
        color: #1a1a1a;
        text-align: center;
    }

    section > .wrapText {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 600px;
        background: none;
        border: none;
        margin-bottom: 5vh;
        cursor: pointer;
    }

    section > .wrapText p {
        font-size: 1.4rem;
        font-weight: 700;
        margin: 0px;
        text-align: center;
        color: #666;
    }

    section > .wrapText > .hint {
        position: relative;
        font-size: 0.6rem;
        text-align: center;
        color: #666;
    }

    section > .wrapText .hint::after {
        content: "Projects are fetched live from my GitHub repositories using the GitHub API. The app parses repository topics(used as parameters) and metadata to auto-generate and update project cards, no manual code needed.";
        position: absolute;
        opacity: 0;
        transition: 0.3s;
        width: 70%;
        height: auto;
        text-wrap: wrap;
        pointer-events: none;
        line-height: 1.4;
        top: 0px;
        left: 50%;
    }

    section > .wrapText .hint:hover::after {
        top: -30px;
        left: 80%;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10;
        opacity: 1;
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

    .projects-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 24px;
        width: 100%;
        max-width: 1200px;
        perspective: 1200px;
        justify-items: center;
        margin-bottom: 30px;
    }

    .project-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 12px;
        width: 100%;
        max-width: 350px;
        min-height: 400px;
        box-shadow: 5px 5px 5px 0px #000000, 5px 5px 5px 5px rgba(0,0,0,0); 
        text-shadow: 2px 0 #000000, -2px 0 #000000, 0 2px #000000, 0 -2px #000000,
             1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000;
        transition: all 0.4s ease;
        overflow: hidden;
        border: 1px solid #e5e7eb;
        position: relative;
        cursor: pointer;
    }

    .project-card:hover {
        transform: scale(1.05) translateY(-10px);
        filter: brightness(0.95);
    }

    .project-card h3 {
        text-transform: uppercase;
        color: white;
        margin: 0;
        font-size: 1.3rem;
        font-weight: 600;
        padding: 20px 20px 16px;
        background: inherit;
    }

    .project-card img {
        width: 100%;
        height: auto;
        padding-left: 10vw;    
        padding-right: 10vw;
        padding-top: 20px;
        padding-bottom: 20px;
        max-width: 220px;
        object-fit: contain;
        background: white;
        border-radius: 8px;
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
        border-radius: 6px;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: center;
        backdrop-filter: blur(10px);
        cursor: pointer;
    }

    .project-link:hover {
        transform: translateY(-1px);
        text-decoration: underline;
    }

    .topics {
        top: 20px;
        right: 10px;
        position: absolute;
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
        display: flex;
        align-items: center;
        background: rgba(199, 199, 199, 0.7);
        color: rgba(73, 73, 73, 0.9);
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
        text-align: center;
    }

    .topics li:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.4);
    }

    /* Special styling for language bubble */
    .language-bubble {
        display: flex;
        align-items: center;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
        text-align: center;
        color: rgb(255, 255, 255) !important;
        font-weight: 600 !important;
        border: 2px solid rgba(255, 255, 255, 0.4) !important;
        padding: 5px 12px !important;
        font-size: 1rem !important;
        cursor: pointer;
    }

    .language-bubble:hover {
        border-color: rgba(0, 0, 0, 0.767) !important;
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
        h2 {
            font-size: 2.5rem;
        }
        
        .filters {
            flex-direction: column;
            gap: 20px;
            padding: 20px 15px;
        }
        
        .filters > div {
            width: 90%;
        }
        
        .filters select {
            width: 90%;
        }
        
        .projects-container {
            width: 80%;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .project-card {
            max-width: 90%;
        }

        section > .wrapText .hint {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        section > .wrapText .hint::after {
            position: relative;
            left: 0px;
            top: -50px
        }

        section > .wrapText .hint:hover::after {
            left: 0px;
            top: 10px
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
        

    }

</style>
