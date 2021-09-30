<script>
	import data from './_data.json';

	import BlockWithImage from './components/BlockWithImage.svelte';
	import Bubbles from './components/Bubbles.svelte';
	import Hero from './components/Hero.svelte';
	import Slider from './components/Slider.svelte';
	import Cards from './components/Cards.svelte';

	// Hardcoded before routing
	$: components = data.pages.filter((p) => p.name == 'Home')[0].components;

	$: colors = data.colorPalette;
</script>

<main>
	{#each components as component}
		<svelte:component this={eval(component.type)} {...component} colors="{colors}" />
	{/each}
</main>