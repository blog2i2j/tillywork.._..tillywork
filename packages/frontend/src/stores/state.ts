import { WorkspaceTypes, type List } from '@tillywork/shared';

export const useStateStore = defineStore('state', {
  persist: true,
  state: () => {
    return {
      selectedModule: WorkspaceTypes.PROJECT_MANAGEMENT as WorkspaceTypes,
      /** Is an input currently focused */
      isInputFocused: false,
      /** Is information navigation drawer open */
      isInfoDrawerOpen: true,
      /** Are child cards expanded. */
      areChildCardsExpanded: false,
      /** Sets the latest active list */
      currentList: undefined as undefined | List,
    };
  },
  actions: {
    setSelectedModule(module: WorkspaceTypes) {
      this.selectedModule = module;
    },
    setIsInputFocused(v: boolean) {
      this.isInputFocused = v;
    },
    toggleInfoDrawer() {
      this.isInfoDrawerOpen = !this.isInfoDrawerOpen;
    },
    toggleChildCards() {
      this.areChildCardsExpanded = !this.areChildCardsExpanded;
    },
    setCurrentList(list: undefined | List) {
      this.currentList = list;
    },
    setTitle(title?: string) {
      document.title = `${title ? title + ' | tillywork' : 'tillywork'}`;
    },
  },
});
