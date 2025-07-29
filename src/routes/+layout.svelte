<script>
  import Seo from 'sk-seo';
  import { setup } from 'svelte-match-media'
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();

  setup({
    desktop: 'screen and (min-width: 769px)',
    mobile: 'screen and (max-width: 768px)'
  })
</script>

<Seo />
{@render children?.()}