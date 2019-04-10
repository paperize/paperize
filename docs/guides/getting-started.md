---
slug: getting-started
title: Getting Started
---

# Getting Started

_Wherein we create a game from scratch with Paperize_

<!-- Note: Prefer to learn by watching? This guide has a video version: link. -->

## Start Paperize

In order to turn our game idea into a physical prototype as quickly as possible, we've decided to follow the Paperize workflow:

- design our game in a Google Spreadsheet
- organize the images in our Google Drive
- use Paperize.io to generate print-and-play PDF-files from those assets
- print, play, ponder, repeat

To start the process, we visit [Paperize.io](https://beta.editor.paperize.io).

## Logging In

Looking to the top right corner of the app, we click the "Sign In" menu item.

SIGN_IN_LINK_IMAGE

We are presented with a pop-out window that allows us to log in with our Google accounts.

GOOGLE_POP_OUT_IMAGE

After entering our credentials, we need to give Paperize access to our Google Drive and Google Sheets.

GOOGLE_PERMISSIONS_IMAGE

And that's it! Paperize will complete the login process, including creating a "Paperize.io" folder in our Google Drive, and dropping a special file in it, "paperize_database.json". You can view these details by clicking the "Database" menu item now visible at the top of the screen.

DATABASE_LINK_IMAGE

DATABASE_POPOVER_IMAGE

[Learn more about Google Authorization](/references/google-authorization)

## Creating a New Game

The first screen of Paperize lists our games, and since we have only just started, we have no games to list. Let's remedy that!

We click the button titled "New Game" and fill in a title.

NEW_GAME_BUTTON

NEW_GAME_FORM

We notice a handful of checkboxes related to Google Drive:
- one creates a folder to go with this game
- one creates an "Images" folder inside the game folder
- one creates a Spreadsheet inside the game folder

All of these are useful for rapidly putting a game together without tedious tasks, so we leave them checked.

We click "Start Designing", the game is created as well as the Google Drive assets, and we are dropped into the game editor.

[Learn more about the Game resource](/references/game)

## Creating a New Component

In Paperize, our games are made up of components. A component is a deck of cards, a stack of tiles, player mats, even instruction manuals and promotional inserts could be modeled as components.

We click the button titled "New Component" and fill in a title.

NEW_COMPONENT_BUTTON

NEW_COMPONENT_FORM

Again we see a checkbox related to our assets in Google Drive: this one creates a new worksheet inside of this game's spreadsheet (remember, a spreadsheet was created for this game automatically in the last step.)

Once again we agree that this is saving us time, so we leave it checked.

We click "Create Component" and see the component appear on the left side of the screen, with its Spreadsheet and Template settings open in the middle and right of the screen.

SELECTED_COMPONENT_SCREEN

[Learn more about the Component resource](/references/component)

## Importing a Spreadsheet

Should be already set, blah.

Can be changed to a different spreadsheet.

Click link to jump to Google Sheets editor...

## Data Generation: Spreadsheet Values

Type some data manually.

Provide some data. "Click to copy" a Google Drive resource.

[Learn more about how Paperize uses Spreadsheets](/references/spreadsheet)

## Editing the Template

- Add 3 Shape Layers
- Add 2 Text Layers
- Add 1 Image Layer...

[Learn more about Shape Layers](/references/shape-layer)

[Learn more about Text Layers](/references/text-layer)

## Asset Acquisition: Image Source

Google Image Search with licensing-aware search settings.

Other licensing-aware image directories and search engines.

Put into the Paperize.io folder.

[Learn more about how Paperize uses Images](/references/image)

## Finishing the Template

Add static Image Layer of background

Add dynamic Image Layer of cards

[Learn more about Image Layers](/references/image-layer)
