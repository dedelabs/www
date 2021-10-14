<script>
  export let title = "Title for hero component";
  export let subtitle = "Subtitle for hero component";
  export let shapes = 2;
  export let colors = ['red', 'yellow', 'blue'];
  export let cta = false;

  import Blobs from './Blobs.svelte';
  import { afterUpdate } from 'svelte'
  import { smoothScroll } from '../utilities.js';
  
  afterUpdate(() => {
    smoothScroll()
  })
</script>

<div class="wrapper">
  <div class="hero">
    <div class="hero__content">
      <h1 class="hero__title">{title}</h1>
      <h3 class="hero__subtitle">{subtitle}</h3>
    </div>
    {#if cta}
      <div class="hero__cta" data-smoothscroll="#Solution">
        {cta.text}
        {#if cta.arrow}
          <div class="arrow arrow--{cta.arrow}">-></div>
        {/if}
      </div>
    {/if}
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>