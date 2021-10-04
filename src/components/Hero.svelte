<script>
  export let title = "Title for hero component";
  export let subtitle = "Subtitle for hero component";
  export let shapes = 2;
  export let colors = ['red', 'yellow', 'blue'];

  import Blobs from './Blobs.svelte';
</script>

<div class="wrapper">
  <div class="hero">
    <div class="hero__content">
      <h1 class="hero__title">{title}</h1>
      <h3>{subtitle}</h3>
    </div>
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>