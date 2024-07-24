import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { md3 } from 'vuetify/blueprints';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import '@/styles/vuetify.scss';

const themes = {
  light: {
    dark: false,
    colors: {
      primary: '#1976D2',
      background: '#FEFFFE',
      surface: '#FEFEFE',
      accent: '#F7F7F7',
      secondary: '#BCFFCD',
      error: '#E53935',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#1976D2',
      background: '#090909',
      surface: '#101112',
      accent: '#17191A',
      secondary: '#88FA9D',
      error: '#EF5350',
      'surface-variant': '#FEFEFE',
    },
  },
};

const vuetify = createVuetify({
  blueprint: md3,
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: themes,
  },
  defaults: {
    global: {
      elevation: 0,
    },
    VBtn: {
      color: 'primary',
      rounded: 'md',
    },
    VSwitch: {
      color: 'primary',
      flat: true,
      inset: true,
      density: 'comfortable',
    },
    VTextField: {
      color: 'primary',
      density: 'compact',
    },
    VDataTable: {
      density: 'compact',
    },
    VCard: {
      rounded: 'md',
    },
    VList: {
      density: 'compact',
      slim: true,
      VListItem: {
        VListItemTitle: {
          class: 'text-body-3',
        },
        VIcon: {
          size: 'x-small',
        },
      },
    },
    VNavigationDrawer: {
      VList: {
        lines: false,
        slim: true,
        nav: true,
      },
    },
    VMenu: {
      offset: 3,
      width: 200,
    },
    VIcon: {
      size: 'small',
      style: 'opacity: 0.9',
    },
    VSelect: {
      density: 'compact',
    },
    VAutocomplete: {
      density: 'compact',
    },
    VCombobox: {
      density: 'compact',
    },
    VCheckbox: {
      density: 'compact',
      color: 'primary',
      hideDetails: true,
    },
    VChip: {
      rounded: 'md',
    },
  },
});

export default vuetify;
