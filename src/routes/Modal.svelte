<script lang="ts">
  import LoginModal from "$components/LoginModal.svelte";
  import { modalController } from "$ionic/svelte";
  import IonPage from "$ionic/svelte/components/IonPage.svelte";
  import {
    closeOutline,
    lockOpenOutline,
    lockClosedOutline
  } from "ionicons/icons";
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

  const showModalController = async () => {
    const modal = await modalController.create({
      component: LoginModal,
      componentProps: {
        providers: providers,
        SUPABASE_URL: SUPABASE_URL,
        SUPABASE_KEY: SUPABASE_KEY,

      },
      showBackdrop: true,
      backdropDismiss: true,
    });

    modal.onDidDismiss().then((value) => {
      console.log("Dismissed the modal", value);
      if (value.role === "backdrop") console.log("Backdrop clicked");
    });

    await modal.present();
  };
  // let email = '';
  // let password = '';
  let providers: string[] = ['google', 'facebook', 'twitter'];
  // let showModal = false;
  // let backdropDismiss = true;
  // let localUser: any = {};
  // let showLoading = false;

</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<IonPage>
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button />
      </ion-buttons>
      <!-- <ion-buttons slot="end">
      </ion-buttons> -->
      <ion-title>Login</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    <ion-button strong expand="block" on:click={showModalController}>
      Show modal - via controller
    </ion-button>

  </ion-content>
</IonPage>
