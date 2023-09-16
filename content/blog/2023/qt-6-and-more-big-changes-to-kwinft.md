---
title: "Qt 6 and More Big Changes To KWinFT"
date: 2023-05-04 12:00:00
tags:
- kwinft
- wlroots
- qt
series: false
cover_image: ./assets/2023-05-04-qt-6-and-more-big-changes-to-kwinft.jpg
canonical_url: false
description: "The KWinFT project uses Qt&nbsp;6 now and one more wlroots protocol in a crucial place. These changes continue to drive forward the technical vision of the project."
authors: [roman-gilg]
---
Since the [last status update](../2022/changes-of-substance),
work has continued on KWinFT to stay up-to-date with changes in the ecosystem
and push forward our own plans.

## KWin Effects
A lot of work has been done on KWin in the past few years to modernize a subset of effects,
as well as the effects system in general.

Thanks to the [great efforts](https://gitlab.com/kwinft/kwinft/-/merge_requests/253) of Sergio,
a KWinFT contributor,
a large chunk of this work could be backported to KWinFT.

This includes the overview effect and its QML cousins that now feature a more modern UI.
What hasn't been backported is KWin's new tiling functionality,
but from what I've seen,
this is not a big loss.

All this work has also been included in KWinFT's latest release,
which is reasonably stable in terms of stability.
However, on the current master branch,
there are some stability issues that we need to address.
More on that later.

The new instability on the master branch is mostly due to a recent major change:
the porting to Qt&nbsp;6.

## Qt&nbsp;6
As we are currently aligning our releases with KDE Plasma, the point in
time when we would switch from using legacy Qt&nbsp;5 to the most recent
iteration Qt&nbsp;6 was not negotiable - we would switch when KDE Plasma
switched.

This has now happened, as the KDE Plasma master branches switched to Qt&nbsp;6
at the [end of February](https://www.phoronix.com/news/KDE-Plasma-Master-Qt6).

I started working on the KWinFT port about one month later since there
were some other tasks to finish first. But with the recently merged
patches to Wrapland, Disman, KDisplay, and especially [KWinFT](https://gitlab.com/kwinft/kwinft/-/merge_requests/274), we are now
building against Qt&nbsp;6 on master too.

The session is starting up, but as mentioned earlier, there are still
some bugs, especially with rendering effects. Some of these bugs might
actually be in other KDE projects that exhibit temporary instability
after their port to Qt&nbsp;6. So there is still a fair amount of research
to do to find and fix these regressions.

## Catch2
The integration and unit tests of KWinFT were originally written with the [Qt
Test framework](https://doc.qt.io/qt-6/qttest-index.html). This testing
framework is often the first choice for Qt-based applications, but there are
good reasons for using a different one like [Catch2](https://github.com/catchorg/Catch2). For example, see [this excellent
presentation](https://www.youtube.com/watch?v=J27HoZM_PTI) on reasons to switch
and practical tips on how to make this switch.

Obviously, rewriting all tests of KWinFT with Catch2 would not be a small task.
However, since I wanted KWinFT to become less dependent on Qt over time and I was
already looking into Catch2 for a separate customer project, I decided to go ahead
and pull through with the transformation [in one go](https://gitlab.com/kwinft/kwinft/-/merge_requests/270).

There are some interesting results coming from this work. As I had hoped,
compilation times decreased because Catch2 creates a single binary with all the
tests, while Qt Test creates a separate binary for each test. The decrease in
compilation time is around 20%.

Although we now use a single binary for all tests, the separation of tests is
improved because we not only restart a fresh Wayland server instance between
test binaries, but also between each test function or *test section*, as they
are called in Catch2. This has the drawback that running tests now takes more
time, but in my opinion, that is an acceptable trade-off for tests in general
having fewer side effects.

However, being able to create and destroy central pieces like the Wayland server
at runtime requires special care in regards to encapsulation. Since this is a
requirement we want to fulfill anyway for future library excellence, there was
already a lot of work done in the last years to be ready for that. We don't have
direct control over such requirements in our dependencies, though. This led to
another big change.

## Absorb KDE Parts
The [KDE frameworks](https://develop.kde.org/products/frameworks/) offer a lot
of functionality, but due to their age, they lack in certain areas.
One issue is that sometimes global singletons are created depending on the
application lifetime. In our case, this broke the interaction with Xwayland.

Initially, my idea was to fix these issues upstream in the respective KDE
frameworks. However, this approach typically takes a long time, and, more
importantly, in certain core parts of the compositor, we don't want to depend on
KDE frameworks at all.

For that reason, it seemed more appropriate to [directly incorporate](
https://gitlab.com/kwinft/kwinft/-/merge_requests/269) parts of the frameworks
into our code base. This includes basic KWindowSystem code for our X11 session
and the KGlobalAccel runtime component for Wayland.
## wlroots Output Management Protocol
While on one hand we are reducing our dependencies on external projects, on the
other hand we are strengthening cooperation. I have decided to remove our custom
protocol for output management and instead completely rely on the [wlroots output
management protocol](https://gitlab.freedesktop.org/wlroots/wlr-protocols/-/blob/4264185db3b7e961e7f157e1cc4fd0ab75137568/unstable/wlr-output-management-unstable-v1.xml).
This has the added benefit of providing VRR support for free.

Switching to the wlroots protocol still required a reasonable amount of refactoring
in our [Wrapland code](https://gitlab.com/kwinft/wrapland/-/merge_requests/139),
and subsequently [in KWinFT](https://gitlab.com/kwinft/kwinft/-/merge_requests/273).
But I believe that strengthening cooperation and harmonization of protocols in the
Wayland compositor space is definitely worth the effort.

However, one drawback of using the wlroots protocol is that output mirroring is not
possible at the moment. There is a [proposed patch](https://gitlab.freedesktop.org/wlroots/wlr-protocols/-/merge_requests/116)
to allow this again, similar to how our custom protocol did it before, but the patch
has yet to be merged.

## Next Steps
As mentioned earlier, after the Qt 6 port, we must improve stability again before
the next release.

Besides that, a major area I want to look into is our effects system. We were able
to backport some changes from KWin, but overall I am not happy with the current
system. A long-term goal would be to design a second version of it with a basic
subset of functionality not dependent on Qt, and overall more similar to other
proven compositor effect systems like the one established by Wayfire. If there is a
possibility for cooperation with the Wayfire developers or even some form of
standardization, then even better.

The second big topic is target build separation. I have invested a lot of time in
the last few years to improve modularity and create a vision for a collection of
library components for compositor creation. The final step is still to be taken, to
actually build all major library parts and offer them together or individually.
This means that there should be separate CMake targets for
different build configurations, for example with and without Xwayland. A consumer
should be able to build a compositor with a reasonable but otherwise variable
subset of functionality.
