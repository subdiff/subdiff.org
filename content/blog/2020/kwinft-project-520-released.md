---
title: "KWinFT Project 5.20 Released"
date: 2020-10-15 15:00:00
tags:
 - kwinft
 - disman
 - kdisplay
series: false
cover_image: ./assets/2020-10-15-kwinft-project-520-released.jpg
canonical_url: false
description: "New versions of the KWinFT projects are available now. Aligned with the release of Plasma 5.20 they offer new features and stability improvements."
authors: [roman-gilg]
---
New versions of the KWinFT projects Wrapland, Disman, KWinFT and KDisplay are available now.
They were on the day aligned with the release of [Plasma 5.20][plasma-520-release] this week
and offer new features and stability improvements.

## Universal Display Management

The highlight this time is a completely redefined and reworked [Disman][disman]
that allows to control display configurations
not only in a KDE Plasma session with KWinFT
but also with KWin
and in other Wayland sessions with wlroots-based compositors
as well as any X11 session.

You can use it with the included command-line tool dismanctl
or together with the graphical frontend [KDisplay][kdisplay].
Read more about Disman's goals and technical details
in the 5.20 beta [announcement](/blog/2020/universal-means-to-specific-ends).

## KWinFT Projects You Should Use
Let's cut directly to the chase!
As Disman and KDisplay are replacements for libkscreen and KScreen
and KWinFT for KWin you will be interested in a comparison
from a user point of view.
What is better and what should you personally choose?

### Disman and KDisplay for KDE Plasma
If you run a KDE Plasma desktop at the moment,
you should definitely consider
to use Disman
and replace KScreen with KDisplay.

Disman comes with a more reliable overall design
moving internal logic to its D-Bus service
and away from the frontends in KDisplay.
Changes by that become more atomic
and bugs are less likely to emerge.

The UI of KDisplay is improved in comparison to KScreen
and comfort functions have been added,
as for example automatic selection of the best available mode.

There are still some caveats to this release
that might prompt you to wait for the next one though:
* Albeit in the beta phase multiple bugs were discovered
  and [could be fixed][disman-beta-fixes]
  5.20 is still the first release after a large redesign,
  so it is not unlikely more bugs will be discovered later on.
* If you want to use Disman and KDisplay in a legacy KWin Wayland session
  note that Disman was only tested with KWinFT and sway by me personally.
  Maybe other people already use it with legacy KWin in a Wayland session
  but the backend, that is loaded in this case,
  could very well have seen no QA at all yet.
  That being said if you run a KWin X11 session,
  you will experience no such problems
  since in this case the backend is the same as with KWinFT
  or any other X11 window manager.
* If you require the KDisplay UI in another language
  then this release is not yet for you.
  An [online translation system][weblate-kwinft] has been setup now
  but the first localization will only become available with release 5.21.

So your mileage may vary
but in most cases you should have a better experience
with Disman and KDisplay.

And if you in general like to support new projects
with ambitious goals
and make use of most modern technologies
you should definitely give it a try.

### Disman and KDisplay with wlroots
Disman includes a backend for [wlroots-backed compositors][wlroots-projects].
I'm proud of this achievement since I believe we need more
projects for the Linux desktop
which do not only try to solve issues in their own little habitat and project monoculture
but which aim at improving the Linux desktop in a more holistic and collaborative spirit.

I tested the backend myself and even provided
[some][wlroots-patch-1] [patches][wlroots-patch-2] to wlroots directly
to improve its output-management capabilities,
so using Disman with wlroots should be a decent experience.
One catch though is that for those patches above a new wlroots version must be released.
For now you can only get them by compiling wlroots from master
or having your distribution of choice backport them.

In comparison with other options to manage your displays in wlroots
I believe Disman provides the most user-friendly solution
taking off lots of work from your shoulders
by automatically optimizing unknown new display setups
and reloading data for already known setups.

Another prominent alternative for display management on wlroots is [kanshi][kanshi].
I don't think kanshi is as easy to use and autonomously optimizing as Disman
but you might be able to configure displays more precisly with it.
So you could prefer kanshi or Disman depending on your needs.

You can use Disman in wlroots sessions as a standalone system
with its included command-line tool dismanctl
and without KDisplay.
This way you do not need to pull in as many KDE dependencies.
But KDisplay together with Disman and wlroots also works very well
and provides you an easy-to-use UI
for adapting the display configuration according to your needs.

### Disman and KDisplay on X11
You will like it.
Try it out is all I can say.
The RandR backend is tested thoroughly
and while there is still room for some refactoring
it should work very well already.
This is also independent of what desktop environment
or window manager you use.
Install it and see for yourself.

That being said the following issues are known at the moment:
* Only a global scale can be selected for all displays.
  Disman can not yet set different scales for different displays.
  This might become possible in the future
  but has certain drawbacks on its own.
* The global scale in X11 is set by KDisplay alone.
  So you must install Disman with KDisplay
  in case you want to change the global
  scale without writing to the respective X11 config files manually.
* At the time of writing
  there is [a bug][disman-bug] with Nvidia cards
  that leads to reduced refresh rates.
  But I expect this bug to be fixed very soon.

### KWinFT vs KWin
I was talking a lot about Disman
since it contains the most interesting changes this release
and it can now be useful to many more people than before.

But you might also be interested in replacing KWin with KWinFT,
so let's take a look at how KWinFT
at this point in time compares to legacy KWin.

As it stands KWinFT is still a drop-in-replacement for it.
You can install it to your system replacing KWin
and use it together with a KDE Plasma session.

#### X11
If you usually run an X11 session
you should choose KWinFT without hesitation.
It provides the same features as KWin
and comes with an improved compositing pipeline
that lowers latency and increases smoothness.
There are also [patches in the work][multi-compositing-patches]
to improve upon this further for multi-display setups.
These patches might come to the 5.20 release via a bug fix release.

One point to keep in mind though is
that the KWinFT project will concentrate in the future on improving the experience with Wayland.
We won't maliciously regress the X11 experience
but if there is a tradeoff between improving the Wayland session
and regressing X11, KWinFT will opt for the former.
But if such a situation unfolds at some point in time has yet to be seen.
The X11 session might as well continue to work
without any regressions for the next decade.

#### Wayland
The situation is different if you want to run KWinFT as a Wayland compositor.
I believe in regards to stability and robustness KWinFT is superior.

In particular this holds true for multi-display setups
and display management.
Although I worked mostly on Disman in the last two months
that work naturally spilled over to KWinFT too.
KWinFT's output objects are now much more [reasonably][output-patch-1] [implemented][output-patch-2].
Besides that there were many more bug fixes to outputs handling
what you can convince yourself of
by looking at the merged changes for 5.20 in [KWinFT][kwinft-520-patches]
and [Wrapland][wrapland-520-patches].

If you have issues with your outputs in KWin definitely try out KWinFT,
of course together with Disman.

Another area where you probably will have a better experience
is the composition itself.
As on X11 the pipeline was reworked.
For multi-display setups the patch,
that was linked above
and might come in a bug fix release to 5.20,
should improve the situation further.

On the other side KWin's Wayland session gained some much awaited features with 5.20.
According to the changelog screencasting is now possible,
as is middle-click pasting and integration with Klipper,
that is the clipboard management utility in the system tray.

I say "in theory" because I have not tested it myself
and I expect it to not work without issues.
That is for one
because big feature additions like these
regularly require later adjustments due to unforeseen behavior changes
but also because on a principal and strategic level I disagree
with the KWin developers' general approach here.

The KWin codebase is rotten and needs a rigorous overhaul.
Putting more features on top of
that, which often require massive internal changes
just for the sake of crossing an item from a checklist
might make sense from the viewpoint of KDE users and KDE's marketing staff,
but from a long-term engineering vision
will only litter the code more
and lead to more and more breakage over time.
Most users won't notice that immediately
but when they do it is already too late.

On how to do that better
I really have to compliment the developers of Gnome's Mutter and wlroots.

Especially Mutter's Wayland session was in a bad state
with some fundamental problems due to its history just few years ago.
But they committed to a very forward-thinking stance,
ignoring the initial bad reception
and not being tempted by immediate quick fixes
that long-term would not hold up to the necessary standards.
And nowadays Gnome Mutter's Wayland session is in way better shape.
I want to highlight their [transactional KMS project][mutter-kms].
This is a massive overhaul that is completely transparent to the common user,
but enables the Mutter developers
to build on a solid base in many ways in the future.

Still as said I have not tried KWin 5.20 myself
and if the new features are important to you,
give it a try and check for yourself
if your experience confirms my concerns
or if you are happy with what was added.
Switching from KWin to KWinFT or the other way around
is easy after all.

## How to Get the KWinFT Projects
If you self-compile KWinFT it is very easy to switch from KWin to KWinFT.
Just compile KWinFT to your system prefix.
If you want more comfort through distribution packages
you have to choose your distribution carefully.

Currently only [Manjaro][manjaro] provides KWinFT packages officially.
You can install all KWinFT projects on Manjaro easily through the packages
with the same names.

Manjaro also offers git-variants of these packages
allowing you to run KWinFT projects directly from master branch.
This way you can participate in its development directly
or give feedback to latest changes.

If you run [Arch Linux][arch-linux]
you can install all KWinFT projects from the AUR.
The release packages are not yet updated to 5.20
but I assume this happens pretty soon.
They have a bit weird naming scheme:
there are *kwinft*, *wrapland-kwinft*, *disman-kwinft* and *kdisplay-kwinft*.
Of these packages git-variants are available too
but they follow the better naming scheme without a kwinft suffix.
So for example the git package for *disman-kwinft* is just called *disman-git*.
Naming nitpicks aside huge thanks to the maintainers of these packages:
abelian424 and Christoph (haagch).

A special place in my heart was conquered not long ago by Fedora.
I switched over to it from KDE Neon
due to problems on the latest update and the often outdated packages
and I am amazed by Fedora's technical versed
and overall professional vision.

To install KWinFT projects on Fedora
with its exceptional package manager DNF
you can make use of [this copr repository][copr-zawertun]
that includes their release versions.
The packages are already updated to 5.20.
Thanks to zawertun for providing these packages!

Fedora's [KDE SIG][kde-sig] group
also took interest in the KWinFT projects
and setup [a preliminary copr][copr-kdesig] for them.
One of their packagers contacted me after the Beta release
and I hope that I can help them to get it fully setup soon.
I think Fedora's philosophy
of pushing the Linux ecosystem
by providing most recent packages and betting on emerging technologies
will harmonize very well with the goals of the KWinFT project.

[arch-linux]: https://www.archlinux.org/
[copr-zawertun]: https://copr.fedorainfracloud.org/coprs/zawertun/kde/packages/
[copr-kdesig]: https://copr.fedorainfracloud.org/coprs/g/kdesig/kwinft/
[disman]: https://gitlab.com/kwinft/disman
[disman-beta-fixes]: https://gitlab.com/kwinft/disman/compare/disman@0.520.0-beta.0...disman@0.520.0
[disman-bug]: https://gitlab.com/kwinft/disman/-/issues/33
[gitter-kwinft]: https://gitter.im/kwinft/community
[kanshi]: https://github.com/emersion/kanshi
[kde-sig]: https://fedoraproject.org/wiki/SIGs/KDE
[kdisplay]: https://gitlab.com/kwinft/kdisplay
[kwinft]: https://gitlab.com/kwinft/kwinft
[kwinft-520-patches]: https://gitlab.com/kwinft/kwinft/-/merge_requests?scope=all&utf8=%E2%9C%93&state=merged&milestone_title=5.20
[manjaro]: https://manjaro.org
[multi-compositing-patches]: https://gitlab.com/kwinft/kwinft/-/merge_requests/47
[mutter-kms]: https://gitlab.gnome.org/GNOME/mutter/-/issues/548
[output-patch-1]: https://gitlab.com/kwinft/wrapland/-/merge_requests/72
[output-patch-2]: https://gitlab.com/kwinft/wrapland/-/merge_requests/75
[plasma-520-release]: https://kde.org/announcements/plasma-5.20.0
[weblate-kwinft]: https://hosted.weblate.org/engage/kwinft
[wlroots-patch-1]: https://github.com/swaywm/wlroots/pull/2392
[wlroots-patch-2]: https://github.com/swaywm/wlroots/pull/2411
[wlroots-projects]: https://github.com/swaywm/wlroots/wiki/Projects-which-use-wlroots
[wrapland-520-patches]: https://gitlab.com/kwinft/wrapland/-/merge_requests?scope=all&utf8=%E2%9C%93&state=merged&milestone_title=5.20
