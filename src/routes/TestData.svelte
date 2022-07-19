<script lang="ts">
	import SupabaseDataService from '$services/supabase.data.service'
	import { onMount } from 'svelte'
	import { loadingBox } from '$services/loadingMessage'
	import IonPage from '$lib/ionic/svelte/components/IonPage.svelte'

	const supabaseDataService = SupabaseDataService.getInstance()
	let widgets: any[] = []
	const getWidgets = async () => {
		const loader = await loadingBox(
			'Flinging the widgets from the Supabase cloud to your browser...'
		)

		const { data, error } = await supabaseDataService.getWidgets()
		if (error) {
			loader.dismiss()
			console.error(error)
		} else {
			widgets = data
			console.log('got widgets:', widgets)
			loader.dismiss()
		}
	}
	onMount(() => {
		getWidgets()
	})
</script>

<IonPage>
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
</IonPage>

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
