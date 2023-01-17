import { Category } from './categories';
import { User } from './users';

export interface Product {
  id: number,
  name: string,
  categoryId: number,
  category: Category[] | null,
  user: User[] | null,
}
