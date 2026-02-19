import { Block } from '@/types/block';
import { themes, ThemeName } from './themes';

function escape(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateStyles(theme: ThemeName = 'modern'): string {
  const currentTheme = themes[theme];
  
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${currentTheme.fonts.body};
        line-height: 1.6;
        color: ${currentTheme.colors.text};
        background: ${currentTheme.colors.background};
        -webkit-font-smoothing: antialiased;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
      }
      
      section {
        padding: 60px 40px;
      }
      
      h1, h2, h3 {
        font-family: ${currentTheme.fonts.heading};
        font-weight: 800;
        line-height: 1.2;
        color: ${currentTheme.colors.text};
      }
      
      a {
        text-decoration: none;
        transition: all 0.3s;
      }
      
      .btn {
        display: inline-block;
        padding: 16px 40px;
        border-radius: ${currentTheme.borderRadius.md};
        font-weight: 700;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        border: none;
        font-size: 16px;
        background: ${currentTheme.colors.primary};
        color: white;
      }
      
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: ${currentTheme.shadows.lg};
      }
      
      input, textarea {
        width: 100%;
        padding: 14px;
        border: 2px solid #e2e8f0;
        border-radius: ${currentTheme.borderRadius.sm};
        font-size: 15px;
        font-family: ${currentTheme.fonts.body};
        transition: all 0.3s;
      }
      
      input:focus, textarea:focus {
        outline: none;
        border-color: ${currentTheme.colors.primary};
        box-shadow: 0 0 0 3px ${currentTheme.colors.primary}33;
      }
      
      @media (max-width: 768px) {
        section {
          padding: 40px 20px;
        }
        
        h1 {
          font-size: 32px !important;
        }
        
        h2 {
          font-size: 24px !important;
        }
      }
    </style>
  `;
}

function generateFormScript(): string {
  return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const forms = document.querySelectorAll('.order-form');
        
        forms.forEach(form => {
          form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            const formData = {
              name: form.querySelector('[name="name"]').value,
              phone: form.querySelector('[name="phone"]').value,
              message: form.querySelector('[name="message"]')?.value || '',
              title: form.dataset.title || 'Заявка с сайта'
            };
            
            try {
              const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
              });
              
              if (response.ok) {
                alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset();
              } else {
                throw new Error('Ошибка отправки');
              }
            } catch (error) {
              alert('❌ Ошибка отправки заявки. Попробуйте позже или свяжитесь с нами по телефону.');
            } finally {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }
          });
        });
      });
    </script>
  `;
}

export function exportToHtml(blocks: Block[], theme: ThemeName = 'modern'): string {
  const currentTheme = themes[theme];
  
  const renderedBlocks = blocks.map((block, index) => {
    const sectionId = `block-${index}`;
    const d = block as any;
    
    switch (block.type) {
      case 'header':
        return `
          <section id="${sectionId}" style="text-align: center; background: ${currentTheme.colors.background}; padding: 100px 40px; border-radius: ${currentTheme.borderRadius.lg}; box-shadow: ${currentTheme.shadows.md};">
            <h1 style="font-size: 56px; margin-bottom: 24px; color: ${currentTheme.colors.text}; font-family: ${currentTheme.fonts.heading};">
              ${escape(d.title)}
            </h1>
            <p style="font-size: 20px; color: ${currentTheme.colors.textLight}; max-width: 700px; margin: 0 auto; font-family: ${currentTheme.fonts.body};">
              ${escape(d.subtitle || '')}
            </p>
          </section>
        `;

      case 'catalog':
        const items = (d.items || []).map((item: any) => `
          <div style="background: ${currentTheme.colors.primary}15; padding: 24px; border-radius: ${currentTheme.borderRadius.md}; display: flex; justify-content: space-between; align-items: center; box-shadow: ${currentTheme.shadows.sm};">
            <span style="font-weight: 600; color: ${currentTheme.colors.text}; font-size: 18px; font-family: ${currentTheme.fonts.body};">${escape(item.name)}</span>
            <span style="font-weight: 700; color: ${currentTheme.colors.primary}; font-size: 24px; font-family: ${currentTheme.fonts.body};">${escape(String(item.price))} BYN</span>
          </div>
        `).join('');
        
        return `
          <section id="${sectionId}" style="padding: 60px 40px; background: ${currentTheme.colors.background}; border-radius: ${currentTheme.borderRadius.lg}; box-shadow: ${currentTheme.shadows.md};">
            <h2 style="text-align: center; margin-bottom: 48px; font-size: 42px; color: ${currentTheme.colors.text}; font-family: ${currentTheme.fonts.heading};">
              ${escape(d.title)}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">
              ${items}
            </div>
          </section>
        `;

      case 'button':
        return `
          <section id="${sectionId}" style="text-align: center; padding: 60px 40px;">
            <a href="${escape(d.url)}" class="btn" style="background: ${currentTheme.colors.primary}; border-radius: ${currentTheme.borderRadius.md}; box-shadow: ${currentTheme.shadows.md}; font-family: ${currentTheme.fonts.body};">
              ${escape(d.title || 'Кнопка')}
            </a>
          </section>
        `;

      case 'contacts':
        let contactItems = '';
        
        if (d.phone) {
          contactItems += `
            <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: ${currentTheme.colors.secondary}15; border-radius: ${currentTheme.borderRadius.md}; margin-bottom: 16px; box-shadow: ${currentTheme.shadows.sm};">
              <div style="width: 50px; height: 50px; background: ${currentTheme.colors.secondary}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📞</div>
              <div>
                <p style="font-size: 12px; color: ${currentTheme.colors.secondary}; font-weight: 600; margin-bottom: 4px; font-family: ${currentTheme.fonts.body};">ТЕЛЕФОН</p>
                <a href="tel:${escape(d.phone)}" style="font-weight: 600; color: ${currentTheme.colors.text}; font-size: 18px; font-family: ${currentTheme.fonts.body};">${escape(d.phone)}</a>
              </div>
            </div>
          `;
        }
        
        if (d.email) {
          contactItems += `
            <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: ${currentTheme.colors.accent}15; border-radius: ${currentTheme.borderRadius.md}; margin-bottom: 16px; box-shadow: ${currentTheme.shadows.sm};">
              <div style="width: 50px; height: 50px; background: ${currentTheme.colors.accent}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📧</div>
              <div style="flex: 1; min-width: 0;">
                <p style="font-size: 12px; color: ${currentTheme.colors.accent}; font-weight: 600; margin-bottom: 4px; font-family: ${currentTheme.fonts.body};">EMAIL</p>
                <a href="mailto:${escape(d.email)}" style="font-weight: 600; color: ${currentTheme.colors.text}; word-break: break-all; font-family: ${currentTheme.fonts.body};">${escape(d.email)}</a>
              </div>
            </div>
          `;
        }
        
        if (d.address) {
          contactItems += `
            <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: ${currentTheme.colors.primary}15; border-radius: ${currentTheme.borderRadius.md}; box-shadow: ${currentTheme.shadows.sm};">
              <div style="width: 50px; height: 50px; background: ${currentTheme.colors.primary}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📍</div>
              <div>
                <p style="font-size: 12px; color: ${currentTheme.colors.primary}; font-weight: 600; margin-bottom: 4px; font-family: ${currentTheme.fonts.body};">АДРЕС</p>
                <p style="font-weight: 600; color: ${currentTheme.colors.text}; font-family: ${currentTheme.fonts.body};">${escape(d.address)}</p>
              </div>
            </div>
          `;
        }
        
        return `
          <section id="${sectionId}" style="padding: 60px 40px; background: ${currentTheme.colors.background}; border-radius: ${currentTheme.borderRadius.lg}; box-shadow: ${currentTheme.shadows.md};">
            <h2 style="text-align: center; margin-bottom: 48px; font-size: 42px; color: ${currentTheme.colors.text}; font-family: ${currentTheme.fonts.heading};">
              ${escape(d.title || 'Контакты')}
            </h2>
            <div style="max-width: 600px; margin: 0 auto;">
              ${contactItems}
            </div>
          </section>
        `;

      case 'orderForm':
        return `
          <section id="${sectionId}" style="background: linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary}); padding: 80px 40px; border-radius: ${currentTheme.borderRadius.lg}; box-shadow: ${currentTheme.shadows.lg}; margin: 20px;">
            <div style="max-width: 550px; margin: 0 auto; background: white; padding: 50px; border-radius: ${currentTheme.borderRadius.md}; box-shadow: ${currentTheme.shadows.md};">
              <h2 style="text-align: center; font-size: 36px; margin-bottom: 12px; color: ${currentTheme.colors.text}; font-family: ${currentTheme.fonts.heading};">
                ${escape(d.title)}
              </h2>
              <p style="text-align: center; color: ${currentTheme.colors.textLight}; margin-bottom: 32px; font-family: ${currentTheme.fonts.body};">
                Заполните форму и мы свяжемся с вами
              </p>
              <form class="order-form" data-title="${escape(d.title)}">
                <div style="margin-bottom: 20px;">
                  <input type="text" name="name" placeholder="Ваше имя *" required style="font-family: ${currentTheme.fonts.body};" />
                </div>
                <div style="margin-bottom: 20px;">
                  <input type="tel" name="phone" placeholder="Телефон *" required style="font-family: ${currentTheme.fonts.body};" />
                </div>
                <div style="margin-bottom: 24px;">
                  <textarea name="message" rows="3" placeholder="Ваше сообщение (необязательно)" style="resize: vertical; font-family: ${currentTheme.fonts.body};"></textarea>
                </div>
                <button type="submit" class="btn" style="width: 100%; font-size: 18px; background: ${currentTheme.colors.primary}; border-radius: ${currentTheme.borderRadius.sm}; font-family: ${currentTheme.fonts.body};">
                  ${escape(d.submitText || 'Отправить заявку')}
                </button>
              </form>
            </div>
          </section>
        `;

      case 'footer':
        return `
          <footer id="${sectionId}" style="background: ${currentTheme.colors.text}; color: white; text-align: center; padding: 40px; border-radius: ${currentTheme.borderRadius.lg} ${currentTheme.borderRadius.lg} 0 0;">
            <p style="color: ${currentTheme.colors.textLight}; font-size: 14px; margin-bottom: 12px; font-family: ${currentTheme.fonts.body};">
              ${escape(d.text)}
            </p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 12px; color: #64748b; font-family: ${currentTheme.fonts.body};">
              <span>Создано в</span>
              <span style="font-weight: 700; color: ${currentTheme.colors.primary};">Gomel-Flow</span>
            </div>
          </footer>
        `;

      default:
        return '';
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generator" content="Gomel-Flow Builder">
  <meta name="theme" content="${theme}">
  <title>Сайт - Gomel-Flow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  ${generateStyles(theme)}
</head>
<body>
  <div class="container">
    ${renderedBlocks}
  </div>
  ${generateFormScript()}
</body>
</html>`;
}