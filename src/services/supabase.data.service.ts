import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { loadingBox } from '$services/loadingMessage'
import NetworkService from '$services/network.service';
import { toast } from '$services/toast';
import { BehaviorSubject } from 'rxjs';

const VITE_SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL
const VITE_SUPABASE_KEY: string = import.meta.env.VITE_SUPABASE_KEY


let supabase: SupabaseClient;

let isOnline: boolean = undefined; // unknown status
const networkService = NetworkService.getInstance()

export default class SupabaseDataService {
	static myInstance:any = null;

	static getInstance() {
		if (this.myInstance === null) {
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

  public gen_random_uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  public uuid_generate_v4 = this.gen_random_uuid;

  public static datasets: any = {};

  public getDataSubscription = (item: string, options?: object) => {
    const name = item + (options ? ':' + JSON.stringify(options) : '');
    SupabaseDataService.datasets[name] = new BehaviorSubject<any[]>([]);
    this.updateDataSubscription(item, options);
    return SupabaseDataService.datasets[name];
  }
  public updateDataSubscription = async (item: string, options?: object) => {
    const name = item + (options ? ':' + JSON.stringify(options) : '');
    const cache: any = this.loadCache(name);  
    if (cache !== null) {
      SupabaseDataService.datasets[name].next(cache);
    }
    if (!isOnline) {
      // we are not online, so we will not update the data subscription
      return;
    }
    /**
    supabase.data.service.ts?t=1660228357757:71 
    updateDataSubscription: error 
    {message: 'FetchError: Failed to fetch', details: '', hint: '', code: ''}

     * 
     */
    const loadFunction: Function = this[`load_${item}`];
    if (!loadFunction) {
      console.error('supabaseDataService: missing function load_' + item);
      return;
    }
    if (!options) options = {cached: (cache !== null)}
    else options = {...options, cached: (cache !== null)}

    try {
      const { data, error } = await loadFunction(options);
      if (error) {
        console.error('updateDataSubscription: error', error);
        if (error.message === 'FetchError: Failed to fetch') {
          // handle fetch error here
        }
      } else {
        SupabaseDataService.datasets[name].next(data);
        this.saveCache(data, name);
      }  
    } catch (error) {
      // handle fetch error here
    }
  }
  
  /***********/
  /*  cache  */
  /***********/
  public loadCache = (name: string) => {
    const cache = localStorage.getItem(name);
    if (cache) {
      return JSON.parse(cache);
    } else {
      return null;
    }
  }
  public saveCache(obj: any, name: string) {
    localStorage.setItem(name, JSON.stringify(obj));
    return obj;
  }

  public clearCache(name: string) {
      localStorage.removeItem(name);
  }
  public clearAllCache() {
    localStorage.clear();
  }
  /******************/
  /* queued updates */
  /******************/
  public queueUpdate(functionName: string, table:string, record: any) {
    const queue = JSON.parse(localStorage.getItem('update-queue') || '[]');
    queue.push({functionName, table, record, timestamp: +Date.now()});
    localStorage.setItem('update-queue', JSON.stringify(queue));
  }
  public processQueue = async () => {
    if (isOnline) {
      const queue = JSON.parse(localStorage.getItem('update-queue') || '[]');
      if (queue.length > 0) {
        const { functionName, table, record, timestamp } = queue.shift();
        // console.log('processQueue:', functionName, table, record, `timestamp: ${timestamp}`);
        if (functionName === 'saveRecord' || functionName === 'deleteRecord') {
          const { status, data, error } = await this.checkRecordVersion(table, record);
          // console.log('processQueue: checkRecordVersion:', 'table', table, 'record', record);
          console.log(`function: ${functionName}:`, 'status', status, 'data', data, 'error', error);
        }
        const { error } = await this[functionName](table, record);
        if (error) {
          console.error('error processing update queue', error);
          console.error('functionName', functionName);
          console.error('table', table)
          console.error('record', record);
          console.error('timestamp', timestamp);
          return;
        } else {
          localStorage.setItem('update-queue', JSON.stringify(queue));
          this.processQueue();
        }
      } else {
        console.log('processQueue: queue is empty');
      }
    }
  }
  /**********************************/
  /* generic save and delete record */
  /**********************************/
  public async checkRecordVersion(table: string, record: any, fieldName: string = 'updated_at') {
    if (isOnline) {
      const { error:errorGettingCount, count } = 
      await supabase.from(table)
      .select(`id`, { count: 'exact' })
      .eq('id', record.id);
      if (errorGettingCount) {
        console.error('checkRecordVersion getCount: error', errorGettingCount);
        return { status: 'error', error: errorGettingCount };
      } else {
        if (count === 0) {
          return {status: 'notFound', data: null, error: null}
        } else if (count > 1) {
          return {status: 'multipleFound', data: null, error: null}
        }
      }

      const { data, error } = 
      await supabase.from(table)
      .select(`id, ${fieldName}`)
      .eq('id', record.id)
      .single();
      // console.log('checkRecordVersion select got data, error', data, error);
      if (error) {
        return { status: 'error', data: null, error };
      } else {
        if (data && typeof data[fieldName] === typeof record[fieldName]) {
          if (data[fieldName] === record[fieldName]) {
            return { status: 'ok', data, error };
          } else {
            return { status: 'conflict', data, error };
          }
        } else {
          return { status: 'error', data: null, error: `${fieldName} data missing or wrong type` };
        }
      }
    } else {
      return { status: 'offline', data: null, error: null };
    }
  }

  public async saveRecord(table: string, record: any) {
    if (isOnline) {
      const { data, error } = 
      await supabase.from(table)
      .upsert(record);
      return { data, error };  
    } else {
      this.queueUpdate('saveRecord', table, record);
      return { data: null, error: null };
    }    
  }
  public async deleteRecord(table: string, record: any) {
    if (isOnline) {
      const { data, error } = 
      await supabase.from(table)
      .delete()
      .eq('id', record.id);
      return { data, error };  
    } else {
      this.queueUpdate('deleteRecord', table, record);
      return { data: null, error: null };
    }
  }

  /*****************************/
  /* update/delete collection */
  /*****************************/

  public updateCollection = async (collection: any[], record: any, id_field: string = 'id') => {
    const index = collection.findIndex(w => w[id_field] === record[id_field]);
    if (index > -1) {
      collection[index] = record
    } else {
      collection.push(record)
    }
    return collection;
  }
  public deleteFromCollection = async (collection: any[], record: any, id_field: string = 'id') => {
    const index = collection.findIndex(w => w[id_field] === 
      (typeof record === 'string' ? record : record[id_field]));
    if (index > -1) {
      collection.splice(index, 1);
    }
    return collection;
  }
  /*****************************/

  public load_widgets = async (options: any = {}) => {
    let loader;
    if (!options.cached) loader = await loadingBox('loading widgets...')
    if (!this.isConnected()) { await this.connect() }
    const { data, error } = await supabase.from('widgets').select().order('name');
    if (!options.cached) loader.dismiss();
    return { data, error };
  }

  public load_widget = async (options: any = {}) => {
    let loader;
    if (!options.cached) loader = await loadingBox('loading widget...')
    if (!this.isConnected()) { await this.connect() }
    const { data, error } = await supabase.from('widgets')
      .select()
      .eq('id', options.id)
      .limit(1)
      .single()
    if (!options.cached) loader.dismiss();
    return { data, error };
  }

  public async save_widget(widget: any) {
    const { data, error} = await this.saveRecord('widgets', widget);
    return { data, error };
  }
  public async delete_widget(record: any) {
    const { data, error} = await this.deleteRecord('widgets', record);
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

const supabaseDataService = SupabaseDataService.getInstance()
networkService.online.subscribe((online: boolean) => {
  isOnline = online
  if (isOnline) {
    console.log('supabase: app came online -- process pending queue')
    supabaseDataService.processQueue();
  }
})
