<script lang="ts">
  import IonPage from "$ionic/svelte/components/IonPage.svelte";

  // import { goto } from "@roxi/routify";
  // $goto("/", {  });
</script>

<svelte:head>
  <title>Landing Page</title>
</svelte:head>

<IonPage>
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button />
      </ion-buttons>
      <ion-title>Landing Page</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    Landing Page Here...

  </ion-content>
</IonPage>

