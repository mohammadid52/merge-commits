import {PieConfig} from '@ant-design/plots';
import useTheme from './useTheme';

const useGraphConfig = <T>({
  data,
  legendTitle,
  statisticsTitle
}: {
  data: {label: string; value: number}[];
  legendTitle: string;
  statisticsTitle?: string;
}) => {
  const theme = useTheme();
  const config: PieConfig = {
    data,
    angleField: 'value',
    colorField: 'label',
    radius: 0.6,
    label: {
      type: 'outer',

      content: ({percent}) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,

        textAlign: 'center'
      }
    },
    meta: {
      value: {
        formatter: (v) => (v !== null ? `${v}` : `0`)
      }
    },
    pieStyle: {
      lineWidth: 0
    },
    statistic: {
      title: {
        offsetY: -8,
        content: statisticsTitle || 'Total',
        style: {
          color: theme.light.dark,
          fontSize: '16px'
        }
      },
      content: {
        style: {
          color: theme.light.medium,
          fontSize: '18px',
          fontWeight: 400
        },

        offsetY: -4
      }
    },
    innerRadius: 0.64,

    interactions: [
      {
        type: 'element-active'
      },
      {
        type: 'element-single-selected'
      }
    ],
    legend: {
      position: 'right',
      offsetX: -50,
      title: {
        text: legendTitle,
        spacing: 8,
        style: {
          fontWeight: 500,

          fontSize: 14
        }
      },

      itemValue: {
        formatter: (_: any, item: {value: any}) => {
          const items = data.filter((d) => d.label === item.value);
          return items.length
            ? items.reduce((a, b) => a + b.value, 0) / items.length
            : '-';
        },
        style: {
          opacity: 0.65
        }
      }
    }
  };

  return config as T;
};

export default useGraphConfig;
