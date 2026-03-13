import { test } from '../fixtures';

test(
  'contacts block: add row and fill indexed fields',
  { tag: ['@manual', '@contracts', '@create'] },
  async ({ contractCreatePage }) => {
    await contractCreatePage.goto();
    await contractCreatePage.expectOpened();

    const contactsBlock = contractCreatePage.contactsBlock('Контакты');

    await contactsBlock.addRow('Телефон');
    await contactsBlock.phone(0).fill('+70000000000');
    await contactsBlock.email(0).fill('autotest@example.com');
    await contactsBlock.setCheckbox(0, true);
  }
);
