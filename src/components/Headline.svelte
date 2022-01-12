<script>
  export let title = "Title for hero component"
  export let text = "Text_html for hero component"
  export let typewriter_html = "<span>1</span>"
  export let shapes = 2
  export let colors = ['red', 'yellow', 'blue']
  export let cta = false
  export let type = 'Headline'

  let baseClass = type.toLowerCase()

  import Typewriter from 'svelte-typewriter'
  import Blobs from './Blobs.svelte'
  import { afterUpdate } from 'svelte'
  import { smoothScroll } from '../utilities.js'

  afterUpdate(() => {
    smoothScroll()
  })
</script>

<div class="wrapper">
  <div class="{baseClass}">
    <div class="{baseClass}__content">
      <h1 class="{baseClass}__title">{title}</h1>
      <h3 class="{baseClass}__text">
        {text}
        <Typewriter loopRandom={1000} unwriteInterval={20} interval={[50, 70, 90]}>{@html typewriter_html}</Typewriter>
      </h3>
    </div>
    {#if cta}
      <div class="{baseClass}__cta" data-smoothscroll="#solution">
        {cta.text}
        {#if cta.arrow}
          <div class="arrow arrow--{cta.arrow}">-></div>
        {/if}
      </div>
    {/if}
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>