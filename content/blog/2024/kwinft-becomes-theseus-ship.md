---
title: "KWinFT Becomes Theseus' Ship"
draft: false
date: 2024-02-27 12:00:00
tags:
- github
- kwinft
- theseus ship
- winft
series: false
canonical_url: false
description: "The KWinFT Wayland and X11 compositor for the KDE Plasma desktop is now named Theseus' Ship. This is just a teaser to something bigger though."
authors: [roman-gilg]
---
With the long awaited KDE Plasma 6 release just around the corner,
the KWinFT compositor has now been rebranded as *Theseus' Ship*.
The first release is available [on GitHub](https://github.com/winft/theseus-ship)
as part of the *WinFT* family of open-source products.

## Release Together With KDE Plasma 6
It was a hard grind, but I managed to put together a first experimental release of the compositor,
fully [ported to Qt 6](../2023/qt-6-and-more-big-changes-to-kwinft),
and working in combination with Plasma 6.

Looking back, now nearly four years ago KWinFT was [publically announced](../2020/the-kwinft-project).
In these four years a lot has happened.

Initially, KWinFT was more of an experiment, exploring the development of KWin beyond the confines of the unwritten KDE development rules - and with the hopes of merging it back one day.

However, I soon shifted focus to create something more transformative
within the Linux graphics stack,
as outlined in [my talk](https://www.youtube.com/watch?v=lTp7al9FXFs)
at the X.Org Developer's Conference 2021.

And I'm happy that in the coming days I'll be able to talk more about the results of this hard work, of what Theseus' Ship is only a small part.

## New Home on GitHub
While KWinFT and its sister projects Wrapland, Disman and KDisplay were hosted on [gitlab.com](https://gitlab.com),
I decided to use this rebranding as an opportunity to change places, and move with them to GitHub.

There are several reasons for this rather unusual change.
But let me just name the most important one: I'm dissatisfied with GitLab's commitment to open-source projects on gitlab.com. In particular requiring contributors to provide credit card information for basic operations, was an annoying constraint.

We'll see how GitHub fares in the future, for now it's pretty great though.
Porting over GitLab Pipelines to GitHub Actions was of course not directly straightforward.
But once it was done,
it was a nice surprise to see that the free runners on GitHub are noticable faster
than the shared ones on gitlab.com.

## More Than the Sum of Its Parts
As mentioned, this is just a small teaser to something bigger.
If you look through Theseus' Ship's source code, it's easy to spot what I am talking about.
Officially I will reveal and talk more about it in a second announcement in the coming days.

And one more thing: if you like to sponsor my ongoing open-source work financially,
you can now do this through
[GitHub Sponsors](https://github.com/sponsors/romangg) or [Ko-fi](https://ko-fi.com/romangg).
