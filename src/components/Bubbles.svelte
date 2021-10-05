<script>
  export let overtitle = "overtitle";
  export let title = "Title for hero component";
  export let bubbles = ['first', 'second', 'third'];
  export let colors = ['red', 'yellow', 'blue'];

  import { generateBlob } from '../utilities.js';
</script>

<div class="wrapper">
  <div class="bubbles">
    <div class="bubbles__overtitle">{overtitle}</div>
    <h3 class="bubbles__title">{@html title}</h3>
    <div class="bubbles__bubbles">
      {#each bubbles as bubble}
        <div class="bubbles__bubble">
          <div class="bubbles__bubble__text">{bubble}</div>
          <div class="bubbles__bubble__bg" style="border-radius: {generateBlob()}; background-color: {colors[Math.floor(Math.random() * colors.length)]}"></div>
        </div>
      {/each}
    </div>
  </div>
</div>