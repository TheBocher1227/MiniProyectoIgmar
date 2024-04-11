import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor() { }

  getServerSentEvent(url: string): Observable<any> {
    return new Observable((observer: Observer<MessageEvent>) => {
      const eventSource = this.getEventSource(url);

      eventSource.onmessage = event => {
        observer.next(event);
      };

      eventSource.onerror = error => {
        if(eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          console.log(error);
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      };
    });
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}

