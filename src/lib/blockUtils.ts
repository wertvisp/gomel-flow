import type { Block, CatalogBlock } from '@/types/block';

/**
 * Рекурсивно клонирует блок, гарантируя уникальность ID для него 
 * и для всех его дочерних элементов (например, товаров в каталоге).
 */
export function cloneBlock(block: Block): Block {
  const newId = crypto.randomUUID();

  if (block.type === 'catalog') {
    return {
      ...block,
      id: newId,
      items: (block as CatalogBlock).items.map((item) => ({
        ...item,
        id: crypto.randomUUID(), // Каждому товару — новый ID
      })),
    } as CatalogBlock;
  }

  return {
    ...block,
    id: newId,
  } as Block;
}