import { BehaviorSubject } from 'rxjs';

export default class NetworkService {
    static myInstance:any = null;
    static getInstance() {
      if (this.myInstance === null) {
          this.myInstance = new this();
          this.myInstance.online = new BehaviorSubject<boolean>(window.navigator.onLine);
          const o = this.myInstance.online;
          window.addEventListener('offline', function(e) { 
            o.next(false);
          });
          window.addEventListener('online', function(e) { 
            o.next(true);
          });
          this.myInstance.forceOnlineValue = (value: boolean) => {
            o.next(value);
          }
        }    
        return this.myInstance;
    }

    public ping = async (page_name: string = '/ping') => {
      fetch(`${window.location.origin}${page_name}`).then((result) => {
				if (result.status === 200) {
					console.log(result);
          return true;
				} else {
					console.error('ping failed', result)
          return false;
				}			
      }).catch((err) => {
        console.log('fetch error', err);
        console.log('do something here');
        return false;
      })
    }

}

