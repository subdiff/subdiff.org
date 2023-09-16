---
title: "Wayland Future and Legacy"
date: 2018-09-25 12:00:00
tags:
  - dnd
  - input
  - kde
  - kwin
  - plasma
  - wayland
  - xwayland
series: false
cover_image: ./assets/2018-09-25-wayland-future-and-legacy.jpg
canonical_url: false
description: "Plasma 5.14 is right around the corner, time to write again an update like I did for 5.13 on what was achieved in terms of Wayland and what is in the work."
authors: [roman-gilg]
---
Plasma 5.14 is right around the corner, time to write again an update like I did [for 5.13](./progress-on-plasma-wayland-for-513) on what was achieved in terms of Wayland and what is in the work.

### On Blocking and Reprioritizing Work
First I directly admit on what I did teaser for 5.14 in my last update but what will not make it: generic gamma color correction per display. There are two reasons for it. The first one is that some [preliminary][phab-gamma-patch] [patches][phab-outputs-patch], which needed to be merged first, endured long review phases. The second reason is, that when these patches finally were accepted I had shifted my focus on some other topics, which I decided to give an higher priority.

Before delving into these other topics, a short analysis on why the reviews took so long: first there were of course some improvements possible to my patches, but after these got pointed out in the reviews I did fix them back then pretty quickly. The more striking reason is though that we are just short on people who can actually review KWin code changes, in particular with Martin being not maintainer anymore. That is not only a problem for my proposed code changes, but for anyone's patches to KWin. And this hasn't improved since back then. We must find a way to reduce the review pressure on the people being capable of doing reviews somehow, at best with only a minimal hit in code quality. I don't have a full solution for this problem yet, we will see if we find a good one.

After this is out of the way, let us talk about these other features, which I prioritized higher.

### Xwayland Drag and Drop Translation
Drag and drop is an important workflow on desktop platforms. In our Wayland session Xwayland clients were able to do this between each other through the X protocol provided by Xwayland. Wayland native clients were able to do it with the [Wayland interfaces][wayland-data-sharing] for data sharing, what already has been implemented in most aspects in KWin and KWayland.

But these two world were separated. Wayland native clients could not drop something on an Xwayland client and vice versa. For that to work a translation layer needed to be created. We had already some small workaround to translate the clipboard in place, but a similar small workaround would not have worked for drag and drop.

Nevertheless I have [a solution][phab-dnd-patch] now, not a small one for sure, but it is similar to how [Weston][weston-dnd] and [wlroots][wlroots-patch-dnd] try to solve the task, what will hopefully allow us to work closer together in this regard in the future. The solution also rewrites the clipboard mechanism to have it more in line with the other compositors and to be better integrated in the Xwayland handling part of KWin. All the details I omit here for now, but if there is interest I will write another article only about this subject.

In regards to the other compositors one last comment: the Weston solution seems to be only partly done and wlroots still struggles with a few remaining [issues][wlroots-patch-wip-dnd], but it was still immensely helpful to read their code to get a first understanding on what needs to be done besides [some][icccm-selections] [other][uninformativ-clipboard] [literature][johnlindal-dnd]. I hope I can repay the favor by providing now some more information to them on what I learned when I wrote my patches.

### Pointer Lock and Confining Reimagined
While Xwayland drag and drop translation took up the majority of my time in the last three months and is somewhat more important to the majority of our users, who do daily work in the browser, there is a particular subset of users, who will be very happy about a series of changes I did before that and which even already will be available in 5.14. I am talking about our support for pointer constraining, what consists of pointer locking and pointer confining, and the particular subset of users affected by that are gamers.

In the past we already supported pointer constraints, but the support lacked in numerous aspects. I won't go into detail, but anybody who tried to play some games in a Wayland session can probably tell you about problems, starting from annoyingly often displayed warning messages to never locked or never unlocked cursors. A list of issues and what I did to solve them, can be found [here][phab-task-pointer-constraints].

The end result should be that pointer constraints can be used from 5.14 on without any hiccups and without even being noticed. This should improve the quality of our Wayland session for gamers drastically and I have planned [some][pageflips-per-output-task] [more][scanout-direct-task] changes for the future to improve it even more.

### Touch Drags and Input Redirection Rework
A small missing item I noticed when working on Xwayland drag and drop was that we did not yet support Wayland native drags executed through input on a touch screen. To enable these only a few small code additions to [KWayland][touch-drag-kwayland-phab-patch] and to [KWin][touch-drag-kwin-phab-patch] were necessary.

But when working on this feature and with my experience from the Xwayland drag and drop project it became all so more apparent to me that our input redirection code for pointer and touch devices needed a serious overhaul. In general the original idea behind it was fine: input redirection detects which client, decoration or internal window (a surface being created by KWin to use on its own, for example for depicting its effects) has device input focus. There is an update function per device, which redetermines the target, and there are filters to run though to channel off events in case of compositor overruling for example by some effect. But in detail there was much code duplication going on and the update function was recalled rather randomly throughout numerous filters.

My [patch][rework-input-patch] improves the code in both aspects: the update function gets called only once per event and code duplication is reduced through more inheritance usage. Also it is now more clear when the input focus is on the decoration of a client or if the client is an internal window and what to do then. Overall the effects of this rework will not be directly visible to the user, but it will give us a stronger foundation to build upon in the future.

### Outlook
There is some more foundational work without a direct huge visible payoff necessary, in particular to how internal windows are being treated in KWin, which spawned some nasty [problems][invalid-geometry-patch] in the past and needs a more thorough investigation than quick workarounds to ease the immediate pain.

Other foundational work, but which at least has direct impact, is the reorganization of our painting pipeline for multiple outputs at different frequencies, what was mentioned above already as an improvement for gamers. Doing this will not be a small feat and we will see when there is time for it. I hope sooner than later.

What should not be forgotten when talking about this particular feature is adaptive synchronization, better known under AMD's trademark FreeSync and that we want to support this technology of course as well. But the patches to the kernel and Mesa only recently have been posted to the respective mailing lists and I have literally no idea what is necessary from our side to enable it.

This and others topics to discuss is what I am looking forward to when the [X.Org Developer's Conference 2018][xdc] starts tomorrow morning in A Coruña. I traveled a bit through Galicia in the last few days with a rental car and will arrive in the city at some point later today (by the way the picture accompanying this article is from one of the stops I made). Looking at the program and the attendees this should become a very interesting conference. If you are interested as well, you can follow the [livestream][xdc-livestreams] starting tomorrow with the regular program.

[phab-gamma-patch]: https://phabricator.kde.org/D12388
[phab-outputs-patch]: https://phabricator.kde.org/D11781
[wayland-data-sharing]: https://wayland.freedesktop.org/docs/html/ch04.html#sect-Protocol-data-sharing
[weston-dnd]: https://cgit.freedesktop.org/wayland/weston/tree/xwayland/dnd.c
[wlroots-patch-dnd]: https://github.com/swaywm/wlroots/pull/760
[wlroots-patch-wip-dnd]: https://github.com/swaywm/wlroots/pull/841
[icccm-selections]: https://tronche.com/gui/x/icccm/sec-2.html
[uninformativ-clipboard]: https://www.uninformativ.de/blog/postings/2017-04-02/0/POSTING-en.html
[johnlindal-dnd]: http://johnlindal.wixsite.com/xdnd
[phab-dnd-patch]: https://phabricator.kde.org/D15627
[phab-task-pointer-constraints]: https://phabricator.kde.org/T8923
[pageflips-per-output-task]: https://phabricator.kde.org/T5710
[scanout-direct-task]: https://phabricator.kde.org/T4426
[touch-drag-kwayland-phab-patch]: https://phabricator.kde.org/D15464
[touch-drag-kwin-phab-patch]: https://phabricator.kde.org/D15466
[rework-input-patch]: https://phabricator.kde.org/D15595
[invalid-geometry-patch]: https://phabricator.kde.org/D13084
[xdc]: https://xdc2018.x.org/
[xdc-livestreams]: https://twitter.com/xdc2018/status/1044160556318494721
