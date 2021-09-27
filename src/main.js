import App from './App.svelte';
import data from './_data.json';


console.log(data);
const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;