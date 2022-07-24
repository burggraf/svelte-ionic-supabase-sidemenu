<script lang="ts">
	import { params } from '@roxi/routify'
	import { chevronBackOutline, createOutline, checkmarkOutline, closeOutline } from 'ionicons/icons'
	import SupabaseDataService from '$services/supabase.data.service'
	const supabaseDataService = SupabaseDataService.getInstance()
	const cache: any = JSON.parse(localStorage.getItem(window.location.pathname) || '{}')
	// $: id = $params.id;
	const id = $params.id
	let widget: any = cache?.data
	let editMode = false
	const getWidget = async () => {
		console.log('fetch widget', id)
		const { data, error } = await supabaseDataService.getWidget(id, { cached: widget })
		if (error) {
			console.error(error)
		} else {
			widget = data
			supabaseDataService.saveCache({ data })
		}
		console.log('widget', widget)
	}
	getWidget()
	const handler = (event) => {
		if (typeof widget[event.target.name] === 'number') {
			try {
				widget[event.target.name] = parseFloat(event.target.value)
			} catch (e) {
				widget[event.target.name] = 0
			}
		} else { // string
			widget[event.target.name] = event.target.value;
		}
	}
	const save = async () => {
		const { data, error } = await supabaseDataService.saveWidget(widget)
		if (error) {
			console.error(error)
		} else {
			// widget = data
			supabaseDataService.saveCache({ data })
		}
	}
</script>

<ion-header translucent="true">
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-button
				on:click={() => {
					history.back()
				}}
			>
				<ion-icon slot="icon-only" icon={chevronBackOutline} />
			</ion-button>
		</ion-buttons>
		<ion-title>Widget</ion-title>
		<ion-buttons slot="end">
			{#if !editMode}
				<ion-button on:click={() => {editMode = true}}>
					<ion-icon slot="icon-only" icon={createOutline} />
				</ion-button>				
			{/if}
			{#if editMode}
			<ion-button on:click={() => {widget = cache?.data;editMode = false}}>
				<ion-icon slot="icon-only" icon={closeOutline} />
			</ion-button>				
			<ion-button on:click={() => {save();editMode = false}}>
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
					{#if !editMode}{widget?.name}{/if}
					{#if editMode}
							<ion-label>Name:</ion-label><ion-input value={widget.name} on:ionChange={handler} required name="name" type="text" />
					{/if}
				</ion-card-title>
			</ion-card-header>

			<ion-card-content>
				{#if !editMode}{widget?.description}{/if}
				{#if editMode}
					<ion-label>Description:</ion-label><ion-input value={widget.description} on:ionChange={handler} required name="description" type="text" />
				{/if}
				<br />
				<br />
				{#if editMode}
					<ion-label>Price:</ion-label><ion-input value={widget.price} on:ionChange={handler} required name="price" type="number" style="width:100px;text-align:right;" />
				{/if}
				{#if !editMode}price: {widget?.price?.toFixed(2)}{/if}
				<br />
				created: {new Date(widget?.created_at).toLocaleDateString()}
				{new Date(widget?.created_at).toLocaleTimeString()}<br />
			</ion-card-content>
			<pre>
				{JSON.stringify(widget,null,2)}
			</pre>
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
