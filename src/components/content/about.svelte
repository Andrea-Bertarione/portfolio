<script>
	import { onMount } from 'svelte';
	import aboutText from "../data/aboutme"
	import { fade  } from 'svelte/transition';

	const calcAge = (dob) => {
		const now = new Date();
		let age = now.getFullYear() - dob.getFullYear();
		const m = now.getMonth() - dob.getMonth();
		if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
			age--;
		}
		return age;
	}

	const extendText = () => {

		if (!extended) {
			aboutMe = aboutText({ age, experience, extended: true });
			extended = true;
		} else {
			resized();
		}
	}

	const resized = () => {
		if (window.innerWidth < 680) {
			aboutMe = aboutMe.substring(0, 300) + "<span id='extenderRead' style='color: #0087f8; cursor: pointer; font-weight: 600'>... Read more</span>";
			window.addEventListener("click", (e) => {
				if (e.target.id === "extenderRead") {
					extendText();
				}
			});
			extended = false;
		}
		else {
			aboutMe = aboutText({ age, experience });
			extended = true;
		}
	}

	let age = calcAge(new Date(2004, 6, 13));
	let experience = calcAge(new Date(2018, 3, 12));

	let showHero = false;

	let aboutMe = aboutText({ age, experience });
	let extended = false;

	let sectionVisible = false;
	let aboutSection;
	let observer;

	onMount(() => {
		showHero = true;
		
		window.addEventListener('resize', resized);
		resized();
		observer = new IntersectionObserver(
			([entry]) => {
				sectionVisible = entry.isIntersecting;
			},
			{
				threshold: 0.3,
			}
		);
	});

	let previousSection = null;
	$: if (aboutSection && observer) {
		if (previousSection && previousSection !== aboutSection) {
			observer.unobserve(previousSection);
		}
		observer.observe(aboutSection);
		previousSection = aboutSection;
	}
</script>

{#if showHero}
<section id="About" bind:this={aboutSection}>
	<h2>About me</h2>

	<div class="textWrapper">
		<img src="profile.jpg" alt="Profile">
		<div class="textContainer">
			<p class="mainText">
				{@html aboutMe}
			</p>
		</div>
	</div>
	{#if sectionVisible}
		<button id="CVDownload" transition:fade={{ delay: 60, duration: 150 }}>Download CV</button>
	{/if}
</section>
{/if}

<style>
	section {
		display: flex;

		flex-direction: column;
		align-items: center;

		max-width:100%;
	}

	.textWrapper {
		display: flex;
		width: 100%;

		gap: 30px;

		justify-content: space-around;
		align-items: flex-start;
	}

	.textWrapper img {
		width: 25vw;
		height: 70vh;

		margin-bottom: 20vh;
		min-width: 380px;

		border-radius: 30px;
		box-shadow: 0px 0px 15px 13px rgba(0,0,0,0.6);

	}

	.textWrapper .textContainer {
		width: 55vw;
	}

	.textWrapper .textContainer .mainText {

		font-weight: 400;
		color: rgb(71 85 105);
		font-size: 1vw;
	}

	#CVDownload {
		position: fixed;
		bottom: 2%;
		right: 1.5%;
		width: 13%;
		height: 9%;
		z-index: 50;

		background: hsl(221, 83%, 53%);
		color: white;
		border-radius: 12px;
		border: none;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;

		box-shadow: 0 4px 16px rgba(0,0,0,0.15);
		transition: opacity 0.2s;
	}

	@media (min-width: 1800px) {
		.textWrapper .textContainer .mainText { 
			font-size: 4vw;
		}
	}

	@media (max-width: 680px) {
		section h2 {
			margin-top: 10vh;
		}

		.textWrapper {
			flex-direction: column;
		}

		.textWrapper img {
			width: 70vw;
			height: 60vh;

			margin-bottom: 5vh;
		}

		.textWrapper .textContainer {
			width: 80%;
		}

		.textWrapper .textContainer .mainText { 
			font-size: 4vw;
		}

		#CVDownload {
			width: 140px;
			font-size: 14px;
			height: 45px;
			right: 12px;
			bottom: 12px;
		}
	}
</style>