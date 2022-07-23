<script lang="ts">
	import SupabaseDataService from '$services/supabase.data.service'
	const supabaseDataService = SupabaseDataService.getInstance()
	const cache: any = JSON.parse(localStorage.getItem(window.location.pathname) || '{}')
	console.log('cache', cache)
	let widgets: any[] = cache.data || []
	const getWidgets = async () => {
		const { data, error } = await supabaseDataService.getWidgets({ cached: widgets.length })
		if (error) {
			console.error(error)
		} else {
			widgets = data
			supabaseDataService.saveCache({data})
		}
	}
	getWidgets()
</script>

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

<style>
</style>
