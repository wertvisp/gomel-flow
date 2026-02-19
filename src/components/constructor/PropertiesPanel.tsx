'use client';

import type { Block, CatalogItem } from '@/types/block';

interface PropertiesPanelProps {
  block: Block | null;
  onChange: (block: Block) => void;
  onDuplicate?: (block: Block) => void;
}

export function PropertiesPanel({ block, onChange, onDuplicate }: PropertiesPanelProps) {
  if (!block) {
    return (
      <aside className="w-72 flex-shrink-0 border-l border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Свойства
        </h2>
        <p className="mt-8 text-center text-slate-400">Выберите блок на холсте</p>
      </aside>
    );
  }
const update = (updates: Partial<Block>) => {
  onChange({ ...block, ...updates } as Block);
};

  return (
    <aside className="w-72 flex-shrink-0 overflow-auto border-l border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Свойства: {block.type}
        </h2>
        {onDuplicate && (
          <button
            type="button"
            onClick={() => onDuplicate(block)}
            className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
            title="Дублировать блок"
          >
            📋 Дублировать
          </button>
        )}
      </div>
      <div className="mt-4 space-y-4">
        {block.type === 'header' && (
          <>
            <LabelInput
              label="Заголовок"
              value={block.title}
              onChange={(v) => update({ title: v })}
            />
            <LabelInput
              label="Подзаголовок"
              value={block.subtitle}
              onChange={(v) => update({ subtitle: v })}
            />
          </>
        )}
        {block.type === 'catalog' && (
          <>
            <LabelInput
              label="Название каталога"
              value={block.title}
              onChange={(v) => update({ title: v })}
            />
            <CatalogItemsEditor
              items={block.items}
              onChange={(items) => update({ items })}
            />
          </>
        )}
        {block.type === 'contacts' && (
          <>
            <LabelInput
              label="Заголовок"
              value={block.title}
              onChange={(v) => update({ title: v })}
            />
            <LabelInput
              label="Телефон"
              value={block.phone}
              onChange={(v) => update({ phone: v })}
            />
            <LabelInput
              label="Email"
              value={block.email}
              onChange={(v) => update({ email: v })}
            />
            <LabelInput
              label="Адрес"
              value={block.address}
              onChange={(v) => update({ address: v })}
            />
          </>
        )}
        {block.type === 'button' && (
          <>
            <LabelInput
              label="Текст кнопки"
              value={block.title}
              onChange={(v) => update({ title: v })}
            />
            <LabelInput
              label="Ссылка"
              value={block.url}
              onChange={(v) => update({ url: v })}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Стиль</label>
              <select
                value={block.style || 'primary'}
                onChange={(e) =>
                  update({
                    style: e.target.value as 'primary' | 'secondary' | 'outline',
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="primary">Основная (зелёная)</option>
                <option value="secondary">Вторичная (серая)</option>
                <option value="outline">Обводка</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Примеры: tel:+375291234567, mailto:info@mail.by, https://t.me/username
            </p>
          </>
        )}
        {block.type === 'orderForm' && (
          <>
            <LabelInput
              label="Заголовок формы"
              value={block.title}
              onChange={(v) => update({ title: v })}
            />
            <LabelInput
              label="Текст кнопки"
              value={block.submitText}
              onChange={(v) => update({ submitText: v })}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Куда отправлять</label>
              <select
                value={block.sendTo || 'telegram'}
                onChange={(e) =>
                  update({
                    sendTo: e.target.value as 'telegram' | 'email',
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="telegram">Telegram</option>
                <option value="email">Email</option>
              </select>
            </div>
            {block.sendTo === 'telegram' && (
              <LabelInput
                label="Telegram @username"
                value={block.telegramUsername}
                onChange={(v) => update({ telegramUsername: v })}
              />
            )}
            {block.sendTo === 'email' && (
              <LabelInput
                label="Email"
                value={block.email}
                onChange={(v) => update({ email: v })}
              />
            )}
            <p className="text-xs text-slate-500">
              Укажите @username бота или канала. При отправке откроется Telegram или mailto.
            </p>
          </>
        )}
        {block.type === 'footer' && (
          <LabelInput
            label="Текст"
            value={block.text}
            onChange={(v) => update({ text: v })}
          />
        )}
      </div>
    </aside>
  );
}

function LabelInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

function CatalogItemsEditor({ items, onChange }: { items: CatalogItem[]; onChange: (items: CatalogItem[]) => void }) {
  const addItem = () => {
    onChange([...items, { id: crypto.randomUUID(), name: '', price: 0 }]);
  };

  const updateItem = (index: number, field: keyof CatalogItem, value: string | number) => {
    const updated = [...items];
    if (field === 'price') {
      updated[index][field] = typeof value === 'string' ? parseFloat(value) || 0 : value;
    } else {
      updated[index][field] = value as any;
    }
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-600">Товары</label>
        <button
          onClick={addItem}
          className="px-3 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          + Добавить
        </button>
      </div>
      
      {items.map((item, index) => (
        <div key={item.id} className="p-3 bg-slate-50 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Название товара"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded"
              />
              <input
                type="number"
                placeholder="Цена"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded"
              />
            </div>
            <button
              onClick={() => removeItem(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      
      {items.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">
          Нажмите "+ Добавить" чтобы создать товар
        </p>
      )}
    </div>
  );
}

  const addItem = () => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        name: 'Новый товар',
        price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-600">Товары</label>
        <button
          type="button"
          onClick={addItem}
          className="rounded bg-emerald-500 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-600"
        >
          + Добавить
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-2 rounded border border-slate-200 bg-white p-2"
          >
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                placeholder="Название"
                className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(item.id, { price: Number(e.target.value) || 0 })
                }
                placeholder="Цена"
                className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="flex-shrink-0 self-center rounded bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
