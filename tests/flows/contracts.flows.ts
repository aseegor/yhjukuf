import { expect, type Page } from '@playwright/test';
import { AddendumCreatePage } from '../../pages/addendum-create.page';
import { ContractActualVersionPage } from '../../pages/contract-actual-version.page';
import { ContractDetailsPage } from '../../pages/contract-details.page';
import { ContractActionsMenu } from '../../pages/components/contract-actions-menu';
import { ChangeHistorySidebar } from '../../pages/components/change-history-sidebar';
import { ContractListItem } from '../../pages/components/contract-list-item';
import { LinkAgreementSidebar } from '../../pages/components/link-agreement-sidebar';
import { ContractStatusModal, StatusAction } from '../../pages/components/contract-status-modal';
import { UnlinkParentConfirmModal } from '../../pages/components/unlink-parent-confirm-modal';
import { ContractsPage } from '../../pages/contracts.page';
import { RelatedAgreementCreatePage } from '../../pages/related-agreement-create.page';

const MENU_ACTION_LABEL: Record<StatusAction, string> = {
  block: 'Заблокировать',
  unblock: 'Разблокировать',
  close: 'Закрыть'
};

export type ContractMenuAction =
  | 'history'
  | 'createRelated'
  | 'link'
  | 'createAddendum'
  | 'actualVersion'
  | 'unlinkParent';

export type ContractMenuActionResult =
  | ChangeHistorySidebar
  | RelatedAgreementCreatePage
  | LinkAgreementSidebar
  | AddendumCreatePage
  | ContractActualVersionPage
  | UnlinkParentConfirmModal;

type PageSource = {
  getPage(): Page;
};

export class ContractMenuFlow {
  constructor(
    private readonly menu: ContractActionsMenu,
    private readonly pageSource: PageSource
  ) {}

  getMenu(): ContractActionsMenu {
    return this.menu;
  }

  async changeStatus(
    action: StatusAction,
    reason?: string,
    comment?: string,
    date?: string,
    confirm: boolean = true
  ): Promise<ContractStatusModal> {
    await this.menu.clickItem(MENU_ACTION_LABEL[action]);

    const modal = new ContractStatusModal(this.pageSource.getPage());
    await modal.expectForAction(action);

    if (reason) {
      await modal.selectReason(reason);
    }

    if (comment !== undefined) {
      await modal.fillComment(comment);
    }

    if (date) {
      await modal.setDate(date);
    }

    if (confirm) {
      await modal.clickConfirmAction(action);
    }

    return modal;
  }

  async openAction(action: ContractMenuAction): Promise<ContractMenuActionResult> {
    const page = this.pageSource.getPage();

    switch (action) {
      case 'history': {
        await this.menu.clickViewChangeHistory();
        const sidebar = new ChangeHistorySidebar(page);
        await sidebar.expectVisible();
        return sidebar;
      }
      case 'createRelated': {
        await this.menu.clickCreateRelatedAgreement();
        const createPage = new RelatedAgreementCreatePage(page);
        await createPage.expectOpened();
        return createPage;
      }
      case 'link': {
        await this.menu.clickLinkAgreement();
        const sidebar = new LinkAgreementSidebar(page);
        await sidebar.expectVisible();
        return sidebar;
      }
      case 'createAddendum': {
        await this.menu.clickCreateAddendum();
        const addendumPage = new AddendumCreatePage(page);
        await addendumPage.expectOpened();
        return addendumPage;
      }
      case 'actualVersion': {
        await this.menu.clickViewActualVersion();
        const actualVersionPage = new ContractActualVersionPage(page);
        await actualVersionPage.expectOpened();
        return actualVersionPage;
      }
      case 'unlinkParent': {
        await this.menu.clickUnlinkFromParentAgreement();
        const modal = new UnlinkParentConfirmModal(page);
        await modal.expectVisible();
        return modal;
      }
      default: {
        throw new Error(`Unsupported menu action: ${String(action)}`);
      }
    }
  }
}

export async function openParentContractMenuByNumber(
  contractsPage: ContractsPage,
  contractNumber: string
): Promise<ContractMenuFlow> {
  await contractsPage.goto();
  await contractsPage.expectLoaded();

  const item = await contractsPage.contractsList.findByNumber(contractNumber);
  const menu = await item.openActionsMenu();
  await expect(menu.root).toBeVisible();

  return new ContractMenuFlow(menu, contractsPage);
}

export async function openChildContractMenuByNumbers(
  contractsPage: ContractsPage,
  parentContractNumber: string,
  childContractNumber: string
): Promise<ContractMenuFlow> {
  await contractsPage.goto();
  await contractsPage.expectLoaded();

  const parent = await contractsPage.contractsList.findByNumber(parentContractNumber);
  await parent.expandChildren();

  const child = await parent.findChildByNumber(childContractNumber);
  expect(child).not.toBeNull();

  if (!child) {
    throw new Error(
      `Child contract "${childContractNumber}" was not found under parent "${parentContractNumber}".`
    );
  }

  const menu = await child.openActionsMenu();
  await expect(menu.root).toBeVisible();

  return new ContractMenuFlow(menu, contractsPage);
}

export async function openContractMenuFromDetails(
  contractDetailsPage: ContractDetailsPage,
  contractId: string
): Promise<ContractMenuFlow> {
  await contractDetailsPage.goto(contractId);
  await contractDetailsPage.expectOpened(contractId);

  const menu = await contractDetailsPage.openActionsMenu();
  await expect(menu.root).toBeVisible();

  return new ContractMenuFlow(menu, contractDetailsPage);
}
