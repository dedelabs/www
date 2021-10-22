<script>
  export let imagePosition = "left"
  export let imagePath = "image.jpg"
  export let overtitle = "overtitle"
  export let title = "Title for hero component"
  export let description = "Sample description"
  export let shapes = 2
  export let colors = ['red', 'yellow', 'blue']
  export let anchor
  export let type = 'BlockWithImage'
 
  let HTMLanchor = anchor ? anchor : title
  let baseClass = type.toLowerCase()

  import { generateBlob, random } from "../utilities.js"
  import Blobs from './Blobs.svelte'
</script>

<div class="wrapper" id="{HTMLanchor}">
  <div class="{baseClass} {baseClass}--{imagePosition}">
    <div class="{baseClass}__content">
      <div class="{baseClass}__overtitle">{overtitle}</div>
      <h2 class="{baseClass}__title">{title}</h2>
      <div class="{baseClass}__description">{description}</div>
    </div>
    <div class="{baseClass}__image" style="background-image: url('images/{imagePath}'); border-radius: {generateBlob(30, 70)}">
    </div>
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>