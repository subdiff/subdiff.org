---
title: "The GSoC Idea"
date: 2017-07-07 16:00:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
  - layered compositing
series: false
cover_image: ./assets/2017-07-07-the-gsoc-idea.jpg
canonical_url: false
description: "Let's explore the basic idea for my Google Summer of Code project for X.Org. This means talking about how Xwayland currently handles the graphic buffers of its applications, why this leads to tearing and how we plan to change that."
authors: [roman-gilg]
---
After the [two](../2017/understanding-xwayland-part-1-of-2)-[part](../2017/understanding-xwayland-part-2-of-2) series on the fundamentals of Xwayland, I want to briefly introduce the basic idea for my Google Summer of Code (GSoC) project for X.Org. This means I'll talk about how Xwayland currently handles the graphic buffers of its applications, why this leads to tearing and how we plan to change that.

The project has its origin in my work on KWin. In fact there is some connection to my unsuccessful GSoC application from last year on atomic mode setting and layered compositing in KWin. You can read up on these notions and the previous application in some of my older posts, but the relevant part of it to this year's project is in short the transfer of application graphic buffers directly onto the screen without the Wayland server compositing them into a global scene before that. This can be done by putting the buffers on some overlay planes and let the hardware do the compositing of these planes into a background provided by the compositor or in the simpler case by putting a single buffer of a full screen application directly onto the primary plane.

At the beginning of the year I was working on enabling this simpler case in KWin. In a first working prototype I was pretty sure I got the basic implementation right, but my test, a full screen video in VLC, showed massive [tearing][wiki-tearing]. Of course I suspected at first my own code to be the problem, but in this case it wasn't. Only after I wrote a second test application, which was a simple QML application playing the same video in full screen and showing no tearing, I had the suspicion that the problem wasn't my code but Xwayland, since VLC was running on Xwayland while my test application was Wayland native.

Indeed the Wayland protocol should prevent tearing overall, as long as the client respects the compositor's messages. It works like this: After committing a newly drawn buffer to the server, the client is not allowed to touch it anymore and only after the compositor has sent the [release][wl-buffer-release] event, the client is again allowed to repaint or delete it. If the client needs to repaint in the meantime it is supposed to allocate a different buffer object. But this is exactly, what Xwayland based applications are not doing, as Daniel Stone was quick to tell me after I asked for help from him for the tearing issues I experienced.

Under Xwayland an app only ever uses one buffer at all and repaints are always done into this one buffer. This means that the buffer is given to the compositor at some point but the application doesn't stop repainting into it. So in my case the buffer content changed, although at the same time it was presented to the user on the primary plane. The consequence is tearing. Other developers noticed that as well the same time around as documented in this [bug report][bug-report].

The proposed solution is to bolster the Present extension support in Xwayland. In theory with that extension an X based application should be able to paint into more than one Pixmap, which then translate to different Wayland buffers. On the other side Xwayland notifies the app through the Present extension when it can reuse one of its Pixmaps based on the associated Wayland buffer event. The Present extension is a relatively new extension to the Xserver, but is already supported by most of the more interesting applications. It was written by Keith Packard, and you can read more about it on his [blog][keith-present]. In theory it should only be necessary to add support for the extension to the Xwayland DDX. But there are some issues in the DIX side of the extension code, which first need to be ironed out. I plan on writing more about the Present extension in general and the limitations we encounter in our Xwayland use case in the next articles.

[wiki-tearing]: https://en.wikipedia.org/wiki/Screen_tearing
[wl-buffer-release]: https://wayland.freedesktop.org/docs/html/apa.html#protocol-spec-wl_buffer-event-release
[bug-report]: https://bugs.freedesktop.org/show_bug.cgi?id=99702
[keith-present]: https://keithp.com/blogs/Present/
