<script lang="ts">
	import { params, goto } from '@roxi/routify'
	import { chevronBackOutline, createOutline, checkmarkOutline, closeOutline, trashOutline } from 'ionicons/icons'
	import { alert, showConfirm } from "$services/alert";
	import SupabaseDataService from '$services/supabase.data.service'
	const supabaseDataService = SupabaseDataService.getInstance()
	import { onDestroy } from 'svelte';

	let id = $params.id
	let mode = 'view'

	let widgets: any[]; // = cache || []
	let widget: any = {}; // = cache || {}

	const recordset = supabaseDataService.getDataSubscription('widgets').subscribe((recordset) => {
		widgets = recordset;		
		if (id === 'new') {
			widget = {
				id: supabaseDataService.gen_random_uuid(),
				description: '',
				name: '',
				price: 0,
				// replacing Z with +00:00 to make it match Postgres timestamptz format
				created_at: new Date().toISOString().replace('Z', '+00:00'),
				updated_at: new Date().toISOString().replace('Z', '+00:00'),
			};
			mode = 'edit'
		} else {
			console.log('searching for ', id);
			console.log('widgets', widgets);
			if (widgets && widgets.length > 0) {
				widget = widgets.find((w) => w.id === id) || {}			
			} else {
				console.error(`could not find widget ${id}, widgets:`, widgets);
				console.log(widgets[1]);
			}
		}
	})

	onDestroy(() => {
		recordset.unsubscribe()
	})

	const handler = (event) => {
		if (typeof widget[event.target.name] === 'number') {
			try {
				widget[event.target.name] = parseFloat(event.target.value)
			} catch (e) {
				widget[event.target.name] = 0
			}
		} else {
			// string
			widget[event.target.name] = event.target.value
		}
	}
	const save = async () => {
		if (widget.name.trim().length === 0) {
			alert({header: "Invalid entry", message: "Please enter a name"})
			return;
		}
		try {
			parseFloat(widget.price)
		} catch (err) {
			alert({header: "Invalid entry", message: "Please enter a valid price"})
			return;
		}
		const { error } = await supabaseDataService.save_widget(widget)
		if (error) {
			console.error('save_widget error', error)
		} else {	

			// update widgets cache
			console.log('calling updateCollection',widgets, widget);
			widgets = await supabaseDataService.updateCollection(widgets, widget);
			console.log('widgets', widgets);
			supabaseDataService.saveCache(widgets, 'widgets')
			id = widget.id;
			mode = 'view';
			supabaseDataService.updateDataSubscription('widgets');
		}
	}
	const delete_widget = async () => {
		await showConfirm({
			header: "Delete Widget",
			message: "Are you sure?", 
			okHander: async () => {
				const { data, error } = await supabaseDataService.delete_widget(widget)
				if (error) {
					console.error("Error deleting widget", error)
				} else {
					// update widgets cache
					console.log('calling deleteFromCollection', widgets, widget);
					widgets = await supabaseDataService.deleteFromCollection(widgets, widget);
					console.log('widgets', widgets);
					supabaseDataService.saveCache(widgets, 'widgets')
					// supabaseDataService.updateDataSubscription('widgets');
					// $goto('/widgets')
					goBack()
					// window.location.href = '/widgets'
				}
			}
		});
	}
	const goBack = () => {
		$goto(`/widgets`)
	}
</script>

<ion-header translucent="true">
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-button
				on:click={() => {
					//history.back()
					// window.location.href = '/widgets'
					goBack();
				}}
			>
				<ion-icon slot="icon-only" icon={chevronBackOutline} />
			</ion-button>
		</ion-buttons>
		<ion-title>Widget</ion-title>
		<ion-buttons slot="end">
			{#if mode === 'view'}
				<ion-button
					on:click={delete_widget}
				>
					<ion-icon slot="icon-only" icon={trashOutline} />
				</ion-button>
				<ion-button
					on:click={() => {
						mode = 'edit'
					}}
				>
					<ion-icon slot="icon-only" icon={createOutline} />
				</ion-button>
			{/if}
			{#if mode === 'edit'}
				<ion-button
					on:click={() => {
						mode = 'view'
						if (id === 'add') goBack() // window.location.href = '/TestData';
						// else widget = cache || {}
					}}
				>
					<ion-icon slot="icon-only" icon={closeOutline} />
				</ion-button>
				<ion-button
					on:click={() => {
						save()
					}}
				>
					<ion-icon slot="icon-only" icon={checkmarkOutline} />
				</ion-button>
			{/if}
		</ion-buttons>
	</ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
	{#if widget}
		<ion-card>
			<ion-card-header>
				<ion-card-subtitle>{widget?.id}</ion-card-subtitle>
				<ion-card-title>
					{#if mode === 'view'}{widget?.name}{/if}
					{#if mode === 'edit'}
						<ion-label>Name:</ion-label><ion-input
							value={widget.name}
							on:ionChange={handler}
							required
							name="name"
							type="text"
						/>
					{/if}
				</ion-card-title>
			</ion-card-header>

			<ion-card-content>
				{#if mode === 'view'}{widget?.description}{/if}
				{#if mode === 'edit'}
					<ion-label>Description:</ion-label><ion-input
						value={widget.description}
						on:ionChange={handler}
						required
						name="description"
						type="text"
					/>
				{/if}
				<br />
				<br />
				{#if mode === 'edit'}
					<ion-label>Price:</ion-label><ion-input
						value={widget.price}
						on:ionChange={handler}
						required
						name="price"
						type="number"
						style="width:100px;text-align:right;"
					/>
				{/if}
				{#if mode === 'view'}price: {widget?.price?.toFixed(2)}{/if}
				<br />
				created: {new Date(widget?.created_at).toLocaleDateString()} {new Date(widget?.created_at).toLocaleTimeString()}<br/>
				updated: {new Date(widget?.updated_at).toLocaleDateString()} {new Date(widget?.updated_at).toLocaleTimeString()}
				<br />
			</ion-card-content>
		</ion-card>
	{/if}
</ion-content>

<style>
	ion-label {
		display: inline-block;
		width: 40%;
		text-align: right;
		padding-right: 10px;
	}
	ion-input {
		width: 60%;
		border: 1px solid;
		display: inline-block;
	}
</style>
