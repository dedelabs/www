<script>
  export let shapes
  export let colors

  import Blob from './Blob.svelte'
</script>

{#if (typeof shapes === 'number')}
  {#each Array(shapes) as _, i}
    <Blob color="{colors[Math.floor(Math.random() * colors.length)]}"></Blob>
  {/each}
{:else}
  {#each shapes as shape, i}
    <Blob color="{shape.color}" top="{shape.top}" left="{shape.left}" size="{shape.size}" zindex="{shape.zindex}"></Blob>
  {/each}
{/if}