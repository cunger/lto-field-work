import { I18n } from 'i18n-js/typings';

export const print = (count: number, noun: string, i18n: I18n, zeroAlternative?: string) => {
  if (count == 0 && zeroAlternative) {
    return i18n.t(zeroAlternative);
  }

  if (!noun || noun == 'undefined') {
    noun = i18n.t('OTHER');
  }
  
  noun = noun.toLowerCase();

  let plural = (noun: string) => noun;
  if (i18n.locale == 'en') {
    plural = (noun: string) => {
      if (noun.endsWith('cm')) return noun;
      if (noun.endsWith('fish')) return noun;
      if (noun.endsWith('gear')) return noun;
      return `${noun}s`;
    };
  }
  if (i18n.locale == 'pt') {
    plural = (noun: string) => {
      if (noun.endsWith('ão')) return `${noun.slice(0, noun.length - 2)}ões`;
      if (noun.endsWith('o') || noun.endsWith('a') || noun.endsWith('ã') || noun.endsWith('e') || noun.endsWith('i') || noun.endsWith('u')) return `${noun}s`;
      if (noun.endsWith('n') || noun.endsWith('r') || noun.endsWith('s') || noun.endsWith('z')) return `${noun}es`;
      if (noun.endsWith(' cm')) return noun;
      if (noun.endsWith('m')) return `${noun.slice(0, noun.length - 1)}ns`;
      if (noun.endsWith('l')) return `${noun.slice(0, noun.length - 1)}is`;
      return `${noun}`;
    };
  }

  return (count === 1)
    ? `${count} ${noun}`
    : `${count} ${plural(noun)}`;
};