import { makeAutoObservable } from 'mobx';

type Mode = 'edit' | 'view';

export class ModeManager {
  mode: Mode;
  id = '';
  constructor(mode?: Mode) {
    this.mode = mode ?? 'view';

    makeAutoObservable(this);
  }
  getMode = () => {
    return this.mode;
  };
  setMode = (mode: Mode) => {
    this.mode = mode;
  };

  get isEditMode() {
    return this.mode === 'edit';
  }

  get isViewMode() {
    return this.mode === 'view';
  }

  toggleMode = () => {
    this.mode = this.mode === 'edit' ? 'view' : 'edit';
  };

  setEditMode = (id?: string) => {
    this.mode = 'edit';
    this.id = id ?? '';
  };

  setViewMode = () => {
    this.mode = 'view';
  };

  isEditable = (id: string) => {
    return this.mode === 'edit' && this.id === id;
  };
}
