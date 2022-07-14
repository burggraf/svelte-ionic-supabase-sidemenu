<script lang="ts">
  import IonPage from "$ionic/svelte/components/IonPage.svelte";

  // import { goto } from "@roxi/routify";
  // $goto("/", {  });
</script>

<svelte:head>
  <title>Root</title>
</svelte:head>

<IonPage>
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button />
      </ion-buttons>
      <ion-title>Root</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    root

  </ion-content>
</IonPage>

