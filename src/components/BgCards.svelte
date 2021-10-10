<script>
  export let title = "Title for hero component";
  export let overtitle = "overtitle";
  export let cards = [];
  export let slider = false;
  export let anchor;

  let HTMLanchor = anchor ? anchor : overtitle;

  let navigation = { nextEl: '.bg-cards__next' }
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
  <div class="bg-cards">
    <div class="bg-cards__overtitle">{overtitle}</div>
    <h3 class="bg-cards__title">{title}</h3>
    {#if slider}
      <Swiper
        modules={[Navigation]}
        loop="{true}"
        navigation={navigation}
        class="bg-cards__container"
        spaceBetween={50}
        slidesPerView={4}
        breakpoints={breakpoints}
        on:slideChange={() => {}}
        on:swiper={(e) => {}}
      >
        {#each cards as card}
          <SwiperSlide>
            <div class="bg-cards__card" style="background-image: linear-gradient(to bottom, rgba(33, 37, 41, 0), rgba(33, 37, 41, 0.4))">
              <div class="bg-cards__card__title">
                <strong>{@html card.firstLine}</strong><br />
                {#if card.secondLine}
                  <small>{@html card.secondLine}</small>
                {/if}
              </div>
            </div>
          </SwiperSlide>
        {/each}
      </Swiper>
      <div class="bg-cards__next">Next -></div>
    {:else}
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
    {/if}
  </div>
</div>