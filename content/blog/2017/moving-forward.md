---
title: "Moving Forward"
date: 2017-08-04 21:00:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
  - present
series: false
cover_image: ./assets/2017-08-04-moving-forward.jpg
canonical_url: false
description: "I reworked this week huge parts of my code and I have a feeling that I'm on the right track. I wrote a second mail to the xorg-devel mailing list and the feedback I got back was also way more positive than on the first try."
authors: [roman-gilg]
---
I reworked this week huge parts of my code and I have a feeling that I'm on the right track. I wrote a second [mail][xorg-devel-ml-thread2] to the xorg-devel mailing list and the feedback I got back was also way more positive than on the first [try](../2017/a-new-beginning). Thanks again to Michel Dänzer for taking the time for this.

In the mail I described my current approach in detail. Basically I created a second code path in the Present DIX for DDX with the possibility to flip windows individually, like Xwayland is capable of doing it. In this code path I also changed the Present extension so that it will only ever signal the client that a certain used pixmap is able to be reused when the DDX has also given it free. In the Xwayland case it does this of course when the Wayland buffer associated with the pixmap has been released by the Wayland server.

What's still somewhat fragile, but one of my personal darlings is flipping the pixmaps of child windows inside another window geometry. I had the idea to use Wayland sub-surfaces for that and at least on KWin it worked quite nicely. I like it, because it reaches deeply into the X rendering pipeline being a combination of very different internal objects of X and Wayland, which fit together in an amazingly smooth way.

As said though the sub-surface part is still somewhat fragile. I often had problems with dangling pointers because of all the different objects in play, in particular with the RRCrtcs provided by the DDX. Of course you can always go back and guard the code against it when you've encountered such a situation while testing. But the risk of missing edge cases is high.

For example everything seemed to work flawlessly at some point a few days ago with my two main test applications VLC and Neverball, but when I tried the Steam desktop client I got segfaults all the time when opening or closing the small drop down menus in the upper half of the window. I came to the conclusion, that this happened because the drop down menus as windows were reparented in between, the old parent was destroyed and by that the child window suddenly had a dangling pointer to the RRCrtc of its former parent. And yeah, I fixed this problem with some guards, but there might be more of these issues I just haven't yet encountered, right?

What I'm considering instead right now in order to improve the situation in a more general sense is making the CRTCs and windows structs independent. Currently we make an implicit assumption that one window corresponds over its lifetime to exactly one RRCrtc. In Xwayland I created just one fake CRTC per window for that. Conceptually this makes sense, because we want to flip the windows individually and don't only flip display front buffers as represented by their CRTCs, but the crux is that Present might try to access a CRTC object after the window has been deleted long ago. Making the objects independent again, we could directly test in Xwayland if a RRCrtc is still available as an `xwl_output` in the output list of the `xwl_screen` struct, just the way like it's normally done.

Making CRTCs and windows independent would also bring back the Present code paths to being more similar again from a structural point of view, but it still might mean that the two code paths need to be dissociated more strongly. I'll see this weekend how it works out and will report on my findings in the article next week.

[xorg-devel-ml-thread2]: https://lists.x.org/archives/xorg-devel/2017-August/054232.html
