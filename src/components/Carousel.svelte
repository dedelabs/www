<script>
  export let title = "Title for hero component";
  export let overtitle = "overtitle";
  export let slides = [];
  export let slider = true;

  export let anchor;

  let HTMLanchor = anchor ? anchor : overtitle;

  let navigation = { nextEl: '.carousel__next' }
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

  // Import Swiper Svelte components
  import { Navigation } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/svelte'
</script>

<div class="wrapper" id="{HTMLanchor}">
  <div class="carousel">
    <div class="carousel__overtitle">
      {overtitle}
    </div>
    {#if slider}
      <h3 class="carousel__title">{title}</h3>
      <Swiper
        modules={[Navigation]}
        loop="{true}"
        navigation={navigation}
        class="carousel__slides"
        spaceBetween={50}
        slidesPerView={4}
        breakpoints={breakpoints}
        on:slideChange={() => {}}
        on:swiper={(e) => {}}
      >
        {#each slides as slide}
          <SwiperSlide>
            {@html slide.image}
            <h4 class="carousel__slide__title">{slide.title}</h4>
            {slide.description}
          </SwiperSlide>
        {/each}
      </Swiper>
      <div class="carousel__next">Next -></div>
    {:else}
      <div class="carousel__slides carousel__slides--no-slider">
        {#each slides as slide}
          <div class="carousel__slide">
            {@html slide.image}
            <h4 class="carousel__slide__title">{slide.title}</h4>
            {slide.description}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

