module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/**/*.html',
      './src/**/*.tsx',
      './src/**/*.ts',
      './src/**/*.js',
      './src/**/*.jsx',
    ],
    options: {
      whitelist: ['bg-fire-orange', 'bg-sea-green', 'bg-dark-red', 'translate-y-1/2'],
    }
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  corePlugins: {
    translate: true,
  },
  theme: {
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
      'help': 'help'
    },
    textColor: theme => theme('colors'),
    fontSize: {
      'xxs': '.5rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      '5.5xl': '3.5rem',
      '4.5xl': '2.75rem',
    },
    zIndex: {
      '0': 0,
      '10': 10,
      '20': 20,
      '30': 30,
      '40': 40,
      '50': 50,
      '25': 25,
      '50': 50,
      '75': 75,
      '100': 100,
      'auto': 'auto',
    },
    opacity: {
      '10': '.1',
      '20': '.2',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '65': '.65',
      '70': '.7',
      '75': '.75',
      '80': '.8',
      '85': '.85',
      '90': '.9',
      '95': '.95',
    },
    borderWidth: {
      default: '1px',
      'neg1': '-1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    inset: {
      '0': '0rem',
      '1': '1rem',
      '2': '2rem',
      '3': '3rem',
      '4': '4rem',
      '5': '5rem',
      '6': '6rem',
      '7': '7rem',
      '8': '8rem',
      '9': '9rem',
      '10': '10rem',
      '11': '11rem',
      '12': '12rem',
      '13': '13rem',
      '14': '14rem',
      '15': '15rem',
      '16': '16rem',
      '17': '17rem',
      '18': '18rem',
      '19': '19rem',
      '20': '20rem',
      '21': '21rem',
      '22': '22rem',
      '23': '23rem',
      '24': '24rem',
      '25': '25rem',
      '26': '26rem',
      '27': '27rem',
      '28': '28rem',
      '29': '29rem',
      '30': '30rem',
      '1/2': '50%',
    },
    fontFamily: {
      'open': ['Barlow', 'sans-serif'],
      // 'open': ['Open Sans Condensed', 'sans-serif'],
    },
    extend: {
      lineHeight: {
               'extra-tight': '.8',
                },
      animation: {
        'bounce': 'bounce 2.5s linear 2',
        'ping': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fadeIn': 'fadeIn 1s ease-in-out'
      },
      keyframes: {
        bounce: {
          '0%': {
            transform: 'translateY(0)'
          },
          '60%': {
            transform: 'translateY(0)'
          },
          '65%': {
            transform: 'translateY(-4px)'
          },
          '75%': {
            transform: 'translateY(-6px)'
          },
          '78%': {
            transform: 'translateY(0)'
          },
          '100%': {
            transform: 'translateY(0)'
          },
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
      },
      width: {
        '1/2': '48%',
        '1/3': '30%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '19/20': '95%',
      },
      spacing: {
        '0.5': '.125rem',
        '2.5': '.625rem',
        '11': '2.75rem',
        '14': '3.5rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '64': '16rem',
        '68': '17rem',
        '72': '18rem',
        '80': '20rem',
        '84': '21rem',
        '88': '22rem',
        '96': '24rem',
        '100': '25rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
        '132': '33rem',
        '136': '34rem',
        '140': '35rem',
        '152': '38rem',
        '156': '39rem',
        '160': '40rem',
        '164': '41rem',
        '168': '42rem',
        '172': '43rem',
        '176': '44rem',
        '180': '45rem',
        '184': '46rem',
        '188': '47rem',
        '192': '48rem',
        '196': '49rem',
        '200': '50rem',
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
        '3.5/10': '35%',
        '3.8/10': '38%',
        '3.9/10': '39%',
        '4/10': '40%',
        '4.3/10': '43%',
        '4.5/10': '45%',
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
        '8.2/10': '82%',
        '8.3/10': '83%',
        '8.5/10': '85%',
        '8.7/10': '87%',
        '8.8/10': '88%',
        '9/10': '90%',
        '9.28/10': '92.8%',
        '9.5/10': '95%',
        '19/20': '95%',
        '9.3/10': '93%',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        '1': '0.5px -1.5px 1.5px black',
        '2': '0px 2px 4px black',
        '5': '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
        'xlr': '0 -12px 25px -8px rgba(0, 0, 0, 0.25)',
        'xl': '0 12px 25px -8px rgba(0, 0, 0, 0.25)',
        '2xlr': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'elem-dark': '0 2px 4px black',
        'elem-semi-dark': '0 2px 4px #2f2f2f',
        'elem-light': '3px 3px 5px darkgray',
        'map': '5px -1px 8px #1A202C',
        'inner-dark': 'inset 0 2px 4px black',
        'gray': '0px 0px 10px 4px #e2e8f0',
        'grayscale': '0px 0px 10px 4px #fdfdfd',
        'inner-box': 'inset 0 2px 4px 0 #191d25',
        'container': '1px 1px 10px 1px #e0e0e0',
      },
      colors: {
        'transparent': '#ffffff00',
        'background': '#f2f2f2',
        'off-white': '#ffffffe6',
        'dark-red-faded': 'rgba(202, 34, 34, 0.2)',
        'dark-red': '#CA2222',
        'ketchup': '#CA2222',
        'blueberry': '#488AC7',
        'sea-green': '#17A589',
        'green-light': '#38a169',
        'fire-orange': '#FF5733',
        // 'dark-blue': '#04111A',
        'lighter-blue': '#1a202c',
        'medium-blue': '#30445e',
        'med-dark-blue': '#273548',
        'dark-blue': '#1C2C42',
        'darker-blue': '#384f68',
        'denim': '#153057',
        'dark': '#051429',
        // 'dark': '#010710',
        'gold': '#F1C40F',
        'mustard-yellow': '#C7A748',
        'grayscale': '#666666',
        'grayscale-light': '#d2cbcb',
        'grayscale-lighter': '#f7f7f7',
        'orange-light': '#e4a04f',
        'orange-medium': '#e4714f',
        'pink-light': '#c64575',
        'grayscale': '#66666673',
        // 'grayscale' : '#666666',
        // 'grayscale-light' : '#d2cbcb96',
        'grayscale-light': '#959aa3',
        'grayscale-lighter': '#f9f9f947',
        'grayscale-lightest': '#fffbfb',
        // 'grayscale-lighter' : '#f7f7f7',
        'white5': 'rgba(255,255,255,.05)',
        'white10': 'rgba(255,255,255,.1)',
        'white20': 'rgba(255,255,255,.2)',
        'white30': 'rgba(255,255,255,.3)',
        'white40': 'rgba(255,255,255,.4)',
        'white50': 'rgba(255,255,255,.5)',
        'black10': 'rgba(0,0,0,.1)',
        'black20': 'rgba(0,0,0,.2)',
        'black30': 'rgba(0,0,0,.3)',
        'black40': 'rgba(0,0,0,.4)',
        'black50': 'rgba(0,0,0,.5)',
        'black60': 'rgba(0,0,0,.6)',
        'black70': 'rgba(0,0,0,.7)',
        'black80': 'rgba(0,0,0,.8)',
      },
    },
  },
  variants: {
    animation: ['responsive', 'hover', 'focus'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    color: ['responsive', 'hover', 'focus', 'active'],
    boxShadow: ['responsive', 'hover', 'focus', 'active'],
  },
  plugins: [],
}