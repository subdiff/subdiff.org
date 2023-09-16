---
title: "A Small Update"
date: 2017-07-21 21:00:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
  - present
series: false
cover_image: ./assets/2017-07-21-a-small-update.jpg
canonical_url: false
description: "This is just a small update on what I am currently working on for my Google Summer of Code project. More content will come in the following weeks"
authors: [roman-gilg]
---
I planned on writing about the Present extension this week, but I'll postpone this since I'm currently strongly absorbed into finding the last rough edges of a first patch I can show off. I then hope to get some feedback on this from other developers in the [xorg-devel][xorg-devel-ml] mailing list.

Another reason is that I stalled my work on the Present extension for now and try to get first my Xwayland code working. My mentor Daniel recommended that to me since the approach I pursued in my work on Present might be more difficult than I first assessed. At least it is something similar to what other way more experienced developers than myself tried in the past and weren't able to do according to Daniel. My idea was to make Present flip per CRTC only, but this would clash with Pixmaps being linked to the whole screen only. There are no Pixmaps only for CRTCs in X.

On the other hand when accepting the restriction of only being able to flip one window at a time my code already works quite good. The flipping is smooth and at least in a short test also improved the frame rate. But the main problem I had and still to some degree have, is that stopping the flipping can fail. The reason seems to be that the Present extension sets always the Screen Pixmap on flips. But when I test my work with KWin, it drives Xwayland in rootless mode, i.e. without a Screen Pixmap and only the Window Pixmaps. I'm currently looking into how to circumvent this in Xwayland. I think it's possible, but I need to look very carefully on how to change the process in order to not forget necessary cleanups on the flipped Pixmaps. I hope though that I'm able to solve these issues already this weekend and then get some feedback on the xorg-devel mailing list.

As always you can find my latest work on my working branch on [GitHub][github-work-branch].

[xorg-devel-ml]: https://lists.x.org/mailman/listinfo/xorg-devel
[github-work-branch]: https://github.com/subdiff/xserver/tree/presentInXwayland
