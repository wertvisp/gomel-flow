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
export interface CatalogItem {
  id: string;
  name: string;
  price: number;
}

export interface Block {
  id: string;
  type: 'header' | 'catalog' | 'button' | 'contacts' | 'orderForm' | 'footer';
  [key: string]: any;
}

export interface HeaderBlock extends Block {
  type: 'header';
  title: string;
  subtitle?: string;
}

export interface CatalogBlock extends Block {
  type: 'catalog';
  title: string;
  items: CatalogItem[];
}

export interface ButtonBlock extends Block {
  type: 'button';
  title: string;
  url: string;
  style?: 'primary' | 'secondary' | 'outline';
  alignment?: 'left' | 'center' | 'right';
}

export interface ContactsBlock extends Block {
  type: 'contacts';
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  telegram?: string;
  instagram?: string;
}

export interface OrderFormBlock extends Block {
  type: 'orderForm';
  title: string;
  submitText?: string;
  sendTo?: 'telegram' | 'email';
  telegramUsername?: string;
  email?: string;
}

export interface FooterBlock extends Block {
  type: 'footer';
  text: string;
}