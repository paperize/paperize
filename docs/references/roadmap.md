---
slug: roadmap
title: Paperize Project Roadmap
---

# Paperize Roadmap

**Updated:** August 2019


### Next Release: ??? (Alpha 8)

**Releasing:** _To be announced_

**Goal:** Quality of Life: _Time-saving features and automatic backups_


## Road to Public Beta

- [ ] Data Management Story: Backups, Security, Privacy (Alpha 8)
- [ ] Copying Things (Games, Components, Templates, Layers, Dimensions) (Alpha 8)
- [ ] A nice "Load Example" option for everything
- [ ] Browser Testing
- [ ] Getting the Word Out (Marketing Push)


## The Road Beyond

- [ ] Open Sourcing Everything
- [ ] Sharing Things (Games, Components, Templates, Layers, Dimensions)
- [ ] Icon Support/Workflow
- [ ] Layer Nesting
- [ ] Layer Rotation
- [ ] "Print-n-Play" Config
- [ ] SVG support
- [ ] Active Sheet Workflow: Paperize watches Spreadsheet, notes issues, renders PDF
- [ ] Asset Pipeline: Draft and Pro Quality, Performance Tradeoffs


## The Road Behind

### Current Release: "Obedient Consumer" (Alpha 7)
---

**Released:** August 26, 2019

![Obedient Consumer](https://media.giphy.com/media/JRBlqgyCnjdtK/giphy.gif)

**Goal:** _Customization: Google Fonts and Magic Properties_

- [x] Google Font support, expanding the available fonts from 14 to more than 900
- [x] Magic Properties: most things can be dynamically set via the spreadsheet now
  - used to be just text and images
  - now includes colors, font sizes, alignments, shapes, etc
  - new template features will automatically work like this going forward
- [x] A documentation site so new users can self-teach!
- [x] A built-in error-reporter so when things go wrong, users know it and can share it (even if they don't understand it!)

### "Enigmatic Gambler" (Alpha 6)
---

**Released:** March 25th, 2019

![Enigmatic Gambler](https://media.giphy.com/media/l0MYv61yrzZu6roFG/giphy.gif)

**Goal:** _Lots and lots of medium-sized fixes and features things_

- [x] Google Driver Explorer: understand how Paperize sees Drive
- [x] magic shrink-to-fit for font sizes: side-steps bad word-breaking behavior
- [x] multi-page components: for when your component is bigger than your paper!
- [x] component-per-page print option (for powerful printers and savvy layout users)
- [x] worksheet support, row-range support
- **Text Layers:**
- [x] New Options: Horizontal and Vertical Alignment
- [x] Upgrade: Smarter Shrink-to-fit, steps down font size before breaking words
- [x] Bugfix: Cyrillic Support, had no fonts with glyphs outside the ASCII range
- **Layer Editor updates:**
- [x] New Feature: Highlight Selected Layer
- [x] New Interface: Use an accordion control; cleaner, less scrolling
- [x] Improvement: Color Pickers that get out of your way until you need them
- **Print updates:**
- [x] New Feature: Multi-page Components (supports bigger stuff, like game boards)
- [x] New Interface: Print Dialog that tells you what is happening during long prints
- [x] New Print Mode: Component-Per-Page (or "bring your own layout")
- [x] New Print Option: Configurable spacing between items
- **Google Drive updates:**
- [x] New Interface: Drive Explorer, automatically finds all your files
- [x] New Feature: refresh tracking on files ("last refreshed 3 days ago")
- [x] New Feature: use the Google Picker for making selections from Drive
- [x] Improvement: index 1000 files per folder (up from 100)
- **Spreadsheet updates:**
- [x] new Spreadsheet feature: worksheet support
- [x] new Spreadsheet feature: row range support ("only use rows 5 through 15")
- [x] new Spreadsheet workflow: automatically create spreadsheet for game
- [x] new Spreadsheet workflow: automatically create worksheet for component
- **Image updates:**
- [x] new Image workflow: no more special image folders, images can be anywhere
- [x] removed Image Library (subsumed by Drive Explorer)
- [x] General Improvements:
- [x] Performance: local caching layer for Images and Spreadsheets
- [x] User interface: icons for Google Drive Folders, Spreadsheets, and Images
- [x] New Menu: "Help", with links to Discord, Bug Report, and Feature request links
- **Bugfixes:**
- [x] removed Code Layers: I'll bring them back when I can secure them
- [x] fixed Template preview stops working after editing template
- [x] don't search in Google trash

### "Reclusive Scrivener" (Alpha 5)
---

**Released:** December 6th, 2018

![Reclusive Scrivener](https://media.giphy.com/media/LX9cOF1YdfLry/giphy.gif)

**Goal:** _Deep integration with Google Drive so users can own and control sharing of their own data and assets_

This is a massive update including rewrites of multiple sub-systems to facilitate scale and visibility of user data. Paperize will now create its own folder in a user's Google Drive and store a "database" file there. Creating Games and Components in Paperize also creates folders, so it's easy to **manage all of your game assets in one place that you control**. Drive also acts as the server for Paperize.io, so you can log into your account on different devices without wondering where your data is stored (it used to just be in the browser.)

We've also overhauled the look-and-feel of the app, leveraging the phenomenal [Vuetify Material Design Component Framework](https://vuetifyjs.com). It's now easier than ever for us to create modern, usable experiences quickly, and without dedicated design professionals on the team.

- [x] **Google Drive integration** for the app itself, games, components, and images
- [x] adopt **Vuetify framework** for faster, prettier work
- [x] add **Patreon and Discord** to the splash page
- [x] new Shapes: **ellipse, circle, and rounded rectangle**
- [x] new Dimension units: **inches, pixels, and millimeters**
- [x] option to work against the **top, right, bottom, and left** instead of x, y, width, and height


### "Prodigious Electromancer" (Alpha 4)
---

**Released:** January 24th, 2018

![Prodigious Electromancer](https://media.giphy.com/media/wz6qhyAYmglX2/giphy.gif)

**Goal:** _Easy layer/template editing and flexible print layout._

This is it: the new Paperize template editor is now usable all the way through to PDF printing! You can log in, load spreadsheet data, upload images, create a template, and print a PDF to any size paper.

- [x] Shape, Text, and Image layers working in template editor
- [x] Customizable print settings and layout
- [x] HTTPS support


### "Code Cowboy" (alpha 3)
---

**Released:** December 8th, 2017

![Code Cowboy](https://media.giphy.com/media/mYeVFcauQ5Hz2/giphy.gif "Spike learns about using 'eval()' in the browser")

**Goal:** _Render the Source data to PDF in-browser as we work._

**Transforms** come in many types: Images, Text, Icons, etc. By far the deepest, most complex, most flexible Transform is the Transfom all others are built from: the **Code Transform**. Code Transforms are blocks of JavaScript that get called for each **Item** in a **Component**. They have access to the **Game**, all **Components**, all **Items**, and the PDF rendering library. They provide maximum power with minimum usability.

**Transform Editor:**
  - [x] Add new Transforms
  - [x] Name Transforms
  - [x] Reorder Transforms (render order)
  - [x] Edit Transforms with the ACE editor

**Template Renderer:**
- [x] Live previews of actual PDF output
- [x] Ability to print entire game (one Item per page, no layout)


### "Scheming Vizier" (alpha 2)
---

**Released:** October 14th, 2017

![Scheming Vizier](https://media.giphy.com/media/YLHwkqayc1j7a/giphy.gif "Scheming Vizier")

**Goal:** _Component Source management and Google Sheets integration._

If a **Component** is a deck of cards, stack of tiles, or pile of chips, then a **Component Source** is what populates every item in the deck/stack/pile. The most-prefered method for authoring and sharing Sources is Google Sheets, and thus Google Sheets is the only option available during Alpha.

[Watch visual test suite](http://beta.editor.paperize.io/releases/10-14-17.mp4)

**Component Source Editor:**
  - [x] import a new Google Sheet Component Source by URL or ID
  - [x] import a new Google Sheet Component Source by exploring your Sheets
  - [x] explore imported Component Sources
  - [x] select a Component Source
  - [x] visualize selected Component Source
  - [x] change selected Component Source
  - [x] refresh a Component Source from Google
  - [x] get Google approval for the API scopes we're using

### "Sleeping Giant" (alpha 1)
---

**Released:** August 4th, 2017

![Sleeping Giant](https://media.giphy.com/media/YssHwX1OFFmbS/giphy.gif "Sleeping Giant")


**Goal:** _Initialize project and deploy. Just the broad interactions: managing Games and their Components._

This proves we can develop and deploy a brand new codebase and stack, statically to the web. You can work with the basic parts without the world ending. Hooray!

[Watch visual test suite](http://beta.editor.paperize.io/releases/8-4-17.mp4)

**Basics:**
  - [x] Home
  - [x] Login/Logout
  - [x] Profile info

**Game Manager:**
  - [x] add a new game
  - [x] list my games
  - [x] delete a game
  - [x] work on a game (start the game editor)

**Game Editor:**
  - [x] edit game attributes
  - [x] delete game
  - [x] add a new component
  - [x] select a component for editing
  - [x] delete a component

**Layers:**
  - [x] Image Layer
  - [x] Text Layer (with data templating)
  - [x] Shape Layer

**Printing:**
  - [x] Customizable page and margin settings
  - [x] Multiple components per page

**Devops:**
  - [x] CDN
  - [x] SSL
