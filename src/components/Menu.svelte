<script lang="ts">
	// import { IonicConfig } from '@ionic/core/components';
	import { menuController, registerMenu } from '$ionic/svelte'
	import { settings, person, informationCircle } from 'ionicons/icons'
	import { onDestroy, onMount } from 'svelte'
	import Login from '$components/Login/Login.svelte'
	import SupabaseAuthService from '$services/supabase.auth.service'
	import type { User } from '@supabase/supabase-js'
	import cfg from '../../package.json'
	import NetworkService from '$services/network.service'
	import { goto, isActive } from '@roxi/routify'
	import { toast } from '$services/toast'
	import { showConfirm } from '$services/alert'

	let user = null
	let userSubscription: any
	let onlineSubscription: any
	let onlineStatus = false
	const networkService = NetworkService.getInstance()

	onMount(() => {
		registerMenu('mainmenu')

		userSubscription = SupabaseAuthService.user.subscribe((newuser: User | null) => {
			user = newuser
			// console.log('got user:', user)
		})
		// const networkService = NetworkService.getInstance()
		onlineSubscription = networkService.online.subscribe((online: boolean) => {
			console.log('got online:', online)
			onlineStatus = online
		})
	})
	onDestroy(() => {
		userSubscription.unsubscribe()
		//onlineSubscription.unsubscribe()
	})

	const appPages = [
		{ title: 'Current User', url: '/TestAuth', icon: person, requireLogin: true },
		{ title: 'Widgets', url: '/widgets', icon: settings, requireLogin: false },
		{ title: 'Info', url: '/', icon: informationCircle, requireLogin: false },
	]
	const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']

	const goMenuItem = (page) => {
		$goto(page.url)
		// window.location = page.url
		menuController.close('mainmenu')
	}
</script>

<ion-menu content-id="main" menu-id="mainmenu">
	<ion-content class="ion-padding">
		<ion-list id="inbox-list">
			<!-- <ion-list-header>Menu</ion-list-header> -->
			<h4 style="margin-top:0px;text-align:center;color:var(--ion-color-primary)">
				<strong>Menu2</strong>
			</h4>
			<p style="padding-bottom:5px;text-align:center;color:var(--ion-color-medium)">tagline</p>
			<ion-menu-toggle auto-hide="false">
				<Login
					providers={['google', 'facebook', 'twitter']}
					onSignOut={() => {
						window.location.href = '/'
					}}
					profileFunction={() => {
						//console.log('do some profileFunction here')
					}}
				/>
			</ion-menu-toggle>

			{#each appPages as p, i}
				{#if !p.requireLogin || user}
					<ion-menu-toggle auto-hide="false">
						<ion-item
							routerDirection="root"
							on:click={() => {
								goMenuItem(p)
							}}
							lines="none"
							detail="false"
							class={$isActive(p.url) && p.url.length > 1 ? 'active-item' : ''}
						>
							<ion-icon slot="start" icon={p.icon} />
							<ion-label>{p.title}</ion-label>
						</ion-item>
					</ion-menu-toggle>
				{/if}
			{/each}
		</ion-list>
	</ion-content>
	<ion-footer class="ion-padding">
		<u
			on:click={() => {
				localStorage.clear()
			}}>clear cache</u
		><br />v.{cfg?.version}
		<br />
		<ion-item
			on:click={async (e) => {
				await showConfirm({
					header: 'Manually set online status',
					message: `Force online status to <b>${onlineStatus ? 'Offline' : 'Online'}</b>?`,
					okHander: async () => {
						networkService.forceOnlineValue(!onlineStatus)
						toast(
							`Online status set to: <b>${onlineStatus ? 'Online' : 'Offline'}</b>`,
							onlineStatus ? 'success' : 'danger'
						)
					},
				})
			}}
		>
			<ion-label color={onlineStatus ? 'success' : 'danger'}
				><b>{onlineStatus ? 'Online' : 'Offline'}</b></ion-label
			>
		</ion-item>
		<!-- <div id="online-status">
			<u>{onlineStatus ? "online" : "offline"}</u>
		</div>
		<br />&nbsp; -->
	</ion-footer>
</ion-menu>

<style>
	u {
		cursor: pointer;
	}
	ion-item {
		cursor: pointer;
	}
	ion-menu ion-content {
		--background: var(--ion-item-background, var(--ion-background-color, #fff));
	}

	ion-item:hover {
		--background: var(--ion-color-light);
		font-weight: bold;
	}

	.active-item {
		font-weight: bold;
	}

	ion-menu.md ion-content {
		--padding-start: 8px;
		--padding-end: 8px;
		--padding-top: 20px;
		--padding-bottom: 20px;
	}

	ion-menu.md ion-list {
		padding: 20px 0;
	}

	ion-menu.md ion-note {
		margin-bottom: 30px;
	}

	ion-menu.md ion-list-header,
	ion-menu.md ion-note {
		padding-left: 10px;
	}

	ion-menu.md ion-list#inbox-list {
		border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
	}

	ion-menu.md ion-list#inbox-list ion-list-header {
		font-size: 22px;
		font-weight: 600;

		min-height: 20px;
	}

	ion-menu.md ion-list#labels-list ion-list-header {
		font-size: 16px;

		margin-bottom: 18px;

		color: #757575;

		min-height: 26px;
	}

	ion-menu.md ion-item {
		--padding-start: 10px;
		--padding-end: 10px;
		border-radius: 4px;
	}

	ion-menu.md ion-item.selected {
		--background: rgba(var(--ion-color-primary-rgb), 0.14);
	}

	ion-menu.md ion-item.selected ion-icon {
		color: var(--ion-color-primary);
	}

	ion-menu.md ion-item ion-icon {
		color: #616e7e;
	}

	ion-menu.md ion-item ion-label {
		font-weight: 500;
	}

	ion-menu.ios ion-content {
		--padding-bottom: 20px;
	}

	ion-menu.ios ion-list {
		padding: 20px 0 0 0;
	}

	ion-menu.ios ion-note {
		line-height: 24px;
		margin-bottom: 20px;
	}

	ion-menu.ios ion-item {
		--padding-start: 16px;
		--padding-end: 16px;
		--min-height: 50px;
	}

	ion-menu.ios ion-item.selected ion-icon {
		color: var(--ion-color-primary);
	}

	ion-menu.ios ion-item ion-icon {
		font-size: 24px;
		color: #73849a;
	}

	ion-menu.ios ion-list#labels-list ion-list-header {
		margin-bottom: 8px;
	}

	ion-menu.ios ion-list-header,
	ion-menu.ios ion-note {
		padding-left: 16px;
		padding-right: 16px;
	}

	ion-menu.ios ion-note {
		margin-bottom: 8px;
	}

	ion-note {
		display: inline-block;
		font-size: 16px;

		color: var(--ion-color-medium-shade);
	}

	ion-item.selected {
		--color: var(--ion-color-primary);
	}
</style>
