<script>
    import Navigation from "../components/header/navigation.svelte";
	import Home from "../components/content/home.svelte";
	import About from "../components/content/about.svelte";
	import Skills from "../components/content/skills.svelte";
	import Projects from "../components/content/projects.svelte";
</script>


<section >
	<Navigation />
	<Home />
	<About />
	<Skills />
	<Projects />
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
		width: 100%;
		max-width:100%;
	}

	:global(.gradient-text) {
		background: linear-gradient(
			270deg,
			hsl(221, 83%, 53%),
			hsl(43, 96%, 56%)
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	:global(.hero-gradient) {
		background: linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(215, 25%, 27%) 50%, hsl(215, 20%, 65%) 100%);
	}

	:global(.glass-effect) {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	section :global(h2) {
		margin-top: 10vh;
		font-size: 3rem;
		color: rgb(30 41 59 / var(--tw-text-opacity, 1));

		display: flex;
		flex-direction: column;

		align-items: center;
		justify-content: center;
	}

	section :global(h2::after) {
		content: "";
		display: inline-block;
		width: 60%;
		height: 5px;

		background: linear-gradient(
			135deg,
			hsl(221, 83%, 53%),
			hsl(43, 96%, 56%)
		);
	}

	
</style>
