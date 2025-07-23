<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import SkillsDeck from '../utils/skillsDeck.svelte';

    let showHero = false;

    onMount(() => {
        showHero = true;
    });
</script>

{#if showHero}
	<section id="skills">
        <h2>Skills deck</h2>
        <SkillsDeck />
    </section>
{/if}

<style>
	section {
		display: flex;
		flex-direction: column;
		
		max-width:100%;
		width: 100vw;
		height: 100vh;

        background: #F7F8FA;

		justify-content: start;
		align-items: center;
	}

</style>