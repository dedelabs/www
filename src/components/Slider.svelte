<script>
  export let title = "Title for hero component";
  export let overtitle = "overtitle";
  export let slides = [];
  export let colors = ['red', 'yellow', 'blue'];
</script>

<div class="hero">
  {overtitle}<br />
  {title}<br />
  {slides}<br />
  {colors}
</div>