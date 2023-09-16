---
title: "A New Beginning"
date: 2017-07-28 22:00:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xwayland
  - present
series: false
cover_image: ./assets/2017-07-28-a-new-beginning.jpg
canonical_url: false
description: "After receiving negative feedback in regards to my code I decided to start over. Read here to learn more."
authors: [roman-gilg]
---
What is the worst thing, that can happen to someone's work? Probably showing it to someone and he isn't impressed at all by it. Guess, what happened to me! I said in the [last post](../2017/a-small-update), that I wanted to reach out to the good people from the xorg-devel mailing list for some feedback on my work so far. I [did][xorg-devel-ml-thread], but the response wasn't [that][xorg-devel-ml-answer1] [reassuring][xorg-devel-ml-answer2].

Basically several fundamental parts of my code were questioned. OK, the problem of timings with the frame callback was easily to solve - just don't do it for now, it's not really necessary. But the problems pointed out by Michel had a more profound impact. How I should deal with the Present extension and what was requested by Michel couldn't easily be integrated in the code I had written.

But I didn't lose my motivation because of this setback and of course I'm deeply thankful for the voiced critique by Pekka and Michel, since I can only learn from their feedback and for sure better rework the code now than later. I did exactly that in the last few days. And in my opinion with great success.

I interpreted Michel's mail, such that I'm allowed to make larger changes to the Present extension code. Otherwise the rootless flipping wouldn't be possible for sure. So I [added][github-commit-rootless] a "Rootless mode" to the extension, which of course currently only is used by the Xwayland DDX, but could be used by other DDX in the future with similar functionality. It allows to flip windows individually and without the need to be full screen. This is a huge functionality boost in comparison to the normal X behavior, where a window needs to be full screen on the whole `_Screen`, and this in particular means that it won't work with a full screen window on a single display in a RandR environment.

Of course some big change like this never works directly. For example I forgot to increase the reference counter on the pixmap remembered for restoring the window and only after tedious bug search [found][github-commit-refcntfix] that this was the culprit for sporadic segfaults when exiting the full screen mode of the VLC player.

And yes, in order to be able to flip the pixmap not only in full screen mode but even inside a window with other sub-windows being composited around it, more was necessary. The solution was in the end to use a [sub-surface][wayland-subsurface] for the flipping pixmap. And I'm not sure if it will be viable in the end, but I'm damn proud that it works so far.

Sometimes there are still visual artifacts I experience on window movements. The compositor doesn't seem to get informed that the sub-surface has been moved away and still paints its content where it was before. But maybe the culprit is in this case KWin not handling the sub-surface correctly. I'll need to cross-check this problem with some other compositor like Weston.

And I plan on writing another mail this weekend to the mailing list. Let's see how this radical *new beginning* will resonate.

[xorg-devel-ml-thread]: https://lists.x.org/archives/xorg-devel/2017-July/054136.html
[xorg-devel-ml-answer1]: https://lists.x.org/archives/xorg-devel/2017-July/054137.html
[xorg-devel-ml-answer2]: https://lists.x.org/archives/xorg-devel/2017-July/054149.html
[github-commit-rootless]: https://github.com/subdiff/xserver/commit/89da1d719c740d6b918b9a6233f954f32ca3b2d9
[github-commit-refcntfix]: https://github.com/subdiff/xserver/commit/b8b0ed387399e682490a5c356e4bb4d15b81dfde#diff-3d3879ed9d00da329595af0410b0609eR874
[wayland-subsurface]: https://wayland.freedesktop.org/docs/html/apa.html#protocol-spec-wl_subsurface
