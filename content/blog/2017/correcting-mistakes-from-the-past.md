---
title: "Correcting Mistakes From the Past"
date: 2017-05-20 13:00:00
published: true
tags:
  - coding
  - kde
  - kwin
  - wayland
  - drm
  - atomic mode setting
series: false
cover_image: ./assets/2017-05-20-correcting-mistakes-from-the-past-castle-bravo-blast.jpg
canonical_url: false
description: "Not only, but to a large extent I worked in the last few months on foundational improvements to KWin's DRM backend, which is a central building block of KWin's Wayland session."
authors: [roman-gilg]
---
Not only, but to a large extent I worked in the last few months on foundational improvements to KWin's DRM backend, which is a central building block of KWin's Wayland session. The idea in the beginninng was to directly expand upon my past Atomic Mode Setting (AMS) work from last year. We're talking about direct scanout of graphic buffers for fullscreen applications and later [layered compositing][mg-layered]. Indeed this was my Season of KDE project with Martin Flöser as my mentor, but in the end relative to the initial goal it was unsuccessful.

The reason for the missed goal wasn't a lack of work or enthusiasm from my side, but the realization that I need to go back and first rework the foundations, which were in some kind of disarray, mostly because of mistakes I did when I first worked on AMS last year, partly because of changes Daniel Stone made to his [work-in-progress patches][daniels-amsphab] for AMS support in Weston, which I used as an example throughout my work on AMS in KWin, and also because of some small flaws introduced to our DRM backend before I started working on it.

The result of this rework are three seperate patches depending on each other and all of them got merged last week. They will be part of the 5.10 release. The reason for doing three patches instead of only one, was to ease the review process.

The [first patch][phab-d5118] dealt with the query of important kernel display objects, which represent real hardware, the [CRTCs and Connectors][wiki-displaycontrollers]. KWin didn't remember these objects in the past, although they are static while the system is running. This meant for example that KWin requeried all of them on a hot plugging event and had no prolonged knowledge about their state after a display was disconnected again. The last point made it in particular difficult to do a proper cleanup of the associated memory after a disconnect. So changing this in a way that the kernel objects are only queried once in the beginning made sense. Also from my past work I already had created a [generic class][kwincode-drm-object] for kernel object with the necessary subclasses, which could be used in this context. But still to me this patch was the most "controversial" one of the three, which means it was the one I was most worried about being somehow "wrong", not just in details, but in general, especially since it didn't solve any observable specific misbehaviour, which it could be benchmarked against. Of course I did my research, but there is always the anxiety of overlooking something crucial. Too bad the other patches depended on it. But the patch was accepted and to my relief everything seems to work well on the current master and the beta branch for the upcoming release as well.

The [second patch][phab-d5179] restructured the DrmBuffer class. We support KWin builds with or without [Generic Buffer Manager][mesacode-gbm] (GBM). It made therefore sense to split off the GBM dependent part of DrmBuffer into a seperate file, which gets only included when GBM is available. Martin had this idea and, although the patch is still quite large because of all the moved around code and renamed classes, the change was straight forward. I still managed to introduce a build breaking regression, which was [quickly discovered][bug-379732] and easily to solve. This patch was also meant as a preperation for the future direct scanout of buffers, which will then be done by a new subclass of DrmBuffer, also depending on GBM.

The [last patch][phab-d5179] finally directly tackled all the issues I experienced when trying to use the before that rather underwhelming code path for AMS. Yes, you saw the picture on the screen, the buffer flipping worked, but basic functionality like hot plugging or display suspending were not working at all or led to unpredictable behaviour. Basically a complete rewrite later with many, many manual in and out pluggings of external monitors to test the bahaviour the problems have been solved to the point I consider the AMS code path now to be ready for daily use. For Plasma 5.11 I therefore plan to make it the new default. That means that it will be available on Intel graphics automatically from Linux kernel 4.12 onwards, when on the kernel side the Intel driver also defaults to it. If you want to test my code on Plasma 5.10 you need to set the environment variable `KWIN_DRM_AMS` and on kernels older than 4.12 you need to add the boot parameter `i915.nuclear_pageflip`. If you use Nvidia with the open source Nouveau driver, AMS should be available to you since kernel 4.10. In this case you should only need to set the environment variable above on 5.10, if you want to test it. Since I only tested AMS with Intel graphics until now, some reports back how it works with Nouveau would be great.

That's it for now. But of course there is more to come. I haven't given up on the direct scanout and at some point in the future I want to finish it. I already had a working prototype and mainly waited for my three patches to land. But for now I'll postpone further work on direct scanout and layered compositing. Instead the last weeks I worked on something special for our Wayland session in 5.11. I call it *Night Color*, and with this name you can probably guess what it will be. And did I mention, that I was accepted as a Google Summer of Code student for the X.org foundation with my project to implement multi buffered present support in XWayland? Nah, I didn't. Sorry for rhetorical asking in this smug way, but I'm just very happy and also a bit proud of having learned so much in basically only one year to the point of now being able to start work on an X.org project directly. I'll write about it in another blog post in the near future.

[mg-layered]: https://blog.martin-graesslin.com/blog/2015/08/layered-compositing/
[daniels-amsphab]: https://phabricator.freedesktop.org/T7595
[phab-d5118]: https://phabricator.kde.org/D5118
[phab-d5179]: https://phabricator.kde.org/D5179
[wiki-displaycontrollers]: https://en.wikipedia.org/wiki/Video_display_controller
[kwincode-drm-object]: https://cgit.kde.org/kwin.git/tree/plugins/platforms/drm/drm_object.h
[mesacode-gbm]: https://cgit.freedesktop.org/mesa/mesa/tree/src/gbm/main/gbm.h#n51
[bug-379732]: https://bugs.kde.org/show_bug.cgi?id=379732
