import React, {useEffect, useState} from 'react';

export const QuoteWidget = (props: {
  quotes: any[];
  classProp?: string;
  card?: boolean;
  placement: string;
}) => {
  const {quotes, placement} = props;
  const [widgetQuote, setWidgetQuote] = useState<{
    text: string;
    author: string;
  }>();
  const [twClass, setTWClass] = useState<string>('opacity-100');

  useEffect(() => {
    if (!widgetQuote) setWidgetQuote(quotes[0]);
  }, []);

  useEffect(() => {
    let quoteTimer = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * quotes.length);
      setTimeout(() => {
        setTWClass('opacity-0');
      }, 0);
      setTimeout(() => {
        setWidgetQuote(quotes[randomNumber]);
      }, 1000);
      setTimeout(() => {
        setTWClass('opacity-100');
      }, 1200);
    }, 6000);
    return () => clearInterval(quoteTimer);
  }, []);

  return (
    <div>
      <div className={`mb-2`}>
        <span className={`text-gray-400 w-full font-semibold text-sm`}>Other</span>
      </div>
      <div
        style={{
          minHeight: 90,
          minWidth: placement === 'topbar' ? 300 : 'unset'
        }}
        className={`text-sm text-center italic p-3 bg-white shadow rounded-lg flex items-center justify-center`}>
        {widgetQuote && (
          <div className={`${twClass} transition duration-1000 ease-in-out`}>
            <h2>"{widgetQuote.text}"</h2>
            <p>- {widgetQuote.author}</p>
          </div>
        )}
      </div>
    </div>
  );
};
