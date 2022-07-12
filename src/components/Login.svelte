<script lang="ts">
    console.log('Login.svelte component mounted');
    import LoginModal from "$components/LoginModal.svelte";
    import { modalController } from "$ionic/svelte";
    import { onMount } from "svelte";
    import SupabaseAuthService from "$services/supabase.auth.service";
    import { User } from '@supabase/supabase-js';
    // import IonPage from "$ionic/svelte/components/IonPage.svelte";
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
    let supabaseAuthService: SupabaseAuthService;

    let localUser: User | null = null;
    onMount(() => {
        console.log('AAA onMount, subscribe to user');
        SupabaseAuthService.user.subscribe((user: User | null) => {
            localUser = user;
			console.log('LOGIN subscribed: user', user)
		})
        if (!supabaseAuthService) {
            console.log('load supabaseAuthService service');
	    	supabaseAuthService = 
            SupabaseAuthService.getInstance(
                SUPABASE_URL, SUPABASE_KEY);
    	}
    });

    const openProfile = async () => {
        console.log('openProfile NOT IMPLEMENTED');
    }
	const signOut = async () => {
		const { error } = await supabaseAuthService.signOut()
		if (error) {
			console.error('Error signing out', error)
		} else {
            // if (onSignOut) {
            //     onSignOut();
            // }
            window.location.reload();
        }
	}
    const openLoginBox = async () => {
        console.log('openLoginBox');
      const openLoginModalController = await modalController.create({
        component: LoginModal,
        componentProps: {
          providers: providers,
          SUPABASE_URL: SUPABASE_URL,
          SUPABASE_KEY: SUPABASE_KEY,
  
        },
        showBackdrop: true,
        backdropDismiss: true,
      });
  
      openLoginModalController.onDidDismiss().then((value) => {
        console.log("Dismissed the modal", value);
        if (value.role === "backdrop") console.log("Backdrop clicked");
      });
  
      await openLoginModalController.present();
    };
    let providers: string[] = ['google', 'facebook', 'twitter'];
  </script>
    
  {#if localUser}
  <div style={{width: '100%'}}>
    <ion-button fill='outline' color='dark'
        on:click={openProfile}
        size='small' expand='block' strong>
    {localUser?.email}
    </ion-button>
    <ion-button fill='outline' color='dark'
        on:click={signOut}
        size='small' expand='block' strong>
      Sign Out
    </ion-button>
    </div>
  {:else}
  <div style={{width: '100%'}}>
    <ion-button fill='outline' color='dark'
        on:click={openLoginBox}
        size='small' expand='block' strong>
        Sign In
    </ion-button>
    </div>
{/if}
  