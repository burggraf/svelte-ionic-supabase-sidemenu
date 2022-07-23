<script lang="ts">
	import SupabaseAuthService from '$services/supabase.auth.service'
  import type { User } from '@supabase/supabase-js';
  import { onDestroy, onMount } from 'svelte';
  let user = null;
  let userSubscription: any;
  onMount(() => {
    userSubscription = SupabaseAuthService.user.subscribe((newuser: User | null) => {
      user = newuser;
      console.log('got user:', user)
    })
  })
  onDestroy(() => {
    userSubscription.unsubscribe()
  })	
</script>
  
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button />
      </ion-buttons>
      <ion-title>Current User</ion-title>
    </ion-toolbar>
  </ion-header>
  
  <ion-content class="ion-padding">  
    <!-- <div id="container">
      <strong class="capitalize">test</strong>
    </div> -->
    User:
    <pre>{JSON.stringify(user,null,2)}</pre>
  </ion-content>
  
  <style>
    ion-menu-button {
      color: var(--ion-color-primary);
    }
  
    #container {
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  
    #container strong {
      font-size: 20px;
      line-height: 26px;
    }
  
    #container p {
      font-size: 16px;
      line-height: 22px;
      color: #8c8c8c;
      margin: 0;
    }
  
    #container a {
      text-decoration: none;
    }
  </style>
  