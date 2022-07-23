<script lang="ts">
	import IonPage from '$lib/ionic/svelte/components/IonPage.svelte'
	import { params } from '@roxi/routify'
  import { chevronBackOutline } from 'ionicons/icons'
	$: id = $params.id
</script>

<!-- <IonPage> -->
		<ion-header translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">

          <ion-button on:click={()=>{history.back();}}>
            <ion-icon slot="start" icon={chevronBackOutline}></ion-icon>
          </ion-button>
          <!-- below: not working -->
					<!-- <ion-back-button defaultHref="/TestData" default-href="/TestData" color="primary" /> -->
				</ion-buttons>
				<ion-title>Widget</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">

		widget: {id}
	</ion-content>
<!-- </IonPage> -->

<style>
	ion-menu-button {
		color: var(--ion-color-primary);
	}

	#container {
		text-align: center;
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	#container strong {
		font-size: 20px;
		line-height: 26px;
	}

	#container p {
		font-size: 16px;
		line-height: 22px;
		color: #8c8c8c;
		margin: 0;
	}

	#container a {
		text-decoration: none;
	}
</style>
