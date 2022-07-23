<script lang="ts">
	import { params } from '@roxi/routify'
	import { chevronBackOutline } from 'ionicons/icons'
	$: id = $params.id
</script>

<ion-header translucent="true">
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-button
				on:click={() => {
					history.back()
				}}
			>
				<ion-icon slot="start" icon={chevronBackOutline} />
			</ion-button>
		</ion-buttons>
		<ion-title>Widget</ion-title>
	</ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
	widget: {id}
</ion-content>

<style>
</style>
