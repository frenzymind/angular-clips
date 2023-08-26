import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string) {
    this.modals = this.modals.filter((e) => e.id !== id);
  }

  isModalVisible(id: string): boolean {
    return Boolean(this.modals.find((e) => e.id === id)?.visible);
    // OR
    // return !!this.modals.find((e) => e.id === id)?.visible;
  }

  toggleModal(id: string): void {
    const modal = this.modals.find((e) => e.id === id);

    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
