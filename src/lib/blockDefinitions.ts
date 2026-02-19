import type { Block, BlockType } from '@/types/block';

export const blockDefinitions: {
  type: BlockType;
  label: string;
  icon: string;
  create: () => Block;
}[] = [
  {
    type: 'header',
    label: 'Шапка',
    icon: '📋',
    create: () => ({
      id: crypto.randomUUID(),
      type: 'header',
      title: 'Мой бизнес',
      subtitle: 'Добро пожаловать!',
    }),
  },
  {
    type: 'catalog',
    label: 'Каталог',
    icon: '📦',
    create: () => ({
      id: crypto.randomUUID(),
      type: 'catalog',
      title: 'Каталог товаров',
      items: [
        { id: crypto.randomUUID(), name: 'Товар 1', price: 100 },
        { id: crypto.randomUUID(), name: 'Товар 2', price: 200 },
      ],
    }),
  },
  {
    type: 'contacts',
    label: 'Контакты',
    icon: '📞',
    create: () => ({
      id: crypto.randomUUID(),
      type: 'contacts',
      title: 'Свяжитесь с нами',
    }),
  },
  {
    type: 'button',
    label: 'Кнопка',
    icon: '🔘',
    create: () => ({
      id: crypto.randomUUID(),
      type: 'button',
      title: 'Заказать',
      url: 'tel:+375291234567',
      style: 'primary',
    }),
  },
  {
    type: 'orderForm',
    label: 'Форма заказа',
    icon: '📝',
    create: () => ({
      id: crypto.randomUUID(),
      type: 'orderForm',
      title: 'Оставьте заявку',
      submitText: 'Отправить',
      sendTo: 'telegram',
      telegramUsername: '',
    }),
  },
  {
    type: 'footer',
    label: 'Подвал',
    icon: '📄',
    create: () => ({
      id: crypto.randomUUID(),
      type: 'footer',
      text: '© 2026 Мой бизнес. Все права защищены.',
    }),
  },
];
