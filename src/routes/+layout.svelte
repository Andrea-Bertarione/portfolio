<script>
  import Seo from 'sk-seo';
  import { setup } from 'svelte-match-media'
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  import { injectAnalytics } from '@vercel/analytics/sveltekit'

  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();

  injectSpeedInsights();
  injectAnalytics();

  setup({
    desktop: 'screen and (min-width: 769px)',
    mobile: 'screen and (max-width: 768px)'
  })
</script>

<Seo />
{@render children?.()}