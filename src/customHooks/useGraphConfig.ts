import {PieConfig} from '@ant-design/plots';

const useGraphConfig = <T>({
  data,
  legendTitle
}: {
  data: {label: string; value: number}[];
  legendTitle: string;
}) => {
  const config: PieConfig = {
    data,
    angleField: 'value',
    colorField: 'label',
    radius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({percent}) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,

        textAlign: 'center'
      }
    },
    interactions: [
      {
        type: 'element-active'
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
