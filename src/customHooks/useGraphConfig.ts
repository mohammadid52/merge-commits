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
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      //   @ts-ignore
      content: ({label}) => label,
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
      title: {
        text: legendTitle,
        spacing: 8,
        style: {
          fontSize: 16
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
