<script lang="ts">
	import PocketBase from 'pocketbase'
	import { onMount } from 'svelte'
	const init = async () => {
		const params = new URLSearchParams(window.location.search)
		// console.log('params:', params)
		const client = new PocketBase('http://localhost:8090')
		const redirectUrl = 'http://localhost:8100/redirect'
		const provider = JSON.parse(localStorage.getItem('provider') || '{}')
		if (provider.state !== params.get('state')) {
			console.error('Invalid state')
		}
		client.Users.authViaOAuth2(
			provider.name,
			params.get('code') || '',
			provider.codeVerifier,
			redirectUrl
		)
			.then((authData) => {
				//console.log('authData', authData)
				window.location.href = '/login'
			})
			.catch((err) => {
				console.error('error', err)
			})
	}

	onMount(() => {
		//console.log('onMount')
		init()
	})
</script>

<svelte:head>
	<title>Redirect</title>
	<meta name="description" content="OAuth Redirect" />
</svelte:head>

<div class="content">
	<p>...validating login</p>
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
