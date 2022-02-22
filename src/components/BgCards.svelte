<script>
  export let title = "Title for hero component"
  export let overtitle = "overtitle"
  export let cards = []
  export let slider = false
  export let anchor
  export let type = 'BgCards'
  export let shapes = 0
  export let colors = ['red', 'yellow', 'blue']

  let HTMLanchor = anchor ? anchor : overtitle;
  let baseClass = type.toLowerCase()
  let navigation = { nextEl: `.${baseClass}__next` }

  import { Navigation } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/svelte'
  import { swiperBreakpoints, l } from '../utilities.js'
  import Blobs from './Blobs.svelte'
</script>

<div class="wrapper" id="{HTMLanchor}">
  <div class="{baseClass}">
    <div class="{baseClass}__overtitle">{l(overtitle)}</div>
    <h3 class="{baseClass}__title">{@html l(title)}</h3>
    {#if slider}
      <Swiper
        modules={[Navigation]}
        loop="{true}"
        navigation={navigation}
        class="{baseClass}__container"
        spaceBetween={50}
        slidesPerView={3}
        breakpoints={swiperBreakpoints}
        on:slideChange={() => {}}
        on:swiper={(e) => {}}
      >
        {#each cards as card}
          <SwiperSlide>
            <div class="{baseClass}__card">
              <div class="{baseClass}__card__title {card.secondLine ? '{baseClass}__card__title--with-subtitle' : ''}">
                <strong>{@html l(card.firstLine)}</strong><br />
                {#if card.secondLine}
                  <small>{@html l(card.secondLine)}</small>
                {/if}
              </div>
              <div class="{baseClass}__card__image" style="background-image: url('images/{card.imagePath}')"></div>
            </div>
          </SwiperSlide>
        {/each}
      </Swiper>
      <div class="{baseClass}__next">Next -></div>
    {:else}
      <div class="{baseClass}__container">
        {#each cards as card}
          <div class="{baseClass}__card">
            <div class="{baseClass}__card__title {card.secondLine ? '{baseClass}__card__title--with-subtitle' : ''}">
              <strong>{@html l(card.firstLine)}</strong><br />
              {#if card.secondLine}
                <small>{@html l(card.secondLine)}</small>
              {/if}
            </div>
            <div class="{baseClass}__card__image" style="background-image: url('images/{card.imagePath}')"></div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <Blobs shapes={shapes} colors="{colors}"></Blobs>
</div>