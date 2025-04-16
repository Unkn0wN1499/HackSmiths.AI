
import Dexie, { Table } from 'dexie';
import { Product } from './mock-data';

// Create a subclass of Dexie
export class InventoryDatabase extends Dexie {
  products!: Table<Product>;

  constructor() {
    super('inventoryDatabase');
    this.version(1).stores({
      products: 'id, name, category, sku, price, stockLevel'
    });
  }
}

// Create an instance of the database
export const db = new InventoryDatabase();

// Initialize the database with sample data if empty
export async function initializeDatabase() {
  const count = await db.products.count();
  
  if (count === 0) {
    console.log('Initializing database with sample products...');
    
    const { generateProducts } = await import('./mock-data');
    const sampleProducts = generateProducts(15);
    
    try {
      await db.products.bulkAdd(sampleProducts);
      console.log(`Added ${sampleProducts.length} sample products to the database`);
    } catch (error) {
      console.error('Error adding sample products to database:', error);
    }
  } else {
    console.log(`Database already contains ${count} products`);
  }
}

// CRUD operations
export async function getAllProducts(): Promise<Product[]> {
  return await db.products.toArray();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return await db.products.get(id);
}

export async function addProduct(product: Product): Promise<string> {
  return await db.products.add(product);
}

export async function updateProduct(product: Product): Promise<number> {
  return await db.products.update(product.id, product);
}

export async function deleteProduct(id: string): Promise<void> {
  return await db.products.delete(id);
}

// Helper function to generate a new product ID
export function generateProductId(): string {
  return `prod-${Math.random().toString(36).substring(2, 8)}`;
}
