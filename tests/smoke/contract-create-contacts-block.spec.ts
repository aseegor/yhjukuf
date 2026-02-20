import { test } from '../fixtures';
import { ContactsBlock } from '../../pages/components/contacts.block';

test(
  'contacts block: add row and fill indexed fields',
  { tag: ['@manual', '@contracts', '@create'] },
  async ({ contractCreatePage }) => {
    await contractCreatePage.goto();
    await contractCreatePage.expectOpened();

    const contactsBlock = new ContactsBlock(contractCreatePage.block('Контакты'));

    await contactsBlock.addRow();
    await contactsBlock.phone(0).fill('+70000000000');
    await contactsBlock.email(0).fill('autotest@example.com');
    await contactsBlock.setCheckbox(0, true);
  }
);
