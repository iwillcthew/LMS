<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { t } from '$lib/utils/functions/translations';
  import { currentOrg } from '$lib/utils/store/org';
  import { GoogleIconColored } from '$features/ui/icons';
  import { authClient } from '$lib/utils/services/auth/client';
  import { snackbar } from '$features/ui/snackbar/store';
  import * as Card from '@cio/ui/base/card';
  import { Button } from '@cio/ui/base/button';
  import { Separator } from '@cio/ui/base/separator';
  import { preventDefault } from '$lib/utils/functions/svelte';
  import { ROUTE } from '$lib/utils/constants/routes';
  import { BRAND } from '$lib/utils/constants/brand';
  import { env } from '$env/dynamic/public';

  interface Props {
    isLogin?: boolean;
    showOnlyContent?: boolean;
    isLoading?: boolean;
    showLogo?: boolean;
    hideGoogleAuth?: boolean;
    redirectPathname?: string;
    newUserCallbackPathname?: string;
    handleSubmit?: () => void;
    children?: Snippet;
    getPasswordAuthAlternative?: Snippet;
  }

  let {
    isLogin = true,
    showOnlyContent = false,
    isLoading = false,
    showLogo = false,
    hideGoogleAuth = false,
    redirectPathname = '',
    newUserCallbackPathname,
    handleSubmit = () => {},
    children,
    getPasswordAuthAlternative
  }: Props = $props();

  async function signInWithGoogle() {
    if (isLoading) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const pathname = redirectPathname || params.get('redirect') || '';
    const redirectTo = `${window.location.origin + pathname}`;
    const errorCallbackURL = `${window.location.origin + ROUTE.AUTH_FAILED}`;
    const newUserCallbackURL = newUserCallbackPathname
      ? `${window.location.origin}${newUserCallbackPathname}`
      : undefined;

    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: redirectTo,
        errorCallbackURL,
        ...(newUserCallbackURL ? { newUserCallbackURL } : {})
      });

      if (result?.error) {
        snackbar.error('snackbar.social_auth_not_enabled');
      }
    } catch (error) {
      console.log('catch error', error);
    }
  }

  const authBackgroundUrl = $derived($currentOrg.customization.auth?.backgroundImage?.trim() ?? '');
  const googleEnabled = env.PUBLIC_GOOGLE_AUTH_ENABLED === 'true';
</script>

<div class="mp-auth">
  <aside class="mp-auth-story">
    <img src={BRAND.logo} alt={BRAND.name} class="mp-brand" />
    <div class="mp-story-copy">
      <p class="mp-eyebrow">{$t('mp_learning.eyebrow')}</p>
      <h1>{$t('mp_learning.headline')}</h1>
      <p class="mp-description">{$t('mp_learning.description')}</p>
      <div class="mp-learning-pillars">
        <span>{$t('mp_learning.learn')}</span>
        <span>{$t('mp_learning.practice')}</span>
        <span>{$t('mp_learning.grow')}</span>
      </div>
    </div>
    <p class="mp-story-footer">{$t('mp_learning.internal')}</p>
  </aside>
  <main class="mp-auth-main" style:background-image={authBackgroundUrl ? `url("${authBackgroundUrl}")` : undefined}>
    <div class="mp-auth-form">
      <Card.Root class="w-full border-0 bg-transparent shadow-none">
        {#if !showOnlyContent || showLogo}
          <Card.Header class="flex flex-col items-center gap-4">
            <a href={resolve(ROUTE.HOME, {})} class="mp-mobile-brand">
              <img src={BRAND.logo} alt={BRAND.name} />
            </a>

            {#if !showOnlyContent}
              <a href="/">
                <Card.Title class="text-2xl font-normal!">
                  {isLogin ? $t('login.welcome') : $t('login.create_account')}
                </Card.Title>
              </a>
              {#if isLogin}
                <Card.Description class="text-center">{$t('mp_learning.sign_in_description')}</Card.Description>
              {/if}
            {/if}
          </Card.Header>
        {/if}

        <Card.Content>
          <form onsubmit={preventDefault(handleSubmit)}>
            {@render children?.()}
          </form>

          {#if !showOnlyContent && (getPasswordAuthAlternative || (!hideGoogleAuth && googleEnabled))}
            <div class="mt-6 flex flex-col gap-6">
              <div class="relative flex items-center justify-center">
                <Separator />
                <span class="ui:bg-card ui:text-muted-foreground absolute px-2 text-sm"
                  >{$t('login.continue_with')}</span
                >
              </div>

              {#if getPasswordAuthAlternative}
                {@render getPasswordAuthAlternative()}
              {:else}
                <Button variant="outline" onclick={signInWithGoogle} disabled={isLoading} class="w-full">
                  <GoogleIconColored />
                  <span>
                    {isLogin ? $t('login.login_with_google') : $t('login.signup_with_google')}
                  </span>
                </Button>
              {/if}
            </div>
          {/if}
        </Card.Content>
        {#if !showOnlyContent}
          <Card.Footer class="flex-col gap-2 border-t pt-6">
            <p class="ui:text-muted-foreground text-center text-sm">
              {#if isLogin}
                {$t('mp_learning.invitation_hint')}
                <a class="ui:text-primary hover:underline" href="/signup{page.url.search}"
                  >{$t('mp_learning.activate')}</a
                >
              {:else}
                {$t('login.already_have_account')}
                <a class="ui:text-primary hover:underline" href="/login{page.url.search}">{$t('login.login')}</a>
              {/if}
            </p>
          </Card.Footer>
        {/if}
      </Card.Root>
    </div>
  </main>
</div>

<style>
  .mp-auth {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    min-height: 100svh;
    background: var(--background);
  }
  .mp-auth-story {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 3rem;
    padding: clamp(2rem, 5vw, 5rem);
    background: #edf6ff url('/brand/learning-background.png') center / cover;
    color: #183c72;
  }
  .mp-brand {
    width: min(100%, 330px);
    height: auto;
  }
  .mp-eyebrow {
    font-size: 0.75rem;
    font-weight: 650;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  h1 {
    margin: 1.5rem 0;
    max-width: 620px;
    font-size: clamp(2.2rem, 4vw, 4.2rem);
    line-height: 1.12;
    font-weight: 650;
    letter-spacing: -0.04em;
    text-wrap: balance;
  }
  .mp-description {
    max-width: 440px;
    font-size: 1rem;
    line-height: 1.8;
    color: #496587;
  }
  .mp-learning-pillars {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 2rem;
  }
  .mp-learning-pillars span {
    border: 1px solid #b9d7ef;
    border-radius: 999px;
    padding: 0.55rem 1rem;
    font-size: 0.8rem;
    background: #ffffff80;
  }
  .mp-story-footer {
    font-size: 0.75rem;
    color: #496587;
  }
  .mp-auth-main {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.25rem;
    background-size: cover;
  }
  .mp-auth-form {
    width: 100%;
    max-width: 440px;
  }
  .mp-mobile-brand {
    display: none;
  }
  @media (max-width: 800px) {
    .mp-auth {
      grid-template-columns: 1fr;
    }
    .mp-auth-story {
      display: none;
    }
    .mp-mobile-brand {
      display: block;
      width: 240px;
      margin-bottom: 1.5rem;
      padding: 0.75rem;
      border-radius: 0.75rem;
      background: white;
    }
    .mp-mobile-brand img {
      width: 100%;
      height: auto;
    }
  }
</style>
