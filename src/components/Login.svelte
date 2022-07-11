<script lang="ts">
//import { modalController } from "$ionic/svelte";
//import IonPage from "$lib/ionic/svelte/components/IonPage.svelte";
import { IonContent } from "@ionic/core/components/ion-content";
  import {
    closeOutline,
    lockOpenOutline,
    lockClosedOutline
  } from "ionicons/icons";

  let email = '';
  let password = '';
  let providers: string[] = [];
  let showModal = false;
  let backdropDismiss = true;
  let localUser: any = {};
  let showLoading = false;
</script>

<ion-modal 
is-open={showModal} 
backdropDismiss={backdropDismiss}
className='my-custom-class'>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color='primary' onClick={() => {showModal = false;}}>
                <ion-icon size='large' icon={closeOutline}></ion-icon>
            </ion-button>
    </ion-buttons>
      <ion-title>Sign In</ion-title>
    </ion-toolbar>
    <ion-buttons slot="start">
    </ion-buttons>
</ion-header>
<!-- <IonPage> -->
  <IonContent>
    <ion-loading is-open={showLoading} message={'Loading'} />

    <ion-grid class="ion-padding" style={{maxWidth: '375px'}}>
        <ion-row>
            <ion-col>
                <ion-label>Email Address</ion-label>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>

                <ion-item className="loginItem" lines="none">
                    <ion-input 
                        bind:value={email} 
                        type="email" 
                        placeholder="Email">
                        <ion-icon class="inputIcon" icon={mailOutline} slot="start" size="large" color="medium"></ion-icon>
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
                <ion-item className="loginItem" lines="none">
                    <ion-input type="password" 
                    placeholder="Password" 
                    bind:value={password} 
                    class="loginInputBoxWithIcon">
                    <ion-icon  
                    icon={password.length ? lockOpenOutline: lockClosedOutline} 
                    slot="start" size="large" color="medium"></ion-icon>
                    </ion-input> 
                </ion-item>
                <div onClick={resetPassword} className="ion-text-right" style={{paddingTop:'10px'}}>
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
                    onClick={signInWithEmail}>
                        <ion-icon icon={arrowForwardOutline} size="large" />&nbsp;&nbsp;
                        <b>Sign in with email</b>
                    </ion-button>
                    <div onClick={toggleSignUpMode} className="ion-text-center" style={{paddingTop:'10px'}}>
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
                        onClick={signUp}>
                        <ion-icon icon={personAdd} size="large" />&nbsp;&nbsp;
                        <b>Sign Up</b></ion-button>
                        <div onClick={toggleSignUpMode} className="ion-text-center" style={{paddingTop:'10px'}}>
                        <ion-label>Already have an account? <b>Sign In</b></ion-label>
                    </div>
                </ion-col>
            </ion-row>
        {/if}
        <ion-row>
            <ion-col>
                <div className="ion-text-center" style={{marginBottom: '10px'}}>
                    <ion-label><b>or</b></ion-label>
                </div>
                <ion-button expand="block" 
                disabled={!validateEmail(email) || password.length > 0}
                onClick={sendMagicLink}>
                <ion-icon icon={link} size="large" />&nbsp;&nbsp;
                <b>Send Sign In Link</b></ion-button>                    
            </ion-col>
        </ion-row>
    </ion-grid>
    {#if providers}
        <div className="ion-text-center">
        <ion-label>or, sign in with:</ion-label>
        </div>
    {/if}
    <ion-grid class="ion-padding ion-text-center" style={{maxWidth: '375px'}}>
        <ion-row>
            <ion-col>
                {#each providers as provider}
                    <ProviderSignInButton SUPABASE_URL={SUPABASE_URL} SUPABASE_KEY={SUPABASE_KEY} key={`provider-${provider}`} name={provider} color={logoColors[provider] || 'black'} />
                {/each}
        </ion-col>
        </ion-row>
    </ion-grid>    

  </IonContent>
</ion-modal>
<IonContent>
{#if !localUser}
    <ion-item lines='none' detail={false} onClick={() => setShowModal(true)}>
        <ion-icon slot='start' ios={logInOutline} md={logInSharp}></ion-icon>
        <div style={{width: '100%'}}>
            <ion-button fill='outline' color='dark'
                size='small' expand='block' strong>
                Sign In
            </ion-button>
        </div>
    </ion-item>
{/if}
{#if localUser}
    <ion-item lines='none' detail={false} 
        style={{cursor: profileFunction ? 'pointer' : 'default'}}
        onClick={loadProfile}
    >
        <ion-icon slot='start' ios={personOutline} md={personSharp}></ion-icon>
        <ion-label className='ion-text-center ion-text-wrap'>
            <strong>{localUser?.email}</strong>
        </ion-label>
    </ion-item>
    <ion-item lines='none' detail={false} onClick={signOut}>
        <ion-icon slot='start' ios={logOutOutline} md={logOutSharp}></ion-icon>
        <div style={{width: '100%'}}>
            <ion-button fill='outline' color='dark'
                size='small' expand='block' strong>
                Sign Out
            </ion-button>
        </div>
    </ion-item>
{/if}
</IonContent>

<style>
    .inputIcon {
        margin-left: 10px;
        margin-right: 10px
    }
    .loginInputBoxWithIcon {
        height: 50px;
        border: 1px solid rgb(212, 212, 212);
        background-color: var(--ion-background-color) !important;
        /* border-bottom: 1px solid hsl(0, 0%, 83%); */
        border-radius: 5px;
    }

</style>