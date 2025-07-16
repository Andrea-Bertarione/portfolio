<script>
	const calcAge = (dob) => {
		const now = new Date();
		let age = now.getFullYear() - dob.getFullYear();
		const m = now.getMonth() - dob.getMonth();
		if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
			age--;
		}
		return age;
	}

	let age = calcAge(new Date(2004, 6, 13));
	let experience = calcAge(new Date(2018, 3, 12));

	let showHero = false;

	import aboutText from "../data/aboutme"
	let aboutMe = aboutText({ age, experience });

	// Start the effect on mount
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			console.log('About onMount fired');
			showHero = true;
		}
	});
</script>

{#if showHero}
<section id="About">
	<h2>About me</h2>

	<div class="textWrapper">
		<img src="profile.jpg" alt="Profile">
		<div class="textContainer">
			<p class="mainText">
				{@html aboutMe}
			</p>
		</div>
	</div>
</section>
{/if}

<style>
	section {
		display: flex;

		flex-direction: column;
		align-items: center;

		max-width:100%;
		width: 100vw;
		height: 100vh;
	}

	section h2 {
		margin-top: 160px;
		font-size: 3rem;
		color: rgb(30 41 59 / var(--tw-text-opacity, 1));

		display: flex;
		flex-direction: column;

		align-items: center;
		justify-content: center;
	}

	section h2::after {
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

	.textWrapper {
		display: flex;
		width: 100%;
		height: calc(100% - 160px - 3rem);

		justify-content: space-around;
		align-items: center;
	}

	.textWrapper img {
		width: 20%;
		height: 40%;

		margin-bottom: 12%;

		border-radius: 30px;
		box-shadow: 0px 0px 15px 13px rgba(0,0,0,0.6);
	}

	.textWrapper .textContainer {
		width: 30%;
		height: 60%;
	}

	.textWrapper .textContainer .mainText {
		font-weight: 400;
		color: rgb(71 85 105);
	}

	@media (max-width: 680px) {
		section h2 {
			margin-top: 100px;
		}

		.textWrapper {
			flex-direction: column;
		}

		.textWrapper img {
			width: 70%;
			height: 40%;
		}

		.textWrapper .textContainer {
		width: 80%;
		height: 60%;
		}
	}
</style>