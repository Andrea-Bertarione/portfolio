<script>
	import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
	
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
	
	onMount(() => {
		showHero = true;
	});
</script>

{#if showHero}
	<nav class="hero-gradient">
		<div class="glass-effect wrapper">
			<p class="gradient-text margin-auto" in:fly ={{ y: -200, delay: 200 }}>{Title}</p>
			<div class="navList margin-auto" in:fly ={{ x: 1000, delay: 200, duration: 1000 }}>
				{#each links as link}
					<a class="navLink" href=" {link.to}">{link.name}</a>
				{/each}
			</div>
			<div class="navMenuIcon"><picture><img src="menu.svg" alt="menu icon"></picture></div>
		</div>
	</nav>
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

	.navList .navLink {
		display: flex;
		flex-direction: column;
		gap: 1px;
		text-decoration: none;
		color: white;

		transition: 0.15s;
	}

	.navList .navLink:hover {
		color: hsl(221, 83%, 53%);
	}

	.navList .navLink::after {
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

	.navList .navLink:hover::after {
		width: 100%;
		height: 3px;
	}

	.navMenuIcon {
		display: none;
		padding-right: 1rem;
		padding-left: 1rem;
	}

	@media (max-width: 1100px) {
		nav p {
			padding-left: 4rem;
		}
	}

	@media (max-width: 930px) {
		.navList {
			padding-right: 2rem;
			padding-left: 2rem;
		}
	}

	@media (max-width: 770px) {
		nav p {
			font-size: 22px;
			padding-right: 3rem;
			padding-left: 3rem;
		}

		.navList {
			display: none;
		}

		.navMenuIcon {
			display: flex;
		}
	}

	@media (max-width: 450px) {
		nav p {
			font-size: 20px;
			padding-right: 1rem;
			padding-left: 1rem;
		}
	}

	.hero-gradient {
		background: linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(215, 25%, 27%) 50%, hsl(215, 20%, 65%) 100%);
	  }
</style>
