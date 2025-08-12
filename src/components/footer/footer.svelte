<script>
    import { onMount } from 'svelte';

    let showHero = $state(false);

    onMount(() => {
        showHero = true;
    });
</script>

{#if showHero}
    <footer id="Footer" class="hero-gradient">
        <div class="footer-content">
            <div class="footer-main">
            <p>© 2024 Andrea Bertarione</p>
            <p>Full Stack Developer & Student based in Turin, Italy</p>
            </div>
            
            <div class="footer-tech">
            <p>Built with Svelte 5 & deployed with Vercel</p>
            <a href="/#" class="back-to-top">↑ Back to Top</a>
            </div>
        </div>
    </footer>
{/if}


<style>
    footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 100%;
        min-height: 40vh;
        padding: 2rem 1rem;
        margin-top: 4rem;
    }

    .footer-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        max-width: 1200px;
        width: 100%;
        text-align: center;
    }

    .footer-main {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .footer-main p {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
        opacity: 0.9;
    }

    .footer-main p:first-child {
        font-weight: 600;
        font-size: 1.2rem;
    }

    .footer-tech {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .footer-tech p {
        margin: 0;
        font-size: 1rem;
        font-style: italic;
    }

    .back-to-top {
        text-decoration: none;
        color: white;
        font-weight: 600;
        font-size: 1rem;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(43, 96%, 56%));
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .back-to-top:hover {
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
    }

    /* Tablet and larger screens */
    @media (min-width: 768px) {
        .footer-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
        }

        .footer-tech {
            align-items: flex-end;
            text-align: right;
        }

        footer {
            padding: 3rem 2rem;
        }
    }

    /* Large screens */
    @media (min-width: 1024px) {
        .footer-main p {
            font-size: 1.2rem;
        }

        .footer-main p:first-child {
            font-size: 1.3rem;
        }

        .footer-tech p {
            font-size: 1.1rem;
        }
    }

    /* Mobile optimizations */
    @media (max-width: 480px) {
        footer {
            min-height: 35vh;
            padding: 0rem;
        }

        .footer-main p {
            font-size: 0.9rem;
        }

        .footer-main p:first-child {
            font-size: 1.1rem;
        }

        .back-to-top {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
        }
    }
</style>
