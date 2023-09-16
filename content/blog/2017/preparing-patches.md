---
title: "Preparing Patches"
date: 2017-08-25 23:30:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
series: false
cover_image: ./assets/2017-08-25-preparing-patches.jpg
canonical_url: false
description: "In this last week of my GSoC project I aimed at bringing my code into its final form. The goals for that are simple."
authors: [roman-gilg]
---
In this last week of my GSoC project I aimed at bringing my code into its final form. The goals for that are simple:

* Test the code, fix bugs and protocol any remaining issues.
* Remove any coding style misdemeanors.
* Since in the end my changes to the Xwayland as well as the Present code became pretty extensive, portion them into multiple patches so they are easier to review.

Regarding the remaining issues in my test scenarios there are still some problems with some of my test applications. As long as the underlying problem isn't identified the question here is always though, if my code is the problem or the application is not working correctly. For example with KWin's Wayland session there is a segmentation fault at the end of its run time whenever at some point during run time an Xwayland based client did a flip on a sub-surface. But according to GDB the segmentation fault is caused by KWin's own [egl context destruction][kwin-code1] and happens somewhere in the depths of the EGL DRI2 [implementation][mesa-code1] in MESA.

I tried to find the reasons for some difficile issues like this one in the last few weeks, but at some point for a few of them I had to admit that either the tools I'm using aren't capable enough to hint me in the right direction or I'm simply not knowledgeable enough to know where to look at. I hope that after I have sent in the patches in the next few days I get some helpful advice from senior developers who know the code better than I do and I can then solve the remaining problems.

The patches I will send to the mailing list in the next days are dependent on each other. As an overview here is how I planned them:

1. Introduces an internal API to the Xserver's Present implementation. The goal of this API is to make it easy to add other flipping modes than just full screen flips. While the previous code for full screen flips needs to be adapted to this API this patch doesn't yet alter any functionality.
2. Distribute more code onto several new files to improve readability.
3. Add a window flipping mode to Present using the new internal API.
4. Let Xwayland use the window flipping mode.

This partitioning will hopefully help the reviewers. The other advantage is that mistakes I may have made in one of these patches and have been overlooked in the review process might be easier to get found afterwards. Splitting my code changes up into smaller units also gives me the opportunity to look into the structure of my code from a different perspective one more time and fix details I may have overlooked until now.

I hope being able to send the patches in tomorrow. I'm not sure if I'm supposed to write one more post next week after the GSoC project has officially ended. But in any case I plan on writing one more post at some point in the future about the reaction to my patches and if and how they got merged in the end.

[kwin-code1]: https://cgit.kde.org/kwin.git/tree/abstract_egl_backend.cpp#n75
[mesa-code1]: https://cgit.freedesktop.org/mesa/mesa/tree/src/egl/drivers/dri2/egl_dri2.c#n2583
