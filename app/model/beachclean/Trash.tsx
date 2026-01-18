import Category from './Category';
import BeachCleanSession from './BeachCleanSession';

export default class Trash {
  type: string;
  sessionId: string;
  quantity: number = 0;
  category: Category = Category.Other;
  synced: boolean;

  constructor(sessionId: string, category: Category, quantity: number) {
    this.type = 'Trash';
    this.sessionId = sessionId;
    this.category = category;
    this.quantity = quantity;
    this.synced = false;
  }
};
