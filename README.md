# Paperize.io: Make Better Games, Faster!

Paperize helps game designers make better games by leveraging free web tools to rapidly create and iterate on their designs.

## Get Involved

- [Use the tool](https://beta.editor.paperize.io)
- Support the project on [Patreon](https://patreon.com/paperize)
- Chat with programmers and game designers on [Discord](https://discord.gg/9ggkkQp)
- Read [the Docs](https://docs.paperize.io)
- Contribute to [the Docs](https://github.com/paperize/docs)

## Getting Started

- [Install NodeJS](https://nodejs.org). Suggested version is `14`.
- clone this repository
- Set up your API Keys with Google:
  - visit [the Google API Developer Console](https://console.developers.google.com/apis/credentials)
  - create a new Project for your Paperize keys
  - create the OAuth consent screen. You just need to enter the application name, the support email and keep the existing scopes for the moment.
  - Add a google account you plan to test with as a "Test User". (While publishing status is set to "Testing", only test users are able to access the app.)
  - create a Google OAuth Client ID
    - Application Type: Web Application
    - Name: _totally up to you_
    - Authorized JavaScript Origins: `http://localhost:8080`
    - Authorized Redirect URIs: none
  - from the Library menu, enable these APIs:
    - Web Fonts Developer API and create an API Key
    - Google Drive API and choose the previously created API key
    - Google Picker API and choose the previously created API Key
    - Google Sheets API and choose the previously created API Key
  - Open the OAuth Consent Screen menu again, and add the following scopes:
    - Google Drive API `.../auth/drive.file`
- Set up the API keys in your project:
  - copy and rename `example.env.development` to `.env.development` (`cp example.env.development .env.development`)
  - modify `.env.development` to contain the keys you just set up in the Google Developer Console
- `npm install`
- `npm start`
- visit http://localhost:8080 and _go go go!_
- **Please, be sure to use localhost:8080, as opposed to 127.0.0.1, when adding the Authorized Javascript Origins and opening your server in the browser, since 127.0.0.1 is not allowed by Google API permissions.**

## Libraries, Tools, & Services

- [VueJS 2.x](https://vuejs.org/v2/guide/): low-overhead, highly productive front-end framework
- [Vuetify 1.5.x](https://v15.vuetifyjs.com/en/): material design components for Vue
- [Material Design Icons](https://materialdesignicons.com/): icons integrated into Vuetify
- [jsPDF](http://raw.githack.com/MrRio/jsPDF/master/docs/) and [my fork](https://github.com/lorennorman/jsPDF): PDF generation in the browser
- [Cypress.io](https://cypress.io): modern, browser-based integration testing
- NodeJS, Webpack, Babel: so we can write modern JS
- Google Drive API for user-controlled storage (more to come)
- Amazon Route53/Cloudfront/S3: simple, fast, cheap, global CDN
