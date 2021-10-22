export let generateBlob = (from = 25, to = 75) => {
  let p1 = random(from, to);
  let p2 = random(from, to);
  let p3 = random(from, to);
  let p4 = random(from, to);
  return `${p1}% ${reflect(p1)}% ${reflect(p2)}% ${p2}% / ${p3}% ${p4}% ${reflect(p4)}% ${reflect(p3)}%`;
}

export let random = (from = 25, to = 75) => { return Math.floor(Math.random() * (to - from) + from) }

export let reflect = (n) => { return 100 - n }

export let smoothScroll = () => { 
  let buttons = document.querySelectorAll('[data-smoothscroll]')
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      open = false
      let target = this.getAttribute('data-smoothscroll')
      let headerOffset = 20
      if (window.innerWidth < 1024) { 
        headerOffset = document.querySelector('header.header').offsetHeight
      }
      
      let offsetPosition = document.querySelector(target).offsetTop - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });  
    })
  })
  return buttons
}

export let swiperBreakpoints = {
  '1': {
    slidesPerView: 1,
    spaceBetween: 0,
  },
  '480': {
    slidesPerView: 1,
    spaceBetween: 0,
  },
  '720': {
    slidesPerView: 2,
    spaceBetween: 0,
  },
  '1024': {
    slidesPerView: 3,
    spaceBetween: 0,
  },
}