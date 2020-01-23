# Paperize.io: Make Better Games, Faster!

Paperize helps game designers make better games by leveraging free web tools to rapidly create and iterate on their designs.

## Get Involved

- [Use the tool](https://beta.editor.paperize.io)
- Support the project on [Patreon](https://patreon.com/paperize)
- Chat with programmers and game designers on [Discord](https://discord.gg/9ggkkQp)
- Read [the Docs](https://docs.paperize.io)
- Contribute to [the Docs](https://github.com/paperize/docs)

## Getting Started

- [Install NodeJS](https://nodejs.org)
- clone this repository
- Set up your API Keys:
  - visit [the Google API Developer Console](https://console.developers.google.com/apis/credentials)
  - create a new Project for your Paperize keys
  - create the OAuth consent screen. You just need to enter the application name, the support email and keep the existing scopes for the moment.
  - create a Google OAuth Client ID
    - Application Type: Web Application
    - Name: _totally up to you_
    - Authorized JavaScript Origins: `http://localhost:8080`
    - Authorized Redirect URIs: none
  - from the Library menu, enable Web Fonts Developer API and create an API Key
  - from the Library menu, enable the Google Picker API and choose the previously created API Key
  - from the Library menu, enable the Google Sheets API and choose the previously created API Key
  - Open the OAuth Consent Screen menu again, and add the following scopes:
    - Google Drive API  ../auth/drive.appdata
    - Google Drive API  ../auth/drive.file
    - Google Sheets API ../auth/drive.file
  - `cp example.api_keys.dev.json .api_keys.dev.json`
  - modify `.api_keys.dev.json` to contain the keys you just set up
- `npm install`
- `npm test`
- `npm start`
- visit http://localhost:8080 and _go go go!_
- **Please, be sure to use localhost:8080, as opposed to 127.0.0.1, when adding the Authorized JAvascript Origins and opening your server in the browser, since 127.0.0.1 is not allowed by Google API permissions.**
