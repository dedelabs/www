<script>
  export let title = "Sample title"
  export let subtitle
  export let type = 'Title'
  export let shapes = 0
  export let ll
  export let colors = ['red', 'yellow', 'blue']

  let baseClass = type.toLowerCase()

  import Blobs from './Blobs.svelte'
  import { l } from '../utilities.js'
</script>

<div class="wrapper">
  <div class="{baseClass}">
    <h2 class="{baseClass}__title">{l(title, ll)}</h2>
    {#if subtitle}
      <h4 class="{baseClass}__subtitle">{l(subtitle, ll)}</h4>
    {/if}
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>