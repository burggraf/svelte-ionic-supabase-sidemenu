<script lang="ts">
	import { params } from '@roxi/routify'
	import { chevronBackOutline, createOutline, checkmarkOutline, closeOutline, trashOutline } from 'ionicons/icons'
	import SupabaseDataService from '$services/supabase.data.service'
	const supabaseDataService = SupabaseDataService.getInstance()
	import UtilityFunctionsService from '$services/utility.functions.service'
	const utilityFunctionsService = UtilityFunctionsService.getInstance()
	let cache: any = supabaseDataService.getCache()
	import { showConfirm } from "$services/alert";

	// const cache: any = JSON.parse(localStorage.getItem(window.location.pathname) || '{}')
	// $: id = $params.id;
	const id = $params.id
	let widget: any = cache?.data
	let mode = 'view'
	if (id === 'add') {
		widget = {
			id: utilityFunctionsService.uuidv4(),
			description: '',
			name: '',
			price: 0,
			created_at: new Date().toISOString(),
		}
		mode = 'edit'
	}
	const getWidget = async () => {
		console.log('fetch widget', id)
		const { data, error } = await supabaseDataService.getWidget(id, { cached: widget })
		if (error) {
			console.error(error)
		} else {
			widget = data
			cache = supabaseDataService.saveCache({ data })
		}
		console.log('widget', widget)
	}
	if (mode !== 'add') getWidget()
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
		const { data, error } = await supabaseDataService.saveWidget(widget)
		if (error) {
			console.error(error)
		} else {
			// widget = data
			if (id === 'add') {
				window.location.href = '/widget/' + widget.id
			} else {
				cache = supabaseDataService.saveCache({ data })
			}
		}
	}
	const deleteWidget = async () => {
		await showConfirm({
			header: "Delete Widget",
			message: "Are you sure?", 
			okHander: async () => {
				const { data, error } = await supabaseDataService.deleteWidget(widget.id)
				if (error) {
					console.error("Error deleting widget", error)
				} else {
					window.location.href = '/TestData'
				}
			}
		});
	}
</script>

<ion-header translucent="true">
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-button
				on:click={() => {
					//history.back()
					window.location.href = '/TestData'
				}}
			>
				<ion-icon slot="icon-only" icon={chevronBackOutline} />
			</ion-button>
		</ion-buttons>
		<ion-title>Widget</ion-title>
		<ion-buttons slot="end">
			{#if mode === 'view'}
				<ion-button
					on:click={deleteWidget}
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
						if (id === 'add') window.location.href = '/TestData';
						else widget = cache?.data;
					}}
				>
					<ion-icon slot="icon-only" icon={closeOutline} />
				</ion-button>
				<ion-button
					on:click={() => {
						save()
						mode = 'view'
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
				created: {new Date(widget?.created_at).toLocaleDateString()}
				{new Date(widget?.created_at).toLocaleTimeString()}<br />
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
