# Paperize Has No Database

Wherein we explore the idea a web application that DOESN'T send all of the end-user's data to the server, but rather leaves it in place where the application is running: on the user's machine.

## Standard Web Apps

Traditionally (for about the past 20 years), web applications of any scale have been "database-backed web applications". This class of software encompasses virtually every notable website we use: Google, Facebook, and Amazon certainly, but also the corporate portals we use in our day jobs, the smaller e-commerce platforms, and even creative endeavors such as Pinterest and Canva.

Indeed, it is easy for one to assume that database-backed is the _only_ way to create a compelling and scalable web application. What else would the "server" be for in the "client-server" model of software that the web uses? Many clients talk to a single source of truth that makes sure everything is valid and safe and shares changes from any one client back out to other clients.

So, what's the problem?

## Problems with Databases

Oh, there are problems. Big ones.

### Technical Scalability

You've got to scale this thing, for one! The more users you get, the more data you must store. The more your users use the product, the more data you must store. The more data you store, the slower our database gets.

### Security

If we've scaled up our database to handle a bajillion requests, we must be getting pretty popular! That means we're on the radar of the bad guys, who will now begin launching constant attacks on our bastion of juicy user data.

### Team Scalability

In order to get our database scaled up and protected, we've got to hire a lot of talent along the way! Database people and operations people and developers. And don't forget the managers, and the managers of managers.

### Privacy (Moral Hazard)

What if the bad guys are on the payroll? It sounds something like: "Let's make the product free so people will sign up in droves, then we'll make money by selling their data!"

### Late Stage Capitalism

Starting to stretch here, but this is the ultimate endgame where all the bad stuff happens. Now that there is so much money flowing through the organization, and so many people involved in the chain, the knives come out. Saving and making the next dollar becomes the only thing that matters. We end up with large entities which everyone must use that fail across the board: slow web applications with weak security run by a skeleton crew who infringe on their user's privacy as a matter of business as usual.

Slippery slope? Read the news.

## But How Can We Go Without?

So we know there are problems with using a central data store, but is it really possible to do without? No one else seems to be doing this, how do we know it will work?

First of all, I'm crazy. If "no one" else is doing something, I'm compelled to do it just to learn, and I'll admit that motivated my initial research into this idea. But I quickly found that it just wasn't true: there are lots of people doing this, people with their heads screwed on a lot tighter than me!

Hoodie, PouchDB, WebSQL

Lives in your browser instance.

Use a remote data store to get replication the user owns.

No team required to get scalability, security, privacy. And drastically reduced moral hazard!

Let's build this thing.


# Intro

Ok, I have to confess. I've been playing. With modern web tools.

...kind of **a lot**.

And it's kind of... _unbelievably cool._


# Toolchain: Automatic User Story Videos

I've got a pretty tight little tool chain running. I can do neat tricks, like trivially create videos of my entire application being run through every user story, check it out:

[video embed]

# Stack Reduction, Discovery of noBackend, DreamCode, hood.ie and their ethics

I also totally removed two collaborators from my stack:
- Auth0
- Google Analytics

I thought these 2 would be requirements in this project from the beginning. I turned out to be wrong on both of them, but for very different reasons!

Holy cow, I thought the term "serverless" was hipster going into this! That's before I discovered the Hoodie ecosystem: hood.ie where I learned about noBackend, DreamCode, and user-driven design (whatever they say)

# My Ethics

I'm shedding weight, you see, because I want Paperize to be more of a public utility than, say, a "growth for growth's sake"-style modern startup. What if it were something:
- free to use
- fully
- by anyone
- on the planet
- by visiting a link

# PouchDB/CouchDB Replication

Now I'm looking hard at the PouchDB project hoodie is based on, which gives me an in-browser database that can be trivially synced (replicated to a CouchDB server) elsewhere

Why am I on about all this?

# Server Complexity Diatribe

_Because servers are hard, folks!_ I mean, it's not that they're hard per se, it's just that someone (_soon a team of someones_) has a full-time job "doing servers". If, instead of "doing servers", we can just, "not do servers", we can work keep putting quality iterations on a smaller surface area.

But that pushes complexity up front, yep it sure does. To keep the backend pounds off, we gotta learn to juggle this stuff up front. And this is where I talk about VueJS again...

# Vue endorsement, Patreon peer mention

_zomg Vue!!!_

[single-page component example]

Big shout-out to fellow Patreon creator Evan Yu with VueJS, this project is brilliant. It's a front-end framework, it's just a beautifully simple and tight experience once you've internalized single-file components and gotten vuex down (try it if you like React and Angular and all them others.)

# Modern JavaScript endorsement

Oh, and even Javascript is surprising me with the new syntax! I just didn't "get it" until Vue's docs pushed it on me, and wow it is nice. Like, new favorite language nice. (This is like the eighth time JS has become my favorite language.) The shorthand for destructuring objects has _amazing_ benefits to code legibility, terseness, and expressivity. JS has always been a malleable language environment, just kind of hilariously clunky at times. This shorthand streamlines the seams of your objects really nicely.

[js destructuring examples]

Must give credit to Webpack and Babel. Without really learning anything beyond some npm searching-then-reading-then-installing, I got a stack compiling all this new JS loveliness into a build folder. Whenever I need to enable or disable something in Webpack/Babel, it's always been a bit of Googling away, no problem.

# Trivial, Static Deployment

With Webpack/Babel force-multiplying our code's benevolent power, we can just sync that build folder to an S3-bucket-with-static-hosting, and that's a deploy, folks.

[animated gif of "ship it"]

# No Login, Bring Your Own Services Conversation

So how do i log in?

You don't.

What?

You don't log in _to Paperize._

What do I log into?

You log into the services Paperize, as you need them. Paperize does not provide services that have severe infrastructure and data security costs and concerns.

Ok, I get it...

Does it sound crazy to build an app, but not have the decency to put a database under the hood? It's like selling someone a sports car with no engine in it. Or something.

I guess... wait, I thought I was asking the questions?

It's like "here, welcome to my store! i hope you brought a database with you so that we may do business today"

What does that even mean?

It means I don't have a database for you to use.

So how do i store stuff?

Well, at the very first, the app just stores stuff locally, inside the browser. You can edit like this all day, and even rig up sources and render templates!

But eventually you'll want to save things in a more permanent location, either because you want:
- privacy
- security
- more storage
- to use it on other browsers and have my blasted data synced!

Yeah, so this is where it gets cool, you just BYODS! (bring your own data store, duh) For the cost of a few dozen megabytes on Google Drive or Dropbox (so... probably free?), **we can grant Paperize the power of replication** (which PouchDB was built for).

In mere moments, it downloads and restores a blob of data, fully-inflating your data into this new client you've just verified, which is now ready to begin editing. _oh right it also feeds its data back automatically as you work._ Holy moly, you get replication of your own data automatically! I don't have to maintain a database! WAT

Next hurdle is sharing, right? We don't just want to work with our own, home-built pattern libraries, and we don't want to be the only ones using our home-built pattern libraries! We want to browse templates by, and create templates for, each other.

This one's an open question, but replication is looking good for this, too. We should probably experiment with cheaply hosting a few public indexes (just CouchDB servers.) Ad-hoc sharing networks by allowing arbitrary index subscription and posting. Host your own Couch instance! Add hood.ie (which let's you add server code that reacts to data changes) and you can run a guild server in there :)

So yeah, a pretty good story there. Has some definite holes. All good stories have holes. Right?

# Actual Stack Today

Credits

Cast (in order of appearance)
- AWS Route53
- AWS S3
- Google Auth API
- Google Drive API
- Google Sheets API

That's the whole stack? 2 cloud services and 3 APIs?

Yep. The entire app doesn't talk to anything else, today. Your "network" tab in the browser developer tools should be pretty clean, no Google Analytics and friends, no marketing pixels of any kind, just the app code and, when needed calls out to its collaborator services, as configured by the user.
