import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { loadingBox } from '$services/loadingMessage'

const VITE_SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL
const VITE_SUPABASE_KEY: string = import.meta.env.VITE_SUPABASE_KEY

let supabase: SupabaseClient;

export default class SupabaseDataService {
	static myInstance:any = null;

	static getInstance() {
		if (this.myInstance === null) {
      // console.log('********************************************');
      // console.log('Creating new instance of SupabaseDataService');
      // console.log('********************************************');
      if (VITE_SUPABASE_URL && VITE_SUPABASE_KEY) {
        this.myInstance = new this();
        this.myInstance.connect();
      } else {
        console.error('SupabaseDataService: getInstance: missing env variable(s) VITE_SUPABASE_URL or VITE_SUPABASE_KEY');
        this.myInstance = null;
      }
		}
		return this.myInstance;
	}
  
  public isConnected = () => {
    return (typeof supabase !== 'undefined');
  }
  public getSupabase = () => {
    return supabase;
  }
  public connect = async () => {
      if (this.isConnected()) { return; }
      supabase = await createClient(
        VITE_SUPABASE_URL,
        VITE_SUPABASE_KEY);
  }

  /* cache */
  public getCache = () => {
    return JSON.parse(localStorage.getItem(window.location.pathname) || '{}');
  }
  public saveCache(obj: any) {
    localStorage.setItem(window.location.pathname, JSON.stringify(obj));
  }
  public clearCache() {
    localStorage.removeItem(window.location.pathname);
  }
  public clearAllCache() {
    localStorage.clear();
  }
  /***********/

  public getWidgets = async (options: any = {}) => {
    let loader;
    if (!options.cached) loader = await loadingBox('loading widgets...')
    if (!this.isConnected()) { await this.connect() }
    const { data, error } = await supabase.from('widgets').select().order('name');
    if (!options.cached) loader.dismiss();
    return { data, error };
  }

  public getWidget = async (id: string, options: any = {}) => {
    let loader;
    if (!options.cached) loader = await loadingBox('loading widget...')
    if (!this.isConnected()) { await this.connect() }
    const { data, error } = await supabase.from('widgets')
      .select()
      .eq('id', id)
      .limit(1)
      .single()
    if (!options.cached) loader.dismiss();
    return { data, error };
  }

  public async saveWidget(widget: any) {
    console.log('saveWidget', widget);
    const { data, error } = 
    await supabase.from('widgets')
    .upsert(widget);
    return { data, error };
  }
  public async deleteWidget(id: string) {
    const { data, error } = 
    await supabase.from('widgets')
    .delete()
    .eq('id', id);
    return { data, error };
  }
  public getSingleRecordById = async (table: string, id: string) => {
      const { data, error } = 
      await supabase.from(table)
      .select('*')
      .eq('id', id)
      .limit(1)
      .single(); // return a single object (not an array)
      return { data, error };  
  }

  public async getProfile(id: string) {
    if (id) {
      const { data, error } = 
      await supabase.from('profile')
      .select('*')
      .eq('id', id)
      .limit(1)
      .single(); // return a single object (not an array)
      return { data, error };  
    } else {
      console.error('#### getProfile: no id');
      return { data: {}, error: null };  
    }
  } 

  public async saveProfile(profile: any) {
    const { data, error } = 
    await supabase.from('profile')
    .upsert(profile);
    return { data, error };
  }

  public updateUserSetting = async (name: string, value: any) => {
    console.log('updateUserSetting', name, value);
    const newData: any = {};
    newData[name] = value;
    const { user, error } = await supabase.auth.update({ 
      data: { [name]: value }
    });
    if (error) {
      console.error('updateUserSetting error', error)
    } else {
      console.log('updateUserSetting result (user):', user);
    }
    return { user, error };
  }

}
