---
title: "In the Second Year of KWinFT"
date: 2021-06-13 12:00:00
tags:
- kwinft
series: false
cover_image: ./assets/2021-06-13-in-the-second-year-of-kwinft.jpg
canonical_url: false
description: "The KWinFT project is now in its second year. With version 5.22 just released let's take a look back at the first year and a look forward at what this second year promises."
authors: [roman-gilg]
---
One year of KWinFT meant a lot of change and a lot to learn.
While there were many uncertainties in the beginning,
now in its second year KWinFT's future is more clear than ever before.
Let's take a look back at the beginnings,
what you can expect with the recent release
and a short teaser at what lies ahead.

## Heated Beginnings
The project was officially launched on 15 April 2020
by [a post on this blog](/blog/2020/the-kwinft-project).
As you can read back in this announcement my motives were mostly centered around
the ability to move quicker with less compromise for other stakeholders,
improving the development process itself
and being more open in reaching out to other projects and communities than KWin traditionally has been.

This gained some attention and people tried KWinFT out,
which has been available on Manjaro from the very beginning
and also quickly afterwards in the Arch User Repository.
It is awesome that many of these people are still around today
testing new versions and giving feedback.

The first few months after KWinFT went public I concentrated mostly on
a [fundamental rewrite](/blog/2020/wrapland-redone#wrapland-server-library-redesign)
of Wrapland's server library
which was a great success in regards to stability and long-term maintainability.

But not everything worked out that smoothly.
KWinFT as a Wayland compositor required some additional integration with the workspace,
here with KScreen, the display configuration tool of Plasma.
I wrote the necessary backend code for KScreen myself
but merging the code was blocked by other Plasma developers.
Mind you that this was for a component of Plasma
I had maintained myself for over a year at this point in time.
Because the integration code was necessary for KWinFT to work correctly
I had to create forks of KScreen and its helper library libkscreen.
This was done in the form of
[Disman and KDisplay](/blog/2020/wrapland-redone#new-in-kwinft-disman-and-kdisplay).

On the one hand this was a sad episode as it further decoupled the KWinFT project
from the KDE Plasma development.
On the other hand it allowed me to
[radically reconceptualize](/blog/2020/universal-means-to-specific-ends#universal-display-management-with-disman)
Disman to become an autonomous, desktop-agnostic library and service.
You can [use Disman](https://gitlab.com/kwinft/disman#usage)
now on any desktop on X11
and with wlroots-based compositors, KWinFT and KWin alike on Wayland.
In regards to stability and features it has become much more superior to KScreen.

## Dark Winter Months
While in the first few months a lot was moving forward very quickly,
also thanks to considerable contributions by
[more](https://gitlab.com/kwinft/wrapland/-/merge_requests/53)
people
[than](https://gitlab.com/kwinft/wrapland/-/merge_requests/76)
me,
I realized around autumn last year that I would need to pause the forward momentum for a bit
to rework central parts of KWinFT.

The windowing logic of KWinFT, which I emphatically call its *heart*, was in a bad state.
It had been rotting over many years before that.
And the difficult task to make KWin a Wayland compositor had not improved the code quality either.

I decided to go the extra mile and refactor the windowing logic from the ground up.
It was a lengthy and tedious process that I started with in September last year
and came to a preliminary conclusion with a final merge request back to master in February this year.

But it was [worth it](/blog/2021/the-windowing-revolution).
And I'm also happy that other people since then have picked up this major project and contributed to
[further](https://gitlab.com/kwinft/kwinft/-/merge_requests/87)
[improvements](https://gitlab.com/kwinft/kwinft/-/merge_requests/97).

One downside though is that in the time I refactored the windowing logic
I was not able to work on features that were still missing from the Wayland session.
In direct comparison the Wayland session of KWin has gained some of these missing features in the last year,
like direct scanout of application buffers or now somewhat stable screen capture.
Of course step-by-step I want to offer such features in KWinFT too
and I am also convinced that my more fundamental approach to refactoring the rotten KWin code base
will have greater success long-term,
especially in the quest for stability from an end user's perspective.
But it is still an honest stance
to point out the current feature gap for the Wayland session
due to the stronger focus of KWinFT on foundational improvements.

## Consolidation
After the large refactor of KWinFT's windowing logic in the 5.21 release
I decided to temporarily decelerate the development speed for the next release.
For one I needed a bit of recovery,
mentally and physically,
but I also wanted to take on another large project next which required thoughtful consideration beforehand.

For these reasons the recent 5.22 release mostly contains consolidation changes to
[stabilize](https://gitlab.com/kwinft/disman/-/merge_requests/28)
[the](https://gitlab.com/kwinft/kwinft/-/merge_requests/81)
[current](https://gitlab.com/kwinft/kwinft/-/merge_requests/88)
[code](https://gitlab.com/kwinft/kwinft/-/merge_requests/96).
One great feature for our Wayland session made it into this release though:
KWinFT now drives every display by its individual refresh rate.
For example you can connect one 60 Hz and one 144 Hz display
and a vsynced game will run at 144 Hz on the faster display and
at 60 Hz on the slower one.
Thanks to Wayland this will be achieved without any tearing
and with accurate presentation feedback through the
[presentation time](https://gitlab.freedesktop.org/wayland/wayland-protocols/tree/master/stable/presentation-time)
protocol, something that for example mpv
[makes use of](https://github.com/mpv-player/mpv/wiki/FAQ#should-i-use-x11-or-wayland).
The [patch set](https://gitlab.com/kwinft/kwinft/-/merge_requests/84)
to add this feature did also carry out some necessary refactors for more radical changes very soon.

Internally I
[unified the CI tooling](https://gitlab.com/kwinft/tooling/-/merge_requests/5)
for all KWinFT projects.
That simplifies its maintenance and added useful features like coverage reporting.
It was interesting to exchange information with Pekka Paalanen about the topic,
who was at the same time improving the coverage reporting
[for Weston](https://gitlab.freedesktop.org/wayland/weston/-/merge_requests/307).

## Peek of Tomorrow
If you read carefully you will have noticed me hinting at some "radical changes very soon".
These changes are in my opinion absolutely exciting
for KWinFT, the Plasma desktop and the Linux graphics landscape in general.

[These changes](https://gitlab.com/kwinft/kwinft/-/issues/137)
are not yet merged to master,
but they are already fully functional and you find them on a
[separate feature branch](https://gitlab.com/kwinft/kwinft/-/commits/wlroots-backend/).
For the final merge back to master I am only waiting anymore on the
[next release](https://github.com/swaywm/wlroots/issues/2844)
of our new dependency.

Stay tuned for more information about these exciting changes in a future article on this blog.
