<script>
    import Navigation from "../components/header/navigation.svelte";
	import Home from "../components/content/home.svelte";
	import About from "../components/content/about.svelte";
</script>


<section >
	<Navigation />
	<Home />
	<About />
</section>

<style>
	:root {
		--font-body: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI",
			Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
			sans-serif;
		--font-mono: "Fira Mono", monospace;

		/* Dark theme with purple accents */
		--color-bg-0: #0f0f23;
		--color-bg-1: #1a1a2e;
		--color-bg-2: #16213e;
		--color-theme-1: #9d4edd;
		--color-theme-2: #7209b7;
		--color-accent: #c77dff;
		--color-text: #e0e1dd;
		--color-text-secondary: #a0a1a7;
		--color-border: #333344;

		--column-width: 42rem;
		--column-margin-top: 4rem;
		font-family: var(--font-body);
		font-weight: 800;
		color: var(--color-text);

		scroll-behavior: smooth;
	}

	section {
		display: flex;
		flex-direction: column;
		width: 100vw;
		max-width:100%;
	}

	
</style>
