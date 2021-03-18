import React, { useEffect, useState } from 'react';

/*const quotes = [
  {
    quote: 'The principles of restorative justice ask us to look at who has a stake in a given offense and to regard these people with full consideration of their humanity.',
    source: 'Aremisia Solstice',
  },
  {
    quote: 'I think it is healing behavior, to look at something so broken and see the possibility and wholeness in it.',
    source: 'adrienne maree brown ',
  },
  {
    quote: 'First forget inspiration. Habit is more dependable. Habit will sustain you whether youre inspired or not. Habit will help you finish and polish your stories. Inspiration wont. Habit is persistence in practice.',
    source: 'Octavia Butler',
  },

  {
    quote: 'The denunciation of injustice implies the rejection of the use of Christianity to legitimize the established order',
    source: 'Gustavo Gutierrez ',
  },
];*/

export const QuoteWidget = (props:{quotes: any[], classProp?: string; card?: boolean;}) => {
  const {quotes, classProp, card} = props;
  const [widgetQuote, setWidgetQuote] = useState<{ text: string; author: string }>();
  const [twClass, setTWClass] = useState<string>('opacity-100');

  useEffect(() => {
    if (!widgetQuote) setWidgetQuote(quotes[0]);
  }, []);

  useEffect(() => {
    let quoteTimer = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * quotes.length);
      const opaczero = setTimeout(() => {
        setTWClass('opacity-0');
      }, 0);
      const setQuote = setTimeout(() => {
        setWidgetQuote(quotes[randomNumber]);
      }, 1000);
      const opachunnit = setTimeout(() => {
        setTWClass('opacity-100');
      }, 1200);
    }, 6000);
    return () => clearInterval(quoteTimer);
  }, []);

  return (
    <div className={`text-sm text-center italic`}>
      {widgetQuote && (
        <div className={`${twClass} transition duration-1000 ease-in-out`}>
          <h2>"{widgetQuote.text}"</h2>
          <p>- {widgetQuote.author}</p>
        </div>
      )}
    </div>
  );
};
