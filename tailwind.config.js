module.exports = {
  theme: {
    opacity: {
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
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px', 
      '6': '6px',
      '8': '8px',
    },
    inset: {
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
  },
    fontFamily: {
      'open': ['Open Sans Condensed', 'sans-serif']
    },
    extend: {
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
        '1/10': '10%',
        '1.3/10': '13%',
        '1.5/10': '15%',
        '2/10': '20%',
        '2.3/10': '23%',
        '2.5/10': '25%',
        '2.8/10': '28%',
        '3/10': '30%',
        '3.1/10': '31%',
        '3.2/10': '32%',
        '3.27/10': '32.7%',
        '3.8/10': '38%',
        '4/10': '40%',
        '4.3/10': '43%',
        '4.5/10': '45%',
        '4.8/10': '48%',
        '4.9/10': '49%',
        '5/10': '50%',
        '5.5/10': '55%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '8.3/10': '83%',
        '8.5/10': '85%',
        '8.8/10': '88%',
        '9/10': '90%',
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
        'elem-dark': '0 2px 4px black',
        'elem-light': '3px 3px 5px darkgray',
        'map': '5px -1px 8px #1A202C',
        'inner-dark': 'inset 0 2px 4px black',
        'gray': '0px 0px 10px 4px #e2e8f0',
        'grayscale' : '0px 0px 10px 4px #fdfdfd'
      },
      colors: {
        'dark-red-faded': 'rgba(202, 34, 34, 0.2)',
        'dark-red': '#CA2222',
        'blueberry': '#488AC7',
        'sea-green': '#17A589',
        'fire-orange': '#FF5733',
        // 'dark-blue': '#04111A',
        'dark-blue': '#1C2C42',
        'dark': '#051429',
        'gold': '#F1C40F',
        'grayscale' : '#666666',
        'grayscale-light' : '#f1f1f1',

      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    color: ['responsive', 'hover', 'focus', 'active'],
    boxShadow: ['responsive', 'hover', 'focus', 'active'],
  },
  plugins: [],
}
