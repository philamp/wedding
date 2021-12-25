module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './src/**/*.{html,js,svelte,ts}',
    ],
    options: {
      safelist: [
        /data-theme$/,
      ]
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        'mytheme': {                          /* your theme name */
           'primary' : '#EFB081',           /* Primary color */
           'primary-focus' : '#FFDBB3',     /* Primary color - focused */
           'primary-content' : '#ffffff',   /* Foreground content color to use on primary color */

           'secondary' : '#619CB5',         /* Secondary color */
           'secondary-focus' : '#61C2E7',   /* Secondary color - focused */
           'secondary-content' : '#ffffff', /* Foreground content color to use on secondary color */

           'accent' : '#EAD9D2',            /* Accent color */
           'accent-focus' : '#CADFC7',      /* Accent color - focused */
           'accent-content' : '#ffffff',    /* Foreground content color to use on accent color */

           'neutral' : '#3d4451',           /* Neutral color */
           'neutral-focus' : '#2a2e37',     /* Neutral color - focused */
           'neutral-content' : '#ffffff',   /* Foreground content color to use on neutral color */

           'base-100' : '#EBF8FF',          /* Base color of page, used for blank backgrounds */
           'base-200' : '#DADCE1',          /* Base color, a little darker */
           'base-300' : '#d1d5db',         /* Base color, even more darker */
           'base-content' : '#22393C',      /* Foreground content color to use on base color */

           'info' : '#2094f3',              /* Info */
           'success' : '#009485',           /* Success */
           'warning' : '#ff9900',           /* Warning */
           'error' : '#ff5724',             /* Error */
        },
      },
    ],
  },
}