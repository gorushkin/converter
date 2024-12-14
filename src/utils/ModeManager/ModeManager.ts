import { makeAutoObservable } from 'mobx';

type Mode = 'edit' | 'view';

export class ModeManager {
  mode: Mode;
  constructor(mode?: Mode) {
    this.mode = mode ?? 'view';

    makeAutoObservable(this);
  }
  getMode() {
    return this.mode;
  }
  setMode(mode: Mode) {
    this.mode = mode;
  }

  isEditMode() {
    return this.mode === 'edit';
  }

  isViewMode() {
    return this.mode === 'view';
  }

  toggleMode() {
    this.mode = this.mode === 'edit' ? 'view' : 'edit';
  }
}
