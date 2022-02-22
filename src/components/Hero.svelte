<script>
  export let title = "Title for hero component"
  export let subtitle = "Subtitle for hero component"
  export let shapes = 2
  export let colors = ['red', 'yellow', 'blue']
  export let cta = false
  export let type = 'Hero'

  let baseClass = type.toLowerCase()

  import Blobs from './Blobs.svelte'
  import { afterUpdate } from 'svelte'
  import { smoothScroll, l } from '../utilities.js'

  afterUpdate(() => {
    smoothScroll()
  })
</script>

<div class="wrapper">
  <div class="{baseClass}">
    <div class="{baseClass}__content">
      <h1 class="{baseClass}__title">{l(title)}</h1>
      <h3 class="{baseClass}__subtitle">{l(subtitle)}</h3>
    </div>
    {#if cta}
      <div class="{baseClass}__cta" data-smoothscroll="#solution">
        {l(cta.text)}
        {#if cta.arrow}
          <div class="arrow arrow--{cta.arrow}">-></div>
        {/if}
      </div>
    {/if}
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>