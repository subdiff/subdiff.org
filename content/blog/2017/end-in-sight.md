---
title: "End In Sight"
date: 2017-08-18 23:30:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
  - present
series: false
cover_image: ./assets/2017-08-18-end-in-sight.jpg
canonical_url: false
description: "We count the last days of 2016 so it's time for a little recap..."
authors: [roman-gilg]
---
The last week of GSoC 2017 is about to begin. My project is in a pretty good state I would say: I have created a big solution for the Xwayland Present support, which is integrated firmly and not just attached to the main code path like an afterthought. But there are still some issues to sort out. Especially the correct cleanup of objects is difficult. That's only a problem with sub-surfaces though. So, if I'm not able to solve these issues in the next few days I'll just allow full window flips. This would still include all full screen windows and for example also the Steam client as it's directly rendering its full windows without usage of the compositor.

I still hope though to solve the last problems with the sub-surfaces, since this would mean that we can in all direct rendering cases on Wayland use buffer flips, which would be a huge improvement compared to native X.

In any case at first I'll send the final patch for the Present extension to the xorg-devel mailing list. This patch will add a separate mode for flips per window to the extension code. After that I'll send the patches for Xwayland, either with or without sub-surface support.

That's already all for now as a last update before the end and with still a big decision to be made. In one week I can report back on what I chose and how the final code looks like.
