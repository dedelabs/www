export let generateBlob = () => {
  let p1 = random();
  let p2 = random();
  let p3 = random();
  let p4 = random();
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