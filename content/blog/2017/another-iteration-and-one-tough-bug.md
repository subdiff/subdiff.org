---
title: "Another Iteration and One Tough Bug"
date: 2017-08-11 23:30:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
  - present
  - kwin
series: false
cover_image: ./assets/2017-08-11-another-iteration-and-one-tough-bug.jpg
canonical_url: false
description: "One more time I decided to start from the beginning and try another even more radical approach to my Xwayland GSoC project than the last time. I have now basically written a full API inside the Present extension, with which modes of presentation can be added."
authors: [roman-gilg]
---
One more time I decided to start from the beginning and try another even more radical approach to my Xwayland GSoC project than the last time. I have now basically written a full API inside the Present extension, with which modes of presentation can be added. There are of course only two modes right now: The default screen presenting mode as how it worked until now and the new one for Xwayland to present on individual windows and without the need of them being full screen. While this was also possible with the version from last week, the code is now substantially better structured.

I'm currently still in a phase of testing so I won't write much more about it for now. Instead I want to talk about one very persistent bug, which popped up seemingly from one day to the other in my KWin session and hindered my work immensely.

This is also a tale of how difficult it can be to find the exact reason for a bug. Especially when there is not much information to work with: As said the problem came out of nowhere. I had used Neverball to test my Xwayland code in the past all the time. But starting a few days ago whenever I selected a level and the camera was to pan down to the level the whole KWin session blocked and I could only hard reboot the whole computer or SIGKILL the KWin process via SSH. The image of the level was frozen and keyboard inputs didn't work anymore. That said I still heard the Neverball music playing in the background, so the application wasn't the problem. And Xwayland or KWin didn't quit with a segfault, they just stopped doing stuff.

So I began the search. Of course I first suspected my own code to be the problem. But when I tried the Xwayland master branch I experienced the same problem. But please, what was that? Why suddenly didn't Neverball work at all anymore? I had used it in the past all the time, but now everything blocks? So I tried first to roll back commits in the master branches of Xwayland, KWin, KWayland in the last few weeks, thinking that the problem must have been introduced at that point in time because I could still use Neverball just recently without problems, right?

But the problem was still there. So I went further back. It worked with my distribution's Xwayland and when manually testing through the input related commits to Xwayland starting from somewhere at the beginning of the year I finally found the responsible [commit][xwayland-commit1], or so I thought. But yeah, before that commit no blocking, with it blocking, so there has to be an error with this particular commit, right? But on the other side why could I use Neverball just one week ago without blocking and this commit is several months old?

Nevertheless I studied the Xwayland input code thoroughly. The documentation for this stuff is non-existent and the function patterns confusing, but with time I understood it well enough to decide that this couldn't be the cause of the problem. Another indicator for that was, that Weston worked. The problem had to be in KWin or KWayland somewhere. After lots of time I also finally understood somewhat why I still could use Neverball a few days ago but now not at all anymore: I always started KWin from the terminal before that without launching a full Wayland Plasma session. But after here everything worked fine I switched to testing it in the Plasma session and apparently missed that from now on the problem existed. So was it Plasma itself? But this wasn't really possible, since Plasma is a different process.

I didn't want to give up and so I looked through the KWayland and KWin code related to pointer locking and confinement, which is a lot. Hours later I finally found the root cause: KWin creates small on screen notifications when a pointer is locked or confined to a window. Most of the time this works without problem, but with the above patch to Xwayland the client sends in quick succession the pointer confine and lock requests to KWin and for some reason when trying to show [both][kwin-notification1] [notifications][kwin-notification2] at the same time KWin or maybe the QML engine for the notification can't process any further. Without the patch Xwayland always only sent the confinement request and nothing blocked. I don't know how Martin would like to have this issue solved so I created a [bug report][kwin-bugreport] for now. It's weird that it was such a petty cause in the end with such huge consequences, but that's how it goes.

[xwayland-commit1]: https://cgit.freedesktop.org/xorg/xserver/commit/hw/xwayland?id=ca17f3e9fd3b59fdc5ffd0e5d78e4db6ddc87aa1
[kwin-notification1]: https://cgit.kde.org/kwin.git/tree/pointer_input.cpp?id=be89c16b3884cbf96049d7c2749b90211af482ea#n623
[kwin-notification2]: https://cgit.kde.org/kwin.git/tree/pointer_input.cpp?id=be89c16b3884cbf96049d7c2749b90211af482ea#n640
[kwin-bugreport]: https://bugs.kde.org/show_bug.cgi?id=383410
