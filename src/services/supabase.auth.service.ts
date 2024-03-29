import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const VITE_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

interface Listener {
  id: string;
  func: Function;
}

export default class SupabaseAuthService {
  static myInstance:any = null;
  static supabase: SupabaseClient;
  static profileTable: string;
  static profileKey: string;
  static getInstance(profileTable?: string, profileKey?: string) {
    SupabaseAuthService.profileTable = profileTable || '';
    SupabaseAuthService.profileKey = profileKey || '';
    if (this.myInstance === null) {
      if (VITE_SUPABASE_URL && VITE_SUPABASE_KEY) {
        this.supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);
        this.myInstance = new this();
      } else {
        console.error('SupabaseAuthService: getInstance: missing env variable(s) VITE_SUPABASE_URL or VITE_SUPABASE_KEY');
        this.myInstance = null;
      }
    }
    return this.myInstance;
  }

  public showLogin: any;
  public setShowLogin: any;

  public static user = new BehaviorSubject<User | null>(null);
  public static profile = new BehaviorSubject<any>(null);
  private _user: User | null = null;
  // private _profile: any = null;
  public static subscription: any = null;
  
  public static userListeners: Listener[] = [];
  public static profileListeners: Listener[] = [];
  public static setProfileTable(profileTable: string) {
    SupabaseAuthService.profileTable = profileTable;
  }
  public static setProfileKey(profileKey: string) {
    SupabaseAuthService.profileKey = profileKey;
  }

  public static subscribeUser = (setFunc: Function, id?:string) => {
    if (!id) {
      // generate a random string id
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    this.userListeners.push({ id, func: setFunc });
    return id;
  }
  public static subscribeProfile = (setFunc: Function, id?:string) => {
    if (!SupabaseAuthService.profileTable || !SupabaseAuthService.profileKey) {
      console.error('missing parameter(s): profileTable and/or profileKey');
      return '';
    };
    if (!id) {
      // generate a random string id
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    this.profileListeners.push({ id, func: setFunc });
    return id;
  }
  public static unsubscribeUser(id: string) {
    this.userListeners = this.userListeners.filter(userListeners => userListeners.id !== id);
  }
  public static unsubscribeProfile(id: string) {
    this.userListeners = this.profileListeners.filter(profileListeners => profileListeners.id !== id);
  }
  private updateUserListeners(user: User | null) {
    for (let i = 0; i < SupabaseAuthService.userListeners.length; i++) {
      SupabaseAuthService.userListeners[i].func(user);
    }
  }
  private updateProfileListeners(user: User | null) {
    for (let i = 0; i < SupabaseAuthService.profileListeners.length; i++) {
      SupabaseAuthService.profileListeners[i].func(user);
    }
  }

  constructor() {
    // Try to recover our user session
    //console.log('constructor here');
    this.loadUser();
    SupabaseAuthService.subscription = SupabaseAuthService.supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          this._user = session.user;
          SupabaseAuthService.user.next(session.user);
          this.updateUserListeners(session.user);
        } else if (session === null) {
          this._user = null;
          SupabaseAuthService.user.next(null);
          this.updateUserListeners(null);
        }  
        this.loadProfile();
      });  

  }

  // ************** auth ****************

  private async loadUser() {
    //console.log('loadUser');
    const user = SupabaseAuthService.supabase.auth.user();
    //console.log('loadUser: user: ', user);
    if (user) {
      this._user = user;
      SupabaseAuthService.user.next(user);
      this.updateUserListeners(user);
    } else {
      // no current user
    }
  };

  public async loadProfile() {
    if (!SupabaseAuthService.profileTable || !SupabaseAuthService.profileKey) return;
    if (this._user?.id!) {
      const { data, error } = 
      await SupabaseAuthService.supabase.from(SupabaseAuthService.profileTable)
      .select('*')
      .eq(SupabaseAuthService.profileKey, this._user?.id!)
      .limit(1)
      .single(); // return a single object (not an array)
      if (error) {
        console.error('loadProfile error: ', error);
      } else {
        // this._profile = data;
        SupabaseAuthService.profile.next(data);
        this.updateProfileListeners(data);
      }
    } else {
      // this._profile = null;
      SupabaseAuthService.profile.next(null);
      this.updateProfileListeners(null);
    }
  }

  public getCurrentUser() {
    return this._user;
  }

  public signUpWithEmail = async (email: string, password: string) => {
    console.log('signUpWithEmail', email, password);
    console.log('redirectTo', window.location.origin);
    const { user, session, error } = await SupabaseAuthService.supabase.auth.signUp({
      email,
      password
    },{
      redirectTo: window.location.origin // .origin
    });
    return { user, session, error };
  }

  public signInWithEmail = async (email: string, password: string) => {
    const { user, session, error } = await SupabaseAuthService.supabase.auth.signIn({
      email: email,
      password: password,
    });
    return { user, session, error };
  }

  public signInWithProvider = async (provider: Provider) => {
    const { user, session, error } = await SupabaseAuthService.supabase.auth.signIn({
      provider: provider
    }, {
      redirectTo: window.location.origin // .origin
    });
    return { user, session, error };
  }

  public resetPassword = async (email: string) => {
    const { data, error } = await SupabaseAuthService.supabase.auth.api.resetPasswordForEmail(email,
      {
        redirectTo: window.location.origin // + '/resetpassword'
      });
    return { data, error };
  }

  public sendMagicLink = async (email: string) => {
    console.log('sendMagicLink: ', email);
    const { user, session, error } = await SupabaseAuthService.supabase.auth.signIn({
      email: email
    }, {
      redirectTo: window.location.origin
    });
    return { user, session, error };
  }

  public updatePassword = async (access_token: string, new_password: string) => {
    const { error, data } = await SupabaseAuthService.supabase.auth.api
      .updateUser(access_token, { password: new_password });
    return { error, data };
  }

  public signOut = async () => {
    const { error } = await SupabaseAuthService.supabase.auth.signOut();
    if (!error) {
      SupabaseAuthService.user.next(null);
    }
    return { error };
  }

  public checkForPasswordResetToken = () => {
    const hash = window.location.hash;
    let token = "";
    // console.log('hash', hash);
    if (hash && hash.substring(0,1) === '#') {
        const tokens = hash.substring(1).split('&');
        const entryPayload: any = {};
        tokens.map((token) => {
            const pair = (token + '=').split('=');
            entryPayload[pair[0]] = pair[1];
        });
        // console.log('entryPayload', entryPayload);
        if (entryPayload?.type === 'recovery') { // password recovery link
            // return `/resetpassword/${entryPayload.access_token}`;
            // token = entryPayload.access_token;
            token = entryPayload.access_token;
            // console.log('token was set to:', entryPayload.access_token);
        } else {
          // console.log('token was not set entryPayload:', entryPayload);
        }          
    } else {
      // console.log('no hash was found');
    }  
    return token;
  }
}

export { SupabaseAuthService };//, User };