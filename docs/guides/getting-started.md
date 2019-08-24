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

<DocImage src="/generated-images/sign-in-link.png" caption="The 'Sign In' Link" />

We are presented with a pop-out window that allows us to log in with our Google accounts.

<DocImage src="/images/google-pop-out.png" caption="The Google Pop-out Sign-in Form" />

After entering our credentials, we need to give Paperize access to our Google Drive and Google Sheets.

<DocImage class="tall" src="/images/google-permissions.png" caption="The Google Permissions Screen" />

And that's it! Paperize will complete the login process, including creating a "Paperize.io" folder in our Google Drive, and dropping a special file in it, "paperize_database.json". You can view these details by clicking the "Database" menu item now visible at the top of the screen.

<DocImage src="/generated-images/database-link.png" caption="The 'Database' Link" />
<DocImage src="/generated-images/database-popover.png" caption="The Database Popover" />

[Learn more about Google Authorization](/references/google-authorization)

## Creating a New Game

The first screen of Paperize lists our games, and since we have only just started, we have no games to list. Let's remedy that!

We click the button titled "New Game" and fill in a title.

<DocImage src="/generated-images/new-game-button.png" caption="New Game Button" />
<DocImage src="/generated-images/new-game-form.png" caption="New Game Form" />

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

<DocImage src="/generated-images/new-component-button.png" caption="New Component Button" />
<DocImage src="/generated-images/new-component-form.png" caption="New Component Form" />

Again we see a checkbox related to our assets in Google Drive: this one creates a new worksheet inside of this game's spreadsheet (remember, a spreadsheet was created for this game automatically in the last step.)

Once again we agree that this is saving us time, so we leave it checked.

We click "Create Component" and see the component appear on the left side of the screen, with its Spreadsheet and Template settings open in the middle and right of the screen.

<DocImage src="/generated-images/selected-component-screen.png" caption="Selected Component Screen" />

[Learn more about the Component resource](/references/component)

## Importing a Spreadsheet

Because we checked the box on the previous steps, this game has a spreadsheet in Drive already, and a new worksheet inside that spreadsheet is created and linked to this component automatically.

### Don't Have A Spreadsheet?

If you didn't use the checkbox in the previous step, or you decide to change your spreadsheet by clicking the 'Edit' button:

<DocImage src="/generated-images/edit-spreadsheet-link.png" caption="The 'Edit Spreadsheet' Link" />

You can easily select an existing Spreadsheet or have Paperize create a new one for you.

<DocImage src="/generated-images/set-spreadsheet-menu.png" caption="New Spreadsheet Menu" />

### Let's Get Some Data!

Click the icon next to the Spreadsheet's name and we're taken directly to Google Sheets, ready to edit.

<DocImage src="/generated-images/spreadsheet-link.png" caption="Link to Google Sheet" />

## Data Generation: Spreadsheet Values

We know Paperize is all about being lean, so it leverages Google Sheets instead of creating a custom data entry interface. (philosophy of surplus computing)

### First Row: Property Names

The first row should be the names of the things we want on our cards, called "properties". It can be things like "Name", "Cost", "Text", "Rules", "Image Name", etc. It is completely arbitrary what you name your properties.

<DocImage src="/images/spreadsheet-first-row-filled.png" caption="Spreasheet With Property Names Filled In" />

We click back over to Paperize and refresh the spreadsheet there:

<DocImage src="/generated-images/refresh-spreadsheet-link.png" caption="The 'Refresh Spreadsheet' Link" />

A moment later, the property names appear in the Spreadsheet panel:

PROPERTY_NAMES_IN_SPREADSHEET_PANEL

Great! We've proven that the link between Paperize and Google Sheets is working. But we still don't have any cards, and that's where the rest of the rows in the spreadsheet come in...

### Remaining Rows: Component Items

Each row corresponds to a single item on the table: a specific card, tile, or token. We know our game has 14 cards, so we set about editing 14 rows with the information we need on the cards:

DATA_WITHOUT_QUANTITY

We click over to Paperize, refresh the spreadsheet, and see the number of items jump up to our desired value of 14, matching the number of rows we added. But that data is a little fish...

DATA_WITHOUT_QUANTITY_HIGHLIGHTED

We notice some severe duplication in our data: of course, many cards occur multiple times! Luckily, this is just the kind of thing Paperize was created to solve...

### Shortcut: Quantity Property

In order to remove the duplicates, we apply a new property to the spreadsheet, "Quantity", and fill it with the number of times each card appears in the deck:

DATA_WITH_QUANTITY

Much cleaner. We click over to Paperize and refresh the spreadsheet, seeing our number of items drop. Now, utilizing the Quantity Property setting in the Spreadsheet panel:

SET_QUANTITY_PROPERTY

...Paperize steps in to relieve us of the tedious labor of duplicating cards, and we see our item count return to 14.

TODO: Provide some data. "Click to copy" a Google Drive resource.

[Learn more about how Paperize uses Spreadsheets](/references/spreadsheet)

## Editing the Template

We have 14 items, but they're all blank! Not very exciting, is it? We begin to build out the template for our game in earnest by clicking "Edit" on the Template panel:

EDIT_TEMPLATE_BUTTON

And we are greeted with the Template Editor, once described as _"a poor implementation of about 1% of an Adobe tool, and yet somehow still completely necessary and appropriate for the tabletop industry"_, but we digress.

Here's the basic design we want to create:

TEMPLATE_WIREFRAME

It looks like it's 3 shapes, 3 chunks of text, and an image.

### Adding the Shape Layers

[Learn more about Shape Layers](/references/shape-layer)

### Adding the Text Layers

[Learn more about Text Layers](/references/text-layer)

### Adding the Image Layer...



## Asset Acquisition: Image Source

We need some images to put into our game. Not final artwork or anything, just something quick that does a reasonable job of setting the tone. Luckily there is a lot of very good, very free stuff out there, and there are very good tools that help you find it! (philosophy of surplus culture)

### Google Image Search

Today we're using Google Image Search with licensing settings:

GOOGLE_IMAGE_SEARCH_WITH_LICENSING

We search for "medieval guard" and find some things we can use. In order to get them into Paperize, we want to populate the "Images" folder that was created for us when we originally created the game.

### Filling Our Images Folder on Google Drive

Here's the routine we follow to do this:

- click the image we like in the Google Image Search results, so it expands
- right-click the expanded image and select "Save Image as..."
- name the image something simple, like "Guard", then proceed with the download
- visit our Paperize.io folder in Google Drive
- open the game's folder inside the Paperize.io folder
- open the "Images" folder inside the game folder
- upload the image here

ANIMATION_OF_IMAGE_SEARCH_ROUTINE

Great! Now we repeat this process for the other 7 card types in our game, until our image folder looks like this:

IMAGE_FOLDER_FILLED

### Refreshing the Folder in Paperize

Clicking back over to our game prototype in progress, we now need to tell Paperize about all these new images. We do this with the Drive Explorer, found in the main menu after you close the Template Editor.

DRIVE_EXPLORER

Drill down to the images folder we just filled, and click the refresh button adjacent to it:

DRIVE_EXPLORER_IMAGES_REFRESH

Now we see all of our images are indexed, and we are ready to finish the template!

DRIVE_EXPLORER_FILLED

[Learn more about how Paperize uses Images](/references/image)

## Finishing the Template

Back in the Template panel, we click "Edit" to re-open the template editor, and select our image layer:

TEMPLATE_EDITOR_IMAGE_LAYER

Inside the settings panel, we click "Image Content", then select "Dynamic", so that Paperize will set the image based on information from the Spreadsheet.

IMAGE_CONTENT_DYNAMIC_SET

Now we specify how the spreadsheet info becomes a Google Drive file name. In this case, we have named our images exactly matching the "Name" property for each item, i.e. there Name is "Guard" and the associated image in Drive is named "Guard". All we have to do is set the dynamic image property to "Name", and Paperize begins pulling in the images.

IMAGE_CONTENT_DYNAMIC_FILLED

Now let's turn all this into a PDF we can download, distribute, and print!

[Learn more about Image Layers](/references/image-layer)

## PDF Printing

Pleased with what we've created, we close the Template Editor and look for the "Print" button:

PRINT_BUTTONS
