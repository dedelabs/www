<script>
  export let title = "Title for hero component";
  export let overtitle = "overtitle";
  export let cards = [];
  export let slider = false;
  export let anchor;

  let HTMLanchor = anchor ? anchor : overtitle;

  let navigation = { nextEl: '.cards__next' }
  let breakpoints = {
    '320': {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    '640': {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    '1200': {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  }
  import { Navigation } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/svelte'
</script>

<div class="wrapper" id="{HTMLanchor}">
  <div class="cards">
    <div class="cards__overtitle">{overtitle}</div>
    <h3 class="cards__title">{title}</h3>
    {#if slider}
      <Swiper
        modules={[Navigation]}
        loop="{true}"
        navigation={navigation}
        class="cards__container"
        spaceBetween={50}
        slidesPerView={4}
        breakpoints={breakpoints}
        on:slideChange={() => {}}
        on:swiper={(e) => {}}
      >
        {#each cards as card}
          <SwiperSlide>
            <div class="cards__card">
              <h4 class="cards__card__title">{@html card.title}</h4>
              {card.description}
            </div>
          </SwiperSlide>
        {/each}
      </Swiper>
      <div class="cards__next">Next -></div>
    {:else}
      <div class="cards__container">
        {#each cards as card}
          <div class="cards__card">
            <h4 class="cards__card__title">{@html card.title}</h4>
            {card.description}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>