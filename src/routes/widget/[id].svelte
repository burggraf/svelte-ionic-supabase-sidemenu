<script lang="ts">
	import { params } from '@roxi/routify';
	import { chevronBackOutline } from 'ionicons/icons';
	import SupabaseDataService from '$services/supabase.data.service';
	const supabaseDataService = SupabaseDataService.getInstance();
	const cache: any = JSON.parse(localStorage.getItem(window.location.pathname) || '{}');
	$: id = $params.id;
	let widget: any = cache?.data
	const getWidget = async () => {
		console.log('fetch widget', $params.id);
		const { data, error } = await supabaseDataService.getWidget($params.id, { cached: widget });
		if (error) {
			console.error(error)
		} else {
			widget = data
			supabaseDataService.saveCache({data})
		}
	}
	getWidget()

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

	<ion-card>
		<ion-card-header>
		  <ion-card-subtitle>{widget?.id}</ion-card-subtitle>
		  <ion-card-title>{widget?.name}</ion-card-title>
		</ion-card-header>
	  
		<ion-card-content>
			{widget?.description}
			<br/>
			<br/>
			price: {widget?.price.toFixed(2)}<br/>
			created: {new Date(widget?.created_at).toLocaleDateString()} {new Date(widget?.created_at).toLocaleTimeString()}<br/>

		</ion-card-content>
	  </ion-card>

	<pre>
		{JSON.stringify(widget || {}, null, 2)}
	</pre>
</ion-content>

<style>
</style>
