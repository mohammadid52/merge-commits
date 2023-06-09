/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '460px',
      ...defaultTheme.screens
    },
    scale: {
      0: '0',
      25: '.25',
      50: '.5',
      75: '.75',
      90: '.9',
      95: '.95',
      100: '1',
      105: '1.05',
      110: '1.1',
      125: '1.25',
      150: '1.5',
      200: '2'
    },
    placeholderColor: {
      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c'
      }
    },
    flexGrow: {
      0: 0,
      default: 1,
      1: 1,
      2: 2,
      3: 3
    },
    maxWidth: {
      256: '64rem'
    },
    minHeight: {
      2: '2rem'
    },
    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      text: 'text',
      move: 'move',
      'not-allowed': 'not-allowed',
      crosshair: 'crosshair',
      'zoom-in': 'zoom-in',
      help: 'help'
    },
    textColor: (theme) => theme('colors'),
    fontSize: {
      xxs: '.5rem',
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      '8xl': '6rem',
      '5.5xl': '3.5rem',
      '4.5xl': '2.75rem'
    },
    zIndex: {
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      25: 25,
      75: 75,
      100: 100,
      1000: 1000,
      10000: 10000,
      max: 9999999,
      auto: 'auto'
    },
    opacity: {
      0: '0',
      10: '.1',
      20: '.2',
      30: '.3',
      40: '.4',
      50: '.5',
      60: '.6',
      65: '.65',
      70: '.7',
      75: '.75',
      80: '.8',
      85: '.85',
      90: '.9',
      95: '.95'
    },
    borderWidth: {
      default: '1px',
      neg1: '-1px',
      none: '0px',
      0: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px'
    },
    top: {
      2.5: '2.5rem'
    },
    inset: {
      0: '0rem',
      0.5: '0.5rem',
      1: '1rem',
      2: '2rem',
      2.5: '2.5rem',
      3: '3rem',
      3.5: '3.5rem',
      4: '4rem',
      5: '5rem',
      6: '6rem',
      7: '7rem',
      8: '8rem',
      9: '9rem',
      10: '10rem',
      11: '11rem',
      12: '12rem',
      13: '13rem',
      14: '14rem',
      15: '15rem',
      16: '16rem',
      17: '17rem',
      18: '18rem',
      19: '19rem',
      20: '20rem',
      21: '21rem',
      22: '22rem',
      23: '23rem',
      24: '24rem',
      25: '25rem',
      26: '26rem',
      27: '27rem',
      28: '28rem',
      29: '29rem',
      30: '30rem',
      '1/2': '50%',
      auto: 'auto'
    },
    fontFamily: {
      open: ['Open Sans', 'sans-serif']
    },
    colors: {
      transparent: 'transparent',
      black: '#000', // check this color.. it shouldnt be used

      red: {
        100: '#fff5f5',
        200: '#fed7d7',
        300: '#feb2b2',
        400: '#fc8181',
        500: '#f56565',
        600: '#e53e3e',
        700: '#c53030',
        800: '#9b2c2c',
        900: '#742a2a'
      },
      orange: {
        100: '#fffaf0',
        200: '#feebc8',
        300: '#fbd38d',
        400: '#f6ad55',
        500: '#ed8936',
        600: '#dd6b20',
        700: '#c05621',
        800: '#9c4221',
        900: '#7b341e'
      },
      yellow: {
        100: '#fffff0',
        200: '#fefcbf',
        300: '#faf089',
        400: '#f6e05e',
        500: '#ecc94b',
        600: '#d69e2e',
        700: '#b7791f',
        800: '#975a16',
        900: '#744210'
      },
      green: {
        100: '#f0fff4',
        200: '#c6f6d5',
        300: '#9ae6b4',
        400: '#68d391',
        500: '#48bb78',
        600: '#38a169',
        700: '#2f855a',
        800: '#276749',
        900: '#22543d'
      },
      teal: {
        100: '#e6fffa',
        200: '#b2f5ea',
        300: '#81e6d9',
        400: '#4fd1c5',
        500: '#38b2ac',
        600: '#319795',
        700: '#2c7a7b',
        800: '#285e61',
        900: '#234e52'
      },
      blue: {
        100: '#ebf8ff',
        200: '#bee3f8',
        300: '#90cdf4',
        400: '#63b3ed',
        500: '#4299e1',
        600: '#3182ce',
        700: '#2b6cb0',
        800: '#2c5282',
        900: '#2a4365'
      },
      indigo: {
        100: '#ebf4ff',
        200: '#c3dafe',
        300: '#a3bffa',
        400: '#7f9cf5',
        500: '#667eea',
        600: '#5a67d8',
        700: '#4c51bf',
        800: '#434190',
        900: '#3c366b'
      },
      purple: {
        100: '#faf5ff',
        200: '#e9d8fd',
        300: '#d6bcfa',
        400: '#b794f4',
        500: '#9f7aea',
        600: '#805ad5',
        700: '#6b46c1',
        800: '#553c9a',
        900: '#44337a'
      },
      pink: {
        100: '#fff5f7',
        200: '#fed7e2',
        300: '#fbb6ce',
        400: '#f687b3',
        500: '#ed64a6',
        600: '#d53f8c',
        700: '#b83280',
        800: '#97266d',
        900: '#702459'
      },
      black20: 'rgba(0,0,0,.2)',
      black50: 'rgba(0,0,0,.5)',

      'dark-blue': '#1C2C42',
      'darker-blue': '#384f68',

      'darker-gray': '#272730',
      'medium-gray': '#505062',
      'light-gray': '#797986',
      'theme-blue': '#0081CB', //Projectcurate theme blue color.

      // Official iconoclast blue

      'dark-bg': '#333449',
      'dark-block': '#4b4c63',
      'fire-orange': '#FF5733',
      'green-light': '#38a169',
      gold: '#F1C40F',
      grayscale: '#66666673',
      'grayscale-bg': '#fafafa',
      'grayscale-light': '#959aa3',
      'grayscale-lighter': '#f9f9f947',
      'grayscale-lightest ': '#fffbfb',
      ketchup: '#CA2222',
      'sea-green': '#17A589',

      'lighter-blue': '#1a202c',
      'medium-blue': '#30445e',
      'med-dark-blue': '#273548',
      'off-white': '#ffffffe6',
      mustard: '#febd01',
      tahini: '#c4b896',
      'orange-light': '#e4a04f',
      'orange-medium': '#e4714f',
      'pink-light': '#c64575',
      white20: 'rgba(255,255,255,.2)',

      // This is new colors
      // light
      primary: '#667eea', // used for actions like buttons
      darkest: '#141a33', // used for heading text like title
      dark: '#505673', // Used for secondary text like subtitle or description
      medium: '#878ca8', // Used for non-decorative borders like border for search input
      light: '#dadef2', // Used for decorative borders like dividers
      lightest: '#f5f6fa', // Used for alternative backgrounds
      white: '#ffffff' // Used for main background

      // // dark
      // 'lightest -dark': '#c4ccca', // Used for secondary text like subtitle or description
      // 'light-dark': '#9ca6a3', // Used for non-decorative borders like border for search input
      // 'medium-dark': '#4d5453', // Used for decorative borders like dividers
      // 'dark-dark': '#353b39', // Used for alternative backgrounds like card bg
      // 'darkest-dark': '#222625' // Used for main background
    },
    extend: {
      transitionProperty: {
        height: 'height',
        width: 'width'
      },
      backgroundImage: (theme) => ({
        'iconoclast-bg':
          "url('https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/iconoclast_frontpage_bg.jpg')",
        'curate-bg':
          "url('https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/LoginImage_PC.jpg')"
      }),
      backgroundOpacity: {
        10: '0.1',
        20: '0.2',
        25: '0.25',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        75: '0.75',
        80: '0.8',
        90: '0.9',
        95: '0.95',
        100: '1'
      },
      lineHeight: {
        'extra-tight': '.8'
      },
      animation: {
        bounce: 'bounce 1s ease-in-out 1',
        jiggle: 'jiggle 0.2s linear infinite',
        ping: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        spin: 'spin 1s linear infinite',
        activation: 'activation 1s ease-in-out infinite',
        slideUp: 'slideUp 0.2s linear'
      },
      keyframes: {
        bounce: {
          '0%': {
            right: '0',
            opacity: '0'
          },
          '75%': {
            right: '0',
            opacity: '0'
          },
          '90%': {
            right: '-24px',
            opacity: '0.5'
          },
          '100%': {
            right: '0',
            opacity: '1'
          }
        },
        jiggle: {
          '0%': {
            transform: 'rotate(10deg)'
          },
          '50%': {
            transform: 'rotate(-10deg)'
          },
          '100%': {
            transform: 'rotate(10deg)'
          }
        },
        ping: {
          '0%': {
            transform: 'scale(1)',
            opacity: '0.7'
          },
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0'
          }
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '75%, 100%': {
            opacity: '1'
          }
        },
        spin: {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },
        activation: {
          '0%': {
            borderBottom: '0px solid #00488AC7',
            borderTop: '0px solid #00488AC7'
          },
          '50%': {
            borderBottom: '4px solid #00488AC7',
            borderTop: '4px solid #00488AC7'
          },
          '100%': {
            borderBottom: '0px solid #00488AC7',
            borderTop: '0px solid #00488AC7'
          }
        },
        slideUp: {
          '0%': {transform: 'translateY(-12px)'},
          '100%': {transform: 'translateY(0px)'}
        }
      },
      width: {
        '0.5/10': '5%',
        '1.5/10': '15%',
        '2.5/10': '25%',
        '3.5/10': '35%',
        '1/2': '48%',
        '1/3': '30%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '3.3/10': '33.33%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '19/20': '95%',
        '64rem': '64rem',
        148: '37rem'
      },
      spacing: {
        '1px': '1px',
        0.5: '.125rem',
        2.5: '.625rem',
        11: '2.75rem',
        14: '3.5rem',
        18: '4.5rem',
        28: '7rem',
        30: '7.5rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        64: '16rem',
        68: '17rem',
        72: '18rem',
        80: '20rem',
        84: '21rem',
        88: '22rem',
        96: '24rem',
        100: '25rem',
        104: '26rem',
        112: '28rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        152: '38rem',
        156: '39rem',
        160: '40rem',
        164: '41rem',
        168: '42rem',
        172: '43rem',
        176: '44rem',
        180: '45rem',
        184: '46rem',
        188: '47rem',
        192: '48rem',
        196: '49rem',
        200: '50rem',
        256: '64rem',
        '1/4': '25%',
        '1/3': '33%',
        '1/2': '50%',
        '3/4': '75%',
        '.5/10': '5%',
        '.7/10': '7%',
        '.72/10': '7.2%',
        '1/10': '10%',
        '.8/10': '8%',
        '1.3/10': '13%',
        '1.5/10': '15%',
        '1.8/10': '18%',
        '2/10': '20%',
        '2.2/10': '22%',
        '2.3/10': '23%',
        '2.5/10': '25%',
        '2.8/10': '28%',
        '3/10': '30%',
        '3.1/10': '31%',
        '3.2/10': '32%',
        '3.27/10': '32.7%',
        '3.3/10': '33.33%',
        '3.5/10': '35%',
        '3.8/10': '38%',
        '3.9/10': '39%',
        '4/10': '40%',
        '4.3/10': '43%',
        '4.5/10': '45%',
        '4.6/10': '46%',
        '4.7/10': '47%',
        '4.75/10': '47.5%',
        '4.8/10': '48%',
        '4.85/10': '48.5%',
        '4.9/10': '49%',
        '5/10': '50%',
        '5.1/10': '51%',
        '5.3/10': '53%',
        '5.5/10': '55%',
        '5.8/10': '58%',
        '5.9/10': '59%',
        '6/10': '60%',
        '6.5/10': '65%',
        '6.8/10': '68%',
        '7/10': '70%',
        '7.2/10': '72%',
        '7.5/10': '75%',
        '7.8/10': '78%',
        '7.83/10': '78.3%',
        '7.85/10': '78.5%',
        '7.9/10': '79%',
        '8/10': '80%',
        '8.1/10': '81%',
        '8.2/10': '82%',
        '8.5/10': '85%',
        '9/10': '90%',
        '9.5/10': '95%'
      },
      minHeight: {
        12: '3rem',
        16: '4rem',
        28: '7rem',
        30: '7.5rem',
        32: '8rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        64: '16rem',
        68: '17rem',
        72: '18rem',
        80: '20rem',
        84: '21rem',
        88: '22rem',
        96: '24rem',
        100: '25rem',
        104: '26rem',
        112: '28rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        152: '38rem',
        156: '39rem',
        160: '40rem',
        164: '41rem',
        168: '42rem',
        172: '43rem',
        176: '44rem',
        180: '45rem',
        184: '46rem',
        188: '47rem',
        192: '48rem',
        196: '49rem',
        200: '50rem',
        256: '64rem'
      },
      minWidth: {
        16: '4rem',
        32: '8rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        64: '16rem',
        68: '17rem',
        72: '18rem',
        80: '20rem',
        84: '21rem',
        88: '22rem',
        96: '24rem',
        100: '25rem',
        104: '26rem',
        112: '28rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        152: '38rem',
        156: '39rem',
        160: '40rem',
        164: '41rem',
        168: '42rem',
        172: '43rem',
        176: '44rem',
        180: '45rem',
        184: '46rem',
        188: '47rem',
        192: '48rem',
        196: '49rem',
        200: '50rem',
        256: '64rem',
        '80vw': '80vw'
      },
      maxWidth: {
        48: '12rem',
        52: '13rem',
        56: '14rem',
        64: '16rem',
        68: '17rem',
        72: '18rem',
        80: '20rem',
        84: '21rem',
        88: '22rem',
        96: '24rem',
        100: '25rem',
        104: '26rem',
        112: '28rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        152: '38rem',
        156: '39rem',
        160: '40rem',
        164: '41rem',
        168: '42rem',
        172: '43rem',
        176: '44rem',
        180: '45rem',
        184: '46rem',
        188: '47rem',
        192: '48rem',
        196: '49rem',
        200: '50rem',
        256: '64rem',
        '7/10': '70%',
        '9/10': '90%'
      },
      maxHeight: {
        48: '12rem',
        52: '13rem',
        56: '14rem',
        64: '16rem',
        68: '17rem',
        72: '18rem',
        80: '20rem',
        84: '21rem',
        88: '22rem',
        96: '24rem',
        100: '25rem',
        104: '26rem',
        112: '28rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        152: '38rem',
        156: '39rem',
        160: '40rem',
        164: '41rem',
        168: '42rem',
        172: '43rem',
        176: '44rem',
        180: '45rem',
        184: '46rem',
        188: '47rem',
        192: '48rem',
        196: '49rem',
        200: '50rem',
        256: '64rem',
        '9/10': '90%'
      },
      borderRadius: {
        xl: '1rem'
      },
      boxShadow: {
        1: '0.5px -1.5px 1.5px black',
        2: '0px 2px 4px black',
        5: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
        xlr: '0 -12px 25px -8px rgba(0, 0, 0, 0.25)',
        xl: '0 24px 32px -12px rgba(0, 0, 0, 0.55)',
        xlwhite: '0 12px 16px -12px rgba(255, 255, 255, 0.25)',
        '2xlr': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'elem-dark': '0 2px 4px black',
        'elem-semi-dark': '0 2px 4px #2f2f2f',
        'elem-light': '3px 3px 5px darkgray',
        strong: '0px 12px 8px -4px rgba(0, 0, 0, 0.6)',
        'inner-dark': 'inset 0 2px 4px black',
        gray: '0px 0px 10px 4px #e2e8f0',
        grayscale: '0px 0px 10px 4px #fdfdfd',
        'inner-box': 'inset 0 2px 4px 0 #191d25',
        container: '1px 1px 10px 1px #e0e0e0'
      },
      translate: {
        100: '25rem',
        160: '40rem'
      }
    }
  },

  corePlugins: {
    translate: true
  },
  variants: {
    animation: ['responsive', 'hover', 'focus'],
    backgroundColor: ['dark', 'responsive', 'hover', 'focus', 'active'],
    color: ['dark', 'responsive', 'hover', 'focus', 'active'],
    border: ['responsive', 'hover', 'focus', 'active'],
    borderColor: ['dark', 'responsive', 'hover', 'focus', 'active'],
    boxShadow: ['responsive', 'hover', 'focus', 'active'],
    height: ['responsive', 'hover', 'focus'],
    minHeight: ['responsive', 'hover', 'focus'],
    zIndex: ['responsive', 'hover', 'focus'],
    position: ['responsive', 'hover', 'focus'],
    display: ['group-hover', 'responsive', 'group-focus'],
    textColor: ['dark', 'responsive', 'hover', 'focus'],
    transitionProperty: ['hover', 'focus']
  }
};
