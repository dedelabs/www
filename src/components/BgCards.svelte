<script>
  export let title = "Title for hero component";
  export let overtitle = "overtitle";
  export let cards = [];
</script>

<div class="wrapper">
  <div class="bg-cards">
    <div class="bg-cards__overtitle">{overtitle}</div>
    <h3 class="bg-cards__title">{title}</h3>
    <div class="bg-cards__container">
      {#each cards as card}
        <!-- <div class="bg-cards__card"  style="background-image: url('images/{card.imagePath}')"> -->
        <div class="bg-cards__card" style="background-image: linear-gradient(to bottom, rgba(33, 37, 41, 0), rgba(33, 37, 41, 0.4))">
          <div class="bg-cards__card__title">
            <strong>{@html card.firstLine}</strong><br />
            {#if card.secondLine}
              <small>{@html card.secondLine}</small>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>