<script lang="ts">
  import LoginModal from "$components/LoginModal.svelte";
  import { modalController } from "$ionic/svelte";
  import IonPage from "$ionic/svelte/components/IonPage.svelte";
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

  const openLoginBox = async () => {
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

<svelte:head>
  <title>Login</title>
</svelte:head>

<IonPage>
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button />
      </ion-buttons>
      <ion-title>Login</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    <ion-button strong expand="block" on:click={openLoginBox}>
      Login
    </ion-button>

  </ion-content>
</IonPage>
