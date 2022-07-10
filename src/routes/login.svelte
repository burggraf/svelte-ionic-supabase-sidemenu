<script lang="ts">
	import PocketBase from 'pocketbase'
	import { onMount } from 'svelte'
	const client = new PocketBase('http://localhost:8090')
	const redirectUrl = 'http://localhost:8100/redirect'

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true
	let email = ''
	let password = ''
	//let providers: any[] = []
	const getProviders = async () => {
		return (await client.Users.listAuthMethods()).authProviders
	}
	let user: any = undefined
	const getCurrentUser = async () => {
		user = JSON.parse(localStorage.getItem('pocketbase_auth') || '{}').model!
		console.log('user:', user)
	}
	$: logged_in = typeof user === 'object'

	onMount(() => {
		getCurrentUser()
	})
	const login = async (email: string, password: string) => {
		console.log('client', client)
		console.log('email', email)
		console.log('password', password)

		try {
			const authData = await client.Users.authViaEmail(email, password)
			console.log('authData', authData)
            getCurrentUser();
		} catch (err) {
			console.log('error', err)
		}
	}
	const loginWithProvider = async (provider: any) => {
		console.log('loginWithProvider', provider)
		localStorage.setItem('provider', JSON.stringify(provider))
		console.log('provider.authUrl', provider.authUrl)
		console.log('redirectUrl', redirectUrl)
		window.location.href = provider.authUrl + redirectUrl
	}
	const logout = async () => {
		console.log('client', client)
		client.AuthStore.clear()
		getCurrentUser()
		//client.AuthStore.
	}
</script>

<!-- svelte-ignore module-script-reactive-declaration -->
<!-- svelte-ignore module-script-reactive-declaration -->
<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login to the app" />
</svelte:head>

<div class="content">

	<h1>{logged_in ? "Logout" : "Login"}</h1>
    {#if !logged_in}
        Email:<input bind:value={email} type="text" name="email" placeholder="email" />
        <br />
        Password: <input bind:value={password} type="password" name="password" placeholder="password" />
        <br />
		<button
			on:click={() => {
				login(email, password)
			}}>Login</button
		>
    {:else}
        Logged in as: {user.email}<br/>
        {user.profile?.name}<br/>
		<button
			on:click={() => {
				logout()
			}}>Logout</button
		>
	{/if}
	{#await getProviders()}
		<p>Loading</p>
	{:then providers}
		{#each providers as provider}
			{#if !logged_in}
				<br />
				<button
					on:click={() => {
						loginWithProvider(provider)
					}}
					>Login with {provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}
				</button>
			{/if}
		{/each}
	{/await}
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
