---
title: "wlroots in KWinFT"
date: 2021-07-16 13:00:00
tags:
- kwinft
- wlroots
- weston
- mir
series: false
cover_image: ./assets/2021-07-16-wlroots-in-kwinft.jpg
canonical_url: false
description: "KWinFT is from today on internally making use of wlroots. A detailed look at reasons and impact of this important change."
authors: [roman-gilg]
---
As already teasered in the last post about
[KWinFT in its second year](/blog/2021/in-the-second-year-of-kwinft)
a few months ago I started with an ambitious endeavour:
to replace KWinFT's own platform backends with a single one based on wlroots.

Today the feature branch for this fundamental internal refactoring
[has been merged](https://gitlab.com/kwinft/kwinft/-/merge_requests/108/)
into KWinFT's master branch.
To celebrate this milestone
let's take a look at the new wlroots backend in more detail.

## The wlroots Library
wlroots is a library for Wayland compositor creation.
It provides functions and structures to build a Wayland compositor.

Broadly we can divide wlroots into two areas:
* A *server* part,
  that provides the server-side Wayland functionality;
  clients talk to it via the Wayland protocol.
* Multiple *backends*,
  that talk to the platform we run the server on.
  For example there is a [DRM backend](https://en.wikipedia.org/wiki/Direct_Rendering_Manager)
  to send pixels to a screen.

wlroots is very well modularized with amenable facilities.
It is explicitly not a *midlayer* but a *toolkit*
that allows consumers to pick and extend its functionality with ease.
In KWinFT we make only use of wlroots' backends.

## Why Choose wlroots
The question why wlroots was chosen as the new single backend in KWinFT
can be split up into two questions:
* Why make use of an external Wayland compositor library at all?
* Why choose wlroots over other Wayland compositor libraries?

Regarding the first question
there are basically two arguments in favor of using an external, already established library.

### Efficiency and Ecosystem Strength
Making use of an established Wayland compositor library in KWinFT
allows us to be more efficient in making use of available resources.

The most sparse resource in any software project is *developers' time*.
This holds true in the industry
and certainly for free software projects too.

In the past it was possible to maintain KWin as an X11 compositor
basically as a single-person project
because a lot of work was being done behind the scenes by the XServer and its libraries.

This environmental constraint changed drastically with Wayland.
A Wayland compositor now needs to do a lot more than an X11 compositor ever had to.
That shift in responsibilities makes sense on a technical level
and I fully support the Wayland approach,
but for KWin this would have required not only technical changes,
as were done in the past.
It  also requires organizational and social changes in how the development process is structured
and how much we value collaboration between independent or even competing projects.

The solution has never been to just integrate into KWin
everything what the XServer provided in the past,
but it is to change our whole idea on
how a compositor for the Plasma desktop is positioned in regards to other projects
outside of KDE, in the software stack above and below it and relative to its competitors.

This ties in with the second reason
why KWinFT should make use of an independent Wayland compositor library like wlroots.
We can strengthen the ecosystem of Linux graphics overall.
Efforts are shared between different compositor projects.
A bug found in KWinFT with a fix in wlroots will translate to other compositors.
A feature we can get into wlroots directly will be available not only to us,
but to other compositors based on wlroots too,
compositors like [sway](https://swaywm.org/),
[gamescope](https://github.com/Plagman/gamescope),
[Wayfire](https://github.com/WayfireWM/wayfire)
or the compositor of the Librem 5 [phoc](https://source.puri.sm/Librem5/phoc/).

It could be a *game changer* for the Linux graphics ecosystem
as I was told by a stakeholder.

But besides these rather mundane reasons on how the ecosystem is strengthened,
there is another beneficial ramification,
which is of another quality.
Sharing code through wlroots,
discussing it,
enhancing it,
will deepen the ties between projects in the Wayland ecosystem.
It fosters discussion and information exchange between contributors,
allowing us to grow as developers by learning from each other.
And it allows newcomers to get to know different projects more easily.

### Alternatives
There are other Wayland compositor libraries than wlroots around.
Why was wlroots chosen over these alternatives?
Let's look at the two other libraries I considered to answer that.

#### libweston
The [Weston compositor](https://gitlab.freedesktop.org/wayland/weston)
is the reference implementation of a Wayland compositor.
It comes with *libweston*, which "is an effort to separate the re-usable parts of Weston into
a library".

Being an integral part to the reference implementation
libweston is an obvious contender to choose as a Wayland compositor library.
Its maintainers are very active in upstream development,
and for me at least have always been a joy to work with in the past.

To my knowledge libweston is also actively used by some automotive companies
to build their embedded Wayland compositors.

These are all good reasons to make use of libweston,
and I am sure in some use cases,
like the mentioned automotive one,
libweston works fine.

So the *soft factors* are alright.
On the technical side though libweston follows a midlayer library style.
I mentioned earlier that wlroots' toolkit style fits KWinFT better
as we can pick certain parts for integration with our massive code base
and can ignore others.
I assume this would have not been as easy with libweston,
where presumably larger refactors of KWinFT's code
would have been necessary.
A good analysis on the issue with midlayers can be found in
[this presentation](https://www.youtube.com/watch?v=xQ0ItmvGOQ0&t=2437s)
by Daniel Stone,
one of Weston's maintainers.

#### Mir
The [Mir project](https://mir-server.io) has kind of a rough history.
Being first envisioned as an alternative to X11 and Wayland,
Mir was later retooled to become a Wayland server itself.

Mir is here not seen as a Wayland compositor,
but as a "set of libraries for building Wayland based shells".
It is free software
and developed [in the open](https://github.com/MirServer/mir)
just as much as wlroots and Weston.

It is written in modern C++ which would fit well with KWinFT targeting this as well.
Mir's project organization and code quality seem to be great,
coming with its own but [separate test suite](https://github.com/MirServer/wlcs).

The development is active,
likely fully funded by Canonical,
there is enough documentation to get started
and when [I contacted](https://github.com/MirServer/mir/issues/1430)
the developers, they responded swiftly and friendly.

On the other side
the main developers of Mir are not as active in upstream development
on [freedesktop.org](https://www.freedesktop.org/)
as the developers of wlroots and libweston.

Mir's focus on embedded applications is understandable,
considering Canonical's business decisions in the last years,
but it may not fit a full-featured desktop compositor like KWinFT.

Another minus point solely on a personal level was
that I had never worked with the Mir libraries before,
while I had some experience already with wlroots and libweston.

Besides these soft factors on a technical level
from what I read in Mir's documentation
the library is again designed in a midlayer way like libweston.
And Mir is the least low-level of all three contenders.
That might be a good fit for a new Wayland compositor project,
where the developers want to get something up quickly.
For KWinFT, I believe, it would have been too restricting though.

## How to wlroots
This is only a small overview on how I structured my work on the wlroots backend.
I plan to do an in-depth technical talk about it at the next
[X.Org Developers Conference](https://indico.freedesktop.org/event/1/) in September.

There are three main parts to the backend code in wlroots:
* The session integration through `wlr_session`.
* Receiving input through devices of type `wlr_input_device`.
* Sending buffers to outputs with `wlr_output_attach_buffer`.

Session integration means here to acquire the necessary permissions to become the Wayland compositor,
for example to become the DRM master to be able to change the properties of the hardware.

It is important to notice,
that the session integration is independent of the other two parts of the backend code,
but these other two parts of input and output usually depend on each other
and can not easily be used on their own or without session integration.

This forced my hand in the development process.
It meant that I first had to port the session integration code
from our own legacy code which talked to logind directly,
to something making use of wlroots.
I did this by creating interfaces and different implementations as it allowed to
test both approaches at the same time
and allows now to still make use of the logind code in KWinFT's X11 session.

Afterwards KWinFT's backend code for wlroots input and output had to be written.
There is a peculiarity though.
On most platforms,
for example running the compositor nested in another Wayland or X11 session,
the input and output code is supposed to be used together.
But the output code for the DRM backend together with the input code for libinput
can be used independently.
And in fact for some time while the development was ongoing
arbitrary combinations of old input code together with old or new output code and vice versa
were possible on the feature branch.
This made it easier to test the new wlroots code
and compare it with the old DRM and libinput backends in KWinFT
which had been talking directly with libdrm and libinput.

Before the merge back to master though
all of KWinFT's old internal backends have been removed,
so KWinFT's Wayland session always uses wlroots now independent of the platform it is running on.

## Current State and Next Steps
With the wlroots backend branch merged to master
wlroots is now an integral part of KWinFT for all future development.
The first official release with the new backend will be together with Plasma 5.23 in October.

The current state of the master branch is good from what I have seen in my own testing until now.
There are still some issues though which need to be fixed in the upcoming months.
For example I noticed on one of my devices that sometimes after the energy management
switched off the display, it did not go on again. This only happened on this one device though
and at random,
so it needs some more testing to pinpoint the issue.
It might also be a hardware error or a bug on the master branch of upstream wlroots.

Feature-wise there are several ideas I have on how the backend could be improved.
This will be done in coordination with what upstream wlroots plans for the future though.
One feature for which I have already written a draft implementation, is the upcoming
[support of DRM leases](https://gitlab.com/kwinft/kwinft/-/merge_requests/98)
in wlroots.

There are also some other areas that can be improved,
for example making use again of the cursor plane to paint the cursor instead of compositing it,
or in the more distant future making use of overlay planes in a more general fashion.

But as said,
such features will be worked on from now on
in coordination with what upstream wlroots plans
as the wlroots development is very dynamic
with a bunch of awesome contributors.
And with all of us sharing the same motivation
of pushing free and open source graphics,
and in particular the Linux desktop, forward.
