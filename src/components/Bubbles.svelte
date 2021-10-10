<script>
  export let overtitle = "overtitle";
  export let title = "Title for hero component";
  export let bubbles = ['first', 'second', 'third'];
  export let colors = ['red', 'yellow', 'blue'];
  export let slider = false;
  export let anchor;

  let HTMLanchor = anchor ? anchor : overtitle;

  import { generateBlob } from '../utilities.js';

  let navigation = { nextEl: '.bubbles__next' }
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
  <div class="bubbles">
    <div class="bubbles__overtitle">{overtitle}</div>
    <h3 class="bubbles__title">{@html title}</h3>
    {#if slider}
      <div class="bubbles__bubbles">
        <Swiper
          modules={[Navigation]}
          loop="{true}"
          navigation={navigation}
          class="bubbles__slides"
          spaceBetween={50}
          slidesPerView={4}
          breakpoints={breakpoints}
          on:slideChange={() => {}}
          on:swiper={(e) => {}}
        >
          {#each bubbles as bubble}
            <SwiperSlide>
              <div class="bubbles__bubble">
                <div class="bubbles__bubble__text">{bubble}</div>
                <div class="bubbles__bubble__bg" style="border-radius: {generateBlob()}; background-color: {colors[Math.floor(Math.random() * colors.length)]}"></div>
              </div>
            </SwiperSlide>
          {/each}
        </Swiper>
      </div>
      <div class="bubbles__next">Next -></div>
    {:else}
      <div class="bubbles__bubbles">
        {#each bubbles as bubble}
          <div class="bubbles__bubble-container">
            <div class="bubbles__bubble">
              <div class="bubbles__bubble__text">{bubble}</div>
              <div class="bubbles__bubble__bg" style="border-radius: {generateBlob()}; background-color: {colors[Math.floor(Math.random() * colors.length)]}"></div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>