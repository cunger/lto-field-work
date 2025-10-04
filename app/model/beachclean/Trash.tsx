import Item from '../Item';
import Category from './Category';
import BeachCleanSession from '../BeachCleanSession';

export default class Trash extends Item {
  sessionId: string;
  quantity: number = 0;
  category: Category = Category.Other;

  constructor(session: BeachCleanSession, category: Category, quantity: number) {
    super('Trash', session.startDate, session.location);
    this.sessionId = session.id;
    this.category = category;
    this.quantity = quantity;
  }
};
