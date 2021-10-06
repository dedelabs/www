<script>
  export let title = "Title for hero component";
  export let overtitle = "overtitle";
  export let slides = [];
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
  // Import Swiper styles
  import "swiper/css/navigation"
  import 'swiper/css'
</script>

<div class="wrapper">
  <div class="carousel">
    <div class="carousel__overtitle">
      {overtitle}
    </div>
    <h3 class="carousel__title">{title}</h3>
    <Swiper
      modules={[Navigation]}
      loop="{true}"
      navigation={navigation}
      class="carousel__slides"
      spaceBetween={50}
      slidesPerView={4}
      breakpoints={breakpoints}
      on:slideChange={() => console.log('slide change')}
      on:swiper={(e) => console.log(e.detail[0])}
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
  </div>
</div>

