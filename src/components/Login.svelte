<script lang="ts">
  import { modalController } from "$ionic/svelte";
</script>

<ion-modal 
isOpen={showModal} 
backdropDismiss={backdropDismiss}
className='my-custom-class'>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color='primary' onClick={() => setShowModal(false)}>
                <ion-icon size='large' icon={closeOutline}></ion-icon>
        </ion-button>
    </ion-buttons>
      <ion-title>Sign In</ion-title>
    </ion-toolbar>
    <ion-buttons slot="start">
    </ion-buttons>
</ion-header>
  <IonContent>
      <ion-loading isOpen={showLoading} message={'Loading'} />

    <ion-grid class="ion-padding" style={{maxWidth: '375px'}}>
        <ion-row>
            <ion-col>
                <ion-label>Email Address</ion-label>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>

                <ion-item className="loginItem" lines="none">
                    <ion-input type="email"
                    placeholder="Email" 
                    onIonChange={e => setEmail(e.detail.value!)}
                    value={email} className="loginInputBoxWithIcon">
                    <ion-icon className="inputIcon" icon={mailOutline} slot="start" size="large" color="medium"></ion-icon>
                    </ion-input>
                </ion-item>

            </ion-col>
        </ion-row>
        {!validateEmail(email) && email.length > 0 && 
            <ion-row>
                <ion-col>
                    <ion-label color="danger"><b>Invalid email format</b></ion-label>
                </ion-col>
            </ion-row>
        }
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
                    onIonChange={e => setPassword(e.detail.value!)}
                    value={password} className="loginInputBoxWithIcon">
                    <ion-icon className="inputIcon" 
                    icon={password.length ? lockOpenOutline: lockClosedOutline} 
                    slot="start" size="large" color="medium"></ion-icon>
                    </ion-input> 
                </ion-item>
                <div onClick={resetPassword} className="ion-text-right" style={{paddingTop:'10px'}}>
                    <ion-label><b>Forgot password?</b></ion-label>
                </div>
            </ion-col>
        </ion-row>
        {password.length > 0 && password.length < 6 && 
            <ion-row>
                <ion-col>
                    <ion-label color="danger"><b>Password too short</b></ion-label>
                </ion-col>
            </ion-row>
        }
        { !signUpMode &&
            <ion-row>
                <ion-col>
                    <IonButton expand="block" color="primary"
                    disabled={!validateEmail(email) || password.length < 6}
                    onClick={signInWithEmail}>
                        <ion-icon icon={arrowForwardOutline} size="large" />&nbsp;&nbsp;
                        <b>Sign in with email</b>
                    </IonButton>
                    <div onClick={toggleSignUpMode} className="ion-text-center" style={{paddingTop:'10px'}}>
                        <ion-label>Don't have an account? <b>Sign Up</b></ion-label>
                    </div>
                </ion-col>
            </ion-row>
        }
        { signUpMode &&
            <ion-row>
                <ion-col>
                        <IonButton expand="block" 
                        disabled={!validateEmail(email) || password.length < 6}
                        onClick={signUp}>
                        <ion-icon icon={personAdd} size="large" />&nbsp;&nbsp;
                        <b>Sign Up</b></IonButton>
                        <div onClick={toggleSignUpMode} className="ion-text-center" style={{paddingTop:'10px'}}>
                        <ion-label>Already have an account? <b>Sign In</b></ion-label>
                    </div>
                </ion-col>
            </ion-row>
        }
        <ion-row>
            <ion-col>
                <div className="ion-text-center" style={{marginBottom: '10px'}}>
                    <ion-label><b>or</b></ion-label>
                </div>
                <IonButton expand="block" 
                disabled={!validateEmail(email) || password.length > 0}
                onClick={sendMagicLink}>
                <ion-icon icon={link} size="large" />&nbsp;&nbsp;
                <b>Send Sign In Link</b></IonButton>                    
            </ion-col>
        </ion-row>
    </ion-grid>
    { providers &&
        <div className="ion-text-center">
        <ion-label>or, sign in with:</ion-label>
        </div>
    }
    <ion-grid class="ion-padding ion-text-center" style={{maxWidth: '375px'}}>
        <ion-row>
            <ion-col>
                {providers?.map(provider => {
                    return (
                    <ProviderSignInButton SUPABASE_URL={SUPABASE_URL} SUPABASE_KEY={SUPABASE_KEY} key={`provider-${provider}`} name={provider} color={logoColors[provider] || 'black'} />
                    )
                })} 
        </ion-col>
        </ion-row>
    </ion-grid>    

  </IonContent>
</ion-modal>
{!localUser && (
    <ion-item lines='none' detail={false} onClick={() => setShowModal(true)}>
        <ion-icon slot='start' ios={logInOutline} md={logInSharp}></ion-icon>
        <div style={{width: '100%'}}>
            <IonButton fill='outline' color='dark'
                size='small' expand='block' strong>
                Sign In
            </IonButton>
        </div>
    </ion-item>
)}
{localUser && (
    <>
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
            <IonButton fill='outline' color='dark'
                size='small' expand='block' strong>
                Sign Out
            </IonButton>
        </div>
    </ion-item>
    </>
)}


<style>
</style>