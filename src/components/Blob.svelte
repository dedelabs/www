<script>
  export let color
  export let top
  export let left
  export let size
  export let zindex

  let randomPosition = () => {
    return `${random(0, 100)}%`
  }

  import { generateBlob, random } from "../utilities.js"

  $: topPos = isNaN(top) ? randomPosition() : `${top}%`
  $: leftPos = isNaN(left) ? randomPosition() : `${left}%`
  $: dimensions = isNaN(size) ? `${random(20, 200)}px` : `${size}px`
  $: zIndex = isNaN(zindex) ? random(1, 100) : zindex
</script>

<div
  class="blob"
  style="
  background-color: {color}66;
  --top: {topPos};
  --left: {leftPos};
  --dimensions: {dimensions};
  --zindex: {zIndex};
  --blobtiming: {random(35, 45)}s;
  --bloboffsettiming: -{random(25, 35)}s;
"
>
  <div
    class="blob-in"
    style="
    background-color: {color};
    --border-radius: {generateBlob()};
    --fifty: {generateBlob()};
    --onehundred: {generateBlob()};
    --dimensions: {dimensions};
    --blobtiming: {random(3, 5)}s;
    --bloboffsettiming: -{random(3, 5)}s;
  "
  />
</div>

<style>
  .blob {
    /* background-color: transparent; */
    transform-origin: 40% 55%;
    animation: rotate var(--blobtiming) var(--bloboffsettiming) linear infinite;
    top: var(--top);
    left: var(--left);
    width: var(--dimensions);
    height: var(--dimensions);
    z-index: var(--zindex);
    pointer-events: none;
  }
  .blob-in {
    transform: scale(0.9);
    border-radius: var(--border-radius);
    animation: move var(--blobtiming) var(--bloboffsettiming) ease-in-out
      alternate infinite;
    width: var(--dimensions);
    height: var(--dimensions);
  }
  @keyframes move {
    0% {
      border-radius: var(--fifty);
    }
    100% {
      border-radius: var(--onehundred);
    }
  }
  @keyframes rotate {
    0% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.12) rotate(180deg);
    }
    100% {
      transform: scale(1) rotate(359deg);
    }
  }
</style>
