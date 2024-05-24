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
      lines: false,
      density: 'compact',
      slim: true,
      nav: true,
      class: 'bg-transparent',
    },
    VMenu: {
      transition: 'none',
      offset: 3,
      width: 200,
    },
    VIcon: {
      size: 'small',
    },
  },
});

export default vuetify;
