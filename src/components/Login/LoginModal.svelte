<script lang="ts">
  import SupabaseAuthService from "$services/supabase.auth.service";
  import { modalController } from "$ionic/svelte";
  import LoginProviderSignInButton from "$components/Login/LoginProviderSignInButton.svelte";
  import type { Provider } from "@supabase/supabase-js";

  import { toast } from '$services/toast';
  import { loadingBox } from "$services/loadingMessage";
  export let providers: Provider[] = [];  
  export let onSignIn: Function = () => {};
//   const defineComponent = (tagName: string, customElement: any) => {
//     if (typeof customElements === "undefined") return;

//     if (!customElements.get(tagName)) {
//         customElements.define(tagName, customElement);
//     }
// };

  let supabaseAuthService: SupabaseAuthService;
	if (!supabaseAuthService) {
		supabaseAuthService = 
            SupabaseAuthService.getInstance();
	}

  import {
    mailOutline,
    closeOutline,
    personAdd,
    lockOpenOutline,
    lockClosedOutline,
    arrowForwardOutline,
    link
  } from "ionicons/icons";

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
  let showModal = false;
  const closeOverlay = () => {
    modalController.dismiss({ data: Date.now() });
  };

  function handleEmailValue(event) {
    email = event.target.value!;
  }
  function handlePasswordValue(event) {
    password = event.target.value!;
  }

  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const resetPassword = async () => {
    const loader = await loadingBox('Requesting password reset link...');
    const {/*data,*/ error} = 
            await supabaseAuthService.resetPassword(email);
            if (error) { loader.dismiss();toast(error.message) }
            else { loader.dismiss();toast('Please check your email for a password reset link', 'success') }
        }
  
  const signInWithEmail = async ()=> {
        const loader = await loadingBox('Logging in...');
        console.log('loader', loader);
        const {user, session, error} = 
        await supabaseAuthService.signInWithEmail(email, password);
        if (error) { 
            loader.dismiss();
        } else { 
            loader.dismiss();
            showModal = false;
            modalController.dismiss({ data: Date.now() });
            if (onSignIn) {
                onSignIn(user, session);
            }
         }
  }

  const signUp = async () => {
    const loader = await loadingBox('Signing you up...');
    const {/*user, session,*/ error} = 
        await supabaseAuthService.signUpWithEmail(email, password);
        if (error) { 
            console.error(error); 
            loader.dismiss();
            toast(error.message) }
        else { 
            loader.dismiss();
            toast('Please check your email for a confirmation link', 'success') 
        }
    }
  const toggleSignUpMode = () => {
    signUpMode = !signUpMode;
  }
  const sendMagicLink = async () => {
    const loader = await loadingBox('Requesting magic link...');
        const {/*user, session,*/ error} = 
            await supabaseAuthService.sendMagicLink(email);
            if (error) { 
                loader.dismiss();
                toast(error.message) }
            else { 
                //setShowLoading(false);
                loader.dismiss();
                toast('Please check your email for a sign in link', 'success') 
            }
  }
  let email = '';
  let password = '';
  let signUpMode = false;

</script>

<svelte:head>
  <title>Ionic Companion - Modal Extra</title>
</svelte:head>
<ion-header translucent="true">
  <ion-toolbar>
    <ion-title>Sign In</ion-title>
    <ion-buttons slot="start">
      <ion-icon 
      on:click={closeOverlay}
      icon={closeOutline} 
      slot="start" size="large" color="medium"></ion-icon>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

  <ion-grid class="ion-padding LoginGrid">
      <ion-row>
          <ion-col>
              <ion-label>Email Address</ion-label>
          </ion-col>
      </ion-row>
      <ion-row>
          <ion-col>

              <ion-item class="loginItem" lines="none">
                  <ion-input 
                      on:ionChange={handleEmailValue}
                      class="loginInputBoxWithIcon"
                      type="email" 
                      placeholder="Email">
                      <ion-icon class="inputIcon" 
                        icon={mailOutline} 
                        slot="start" size="large" color="medium"></ion-icon>
                  </ion-input>

              </ion-item>

          </ion-col>
      </ion-row>
      {#if !validateEmail(email) && email.length > 0} 
          <ion-row>
              <ion-col>
                  <ion-label color="danger"><b>Invalid email format</b></ion-label>
              </ion-col>
          </ion-row>
      {/if}
      <ion-row>
          <ion-col>
              <ion-label>Password</ion-label>
          </ion-col>
      </ion-row>
      <ion-row>
          <ion-col>
              <ion-item class="loginItem" lines="none">
                  <ion-input type="password" 
                  placeholder="Password" 
                  on:ionChange={handlePasswordValue}
                  class="loginInputBoxWithIcon">
                  <ion-icon class="inputIcon"
                    icon={password.length ? lockOpenOutline: lockClosedOutline} 
                  slot="start" size="large" color="medium"></ion-icon>
                  </ion-input> 
              </ion-item>
              <div on:click={resetPassword} 
                    class="ion-text-right" 
                    style="padding-top:10px">
                  <ion-label><b>Forgot password?</b></ion-label>
              </div>
          </ion-col>
      </ion-row>
      {#if password.length > 0 && password.length < 6}
          <ion-row>
              <ion-col>
                  <ion-label color="danger"><b>Password too short</b></ion-label>
              </ion-col>
          </ion-row>
      {/if}
      {#if !signUpMode}
          <ion-row>
              <ion-col>
                  <ion-button expand="block" color="primary"
                  disabled={!validateEmail(email) || password.length < 6}
                  on:click={signInWithEmail}>
                      <ion-icon icon={arrowForwardOutline} size="large" />&nbsp;&nbsp;
                      <b>Sign in with email</b>
                  </ion-button>
                  <div on:click={toggleSignUpMode} 
                      class="ion-text-center" 
                      style="padding-top:10px">
                      <ion-label>Don't have an account? <b>Sign Up</b></ion-label>
                  </div>
              </ion-col>
          </ion-row>
      {/if}
      {#if signUpMode}
          <ion-row>
              <ion-col>
                      <ion-button expand="block" 
                      disabled={!validateEmail(email) || password.length < 6}
                      on:click={signUp}>
                      <ion-icon icon={personAdd} size="large" />&nbsp;&nbsp;
                      <b>Sign Up</b></ion-button>
                      <div on:click={toggleSignUpMode} 
                      class="ion-text-center" 
                      style="padding-top:10px">
                      <ion-label>Already have an account? <b>Sign In</b></ion-label>
                  </div>
              </ion-col>
          </ion-row>
      {/if}
      <ion-row>
          <ion-col>
              <div class="ion-text-center" style="margin-bottom:10px">
                  <ion-label><b>or</b></ion-label>
              </div>
              <ion-button expand="block" 
              disabled={!validateEmail(email) || password.length > 0}
              on:click={sendMagicLink}>
              <ion-icon icon={link} size="large" />&nbsp;&nbsp;
              <b>Send Sign In Link</b></ion-button>                    
          </ion-col>
      </ion-row>
  </ion-grid>
  {#if providers && providers.length > 0}
      <div class="ion-text-center">
      <ion-label>or, sign in with:</ion-label>
      </div>
  {/if}
  <ion-grid class="ion-padding ion-text-center ProvidersGrid"> 
      <ion-row>
          <ion-col>
              {#each providers as provider}
                  <LoginProviderSignInButton 
                    name={provider} 
                    />
              {/each}
      </ion-col>
      </ion-row>
  </ion-grid>    

<style>
.LoginGrid {
    max-width:375px;
}
.ProvidersGrid {
    max-width:375px;
}
input:-webkit-autofill {
    -webkit-text-fill-color: var(--ion-color-FORCEDARK);
    font-weight: 500px;
}

input:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--ion-color-FORCEDARK);
    font-weight: 500px;
} 


.inputIcon {
    margin-left: 10px;
    margin-right: 10px
}

.loginItem {
    --padding-start: 0px;
    --padding-end: 0px;
    --inner-padding-end: 0px;
}
.loginInputBoxWithIcon {
    height: 50px;
    border: 1px solid rgb(212, 212, 212);
    background-color: var(--ion-background-color) !important;
    border-radius: 5px;
}
.toast {
    font-weight: bold;
}
.flex-container {
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    flex-flow: row wrap;
    -webkit-flex-flow: row wrap;
    -moz-flex-flow: row wrap;
    justify-content: center;
}
</style>