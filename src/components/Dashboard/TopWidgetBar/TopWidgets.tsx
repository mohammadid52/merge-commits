import React, { useEffect, useState } from 'react';

const quotes = [
  {
    quote: 'Education is the most powerful weapon which you can use to change the world',
    source: 'Nelson Mandela',
  },
  {
    quote: 'The cure for boredom is curiosity. There is no cure for curiosity',
    source: 'Dorothy Parker',
  },
  {
    quote:
      'If You are planning for a year, sow rice; if you are planning for a decade, plant trees; if you are planning for a lifetime, educate people',
    source: 'Chinese Proverb',
  },
  {
    quote: 'It’s not that I’m so smart, it’s just that I stay with problems longer',
    source: 'Albert Einstein',
  },
  {
    quote: 'An investment in knowledge pays the best interest',
    source: 'Benjamin Franklin',
  },
  {
    quote:
      'Some people think only intellect counts: knowing how to solve problems, knowing how to get by, knowing how to identify an advantage and seize it. But the functions of intellect are insufficient without courage, love, friendship, compassion, and empathy',
    source: 'Dean Koontz',
  },
  {
    quote:
      'Good writing is remembering detail. Most people want to forget. Don’t forget things that were painful or embarrassing or silly. Turn them into a story that tells the truth',
    source: 'Paula Danziger',
  },
  {
    quote: 'The beautiful thing about learning is that no one can take it away from you',
    source: 'B. B. King',
  },
];

export const QuoteWidget = () => {
  const [widgetQuote, setWidgetQuote] = useState<{ quote: string; source: string }>();
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
    }, 4000);
  }, []);

  return (
    <div className={`text-sm text-center italic`}>
      {widgetQuote && (
        <div className={`${twClass} transition duration-1000 ease-in-out`}>
          <h2>"{widgetQuote.quote}"</h2>
          <p>- {widgetQuote.source}</p>
        </div>
      )}
    </div>
  );
};
