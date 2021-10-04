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
      {title}<br />
      {description}<br />
    </div>
    <div class="block__image" style="background-image: url('https://lorempixel.com/300/{random(300, 500)}/')">
      {imagePath}<br />
    </div>
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>