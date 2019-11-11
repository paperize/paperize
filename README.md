# Paperize.io: Make Better Games, Faster!

Paperize helps game designers make better games by leveraging free web tools to rapidly create and iterate on their designs.

## Get Involved

- Support the project on [Patreon](https://patreon.com/paperize)
- Chat with programmers and game designers on [Discord](https://discord.gg/9ggkkQp)
- Read [the Docs](https://docs.paperize.io)
- Contribute to [the Docs](https://github.com/paperize/docs)

## Getting Started

- [Install NodeJS](https://nodejs.org)
- clone this repository
- Set up your API Keys:
  - visit [the Google API Developer Console](https://console.developers.google.com/apis/credentials)
  - create a new Project for Paperize
  - create a Google OAuth Client ID
  - create a Google Fonts API Key
  - create a Google Picker API Key
  - `cp example.api_keys.dev.json .api_keys.dev.json`
  - modify `.api_keys.dev.json` to contain the keys you just set up
- `npm install`
- `npm test`
- `npm start`
- visit http://localhost:8080 and _go go go!_
