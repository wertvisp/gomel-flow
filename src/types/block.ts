export type BlockType = 'header' | 'catalog' | 'orderForm' | 'button' | 'contacts' | 'footer';

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface HeaderBlock extends BlockBase {
  type: 'header';
  title: string;
  subtitle?: string;
}

export interface ButtonBlock extends BlockBase {
  type: 'button';
  text: string;
  url: string;
  alignment?: 'left' | 'center' | 'right';
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface CatalogBlock extends BlockBase {
  type: 'catalog';
  title: string;
  items: { id: string; name: string; price: string }[];
}

export interface OrderFormBlock extends BlockBase {
  type: 'orderForm';
  title: string;
  submitText?: string;
}

export interface ContactsBlock extends BlockBase {
  type: 'contacts';
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  instagram?: string;
  telegram?: string;
}

export interface FooterBlock extends BlockBase {
  type: 'footer';
  text: string;
}

export type Block = HeaderBlock | ButtonBlock | CatalogBlock | OrderFormBlock | ContactsBlock | FooterBlock;