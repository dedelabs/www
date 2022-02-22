<script>
	import data from './_data.json'
	import "swiper/css/navigation"
  import 'swiper/css'

	import BgCards from './components/BgCards.svelte'
	import BlockWithImage from './components/BlockWithImage.svelte'
	import Bubbles from './components/Bubbles.svelte'
	import Cards from './components/Cards.svelte'
	import Carousel from './components/Carousel.svelte'
	import Footer from './components/Footer.svelte'
	import Header from './components/Header.svelte'
	import Headline from './components/Headline.svelte'
	import Hero from './components/Hero.svelte'
	import Spacer from './components/Spacer.svelte'
	import Text from './components/Text.svelte'
	import Title from './components/Title.svelte'

	let loadedComponents = {
		"BgCards": BgCards,
		"BlockWithImage": BlockWithImage,
		"Bubbles": Bubbles,
		"Cards": Cards,
		"Carousel": Carousel,
		"Hero": Hero,
		"Headline": Headline,
		"Spacer": Spacer,
		"Text": Text,
		"Title": Title
	}

	let getLanguages = (langs) => {
		window.availableLanguages = langs;
		return langs;
	}

	// Hardcoded before routing
	$: components = data.pages.filter((p) => p.name == 'Home')[0].components;

	$: colors = data.colorPalette;
	$: languages = getLanguages(data.languages);
</script>

<main>
	<Header></Header>
	{#each components as component}
		<svelte:component this={loadedComponents[component.type]} {...component} colors="{colors}" />
	{/each}
	<Footer></Footer>
</main>
