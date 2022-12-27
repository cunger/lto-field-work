export const print = (count: number, noun: string, zeroAlternative?: string) => {
  if (count == 0 && zeroAlternative) {
    return zeroAlternative;
  }

  if (!noun || noun == 'undefined') {
    noun = 'other';
  }
  
  noun = noun.toLowerCase();

  const plural = (noun: string) => {
    if (noun.endsWith('cm')) return noun;
    if (noun.endsWith('fish')) return noun;
    if (noun.endsWith('gear')) return noun;
    return `${noun}s`;
  };

  return (count === 1)
    ? `${count} ${noun}`
    : `${count} ${plural(noun)}`;
};