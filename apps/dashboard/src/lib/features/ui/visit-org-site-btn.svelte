<script lang="ts">
  import { Button, type ButtonVariant } from '@cio/ui/base/button';
  import SquareArrowOutUpRight from '@lucide/svelte/icons/square-arrow-out-up-right';
  import type { Component } from 'svelte';

  import { isMobile } from '$lib/utils/store/useMobile';
  import { t } from '$lib/utils/functions/translations';

  interface Props {
    className?: string;
    isLMS?: boolean;
    labelKey?: string;
    variant?: ButtonVariant;
    forceSubdomain?: boolean;
    pathname?: string;
    icon?: Component;
  }

  let {
    className = '',
    isLMS = false,
    labelKey = 'lms_navigation.my_learning',
    variant = 'default',
    forceSubdomain = false,
    pathname,
    icon: Icon = SquareArrowOutUpRight
  }: Props = $props();

  const href = $derived(pathname ?? '/lms');
</script>

<Button {href} target="_blank" {variant} class={`&_span:hidden! md:&_span:block ml-2 ${className}`.trim()}>
  {#if !$isMobile}
    <span>
      {#if isLMS}
        {$t('lms_navigation.my_learning')}
      {:else}
        {$t(labelKey)}
      {/if}
    </span>
  {/if}
  <Icon class="custom" />
</Button>
