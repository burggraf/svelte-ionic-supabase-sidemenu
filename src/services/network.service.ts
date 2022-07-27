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
            console.log('offline'); 
          });
          window.addEventListener('online', function(e) { 
            o.next(true);
            console.log('online'); 
          });
        }
    
        return this.myInstance;
    }

}

