<script lang="ts">
  import SupabaseAuthService from "$services/supabase.auth.service";
  import { modalController } from "$ionic/svelte";
  import { toast } from '$services/toast';

  import { loadingBox } from "$services/loadingMessage";

  export let SUPABASE_KEY: string = "";
  export let SUPABASE_URL: string = "";
  export let token: string = "";

  const defineComponent = (tagName: string, customElement: any) => {
    if (typeof customElements === "undefined") return;

    if (!customElements.get(tagName)) {
        customElements.define(tagName, customElement);
    }
};

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

  const closeOverlay = () => {
    modalController.dismiss({ data: Date.now() });
  };
  function handlePasswordValue(event) {
    password = event.target.value!;
  }

  // import { logoIonic, star, fingerPrint, ellipsisVertical } from "ionicons/icons";
 
  // const clickAction = (event) => {
  //   console.log("You clicked me!!", event.detail);
  // };

  let password = '';
  let showModal = false;
  let backdropDismiss = false;

  const updatePassword = async () => {
    const loader = await loadingBox('Updating password...');

        const { /*data,*/ error }  = 
            await supabaseAuthService.updatePassword(token, password);
        if (error) { loader.dismiss();toast(error.message) }
        else { 
            loader.dismiss();
            toast("Password updated", 'success', 3000);
            closeOverlay();
        }
  }
</script>

<ion-header translucent="true">
  <ion-toolbar>
    <ion-title>Reset Password</ion-title>
    <ion-buttons slot="start">
      <ion-button on:click={closeOverlay}>
        <ion-icon 
        icon={closeOutline} 
        slot="start" size="large" color="medium"></ion-icon>
        </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<!-- <ion-content class="ion-padding"> -->
  <ion-grid class="ion-padding" style="max-width:375px">
      <ion-row>
          <ion-col>
              <ion-label>New Password:</ion-label>
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

          </ion-col>
      </ion-row>
      {#if password.length > 0 && password.length < 6}
          <ion-row>
              <ion-col>
                  <ion-label color="danger"><b>Password too short</b></ion-label>
              </ion-col>
          </ion-row>
      {/if}
          <ion-row>
              <ion-col>
                  <ion-button expand="block" color="primary"
                  disabled={password.length < 6}
                  on:click={updatePassword}>
                      <ion-icon icon={arrowForwardOutline} size="large" />&nbsp;&nbsp;
                      <b>Save New Password</b>
                  </ion-button>
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