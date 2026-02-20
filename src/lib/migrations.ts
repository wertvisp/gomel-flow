import { CatalogItem } from '@/types/block';

/**
 * Нормализует товары каталога, конвертируя price в number
 */
export function normalizeCatalogItems(items: any[]): CatalogItem[] {
  if (!Array.isArray(items)) return [];
  
  return items.map((item: any) => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || ''),
    price: typeof item.price === 'number' 
      ? item.price 
      : parseFloat(String(item.price)) || 0
  }));
}