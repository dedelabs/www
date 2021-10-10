<script>
  export let color;
  export let top;
  export let left;
  export let size;
  export let zindex;

  import { generateBlob, random } from '../utilities.js';

  let randomPosition = () => { return `${random(0, 100)}%` }
  

  $: topPos = isNaN(top) ? randomPosition() : `${top}%`
  $: leftPos = isNaN(left) ? randomPosition() : `${left}%`
  $: dimensions = isNaN(size) ? `${random(20, 200)}px` : `${size}px`
  $: zIndex = isNaN(zindex) ? random(1, 100) : zindex
</script>

<div class="blob" style="
  background-color: {color};
  --border-radius: {generateBlob()};
  --fifty: {generateBlob()};
  --onehundred: {generateBlob()};
  --top: {topPos};
  --left: {leftPos};
  --dimensions: {dimensions};
  --zindex: {zIndex};
  --blobtiming: {random(3,5)}s;
  --bloboffsettiming: -{random(3,5)}s;
"></div>

<style>
  .blob {
    border-radius: var(--border-radius);
    animation: move var(--blobtiming) var(--bloboffsettiming) ease-in-out alternate infinite;
    top: var(--top);
    left: var(--left);
    width: var(--dimensions);
    height: var(--dimensions);
    z-index: var(--zindex);
    pointer-events: none
  }
  @keyframes move {
    50% { border-radius: var(--fifty) }
    100% { border-radius: var(--onehundred) }
  }
</style>