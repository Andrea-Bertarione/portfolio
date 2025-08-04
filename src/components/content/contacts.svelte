<script>
    import { onMount } from 'svelte';

    let showHero = $state(false);

    onMount(async () => {
        showHero = true;
    });
</script>

{#if showHero}
    <section> 

    </section>
{/if}

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
</style>