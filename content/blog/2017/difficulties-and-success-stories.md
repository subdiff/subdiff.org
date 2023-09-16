---
title: "Difficulties and Success Stories"
date: 2017-07-14 20:00:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
  - present
  - kwin

series: false
cover_image: ./assets/2017-07-14-difficulties-and-success-stories.jpg
canonical_url: false
description: "I provided in the past few weeks some general information about my project and hopefully helpful documentation for the multiple components I'm working with, but I have not yet talked about the work I'm doing on the code itself. Let's change this today."
authors: [roman-gilg]
---
I provided in the past few weeks some general information about my project and hopefully helpful documentation for the multiple components I'm working with, but I have not yet talked about the work I'm doing on the code itself. Let's change this today.

You can find my work branch on [GitHub][github-work-branch]. It's basically just a personal repository so I can sync my work between my devices, so be warned: The commits are messy as nothing is cleaned up and debug lines as well as temporary TODOs are all over the place. And to be honest up until yesterday my changes didn't accumulate to much. For some reason no picture was displayed in my two test applications, which are [Neverball][neverball] and VLC.

Then on the weekend suddenly the KWin Wayland session wouldn't even launch anymore. Well, at least this issue I was able to [fix][kwin-patch] pretty quickly. But there was still no picture, it seemed the presenting just halted after the first buffer was sent to KWin and without any further messages. Neither the Xwayland server nor the client were unresponsive though. Only today I finally could solve the problem thanks to Daniel's help. The reason for the halt was that I waited on a frame callback from KWin in order to present the next frame. But this never arrived since I hadn't set any damage in the previous frame and KWin then wouldn't signal a new frame. I [fixed][work-patch] it by adding a generic damage request for now. After that the picture was depicted and moving nicely.

This is definitively the first big milestone with this project. Until now all I achieved was increasing my own knowledge by reading documentation and poking into the code with debug lines. Ok, I also added some code I hoped would make sense, but besides the compilation there was no feedback through a working prototype to see if my code was going in the right direction or if it was utter bollocks. But after today I can say that my buffer flipping and committing code at least produces a picture. And when looking at the FPS counter in Neverball I would even say, that the buffer flipping replacing all the buffer copies already improved the frame rate.

But to test this I first had to solve another problem: The frame rate was always limited to the 60 Hz of my display. The reason was simple: I called [`present_event_notify`][present-event-notify] only on the frame callback, but in the Xwayland case we can call it directly after the buffer has been sent to the compositor. The only problem I see with this is that the Present extension [assumes][present-proto-complete-pixmap-idle], that after a new Pixmap has been flipped the old one can be instantly set ready to be used again for new rendering content. But if the last Pixmap's buffer is still used by the compositor in some way this can lead to tearing.

This hints to a fundamental issue with our approach of using the Present extension in Xwayland. The extension was written with hardware in mind. It assumes a flip happens directly on a screen. There is no intermediate link like a Wayland compositor and if a flip has happened the old buffer is not on the screen anymore. Why do we still try to leverage the Present extension support in Xwayland then? There are two important features of a Wayland compositor we want to have with Xwayland: A tear-free experience for the user and the ability to output a buffer rendered by a direct rendering client on a hardware plane without any copies in between. *Every frame is perfect* should also remain valid when using some legacy application and that we want no unnecessary copies is simply a question of performance improvements. This is especially important for many of the more demanding games out there, which won't be Wayland native in the short term and some of them maybe never. Both features need the the full Present extension support in the Xwayland DDX. Without it a direct rendering application would still use the Present extension but only with its fallback code path of copying the Pixmap's content. And for a tear-free experience we would at least need to sync these copies to the frame events sent by the Wayland compositor or better directly allow multiple buffers, otherwise we would limit our frame rate. In both cases this means again to increase the Present extension support.

I plan on writing about the Present extension in detail in the next week. So if you didn't fully understand some of the concepts I talked about in this post it could be a good idea to check back.

[github-work-branch]: https://github.com/subdiff/xserver/tree/presentInXwayland
[neverball]: http://neverball.org/screenshots.php
[kwin-patch]: https://phabricator.kde.org/D6659
[work-patch]: https://github.com/subdiff/xserver/commit/dcd7891dd045bcee3181e115aa1695184334daca#diff-c42bb41de35f76694e6925695ef25664R1003
[present-proto-complete-pixmap-idle]: https://cgit.freedesktop.org/xorg/proto/presentproto/tree/presentproto.txt#n412
[present-event-notify]: https://cgit.freedesktop.org/xorg/xserver/tree/present/present.c#n516
