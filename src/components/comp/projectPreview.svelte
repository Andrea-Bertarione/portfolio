<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    let { selectedProject = $bindable(), projects = [] } = $props();
    
    let showModal = $state(false);
    let readmeContent = $state('');
    let latestCommit = $state(null);
    let isLoading = $state(false);

    // Watch for URL changes and project selection
    $effect(() => {
        if (browser && $page.params.slug && projects.length > 0) {
            const project = projects.find(p => p.slug === $page.params.slug);
            if (project) {
                selectedProject = project;
                showModal = true;
                loadProjectDetails(project);
            }
        }
    });

    // Watch for selectedProject changes (from parent component)
    $effect(() => {
        if (selectedProject && !$page.params.slug) {
            // Project selected from card click - update URL
            goto(`/preview/${selectedProject.slug}`, { noScroll: true });
        }
        
        if (selectedProject && !showModal) {
            showModal = true;
            loadProjectDetails(selectedProject);
        }
    });

    let createdAt = $state(null);
    let updatedAt = $state(null);

    async function loadProjectDetails(project) {
        if (!project) return;
        isLoading = true;

        try {
            // Call your serverless endpoint for project details
            const res = await fetch(`/api/github-project-details/${encodeURIComponent(project.name)}`);
            if (res.ok) {
                const data = await res.json();
                readmeContent = data.readmeHtml || '';
                latestCommit = data.latestCommit || null;

                // Populate createdAt and updatedAt with ISO strings or null
                createdAt = data.created_at || null;
                updatedAt = data.updated_at || null;
            } else {
                readmeContent = '<p>Failed to load README.</p>';
                latestCommit = null;
                createdAt = null;
                updatedAt = null;
            }
        } catch (err) {
            console.error('Error loading project details:', err);
            readmeContent = '<p>Error loading README.</p>';
            latestCommit = null;
            createdAt = null;
            updatedAt = null;
        }

        isLoading = false;
    }


    const closeModal = async () => {
        showModal = false;
        selectedProject = null;
        readmeContent = '';
        latestCommit = null;
        
        if (browser) {
            await goto('/', {
                noScroll: true,           
                state: { scrollToProjects: true } 
            });
        }
    };

    const navigateToProject = (direction) => {
        if (!selectedProject || !projects.length) return;
        
        const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % projects.length;
        } else {
            newIndex = (currentIndex - 1 + projects.length) % projects.length;
        }
        
        const newProject = projects[newIndex];
        selectedProject = newProject;
        goto(`/preview/${newProject.slug}`, { noScroll: true });
    };

    const handleKeydown = (event) => {
        if (!showModal) return;
        
        switch (event.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigateToProject('prev');
                break;
            case 'ArrowRight':
                navigateToProject('next');
                break;
        }
    };

    onMount(() => {
        // Check if we should show modal based on initial URL
        if (browser && $page.params.slug && projects.length > 0) {
            const project = projects.find(p => p.slug === $page.params.slug);
            if (project) {
                selectedProject = project;
                showModal = true;
                loadProjectDetails(project);
            }
        }
    });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showModal && selectedProject}
    <div
        class="modal-backdrop"
        role="button"
        tabindex="0"
        aria-label="Close modal"
        onclick={closeModal}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeModal(); }}
    >
        <!-- Navigation arrows - NOW OUTSIDE modal-content -->
        <button 
            class="nav-btn prev" 
            onclick={(e) => { e.stopPropagation(); navigateToProject('prev'); }}
            aria-label="Previous project"
        >
        ‹
        </button>
        <button 
            class="nav-btn next" 
            onclick={(e) => { e.stopPropagation(); navigateToProject('next'); }}
            aria-label="Next project"
        >
        ›
        </button>

        <div
            class="modal-content"
            role="dialog"
            aria-modal="true"
            onclick={(e) => e.stopPropagation()}
            tabindex="0"
            onkeydown={(e) => { if (e.key === 'Escape') closeModal(); }}
        >
            <!-- Close button -->
            <button class="close-btn" onclick={closeModal} aria-label="Close modal">
                ×
            </button>
            
            <!-- Loading state -->
            {#if isLoading}
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <p>Loading project details...</p>
                </div>
            {/if}
            
            <!-- Project content - exactly as before -->
            <div class="project-details">
                <div class="project-header">
                    <div class="project-icon" style="background: {selectedProject.color};">
                        {#if selectedProject.banner}
                            <img src="/{selectedProject.banner}.svg" alt={selectedProject.name}>
                        {:else}
                            <span>{selectedProject.name.charAt(0)}</span>
                        {/if}
                    </div>
                    
                    <div class="project-info">
                        <h1>{selectedProject.name}</h1>
                        <p class="project-description">{selectedProject.description}</p>
                        
                        <div class="project-meta">
                            {#if selectedProject.language}
                                <span class="language-tag" style="background: {selectedProject.color};">
                                    {selectedProject.language}
                                </span>
                            {/if}
                            <span class="stars">⭐ {selectedProject.stargazers_count || 0}</span>
                            <span class="forks">🍴 {selectedProject.forks_count || 0}</span>
                        </div>
                    </div>
                </div>
                
                <!-- GitHub Activity -->
                <div class="github-info">
                    <h3>📊 Repository Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Created:</strong> 
                            {new Date(createdAt).toLocaleDateString()}
                        </div>
                        <div class="info-item">
                            <strong>Last Updated:</strong> 
                            {new Date(updatedAt).toLocaleDateString()}
                        </div>
                        {#if latestCommit}
                            <div class="info-item">
                                <strong>Latest Commit:</strong>
                                <div class="commit-info">
                                    <span class="commit-message">{latestCommit.commit.message}</span>
                                    <span class="commit-date">
                                        {new Date(latestCommit.commit.author.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        {/if}
                        {#if selectedProject.topics && selectedProject.topics.length > 0}
                            <div class="info-item topics-section">
                                <strong>Topics:</strong>
                                <div class="topics-list">
                                    {#each selectedProject.topics as topic}
                                        <span class="topic-badge">{topic}</span>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                
                <!-- README Content -->
                {#if readmeContent}
                    <div class="readme-section">
                        <h3>📖 README</h3>
                        <div class="readme-content">
                            {@html readmeContent}
                        </div>
                    </div>
                {:else if !isLoading}
                    <div class="readme-section">
                        <h3>📖 README</h3>
                        <p class="no-readme">No README available for this project.</p>
                    </div>
                {/if}
                
                <!-- Action buttons -->
                <div class="action-buttons">
                    <a href={selectedProject.github} target="_blank" class="btn-primary">
                        <span>📂</span> View on GitHub
                    </a>
                    {#if selectedProject.demo}
                        <a href={selectedProject.demo} target="_blank" class="btn-secondary">
                            <span>🚀</span> Live Project
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .modal-content {
        background: white;
        border-radius: 16px;
        max-width: 90vw;
        max-height: 90vh;
        width: 900px;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: slideUp 0.3s ease;
        /* Remove overflow-x hidden since nav buttons are outside now */
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f4f6;
        border-top: 4px solid #4f46e5;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 10;
        color: #666;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .close-btn:hover {
        background: #f3f4f6;
        color: #000;
    }
    
    /* Updated nav button positioning - now relative to backdrop, not modal-content */
    .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.95);
        border: none;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        font-size: 28px;
        cursor: pointer;
        z-index: 1001; /* Higher than backdrop */
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #374151;
        font-weight: bold;
    }
    
    .nav-btn:hover {
        background: rgba(255, 255, 255, 1);
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        color: #111827;
    }
    
    .nav-btn:active {
        transform: translateY(-50%) scale(0.95);
    }
    
    /* Position buttons outside the modal - with more spacing */
    .nav-btn.prev { 
        left: min(400px, calc(50vw - 550px)); /* Responsive positioning */
    }
    .nav-btn.next { 
        right: min(400px, calc(50vw - 550px)); /* Responsive positioning */
    }
    
    .project-details {
        padding: 30px;
    }
    
    .project-header {
        display: flex;
        gap: 20px;
        margin-bottom: 32px;
        align-items: flex-start;
    }
    
    .project-icon {
        width: 80px;
        height: 80px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .project-icon img {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }
    
    .project-icon span {
        color: white;
        font-size: 2rem;
        font-weight: 600;
    }
    
    .project-info {
        flex: 1;
    }
    
    .project-info h1 {
        margin: 0 0 8px 0;
        font-size: 2rem;
        color: #1a1a1a;
    }
    
    .project-description {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #666;
        margin: 0 0 16px 0;
    }
    
    .project-meta {
        display: flex;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .language-tag {
        padding: 6px 12px;
        border-radius: 12px;
        color: white;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .stars, .forks {
        font-size: 0.9rem;
        color: #666;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .github-info {
        background: #f8f9fa;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 32px;
    }
    
    .github-info h3 {
        margin: 0 0 20px 0;
        color: #1a1a1a;
        font-size: 1.2rem;
    }
    
    .info-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
    
    .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .info-item strong {
        color: #374151;
        font-size: 0.9rem;
    }
    
    .commit-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    
    .commit-message {
        color: #111827;
        font-weight: 500;
    }
    
    .commit-date {
        color: #6b7280;
        font-size: 0.8rem;
    }
    
    .topics-section {
        grid-column: 1 / -1;
    }
    
    .topics-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
    }
    
    .topic-badge {
        background: #e5e7eb;
        color: #374151;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .readme-section {
        margin-bottom: 32px;
    }
    
    .readme-section h3 {
        margin: 0 0 20px 0;
        color: #1a1a1a;
        font-size: 1.2rem;
    }
    
    .readme-content {
        background: #fafafa;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .readme-content :global(h1),
    .readme-content :global(h2),
    .readme-content :global(h3) {
        color: #1a1a1a;
        margin-top: 0;
    }
    
    .readme-content :global(pre) {
        background: #f3f4f6;
        padding: 12px;
        border-radius: 6px;
        overflow-x: auto;
    }
    
    .readme-content :global(code) {
        background: #f3f4f6;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 0.9em;
    }
    
    .no-readme {
        color: #6b7280;
        font-style: italic;
        text-align: center;
        padding: 40px;
    }
    
    .action-buttons {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .btn-primary, .btn-secondary {
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s ease;
        text-align: center;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-primary {
        background: #4f46e5;
        color: white;
    }
    
    .btn-primary:hover {
        background: #4338ca;
        transform: translateY(-1px);
    }
    
    .btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }
    
    .btn-secondary:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
    }
    
    /* Mobile responsive */
    @media (max-width: 1200px) {
        /* On smaller screens, move buttons closer to modal */
        .nav-btn.prev { left: 20px; }
        .nav-btn.next { right: 20px; }
    }
    
    @media (max-width: 768px) {
        .modal-content {
            width: 95vw;
            height: 95vh;
            border-radius: 12px;
        }
        
        .project-details {
            padding: 20px;
        }
        
        .project-header {
            flex-direction: column;
            text-align: center;
        }
        
        .nav-btn {
            width: 50px;
            height: 50px;
            font-size: 24px;
        }
        
        .nav-btn.prev { left: 10px; }
        .nav-btn.next { right: 10px; }
        
        .action-buttons {
            flex-direction: column;
        }
        
        .info-grid {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 480px) {
        .nav-btn {
            width: 45px;
            height: 45px;
            font-size: 20px;
        }
        
        .nav-btn.prev { left: 5px; }
        .nav-btn.next { right: 5px; }
    }
</style>