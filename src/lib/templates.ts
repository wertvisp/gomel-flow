import type { Block } from '@/types/block';

function uid() {
  return crypto.randomUUID();
}

export interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  create: () => Block[];
}

export const templates: Template[] = [
  {
    id: 'coffee',
    name: 'Кофейня',
    icon: '☕',
    description: 'Меню напитков и выпечки',
    create: () => [
      {
        id: uid(),
        type: 'header',
        title: 'Кофейня «Вкусный день»',
        subtitle: 'Свежий кофе и домашняя выпечка в центре Гомеля',
      },
      {
        id: uid(),
        type: 'catalog',
        title: 'Меню',
        items: [
          { id: uid(), name: 'Эспрессо', price: 2.5 },
          { id: uid(), name: 'Капучино', price: 3.5 },
          { id: uid(), name: 'Латте', price: 4.0 },
          { id: uid(), name: 'Круассан', price: 2.8 },
          { id: uid(), name: 'Чизкейк', price: 4.5 },
        ],
      },
      {
        id: uid(),
        type: 'button',
        title: 'Заказать доставку',
        url: 'tel:+375291234567',
        style: 'primary',
      },
      {
        id: uid(),
        type: 'contacts',
        title: 'Контакты',
        phone: '+375 (29) 123-45-67',
        address: 'г. Гомель, ул. Советская, 1',
      },
      {
        id: uid(),
        type: 'orderForm',
        title: 'Предзаказ на вынос',
        submitText: 'Оставить заявку',
        sendTo: 'telegram',
        telegramUsername: '',
      },
      {
        id: uid(),
        type: 'footer',
        text: '© 2026 Кофейня «Вкусный день». Работаем с 8:00 до 22:00.',
      },
    ],
  },
  {
    id: 'shop',
    name: 'Магазин',
    icon: '🛒',
    description: 'Каталог товаров и оформление заказа',
    create: () => [
      {
        id: uid(),
        type: 'header',
        title: 'Магазин «Удобно»',
        subtitle: 'Товары для дома с доставкой по Гомелю',
      },
      {
        id: uid(),
        type: 'catalog',
        title: 'Популярные товары',
        items: [
          { id: uid(), name: 'Плед зимний', price: 45 },
          { id: uid(), name: 'Набор полотенец', price: 28 },
          { id: uid(), name: 'Подставка для фруктов', price: 15 },
          { id: uid(), name: 'Держатель для телефона', price: 8 },
        ],
      },
      {
        id: uid(),
        type: 'button',
        title: 'Позвонить',
        url: 'tel:+375291234567',
        style: 'primary',
      },
      {
        id: uid(),
        type: 'orderForm',
        title: 'Оформить заказ',
        submitText: 'Отправить заявку',
        sendTo: 'telegram',
        telegramUsername: '',
      },
      {
        id: uid(),
        type: 'contacts',
        title: 'Доставка и оплата',
        phone: '+375 (29) 123-45-67',
        email: 'info@udobno.by',
        address: 'г. Гомель, ул. Победы, 10',
      },
      {
        id: uid(),
        type: 'footer',
        text: '© 2026 Магазин «Удобно». Доставка от 1 дня.',
      },
    ],
  },
  {
    id: 'barbershop',
    name: 'Парикмахерская',
    icon: '💈',
    description: 'Услуги и запись онлайн',
    create: () => [
      {
        id: uid(),
        type: 'header',
        title: 'Барбершоп «Классик»',
        subtitle: 'Мужские стрижки и уход за бородой',
      },
      {
        id: uid(),
        type: 'catalog',
        title: 'Услуги и цены',
        items: [
          { id: uid(), name: 'Стрижка мужская', price: 25 },
          { id: uid(), name: 'Стрижка машинкой', price: 15 },
          { id: uid(), name: 'Камуфляж бороды', price: 20 },
          { id: uid(), name: 'Комплекс: стрижка + борода', price: 40 },
        ],
      },
      {
        id: uid(),
        type: 'button',
        title: 'Записаться',
        url: 'tel:+375291234567',
        style: 'primary',
      },
      {
        id: uid(),
        type: 'orderForm',
        title: 'Запись на стрижку',
        submitText: 'Записаться',
        sendTo: 'telegram',
        telegramUsername: '',
      },
      {
        id: uid(),
        type: 'contacts',
        title: 'Как нас найти',
        phone: '+375 (29) 123-45-67',
        address: 'г. Гомель, пр. Ленина, 5',
      },
      {
        id: uid(),
        type: 'footer',
        text: '© 2026 Барбершоп «Классик». Ежедневно с 10:00 до 21:00.',
      },
    ],
  },
];
