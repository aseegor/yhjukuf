import { expect, test as base } from '@playwright/test';
import { ContractCreatePage } from '../pages/contract-create.page';
import { ContractDetailsPage } from '../pages/contract-details.page';
import { ContractPage } from '../pages/contract.page';
import { ContractsPage } from '../pages/contracts.page';

type AppFixtures = {
  contractCreatePage: ContractCreatePage;
  contractDetailsPage: ContractDetailsPage;
  contractsPage: ContractsPage;
  contractPage: ContractPage;
};

export const test = base.extend<AppFixtures>({
  contractCreatePage: async ({ page }, use) => {
    await use(new ContractCreatePage(page));
  },
  contractDetailsPage: async ({ page }, use) => {
    await use(new ContractDetailsPage(page));
  },
  contractsPage: async ({ page }, use) => {
    await use(new ContractsPage(page));
  },
  contractPage: async ({ page }, use) => {
    await use(new ContractPage(page));
  }
});

export { expect };
