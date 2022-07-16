<script lang="ts">
  import SupabaseAuthService from "$services/supabase.auth.service";
  import { modalController } from "$ionic/svelte";
  import LoginProviderSignInButton from "$components/Login/LoginProviderSignInButton.svelte";
  import { IonLoading } from "@ionic/core/components/ion-loading";
  import { toast } from '$services/toast';
  export let providers: string[] = [];  
  export let SUPABASE_KEY: string = "";
  export let SUPABASE_URL: string = "";
  export let onSignIn: Function = () => {};

  const defineComponent = (tagName: string, customElement: any) => {
    if (typeof customElements === "undefined") return;

    if (!customElements.get(tagName)) {
        customElements.define(tagName, customElement);
    }
};

  defineComponent("ion-loading", IonLoading);
  let supabaseAuthService: SupabaseAuthService;
	if (!supabaseAuthService) {
		supabaseAuthService = 
            SupabaseAuthService.getInstance(
                SUPABASE_URL, SUPABASE_KEY);
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

//   console.log("Received providers", providers);
//   console.log("Received SUPABASE_KEY", SUPABASE_KEY);
//   console.log("Received SUPABASE_URL", SUPABASE_URL);


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

  const closeOverlay = () => {
    modalController.dismiss({ data: Date.now() });
  };

  function handleEmailValue(event) {
    email = event.target.value!;
  }
  function handlePasswordValue(event) {
    password = event.target.value!;
  }

  // import { logoIonic, star, fingerPrint, ellipsisVertical } from "ionicons/icons";
 
  // const clickAction = (event) => {
  //   console.log("You clicked me!!", event.detail);
  // };

  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const resetPassword = async () => {
    showLoading = true;
        const {/*data,*/ error} = 
            await supabaseAuthService.resetPassword(email);
            if (error) { showLoading = false;toast(error.message) }
            else { showLoading = false;toast('Please check your email for a password reset link', 'success') }
        }
  
  const signInWithEmail = async ()=> {
        showLoading = true;

        const {user, session, error} = 
        await supabaseAuthService.signInWithEmail(email, password);
        if (error) { 
            showLoading = false; toast(error.message); 
        } else { 
            // window.location.href = '/';
            // console.log('error', error);
            // console.log('user', user);
            // console.log('session', session);
            showLoading = false;
            showModal = false;
            modalController.dismiss({ data: Date.now() });
            if (onSignIn) {
                onSignIn(user, session);
            }
         }
  }

  const signUp = async () => {
    showLoading = true;
    const {/*user, session,*/ error} = 
        await supabaseAuthService.signUpWithEmail(email, password);
        if (error) { 
            console.error(error); 
            showLoading = false;
            toast(error.message) }
        else { 
            showLoading = false;
            toast('Please check your email for a confirmation link', 'success') 
        }
    }
  const toggleSignUpMode = () => {
    signUpMode = !signUpMode;
  }
  const sendMagicLink = async () => {
        showLoading = true;
        const {/*user, session,*/ error} = 
            await supabaseAuthService.sendMagicLink(email);
            if (error) { 
                showLoading = false;
                toast(error.message) }
            else { 
                //setShowLoading(false);
                showLoading = false;
                toast('Please check your email for a sign in link', 'success') 
            }
  }
  let email = '';
  let password = '';
  let showModal = false;
  let backdropDismiss = true;
  let localUser: any = {};
  let showLoading = false;
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

<!-- <ion-content class="ion-padding"> -->
  <ion-loading is-open={showLoading} message={'Loading'} />
  <ion-grid class="ion-padding" style="max-width:375px">
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
  {#if providers}
      <div class="ion-text-center">
      <ion-label>or, sign in with:</ion-label>
      </div>
  {/if}
  <ion-grid class="ion-padding ion-text-center" style="max-width:375px">
      <ion-row>
          <ion-col>
              {#each providers as provider}
                  <LoginProviderSignInButton 
                    SUPABASE_URL={SUPABASE_URL} 
                    SUPABASE_KEY={SUPABASE_KEY} 
                    name={provider} 
                    color={logoColors[provider] || 'black'} />
              {/each}
      </ion-col>
      </ion-row>
  </ion-grid>    
<!-- </ion-content> -->

<style>
input:-webkit-autofill {
    /* height: 0px; */
    /* -webkit-box-shadow:0 0 0 10px var(--ion-color-FORCECLEAR) inset; */
    -webkit-text-fill-color: var(--ion-color-FORCEDARK);
    font-weight: 500px;
}

input:-webkit-autofill:focus {
    /* height: 0px; */
    /* -webkit-box-shadow: 0 0 0 10px var(--ion-color-FORCECLEAR) inset; */
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
    /* border-bottom: 1px solid hsl(0, 0%, 83%); */
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

    /* flex-wrap: wrap; */
    /* border: 1px solid; */

    /* margin-right: 10px;
    margin-left: 10px; */
}
</style>