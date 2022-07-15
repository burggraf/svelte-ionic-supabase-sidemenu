<script lang="ts">
import SupabaseAuthService from "$services/supabase.auth.service";
import type { Provider } from "@supabase/supabase-js";
import { toast } from '$services/toast';

// import { Provider } from '@supabase/supabase-js'

export let name: string;
// export let color: string;
export let SUPABASE_URL: string;
export let SUPABASE_KEY: string;
let showLoading = false;
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
    //"linkedin": "rgb(3,47,84)",
    "linkedin": "rgb(2,119,181)",
    "zoom": "rgb(45,140,255)",
    "notion": window.matchMedia('(prefers-color-scheme: dark)').matches ? 'gray' : 'black',
  }

// import { IonLoading } from "@ionic/core/components/ion-loading";
// import { IonButton } from "@ionic/core/components/ion-button";

//   const defineComponent = (tagName: string, customElement: any) => {
//     if (typeof customElements === "undefined") return;

//     if (!customElements.get(tagName)) {
//         customElements.define(tagName, customElement);
//     }
// };

//   defineComponent("ion-loading", IonLoading);
//   defineComponent("ion-button", IonButton);

// import SupabaseAuthService from './supabase.auth.service'

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
    // spotify: 'node_modules/ionic-react-supabase-login/dist/spotify.svg', // logoSpotify,
	// notion: 'node_modules/ionic-react-supabase-login/dist/notion.svg', // logoNotion,
	// zoom: 'node_modules/ionic-react-supabase-login/dist/zoom.svg', // logoZoom,
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
    // "spotify": spotify,
    // "notion": notion,
    // "zoom": zoom,
  };
  

//import logoZoom from './zoom.svg'

let supabaseAuthService: SupabaseAuthService;
	if (!supabaseAuthService) {
		supabaseAuthService = 
            SupabaseAuthService.getInstance(
                SUPABASE_URL, SUPABASE_KEY);
	}
	const signInWithProvider = async (provider: Provider) => {
		const { user, session, error } = 
        await supabaseAuthService.signInWithProvider(provider as Provider);
		if (error) {
			toast(error.message);
			console.log(error.message);
			showLoading = false;
		} else {
			// *** we can't get here becuase of the third-party redirect...
            console.log('user', user);
            console.log('session', session);
            console.log('error', error);
		}
	}
	// const [present, dismiss] = useIonToast()

	// const toast = (message: string, color: string = 'danger') => {
	// 	present({
	// 		color: color,
	// 		message: message,
	// 		cssClass: 'toast',
	// 		buttons: [{ icon: 'close', handler: () => dismiss() }],
	// 		duration: 3000,
	// 		//onDidDismiss: () => console.log('dismissed'),
	// 		//onWillDismiss: () => console.log('will dismiss'),
	// 	})
	// }
</script>    
		<ion-loading isOpen={showLoading} message='Loading' />
		<ion-button
			fill='clear'
			class='round-button'
			style='margin:8px;color:primary'
			on:click={() => {
				signInWithProvider(name)
			}}>
			{#if (name.startsWith('node_modules'))}
				<ion-icon src={name}  size='large' slot="icon-only" />	
			{/if}
			{#if (!name.startsWith('node_modules'))}
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

    .flex-child {
        margin: 2% 5% 2%
    }  

    .round-button {
        --border-radius: 50%;
        --box-shadow: var(--ion-BOXSHADOW);
    }
</style>