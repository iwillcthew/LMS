<script lang="ts">
  import * as Sidebar from '@cio/ui/base/sidebar';
  import { BRAND } from '$lib/utils/constants/brand';
  import { basePath } from '$lib/utils/store/app';
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton size="lg" tooltipContent={BRAND.name}>
      {#snippet child({ props })}
        <a href={$basePath} {...props}>
          <img src={BRAND.logo} alt={BRAND.name} class="h-auto w-full rounded-md bg-white p-2" />
        </a>
      {/snippet}
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
</Sidebar.Menu>
