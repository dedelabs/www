<script>
  export let color;
  export let top;
  export let left;
  export let size;

  function generateBlob() {
    let p1 = random();
    let p2 = random();
    let p3 = random();
    let p4 = random();
    return `${p1}% ${reflect(p1)}% ${reflect(p2)}% ${p2}% / ${p3}% ${p4}% ${reflect(p4)}% ${reflect(p3)}%`;
  }

  let random = (from = 25, to = 75) => { return Math.floor(Math.random() * (to - from) + from) }
  let randomPosition = () => { return `${random(0, 100)}%` }
  let reflect = (n) => { return 100 - n }

  $: topPos = isNaN(top) ? randomPosition() : `${top}%`
  $: leftPos = isNaN(left) ? randomPosition() : `${left}%`
  $: dimensions = isNaN(size) ? `${random(20, 200)}px` : `${size}px`
</script>

<div class="blob" style="
  background-color: {color};
  --border-radius: {generateBlob()};
  --fifty: {generateBlob()};
  --onehundred: {generateBlob()};
  --top: {topPos};
  --left: {leftPos};
  --dimensions: {dimensions};
  --zindex: {random(1, 100)};
"></div>

<style>
  .blob {
    border-radius: var(--border-radius);
    animation: move 5s ease-in-out alternate infinite;
    top: var(--top);
    left: var(--left);
    width: var(--dimensions);
    height: var(--dimensions);
    transform: translateY(-50%);
    z-index: var(--zindex)
  }
  @keyframes move {
    50% { border-radius: var(--fifty) }
    100% { border-radius: var(--onehundred) }
  }
</style>