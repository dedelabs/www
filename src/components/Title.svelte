<script>
  export let title = "Sample title"
  export let subtitle
  export let type = 'Title'
  export let shapes = 0
  export let colors = ['red', 'yellow', 'blue']

  let baseClass = type.toLowerCase()

  import Blobs from './Blobs.svelte'
</script>

<div class="wrapper">
  <div class="{baseClass}">
    <h2 class="{baseClass}__title">{title}</h2>
    {#if subtitle}
      <h4 class="{baseClass}__subtitle">{subtitle}</h4>
    {/if}
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>