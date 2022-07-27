<script lang="ts">
	import { addOutline } from 'ionicons/icons'
	import SupabaseDataService from '$services/supabase.data.service'
	const supabaseDataService = SupabaseDataService.getInstance()
	const cache: any = supabaseDataService.getCache('widgets');
	console.log('cache', cache)
	let widgets: any[] = cache || []
	const getWidgets = async () => {
		const { data, error } = await supabaseDataService.getWidgets({ cached: widgets.length })
		if (error) {
			console.error(error)
		} else {
			widgets = data
			supabaseDataService.saveCache(widgets, 'widgets');
		}
	}
	getWidgets()
</script>

<ion-header translucent="true">
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-menu-button />
		</ion-buttons>
		<ion-title>Widgets List</ion-title>
		<ion-buttons slot="end">
			<ion-button href="/widget/add">
				<ion-icon slot="icon-only" icon={addOutline} />
			</ion-button>				
		</ion-buttons>
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

<style>
</style>
