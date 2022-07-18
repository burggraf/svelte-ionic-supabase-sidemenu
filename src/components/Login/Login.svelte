<script lang="ts">
	import LoginModal from '$components/Login/LoginModal.svelte'
  import LoginNewPasswordModal from '$components/Login/LoginNewPasswordModal.svelte'
	import { modalController } from '$ionic/svelte'
	import { onMount } from 'svelte'
	import SupabaseAuthService from '$services/supabase.auth.service'
	import type { User, Provider } from '@supabase/supabase-js'
	export let profileFunction: Function = () => {}
	export let providers: Provider[] = []
	export let onSignIn: Function = () => {}
	export let onSignOut: Function = () => {}
	// export let profileTable: string = ''
	// export let profileKey: string = ''
	let token = ''
	let supabaseAuthService: SupabaseAuthService

	let localUser: User | null = null
	onMount(() => {
    checkHash();
		SupabaseAuthService.user.subscribe((user: User | null) => {
			localUser = user
			//console.log('LOGIN subscribed: user', user)
		})
		if (!supabaseAuthService) {
			supabaseAuthService = SupabaseAuthService.getInstance()
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
				}, 2500)
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
			// console.log('profileTable', profileTable)
			// console.log('profileKey', profileKey)
			profileFunction()
		} else {
			// console.log('openProfile: no profileFunction')
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
		const openLoginModalController = await modalController.create({
			component: LoginModal,
			componentProps: {
				providers: providers,
				onSignIn: onSignIn,
			},
			showBackdrop: true,
			backdropDismiss: true,
		})

		openLoginModalController.onDidDismiss().then((value) => {
			if (value.role === 'backdrop') {
				// console.log('Backdrop clicked')
			}
		})

		await openLoginModalController.present()
	}
	const openPasswordResetBox = async () => {
		const openPasswordResetModalController = await modalController.create({
			component: LoginNewPasswordModal,
			componentProps: {
				token: token,
			},
			showBackdrop: true,
			backdropDismiss: true,
		})

		openPasswordResetModalController.onDidDismiss().then((value) => {
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
