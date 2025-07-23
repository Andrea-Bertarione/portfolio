<script>
  import Seo from 'sk-seo';
  import { setup } from 'svelte-match-media'

  setup({
    desktop: 'screen and (min-width: 769px)',
    mobile: 'screen and (max-width: 768px)'
  })
</script>

<Seo />
<slot />