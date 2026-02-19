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