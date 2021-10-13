<script>
	import data from './_data.json';
	import "swiper/css/navigation";
  import 'swiper/css';
	import BgCards from './components/BgCards.svelte';
	import BlockWithImage from './components/BlockWithImage.svelte';
	import Bubbles from './components/Bubbles.svelte';
	import Cards from './components/Cards.svelte';
	import Carousel from './components/Carousel.svelte';
	import Hero from './components/Hero.svelte';
	import Spacer from './components/Spacer.svelte';
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';

	let loadedComponents = {
		"BgCards": BgCards,
		"BlockWithImage": BlockWithImage,
		"Bubbles": Bubbles,
		"Cards": Cards,
		"Carousel": Carousel,
		"Hero": Hero,
		"Spacer": Spacer
	}
	// Hardcoded before routing
	$: components = data.pages.filter((p) => p.name == 'Home')[0].components;

	$: colors = data.colorPalette;
</script>

<main>
	<Header></Header>
	{#each components as component}
		<svelte:component this={loadedComponents[component.type]} {...component} colors="{colors}" />
	{/each}
	<Footer></Footer>
</main>