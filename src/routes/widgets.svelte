<script lang="ts">
	import { onDestroy } from 'svelte';
	import { addOutline } from 'ionicons/icons'
	import SupabaseDataService from '$services/supabase.data.service'
	import { goto } from '@roxi/routify'
	const supabaseDataService = SupabaseDataService.getInstance()

	let widgets: any[]; // = cache || []
	const recordset = 
		supabaseDataService
		.getDataSubscription('widgets')
		.subscribe((recordset) => {
			widgets = recordset;
		}
	)

	onDestroy(() => {
		recordset.unsubscribe()
	})
	const gotoWidget = (id: string) => {
		$goto(`/widget/[id]`,{id})
	}
</script>

<ion-header translucent="true">
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-menu-button />
		</ion-buttons>
		<ion-title>Widgets List</ion-title>
		<ion-buttons slot="end">
			<ion-button on:click={() => gotoWidget('new')}>
				<ion-icon slot="icon-only" icon={addOutline} />
			</ion-button>				
		</ion-buttons>
	</ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
	<ion-list>
		{#if widgets && widgets.length }
			{#each widgets as widget}
					<ion-item on:click={() => gotoWidget(widget.id)}>
						{widget.name}
						<ion-note slot="end">
							{widget.price.toFixed(2)}
						</ion-note>
				</ion-item>
			{/each}
		{:else}
			<ion-item>
				No widgets found
			</ion-item>
		{/if}
	</ion-list>
</ion-content>

<style>
</style>
