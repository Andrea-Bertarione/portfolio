<script>
	import ArrowR from "../interactiveSVG/arrowR.svelte";
	import ArrowD from "../interactiveSVG/arrowD.svelte";
	import { fly  } from 'svelte/transition';

	let text = [
		"Hi there! I'm",
		"Berta",
		"I craft digital solutions that blend code, creativity, and user-centered design.",
		"Whether it's building robust web apps, designing unique user experiences, or experimenting with game development.",
		"I just love turning ideas into reality."
	];

	let textMobile = [
		"Digital solutions with code, creativity, and design.",
	];

	let professions = [];

	let showHero = $state(false);

	let comment = "<!-- I have a lot of other skills too, press this to see them -->"
	let profText = "<Professions>";
	let profTextEnd = "</Professions>";

	// Typewriter effect state
	let currentProfession = $state('');
	let profIndex = 0;
	let charIndex = 0;
	let typing = true;

	function typeProfession() {
		if (typing) {
			if (charIndex < professions[profIndex].length) {
				currentProfession += professions[profIndex][charIndex];
				charIndex++;
				setTimeout(typeProfession, 60);
			} else {
				typing = false;
				setTimeout(eraseProfession, 1200);
			}
		}
	}

	function eraseProfession() {
		if (!typing) {
			if (charIndex > 0) {
				currentProfession = currentProfession.slice(0, -1);
				charIndex--;
				setTimeout(eraseProfession, 30);
			} else {
				typing = true;
				profIndex = (profIndex + 1) % professions.length;
				setTimeout(typeProfession, 300);
			}
		}
	}

	// Start the effect on mount
	import { onMount } from 'svelte';
	
	onMount(async () => {
		showHero = true;

		const professionsRes = await fetch('/api/professions');
		if (professionsRes.ok) {
			professions = await professionsRes.json();
			typeProfession();
		}
		
	});
</script>

{#if showHero}
	<section id="#" class="hero-gradient">
		<p class="orange small" id="intro" in:fly ={{ y: 200 }}>{text[0]}</p>
		<h1 class="big" id="name" in:fly ={{ y: 200, delay: 60 }}>{text[1]}</h1>
		<p class="sub mobile-hide" in:fly ={{ y: 200, delay: 120 }}>{text[2]}</p>
		<p class="sub mobile-hide" in:fly ={{ y: 200, delay: 180 }}>{text[3]}</p>
		<p class="sub mobile-hide" in:fly ={{ y: 200, delay: 240 }}>{text[4]}</p>
		<p class="sub mobile-only" in:fly ={{ y: 200, delay: 300 }}>{textMobile[0]}</p>
		<code class="medium" in:fly ={{ y: 200, delay: 450 }}>
			<a class="comment" href="/#Skills">{comment}</a>
			<p class="gradient-text">{profText}</p>
			<p class="tab gradient-text">{currentProfession}<span class="cursor">|</span></p>
			<p class="gradient-text">{profTextEnd}</p>
		</code>
		<div class="buttonsHor">
			<a class="first" href="/#Projects" in:fly ={{ y: 200, delay: 1200 }}>View my work <ArrowR /></a>
			<a class="second" href="/#Contacts" in:fly ={{ y: 200, delay: 1500 }}>Get in touch</a>
		</div>
		<a class="arrowDown mobile-hide" href="/#About"><ArrowD /></a>
	</section>
{/if}

<style>
	section {
		display: flex;
		flex-direction: column;
		
		max-width:100%;
		width: 100%;
		min-height: 100vh;

		justify-content: start;
		align-items: center;
	}

	#intro {
		text-align: center;
		margin-top: 7%;
		margin-bottom: 0px;
	}

	#name {
		text-align: center;
		margin-top: 0px;
		margin-bottom: 0px;
	}

	code {
		display: flex;
		flex-direction: column;

		margin-top: 25px;
		margin-bottom: 0px;

		width: 40%;
		height: 25%;

		background: rgba(0, 0, 0, 0.3);
		border: 4px solid rgba(0, 0, 0, 0.4);
		border-radius: 5px;

		padding: 10px;

		gap: 0px;
	}

	code p {
		margin-top: 4px;
		margin-bottom: 0px;
	}

	.buttonsHor {
		display: flex;

		margin-top: 40px;

		width: 30%;
		height: 50px;

		justify-content: space-around;
	}

	.buttonsHor a {
		display: flex;

		justify-content: space-around;
		align-items: center;

		width: 35%;

		font-size: 14px;
		font-weight: 600;

		text-decoration: none;

		border-radius: 12px;
	}

	.buttonsHor .first {
		background: hsl(221, 83%, 53%);
		color: white;

		transition: 0.15s;
	}

	.buttonsHor .first:hover {
		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-bg-opacity: 1;
		background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
	}

	.buttonsHor .first:hover :global(.R) {
		transition: 0.15s;
		transform: translateX(5px);
	}

	.buttonsHor .second {
		background: hsl(210, 40%, 96%);
		color: black;

		transition: 0.15s;
	}

	.buttonsHor .second:hover {
		background: hsl(190, 36%, 90%);
		color: hsl(221, 83%, 53%);
	}

	.arrowDown {
		position: relative;

		cursor: pointer;
		
		bottom: 1%;
		animation: pointDown 2s infinite;
		transition: 0.25s;
	}

	@keyframes pointDown {
		0%   { transform: translateY(0px); }
		50%  { transform: translateY(15px); }
		100% { transform: translateY(0px); }
	}
	
	.tab {
		margin-left: 40px;
	}

	.sub {
		text-align: center;
		font-size: 20px;
		font-weight: 400;

		color: rgb(148 163 184);
		
		margin-top: 10px;
		margin-bottom: 0px;
	}

	.small {
		font-size: 14px;
		font-weight: 600;
	}

	.medium {
		font-size: 20px;
		font-weight: 750;
	}

	.big {
		font-size: 72px;
		font-weight: 900;
	}

	.orange {
		color: orange;
	}

	.comment {
		color: green;
		font-size: 16px;
		font-weight: 300;

		text-decoration: none;

		margin-bottom: 5%;
	}

	.cursor {
	  	display: inline-block;
	  	width: 1ch;
		-webkit-text-fill-color: white;
		animation: blink 1s steps(1) infinite;
	}

	@keyframes blink {
	  0%, 50% { opacity: 1; }
	  51%, 100% { opacity: 0; }
	}

	.mobile-hide { display: block; }
	.mobile-only { display: none; }

	@media (max-width: 1425px) {
		code {
			width: 85%;
		}

		.buttonsHor {
			width: 60%;
		}
		
		.buttonsHor a {
			width: 40%;
		}
	}

	@media (max-width: 768px) {
		.mobile-hide { display: none; }
		.mobile-only { display: block; }
		
		.comment {
			font-size: 14px;
		}

		.sub {
			font-size: 17px;
		}

		.big {
			font-size: 55px;
		}

		.medium {
			 font-size: 17px;
		}

		.buttonsHor {
			width: 85%;
			height: 18%;

			flex-direction: column;
			gap: 10%;
		}

		.buttonsHor a {
			width: 100%;
			height: 100%;

			justify-content: center;
			gap: 15px;

			font-size: 30px;
		}

		:global(.R) {
			width: 60px;
			height: 40px;
		}
	}

	@media (max-height: 680px) {
		#intro {
			margin-top: 15px;
		}
	}
</style>