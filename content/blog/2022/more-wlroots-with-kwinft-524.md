---
title: "More wlroots with KWinFT 5.24"
date: 2022-02-08 21:00:00
tags:
- kwinft
- wlroots
series: false
cover_image: ./assets/2022-02-08-more-wlroots-with-kwinft-524.jpg
canonical_url: false
description: "With the new release KWinFT is increasing its integration with the wlroots library. Preparations for the final library split out are ongoing at the same time."
authors: [roman-gilg]
---
In the last year our development focus for KWinFT was on the integration with the
[wlroots library](https://gitlab.freedesktop.org/wlroots).
In a single sentence our goal with this
is to share underlying architecture, patterns and ideas
across the Wayland ecosystem,
instead of reimplementing things again and again for each and every big project
while leaving smaller ones behind.

Only a few months ago in October
a first iteration of this integration was released with KWinFT 5.23.
I talked about it [here](/blog/2021/wlroots-in-kwinft) on this blog
and at X.Org Developer Conference (XDC) 2021 in a talk including a primer on wlroots itself.

If you're interested in that first part of integration specifically
or a wlroots primer in general check out
[my talk on YouTube](https://www.youtube.com/watch?v=My5mppdtjOA).

## Leveraging the wlroots Renderer
But here let's talk some more about
what we now achieved with today's release of version 5.24 and why.
In the previous release 5.23 we made use of the wlroots backend in many aspects already,
but our integration with the wlroots renderer was rather primitive.

We still allocated the buffers for the composition of our final image ourselves through GBM,
then just handed them over to wlroots as dmabufs.
With 5.24 this has changed. KWinFT now allocates its buffers through wlroots.
For that we also switched fully to using the EGL context created by wlroots
and we let wlroots swap the buffers on the outputs at the end of our drawing pipeline.

This is a big step forward,
as it allowed us to remove a lot of our backend code.
The allocation through GBM and all our setup code for the EGL context could be purged.
What we only need anymore is a thin layer of integration with wlroots.
For the future this provides us with a foundation to integrate even deeper with the wlroots renderer.
Our final goal is to use the renderer to such a degree
that we are able to render onto hardware planes directly
through the types that wlroots provides.

Though the development is extremely dynamic.
A lot of API we now use
to render directly through the wlroots renderer
and grabbing its EGL context
didn't exist a few months ago.
So we have to look out at upstream developments and when is the best time to take the next steps.
But I'm looking forward to that.
The wlroots developers are awesome at improving the library in fundamental and logical ways
and it's a joy to work with them as it's a joy to learn from them
and other consumers of wlroots like
[Wayfire](https://wayfire.org/) or
[river](https://github.com/riverwm/river).

At the same time other experienced and novice developers helped
to push the KWinFT project itself forward in the last year.
I want to thank specifically
Fernando, Francesco and as of late Tom
for their contributions and feedback.

## Steps Towards Wayland-only and X11-only Libraries
Deeper integration with wlroots was not the only goal we aimed for with this release.
Conversely we moved our own library plans forward.

Our goal is to provide reusable libraries
that other projects can use in order to build their own compositor
that is tailored to their specific use case.
This has now been a central goal for
[the last two years](https://gitlab.com/kwinft/kwinft/-/issues/21)
and we are moving forward as planned.

In fact we are moving faster than that.
I talked about the library plans at length in
[my second talk](https://www.youtube.com/watch?v=lTp7al9FXFs)
at XDC 21.
And by the timeline I set out there
we want to achieve this with the next release in June this year.

Now it is a good thing we are ahead of time
because of course it is a massive undertaking.
The KWin code we inherited was written in a very monolithic way.
There were attempts in the past to modularize it more.
And for an application of this size it is advisable to do such.
Still the level of
[modularity](https://en.wikipedia.org/wiki/Modular_programming)
is low, the
[coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming))
tight.
And especially with the Wayland integration
another layer of logic was interwoven that led to some strange results,
making the code difficult to extend and maintain.

A simple and rather typical example of such is
[this change](https://gitlab.com/kwinft/kwinft/-/commit/697ea3ae0057a58f68b50bf761971a472d08289a)
from years ago
that introduced a Wayland-specific dependency in a generic utility.

Our goal is to provide libraries for compositor creation.
A consumer of such libraries can expect
that the dependencies for compilation and runtime are minimal.
Because of that we don't want Wayland code in our X11 libraries
and we only want X11 code in our Wayland libraries if the consumer enables Xwayland integration.

The above change that introduced the Wayland dependency in the screen locker watcher had to be corrected therefore, what was done already early in the last development cycle
[with this commit](https://gitlab.com/kwinft/kwinft/-/commit/b3eb6e60a0bdb1f380d39f821db0fb291b0e53e0).
Many more small commits like this and
[major refactoring](https://gitlab.com/kwinft/kwinft/-/commit/8c64ff07f3)
later we could move a big step forward  by
[removing all Wayland dependencies](https://gitlab.com/kwinft/kwinft/-/commit/34afbb78b8d4197f42267a787e7c31b9a30f5a92)
in our common code that is being shared between the Wayland and X11 binary.

There is still a Wrapland dependency in the effects library
which I aim to remove later when refactoring parts of the effects system
but overall this is a great success.
The next big step now is to do it the other way around:
remove all X11 dependencies in our Wayland code.

This will be more difficult
because we must still allow the integration with Xwayland
if the consumer chooses such at compile time.
I assume all compositors aimed at running on desktops
plan to support Xwayland for the foreseeable future.
But in embedded use cases it is often desired
to compile on the target without any X dependencies.

And of course this again is a question of modularity and reduced coupling.
Being able to hook up or remove Xwayland support at compile time
provides better separation than a bunch of if-else clauses at runtime.

As said this will be more difficult,
but with the progress we made in the last year
on underlying structure and improved modularity
I am confident we can achieve it.

## Other Changes
There were other large changes,
most of them have more impact on users,
but none of them was as important on a fundamental level
like the wlroots renderer integration
and our recent advances for the future library splitout.
But let's mention them quickly.

Inter-client data sharing on Wayland
[has been improved](https://gitlab.com/kwinft/wrapland/-/merge_requests/105),
now offering a robust experience
with clipboard, drag-and-drop and the primary selection.

DRM leasing [was stabilized](https://gitlab.com/kwinft/wrapland/-/merge_requests/115) and
support for input methods and virtual keyboards
[was added](https://gitlab.com/kwinft/wrapland/-/merge_requests/107).
You can now for example use
[Squeekboard](https://gitlab.gnome.org/World/Phosh/squeekboard)
on KWinFT.

I was also able to integrate some useful patches from KWin.
Changes to the effect plugins are to highlight here.
[With](https://gitlab.com/kwinft/kwinft/-/commit/94591516897cb4f114ac2de9fcfeb23a4cec87bb)
[these](https://gitlab.com/kwinft/kwinft/-/commit/002c0dd3906170a6515cac93946554752f5e5e2f)
a lot of boilerplate code could be removed
and internal effects are now loaded via the same code path like external ones.

## What We Need to Get Better With
While we are good underway with the big plans
of integrating deeper with wlroots and splitting out our own reusable libraries,
there are some areas that we must improve upon in the future with KWinFT.

For one, we are still missing out on some important features in our Wayland session,
and also on some of the latest features that KWin provides.

While I was able to integrate the important effect plugin changes mentioned above,
I didn't even try to do the same with the new Overview effect.
The reason for this is that the effects code of KWinFT changed so dramatically
in the last year due to the wlroots backend integration and our overall refactoring,
that I decided to not rush this but take a look at what QML and C++ code could be shared
after the implementation in KWin has settled down a bit.

Still as of now the effect is missing in KWinFT,
and that is sad, because it looks like a pretty cool effect.
From what I've seen it is a direct copy of Gnome's overview,
so not very innovative,
but let's not kid ourselves,
the innovative times of the KDE Community are long in the past,
so why not copy something from people with more of that.

Besides such flashy new features
we are still missing out on some fundamental ones
for our Wayland session.

The support for virtual keyboards has now been integrated,
but we do not yet support some important features like
graphical tablet support and
screencasting.

But features are only one side of the medal.
The other is robustness.
Due to our extreme focus on refactoring
and fundamental improvements I think we are on a good way.
Modularity and decoupling improves robustness on a fundamental level.
But what we are lacking is often simple testing and sometimes fixes
to concrete issues,
which might take only a few lines of code to fix.
Regarding this we must also increase our install base.
With more people trying out KWinFT,
also from master directly,
we can find more bugs before release and act on them.

For example while the general feedback I got from contributors
before the release was positive with regards to its stability,
I just discovered yesterday
that resuming from standby can fail sometimes under Wayland.
This is likely caused by the remodelling due to the wlroots renderer integration
and could have been probably fixed before the release
if somebody would have run KWinFT's Wayland session from master on a laptop before that.

So my call to action is: give KWinFT a try,
let us know about the bugs you encounter,
and if you know some C++17/20,
help us fix some of these concrete bugs.
Or if you feel bold today,
why not start working on one of these missing features?

You can get the latest release
[via Manjaro and the AUR](https://gitlab.com/kwinft/kwinft#installation).

We are on
[Matrix](https://matrix.to/#/#kwinft:matrix.org),
[Gitter](https://gitter.im/kwinft/community)
and of course together with our code and tickets on [GitLab](https://gitlab.com/kwinft),
and we're always happy to help new contributors get started.
