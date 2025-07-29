<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script>
    import { run } from 'svelte/legacy';

    import { onMount } from 'svelte';
    import { fade  } from 'svelte/transition';
    import SkillsDeck from '../utils/skillsDeck.svelte';

    const time = 10000;
    let isPlaying = $state(true);
    let progress = $state(0);
    let animationFrame;
    let startTime = null;
    let pauseElapsed = 0;
    let skillsDeckRef = $state();

    function animate(t) {
        if (startTime === null) startTime = t;

        if (!isPlaying) {
            pauseElapsed = t - startTime;
            return;
        }

        const elapsed = (t - startTime) + pauseElapsed;
        progress = Math.floor(Math.min((elapsed / time) * 100, 100));

        if (progress >= 100) {
            if (window.innerWidth < 600) {
                skillsDeckRef.updateCardIndex('prev');
            } else {
                skillsDeckRef.updateCardIndex('next');
            }
            setTimeout(() => {
                progress = 0;
                startTime = null;
                pauseElapsed = 0;
                if (isPlaying) animationFrame = requestAnimationFrame(animate);
            }, 1000);
        } else {
            animationFrame = requestAnimationFrame(animate);
        }
    }

    const playPause = () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            startTime = null;
            animationFrame = requestAnimationFrame(animate);
        }
    };

    let showHero = $state(false);
    let sectionVisible = $state(false);
	let skillsSection = $state();
	let observer = $state();

    onMount(() => {
        showHero = true;

        observer = new IntersectionObserver(
			([entry]) => {
				sectionVisible = entry.isIntersecting;
			},
			{
				threshold: 0.5,
			}
		);

        animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    });

    let previousSection = $state(null);
	run(() => {
        if (skillsSection && observer) {
    		if (previousSection && previousSection !== skillsSection) {
    			observer.unobserve(previousSection);
    		}
    		observer.observe(skillsSection);
    		previousSection = skillsSection;
    	}
    });
</script>

{#if showHero}
    <section id="Skills" bind:this={skillsSection}>
        <h2>Skills deck</h2>
        <SkillsDeck bind:this={skillsDeckRef}/>
        {#if sectionVisible}
            <div id="playBar" transition:fade={{ delay: 60, duration: 150 }}>
                <div class="bar">
                    <div class="fill" style="width: {progress}%;"></div>
                </div>
                <button onclick={playPause} class="Play">
                    <img
                        class="{isPlaying ? 'hidden' : 'shown'}"
                        src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/svgs/solid/play.svg"
                        alt="Play button"
                        width="28"
                        height="28"
                    />
                    <img
                        class="{isPlaying ? 'shown' : 'hidden'}"
                        src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/svgs/solid/pause.svg"
                        alt="Pause button"
                        width="28"
                        height="28"
                    />
                </button>
            </div>
        {/if}
    </section>
{/if}

<style>
    section {
        display: flex;
        flex-direction: column;

        max-width: 100%;
        width: 100vw;
        height: 100vh;

        background: #f7f8fa;

        justify-content: start;
        align-items: center;
    }

    #playBar {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 2%;
        right: 1.5%;
        width: 25%;
        min-height: 28px;
        z-index: 50;

        background: hsl(221, 83%, 53%);
        color: white;
        border-radius: 12px;
        border: none;
        font-size: 16px;
        font-weight: 600;

        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transition: opacity 0.2s;
    }

    .bar {
        width: 100%;
        height: 100%;
        min-height: 28px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
    }

    .bar .fill {
        width: 0;
        height: 100%;
        min-height: 28px;
        background: linear-gradient(
            135deg,
            hsl(221, 79%, 22%),
            hsl(245, 100%, 10%)
        );
        margin: 2px;
        border-radius: 12px;
        transition: width 0.05s ease-in-out;
    }

    .Play {
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .shown {
        display: flex;
    }

    .hidden {
        display: none;
    }

    @media (max-width: 768px) {
        h2 {
            margin-top: 3vh;
            margin-bottom: 3vh;
        }
        #playBar {
            width: 80%;
            bottom: 2%;
            left: 10%;
        }
    }
</style>
