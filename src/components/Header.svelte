<script>
  import DedeLogo from './DedeLogo.svelte';
  import { afterUpdate } from 'svelte'
   afterUpdate(() => {
			let buttons = document.querySelectorAll('[data-smoothscroll]')
			buttons.forEach((button) => {
				button.addEventListener('click', function () {
					let target = this.getAttribute('data-smoothscroll')
					document.querySelector(target).scrollIntoView({ behavior: 'smooth' })
			})
		})
  })
</script>

<div class="wrapper header">
  <DedeLogo></DedeLogo>
  <ul class="header__menu">
    <li class="header__menu__item"><span data-smoothscroll="#Solution">Solution</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#Why">Why</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#How">How</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#What">What</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#Who">Who</span></li>
    <li class="header__menu__item"><span data-smoothscroll="#Micromaster">Micromaster</span></li>
  </ul>
  <a class="header__button">Open call</a>
</div>
