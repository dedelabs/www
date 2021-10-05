<script>
  export let imagePosition = "left";
  export let imagePath = "image.jpg";
  export let overtitle = "overtitle";
  export let title = "Title for hero component";
  export let description = "Sample description";
  export let shapes = 2;
  export let colors = ['red', 'yellow', 'blue'];

  import Blobs from './Blobs.svelte';

  let random = (from = 25, to = 75) => { return Math.floor(Math.random() * (to - from) + from) }
</script>

<div class="wrapper">
  <div class="block block--{imagePosition}">
    <div class="block__content">
      <div class="block__overtitle">{overtitle}</div>
      <h3 class="block__title">{title}</h3>
      <div class="block__description">{description}</div>
    </div>
    <div class="block__image" style="background-image: url('images/{imagePath}')">
    </div>
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>