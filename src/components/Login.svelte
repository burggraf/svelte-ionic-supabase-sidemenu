<script lang="ts">
	console.log('Login.svelte component mounted')
	import LoginModal from '$components/LoginModal.svelte'
  import LoginNewPasswordModal from '$components/LoginNewPasswordModal.svelte'
	import { modalController } from '$ionic/svelte'
	import { onMount } from 'svelte'
	import SupabaseAuthService from '$services/supabase.auth.service'
	import type { User } from '@supabase/supabase-js'
	export let SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
	export let SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
	export let profileFunction: Function = () => {}
	export let providers: string[] = []
	export let onSignIn: Function = () => {}
	export let onSignOut: Function = () => {}
	export let profileTable: string = ''
	export let profileKey: string = ''
	let token = ''
	let supabaseAuthService: SupabaseAuthService
	/*
    backdropDismiss = false, setUser,
    profileFunction, providers, onSignIn, onSignOut, SUPABASE_URL, SUPABASE_KEY,
    profileTable, profileKey

*/

	let localUser: User | null = null
	onMount(() => {
    checkHash();
		console.log('AAA onMount, subscribe to user')
		SupabaseAuthService.user.subscribe((user: User | null) => {
			localUser = user
			console.log('LOGIN subscribed: user', user)
		})
		if (!supabaseAuthService) {
			console.log('load supabaseAuthService service')
			supabaseAuthService = SupabaseAuthService.getInstance(SUPABASE_URL, SUPABASE_KEY)
		}
	})

  const checkHash = () => {
    //console.log('check hash...')
		const hash = window.location.hash
		//console.log('hash', hash)
		if (hash && hash.substring(0, 1) === '#') {
			const tokens = hash.substring(1).split('&')
			const entryPayload: any = {}
			tokens.map((token) => {
				const pair = (token + '=').split('=')
				entryPayload[pair[0]] = pair[1]
			})
			//console.log('entryPayload', entryPayload)
			if (entryPayload?.type === 'recovery') {
				// password recovery link
				// return `/resetpassword/${entryPayload.access_token}`;
				// token = entryPayload.access_token;
				token = entryPayload.access_token
				//console.log('token', token)
				setTimeout(() => {
					openPasswordResetBox()
				}, 4000)
				// console.log('token was set to:', entryPayload.access_token);
			} else {
				//console.log('token was not set entryPayload:', entryPayload)
			}
		} else {
			//console.log('no hash was found');
		}
 }
  const openProfile = async () => {
		if (profileFunction) {
			//console.log('profileFunction', profileFunction);
			console.log('profileTable', profileTable)
			console.log('profileKey', profileKey)
			profileFunction()
		} else {
			console.log('openProfile: no profileFunction')
		}
	}
	const signOut = async () => {
		const { error } = await supabaseAuthService.signOut()
		if (error) {
			console.error('Error signing out', error)
		} else {
			if (onSignOut) {
				onSignOut()
			}
			window.location.reload()
		}
	}
	const openLoginBox = async () => {
		console.log('openLoginBox')
		const openLoginModalController = await modalController.create({
			component: LoginModal,
			componentProps: {
				providers: providers,
				SUPABASE_URL: SUPABASE_URL,
				SUPABASE_KEY: SUPABASE_KEY,
				onSignIn: onSignIn,
			},
			showBackdrop: true,
			backdropDismiss: true,
		})

		openLoginModalController.onDidDismiss().then((value) => {
			console.log('Dismissed the modal', value)
			if (value.role === 'backdrop') console.log('Backdrop clicked')
		})

		await openLoginModalController.present()
	}
	const openPasswordResetBox = async () => {
		console.log('openPasswordResetBox')
		const openPasswordResetModalController = await modalController.create({
			component: LoginNewPasswordModal,
			componentProps: {
				SUPABASE_URL: SUPABASE_URL,
				SUPABASE_KEY: SUPABASE_KEY,
				token: token,
			},
			showBackdrop: true,
			backdropDismiss: true,
		})

		openPasswordResetModalController.onDidDismiss().then((value) => {
			console.log('Dismissed the modal', value)
			if (value.role === 'backdrop') console.log('Backdrop clicked')
		})

		await openPasswordResetModalController.present()
	}
</script>

{#if localUser}
	<div class="fullWidth">
		<ion-button
			fill="outline"
			color="dark"
			on:click={openProfile}
			size="small"
			expand="block"
			strong
		>
			{localUser?.email}
		</ion-button>
		<ion-button fill="outline" color="dark" on:click={signOut} size="small" expand="block" strong>
			Sign Out
		</ion-button>
	</div>
{:else}
	<div class="fullWidth">
		<ion-button
			fill="outline"
			color="dark"
			on:click={openLoginBox}
			size="small"
			expand="block"
			strong
		>
			Sign In
		</ion-button>
	</div>
{/if}

<style>
	.fullWidth {
		width: 100%;
	}
</style>
