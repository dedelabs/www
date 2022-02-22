<script>
  export let title = ""
  export let overtitle = "overtitle"
  export let slides = []
  export let slider = true
  export let type = 'Carousel'
  export let anchor
  export let shapes = 0
  export let colors = ['red', 'yellow', 'blue']

  let HTMLanchor = anchor ? anchor : overtitle
  let baseClass = type.toLowerCase()
  let navigation = { nextEl: `.${baseClass}__next` }

  import { Navigation } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/svelte'
  import { swiperBreakpoints, l } from '../utilities.js'
  import Blobs from './Blobs.svelte'
</script>

<div class="wrapper" id="{HTMLanchor}">
  <div class="{baseClass}">
    <div class="{baseClass}__overtitle h2 underline">
      {l(overtitle)}
    </div>
    <div class="Spacer" style="height: 50px"></div>
    {#if slider}
      <h3 class="{baseClass}__title">{@html l(title)}</h3>
      <Swiper
        modules={[Navigation]}
        loop="{true}"
        navigation={navigation}
        class="{baseClass}__slides"
        spaceBetween={50}
        slidesPerView={3}
        breakpoints={swiperBreakpoints}
        on:slideChange={() => {}}
        on:swiper={(e) => {}}
      >
        {#each slides as slide}
          <SwiperSlide class="{baseClass}__slide">
            <div class="{baseClass}__slide__image">{@html slide.image}</div>
            <h2 class="{baseClass}__slide__title dede-blue">{l(slide.title)}</h2>
            <p class="{baseClass}__slide__description">{l(slide.description)}</p>
          </SwiperSlide>
        {/each}
      </Swiper>
      <div class="{baseClass}__next">Next -></div>
    {:else}
      <div class="{baseClass}__slides {baseClass}__slides--no-slider">
        {#each slides as slide}
          <div class="{baseClass}__slide">
            {@html slide.image}
            <h2 class="{baseClass}__slide__title dede-blue">{l(slide.title)}</h2>
            <p class="{baseClass}__slide__description">{l(slide.description)}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>