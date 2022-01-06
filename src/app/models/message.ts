import { UtilityService } from '../lib/utility.service';
import { User } from '../models/user';
import * as _ from 'lodash';

export class Message {
  id: number;
  content: string;
  internal: boolean;
  creator: User;
  recipient: User;
  type: number;
  isViewed: boolean = false;
  created: Date;
  updated: Date;

  constructor(data: any) {
    if (!data) {
      return;
    }
    this.content = data.content || data.Content;
    this.internal = data.internal || data.Internal;
    this.creator = new User(data.creator);
    this.recipient = new User(data.recipient);
    this.type = data.type || data.Type;
    this.isViewed = data.isViewed;
    this.created = UtilityService.convertToDate(data.CreatedOnUtc || data.CreatedOnUtc);
    this.updated = UtilityService.convertToDate(data.UpdatedOnUtc || data.UpdatedOnUtc);
  }


  public static initializeArray(objects: any): Message[] {
    let results: Message[] = [];

    for (let i = 0; i < objects.length; i++) {
      let mc = new Message(objects[i]);
      results.push(mc);
    }

    return results;
  }



}