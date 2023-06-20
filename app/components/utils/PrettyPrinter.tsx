import { I18n } from 'i18n-js/typings';
import DateTime from '../../model/DateTime';
import Catch from '../../model/fisheries/Catch';

export const print = (count: number, noun: string, i18n: I18n, zeroAlternative?: string) => {
  if (count == 0 && zeroAlternative) {
    return i18n.t(zeroAlternative);
  }

  if (!noun || noun == 'undefined') {
    noun = 'OTHER';
  }

  noun = noun.trim();
  noun = !i18n.t(noun).startsWith('[missing') ? i18n.t(noun) : noun;
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

export const photoFileName = (filetype: string, item: Catch) => {
  const date = new Date(item.date);
  const dateString = `${date.getFullYear()}-${withLeadingZero(date.getMonth() + 1)}-${withLeadingZero(date.getDate())}`;
  const name = `${dateString}-${item.common_name || item.species?.replace('SPECIES_', '') || 'Fish'}-${Date.now()}.${filetype}`;
  return name;
}

export const printDateShort = (date: DateTime, i18n: I18n): string => {
  switch (i18n.locale) {
    case 'en': return `${withLeadingZero(date.day)}-${withLeadingZero(date.month)}-${date.year}`;
    case 'pt': return `${withLeadingZero(date.day)}/${withLeadingZero(date.month)}/${date.year}`;
    default: return `${withLeadingZero(date.day)}.${withLeadingZero(date.month)}.${date.year}`;
  }
}

export const printDateLong = (date: DateTime, i18n: I18n): string => {
  switch (i18n.locale) {
    case 'en': return `${i18n.t('MONTH_' + date.month)} ${withLeadingZero(date.day)}, ${date.year}`;
    case 'pt': return `${date.day} ${i18n.t('MONTH_' + date.month)} ${date.year}`;
    default: return `${date.day}. ${withLeadingZero(date.month)}. ${date.year}`;
  }
}

const withLeadingZero = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
} 