<script>
	import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';

	function nonpassiveWheel(node) {
		function handler(e) {
			if (showMenu) e.preventDefault();
		}
		window.addEventListener('wheel', handler, { passive: false });

		return {
		destroy() {
			window.removeEventListener('wheel', handler, { passive: false });
		}
		};
	}

	let Title = "<Andrea Bertarione />";
	let links = [
		{
			name: "Home",
			to: "/#",
		},
		{
			name: "About",
			to: "/#About",
		},
		{
			name: "Skills",
			to: "/#Skills",
		},
		{
			name: "Projects",
			to: "/#Projects",
		},
		{
			name: "Contacts",
			to: "/#Contacts",
		},
	];

	let showHero = $state(false);
	let showMenu = $state(false);
	
	onMount(() => {
		showHero = true;
	});
</script>

{#if showHero}
	<nav class="hero-gradient">
		<div class="glass-effect wrapper">
			<div class="wrapperTitle margin-auto" in:fly ={{ y: -200, delay: 200 }}>
				<img src="iconportfolio.svg" alt="logo" class="logo" />
				<p class="gradient-text">{Title}</p>
			</div>
			<div class="navList margin-auto" in:fly ={{ x: 1000, delay: 200, duration: 1000 }}>
				{#each links as link}
					<a class="navLink" href=" {link.to}">{link.name}</a>
				{/each}
			</div>
			<button class="navMenuIcon" onclick={() => { showMenu = !showMenu; showMenu ? scrollTo({ top: 0, left: 0, behavior: 'instant'}) : ''}}><picture><img src="menu.svg" alt="menu icon"></picture></button>
		</div>
	</nav>
	<div class="navMenu glass-effect" style="display: {showMenu ? "flex" : "none"}" use:nonpassiveWheel>
		{#each links as link}
			<a class="navLink" onclick={() => {showMenu = false; enableScroll();}} href=" {link.to}">{link.name}</a>
		{/each}
	</div>
{/if}

<style>
	nav {
		z-index: 10;
		position: sticky;
		top: 0px;
		max-width:100%;
		height: 7vh;
		width: 100vw;

		padding: 0px;
		margin: 0px;
		overflow: hidden;
	}

	.wrapper {
		display: flex;
		width: 100%;
		height: 100%;

		align-items: center;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;

		justify-content: space-between;
	}
	
	nav p {
		padding-right: 2rem;
		padding-left: 10rem;
		font-size: 20px;
		-webkit-text-size-adjust: 100%;
	}

	.navList {
		display: flex;
		gap: 20px;

		padding-right: 12rem;
		padding-left: 3rem;
	}

	.wrapperTitle {
		display: flex;
		flex-direction: row;
		align-items: center;

		padding-right: 2rem;
		padding-left: 2rem;

		margin-left: 5rem;
		margin-right: auto;

		transition: color 0.15s;	
	}

	.wrapperTitle p {
		padding-left: 1rem;
	}

	.logo {
		min-width: 25px;
		min-height: 25px;
		width: auto;
		height: 90%;
		max-height: 40px;
		max-width: 40px;
		object-fit: contain;
		margin-left: 2rem;
	}

	.navLink {
		display: flex;
		flex-direction: column;
		gap: 1px;
		text-decoration: none;
		color: white;

		transition: 0.15s;
	}

	.navLink:hover {
		color: hsl(221, 83%, 53%);
	}

	.navLink::after {
		content: "";
		display: inline-block;
		width: 0%;
		height: 3px;

		background: linear-gradient(
			135deg,
			hsl(221, 83%, 53%),
			hsl(43, 96%, 56%)
		);
		transition: 0.15s
	}

	.navLink:hover::after {
		width: 100%;
		height: 3px;
	}

	.navMenuIcon {
		display: none;
		padding-right: 1rem;
		padding-left: 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.navMenu {
		position: absolute;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		top: 7vh;
		left: 0;
		width: 100vw;
		height: calc(100vh - 7vh);
		z-index: 25;
	}

	.navMenu .navLink:nth-child(1) {
		margin-top: 2rem;
	}

	.navMenu .navLink {
		padding: 1rem;
		font-size: 2rem;
	}

	@media (max-width: 1100px) {
		.wrapperTitle {
			margin-left: 2rem;
			margin-right: auto;
		}

		.navList {
			padding-right: 2rem;
			padding-left: 1.5rem;
		}

	}

	@media (max-width: 930px) {
		.wrapperTitle {
			margin-left: 0.5rem;
			margin-right: auto;
		}

		.wrapperTitle p {
			font-size: 1.2rem;
		}

		.navList {
			padding-right: 2rem;
			padding-left: 1.5rem;
		}

		.navLink {
			font-size: 0.7rem;
		}
	}

	@media (max-width: 770px) {
		.wrapperTitle {
			margin-left: 0px;
			padding-left: 0px;
			padding-right: 0px;
			margin-right: auto;
		}

		.wrapperTitle p {
			font-size: 1.5 rem;
		}

		.navList {
			display: none;
		}

		.navMenuIcon {
			display: flex;
		}
	}

	@media (max-width: 450px) {
		.wrapperTitle p {
			font-size: 1rem;
		}
	}

	.hero-gradient {
		background: linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(215, 25%, 27%) 50%, hsl(215, 20%, 65%) 100%);
	  }
</style>
