<script>
  export let imagePosition = "left"
  export let imagePath = "image.jpg"
  export let overtitle = ""
  export let pretitle
  export let title = "Title for hero component"
  export let description = "Sample description"
  export let shapes = 2
  export let colors = ['red', 'yellow', 'blue']
  export let anchor
  export let ll
  export let type = 'BlockWithImage'
 
  let HTMLanchor = anchor ? anchor : title
  let baseClass = type.toLowerCase()

  import { generateBlob, random, l } from "../utilities.js"
  import Blobs from './Blobs.svelte'
</script>

<div class="wrapper center" id="{HTMLanchor}">
  {#if pretitle}
    <div class="{baseClass}__pretitle h2 underline">
      {l(pretitle, ll)}
    </div>
    <div class="Spacer" style="height: 50px"></div>
  {/if}
  <div class="{baseClass} {baseClass}--{imagePosition}">
    <div class="{baseClass}__content center">
      {#if overtitle}
        <div class="{baseClass}__overtitle">{l(overtitle, ll)}</div>
      {/if}
      <h2 class="{baseClass}__title dede-blue">{l(title, ll)}</h2>
      <div class="{baseClass}__description">{l(description, ll)}</div>
    </div>
    <div class="{baseClass}__image" style="background-image: url('images/{imagePath}'); border-radius: {generateBlob(30, 70)}">
    </div>
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>