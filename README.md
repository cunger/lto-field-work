
Work in progress. Info will be added.

## Run locally

```
$ npm run start
```

## Build

Translations:
```
$ npm run build:translations
```

App:
```
$ npx expo prebuild
$ npx expo export --platform ios
```

## Deploy

Building and submitting the app:
```
$ eas build --platform ios --profile production 
$ eas submit --platform ios
```

Make sure to increase the version in `app.json` before building and deploying.