<script>
  export let title = ""
  export let subtitle = ""
  export let content = ""
  export let type = 'Text'
  export let shapes = 0
  export let anchor
  export let colors = ['red', 'yellow', 'blue']

  let HTMLanchor = anchor ? anchor : title
  let baseClass = type.toLowerCase()

  import { l } from '../utilities.js'
  import Blobs from './Blobs.svelte'
</script>

<div class="wrapper" id="{HTMLanchor}">
  <div class="{baseClass}">
    {#if title}
      <h2 class="{baseClass}__title">{l(title)}</h2>
    {/if}
    <h3 class="{baseClass}__subtitle">{l(subtitle)}</h3>
    <div class="{baseClass}__content center">
      <p>{@html l(content)}</p>
    </div>
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>