<script>
  export let height = 100
  export let type = 'Spacer'
  export let shapes = 0
  export let colors = ['red', 'yellow', 'blue']

  let baseClass = type.toLowerCase()

  import Blobs from './Blobs.svelte'
</script>

<div class="{baseClass}" style="height: {height}px"></div>
<Blobs shapes={shapes} colors="{colors}"></Blobs>