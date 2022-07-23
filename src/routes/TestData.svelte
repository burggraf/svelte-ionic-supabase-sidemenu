<script lang="ts">
	import SupabaseDataService from '$services/supabase.data.service'
	// import { onMount } from 'svelte'
	import { loadingBox } from '$services/loadingMessage'
	//import IonPage from '$lib/ionic/svelte/components/IonPage.svelte'

	const supabaseDataService = SupabaseDataService.getInstance()
	const cache: any = JSON.parse(localStorage.getItem(window.location.pathname) || '{}');
	let widgets: any[] = cache.data || [];
	console.log('cached widgets', widgets);

	const getWidgets = async () => {
		const { data, error } = await supabaseDataService.getWidgets({cached: widgets.length})
		if (error) {
			console.error(error)
		} else {
			widgets = data
			localStorage.setItem(window.location.pathname, JSON.stringify({data}))
			console.log('got widgets:', widgets)
		}
	}
	getWidgets();
	//onMount(() => {
		//getWidgets()
	//})
</script>

<!-- <IonPage> -->
	<ion-header translucent="true">
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Test Data</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<ion-list>
			{#each widgets as widget}
				<ion-item href="/widget/{widget.id}">
					{widget.name}
					<ion-note slot="end">
						{widget.price.toFixed(2)}
					</ion-note>
				</ion-item>
			{/each}
		</ion-list>
	</ion-content>
<!-- </IonPage> -->
<style>

</style>
<!-- <style>
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
</style> -->
