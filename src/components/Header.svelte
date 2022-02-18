<script>
  let open = false

  import DedeLogo from './DedeLogo.svelte'
  import Hamburger from 'svelte-hamburgers'
  import { fly } from 'svelte/transition'
  import { afterUpdate } from 'svelte'
  import { smoothScroll } from '../utilities.js'
  
  afterUpdate(() => {
    let buttons = smoothScroll()
    buttons.forEach((button) => { button.addEventListener('click', () => { open = false })})
  })
</script>

<header class="wrapper header">
  <DedeLogo></DedeLogo>
  <!-- <Hamburger bind:open type="emphatic" /> -->
  <!-- {#if open} -->
    <!-- <div class="header__menu--mobile" transition:fly="{{ y: 200, duration: 500 }}" >
      <ul class="header__menu">
        <li class="header__menu__item"><span data-smoothscroll="#vision">Vision</span></li>
        <li class="header__menu__item"><span data-smoothscroll="#why">Why</span></li>
        <li class="header__menu__item"><span data-smoothscroll="#who-we-are">Who we are</span></li>
        <li class="header__menu__item"><span data-smoothscroll="#needs">Needs</span></li>
        <li class="header__menu__item"><span data-smoothscroll="#what-we-do">What we do</span></li>
      </ul> -->
      <!-- <a class="header__button header__button--mobile" href="##">Open call</a> -->
    <!-- </div>
  {/if}
  <ul class="header__menu header__menu--desk">
    <li class="header__menu__item"><span data-smoothscroll="#vision">Vision</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#why">Why</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#who-we-are">Who we are</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#needs">Needs</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#what-we-do">What we do</span></li>
  </ul> -->
  <!-- <a class="header__button header__button--desk" href="##">Open call</a> -->
</header>
