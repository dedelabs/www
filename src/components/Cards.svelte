<script>
  export let title = "Title for hero component";
  export let overtitle = "overtitle";
  export let cards = [];
</script>

<div class="wrapper">
  <div class="cards">
    <div class="cards__overtitle">{overtitle}</div>
    <h3 class="cards__title">{title}</h3>
    <div class="cards__container">
      {#each cards as card}
        <div class="cards__card">
          <h5 class="cards__card__title">{@html card.title}</h5>
          {card.description}
        </div>
      {/each}
    </div>
  </div>
</div>