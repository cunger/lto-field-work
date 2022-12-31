const translationsSource = 'languages/translations.csv';
const translationsTarget = 'app/context/translations.json';
const translations = {
    en: {},
    pt: {}
}

const fs = require('fs');
const csv = require('csv-parse');

console.log('Reading translations from ' + translationsSource + '...');

fs.readFile(translationsSource, function read(error, data) {
  if (error) throw error;

  console.log('Parsing translations...');

  csv.parse(data, {
    bom: true,
    columns: true,
    comment: '#',
    delimiter: ';',
    ltrim: true,
    rtrim: true,
    skip_empty_lines: true,
    skip_lines_with_empty_values: true,
    skip_lines_with_errors: true
  }, function (error, records) {
    if (error) console.log(error);

    console.log('Extracting translations...');

    for (const record of records) {
      if (record.key && record.key !== '') {
        translations.en[record.key] = record.english;
        translations.pt[record.key] = record.portuguese;
      }
    }

    console.log('Writing translations to ' + translationsTarget);

    fs.writeFile(
        translationsTarget,
        JSON.stringify(translations, null, 2),
        'utf-8',
        (error) => { 
          if (error) throw error;
          console.log('Done.');
        }
      );
  });
});
