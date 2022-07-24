<script lang="ts">
import SupabaseAuthService from "$services/supabase.auth.service";
import type { Provider } from "@supabase/supabase-js";
import { toast } from '$services/toast';
import { loadingBox } from "$services/loadingMessage";
export let name: Provider;

const logoColors: any = {
    "google": "rgb(227,44,41)",
    "facebook": "rgb(59,89,152)",
    "spotify": "rgb(36,203,75)",
    "twitter": "rgb(30,135,235)",
    "apple": "gray",
    "slack": "rgb(221,157,35)",
    "twitch": "rgb(120,34,244)",            
    "discord": "rgb(116,131,244)",
    "github": "rgb(0,0,0)",
    "bitbucket": "rgb(56,98,169)",
    "gitlab": "rgb(209,44,30)",
    "azure": "rgb(228,54,26)",
    "linkedin": "rgb(2,119,181)",
    "zoom": "rgb(45,140,255)",
    "notion": window.matchMedia('(prefers-color-scheme: dark)').matches ? 'gray' : 'black',
  }

import {
    logoApple as apple,
    logoGoogle as google,
    logoTwitter as twitter,
    logoFacebook as facebook,
    logoYahoo as yahoo,
    logoGithub as github,
    logoSlack as slack,
    logoTwitch as twitch,
    logoDiscord as discord,
    logoBitbucket as bitbucket,    
    logoGitlab as gitlab,
    logoLinkedin as linkedin,
    logoMicrosoft as azure,
    logoMicrosoft as microsoft,
  } from "ionicons/icons";

  const icons = {
    "apple": apple,
    "google": google,
    "twitter": twitter,
    "facebook": facebook,
    "yahoo": yahoo,
    "github": github,
    "slack": slack,
    "twitch": twitch,
    "discord": discord,
    "bitbucket": bitbucket,
    "gitlab": gitlab,
    "linkedin": linkedin,
    "azure": azure,
    "microsoft": microsoft,
    "spotify": "./assets/spotify.svg",
    "notion": "./assets/notion.svg",
    "zoom": "./assets/zoom.svg",
  };
  
let supabaseAuthService: SupabaseAuthService;
	if (!supabaseAuthService) {
		supabaseAuthService = 
            SupabaseAuthService.getInstance();
	}
	const signInWithProvider = async (provider: Provider) => {
        const loader = await loadingBox(`Contacting ${provider}...`);

		const { /*user, session,*/ error } = 
        await supabaseAuthService.signInWithProvider(provider as Provider);
		if (error) {
            loader.dismiss();
			toast(error.message);
		}
	}
</script>    
		<ion-button
			fill='clear'
			class='round-button'
			style='margin:8px;color:primary'
			on:click={() => {
				signInWithProvider(name)
			}}>
			{#if (name.startsWith('./assets/'))}
				<ion-icon src={name}  size='large' slot="icon-only" />	
			{/if}
			{#if (!name.startsWith('./assets/'))}
				<ion-icon 
                    icon={icons[name]} 
                    style='color: {logoColors[name] || 'black'}'
                    size='large' 
                    slot="icon-only" />	
			{/if}
		</ion-button>	

<style>
    :root {
        --ion-BOXSHADOW: 5px 5px 15px 5px rgba(0,0,0,0.25);
    }  
    @media (prefers-color-scheme: dark) {
        body {
        --ion-BOXSHADOW: 5px 5px 15px 5px rgba(255,255,255,0.25);
        }
    }  
    .round-button {
        --border-radius: 50%;
        --box-shadow: var(--ion-BOXSHADOW);
    }
</style>