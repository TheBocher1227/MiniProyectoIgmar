import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private registerMessage = new BehaviorSubject<string>('');

  currentMessage = this.registerMessage.asObservable();

  constructor() { }

  updateMessage(message: string) {
    this.registerMessage.next(message);
  }
}
