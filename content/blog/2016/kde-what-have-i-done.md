---
title: "KDE! What Have I Done?"
date: 2016-12-26 12:00:00
published: true
tags:
  - coding
  - kde
  - plasma
  - wayland
series: false
cover_image: ./assets/2016-12-26-kde-what-have-i-done.jpg
canonical_url: false
description: "We count the last days of 2016 so it's time for a little recap."
authors: [roman-gilg]
---
We count the last days of 2016 so it's time for a little recap. And since I finally brought all my KDE projects to pleasant end or intermediate states, I even find some time for it. Of course there is one major project I should've actively started working on already atleast half a month ago, but because I concentrated on other ones first haven't even started with: It's my Season of KDE project of finishing the Atomic Mode Setting support in KWin.

It's also the right project to begin this recap with, since its predecessor is basically the catalyst of it all. I did some smaller bug fixes before that, but the real progression started with my application for one of the project ideas by KWin's maintainer Martin for the [Google Summer of Code 2016][GSOC], which was precisely Atomic Mode Setting, and this application was ... directly rejected. To be honest though it's understandable. My application was probably one of the least effortful. I don't like to talk much and make promisses, better just do the work. And to be even more honest this wasn't the only factor, but also that I didn't know shit about how this very technical project can be realized and so how should I've described it without lots of research? I had other stuff to do back then and wanted to delve into the specifics only somewhat later.

Regardless of this setback I decided to still try my luck with it, and Martin was willing to mentor my work even if it wasn't running under the GSOC umbrella. This "work" consisted the first weeks only in trying to get some sort of understanding of it all. Yeah, I really knew shit! What's the DRM, what's a CRTC, what's a plane, what's a connector and what again is an IOCTL? All I could rely on was a short [blog post][mg-layered] by Martin and [two][lwn-atomic1] [articles][lwn-atomic2] on LWN, which were extensive but focused more on the kernel side of it all and not so much on the compositor. What I finally found, was an unmerged [patch set][weston-pull] for Atomic Mode Setting in the Weston compositor by Daniel Stone and an abandoned [git repository][weston-git] with his code. It wasn't easy, but with that and Martin's help I could finish atleast the first [big part][phab-ams] until August.

After that I tried to improve the search bar in KTextEditor, whereas KTextEditor is the foundation for many important KDE apps working with plain text documents like Kate or KDevelop. Sadly the feedback I got wasn't very supportive or atleast I didn't feel very welcomed with my patches. Maybe it's my fault for always producing huge code changes, which are difficult and time consuming to review. But it's my style of work. Probably it's because I studied math, where correctness is of upmost importance, that I'm always aiming for the grand solution and don't like hacky ones. Do it one time right in a universal fashion instead of applying dozens of little fixes to singular problems of a common one is my mantra. Any way afterall I chose to abandon my patches for KTextEditor and instead concentrate on the Plasma project, where the folks seemed to be more welcoming to aspiring contributers. Maybe I'll come back to my [two][kte-batch] [patches][kte-searchbar] for KTextEditor at some point in the future.

But focusing my work on Plasma was the right call back then. After a short pause at the beginning of the semester in October, I worked on many different areas of the Plasma desktop and workspace. Of course it always started with an often interesting but sometimes frustrating phase of learning how all the relevant objects are called and how it's working as a single unit aswell as in combination with the huge Plasma stack in total. Basically I lived for that: I got up in the morning or most often at noon in order to do Plasma stuff and went back to sleep in the evening or way too often when it was already morning again. In between I tried to do some preliminary work on my master thesis, but it was maybe a permill of my time (apologies to my supervisor Carsten). So, what have I done?

* Small Lockscreen [reorganisation][lockscreen-reorg] and [usability improvements][lockscreen-usability].
* [Fixed][meta-review] the crucial [bug][meta-bug] of non-closing start menus on Meta/Windows-key.
* New Touchpad KCM on Wayland, which is still [in review][touchpadkcm-review].
* Supportive to that [lots][libinput-1] [of][libinput-2] [different][libinput-3] [stuff][libinput-4] in KWin's libinput backend.
* And I even came to [fixing][touchpadkcm-Xbug] a small annoyance of the legacy X based Touchpad KCM.
* Some ui improvements on the digital clock, which are still [in review][digitalclock-review].
* Small [change][mpris] to MPRIS data engine.
* Complete redesign of task manager tooltips, which was the brainchild of fabiverse from the VDG Telegram group and which is aswell [in review][taskmanagertooltips-review].

So quite something for a nocive like me. In general I'm pleased with what I've achieved until now and I'm very happy about the invitation to join some of the core developers next February at the Plasma sprint in Affenfels. But at first this month let's get back to Atomic Mode Setting Part II. Way more to come.

[GSOC]: https://summerofcode.withgoogle.com/archive/2016/organizations/5267579820048384/
[mg-layered]: https://blog.martin-graesslin.com/blog/2015/08/layered-compositing/
[lwn-atomic1]: https://lwn.net/Articles/653071/
[lwn-atomic2]: https://lwn.net/Articles/653466/
[weston-pull]: https://lists.freedesktop.org/archives/wayland-devel/2015-June/022848.html
[weston-git]: https://git.collabora.com/cgit/user/daniels/weston.git/?h=wip/atomic
[phab-ams]: https://phabricator.kde.org/D2370
[kte-batch]: https://git.reviewboard.kde.org/r/128850/
[kte-searchbar]: https://git.reviewboard.kde.org/r/128894/
[lockscreen-reorg]: https://phabricator.kde.org/D3034
[lockscreen-usability]: https://phabricator.kde.org/D3055
[meta-bug]: https://bugs.kde.org/show_bug.cgi?id=367685
[meta-review]: https://git.reviewboard.kde.org/r/129204/
[touchpadkcm-review]: https://phabricator.kde.org/D3617
[libinput-1]: https://phabricator.kde.org/D3430
[libinput-2]: https://phabricator.kde.org/D3460
[libinput-3]: https://phabricator.kde.org/D3479
[libinput-4]: https://phabricator.kde.org/D3590
[touchpadkcm-Xbug]: https://phabricator.kde.org/D3324
[digitalclock-review]: https://phabricator.kde.org/D3630
[mpris]: https://phabricator.kde.org/D3667
[taskmanagertooltips-review]: https://phabricator.kde.org/D3738
