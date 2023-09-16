---
title: "The Windowing Revolution"
date: 2021-02-08 20:00:00
tags:
- kwinft
- windowing
series: false
cover_image: ./assets/2021-02-08-the-windowing-revolution.jpg
canonical_url: false
description: "The new version of KWinFT contains a monumental rewrite of its windowing logic. Read on for an overview of the changes and why this rewrite was necessary."
authors: [roman-gilg]
---
The beta for the upcoming 5.21 release of the [KWinFT projects][kwinft] is now available.
It contains a monumental rewrite of KWinFT's windowing logic.
Read on for an overview of the changes and why this rewrite was necessary.

## A Confused Heart
Let's define first what *windowing logic* is.
In my definition this means all structures and algorithms in code
to decide where a window should be stacked, placed, moved
or in which other ways its geometry can be manipulated
to allow the user to interact with and organize the totality of all windows.

And if you agree to such windowing logic
being of central importance for a windowing manager
and what distinguishes it in the end from others,
we may call it the *heart* of KWinFT.

The KWinFT compositor is based on [KWin][kwin],
KDE's official compositor for the Plasma Workspace.
KWin was founded over two decades ago.
Necessarily some of its code is very old,
does not adhere to any modern development principles
and sometimes,
due to changes in other levels of the graphics stack,
it is just plain wrong.

It is kind of unexpected though,
that this has been in particular the case for the windowing logic,
the heart of KWinFT.
For example at the HEAD of KWin's current master branch
[do a git-blame][layers-blame]
over the ludicrous code in `layers.cpp`
responsible for all window stacking
and count how many lines are older than a decade.

But old code is not necessarily bad.
The reason why this old code is bad, is two-fold:
for one under the leadership of the former maintainer
the Wayland support was shoehorned into an already complex code base
and secondly he followed a strategy
to keep the old code untouched as much as possible.
Instead of doing necessary incremental refactors to the old code,
he tried to firewall it with an abundance of tests.

For sure one can find reasons and excuses to pick such a strategy,
but ultimately one has to say it failed.
This can not be judged of course from the outside,
but I feel comfortable in making this assessment
as someone who knows the code in detail
and because I am not the only one who abandoned his strategy.

## Who Does the Work Is Not Always Right
In fact I am not the first one to refactor the old windowing logic.
The current de facto maintainer of KWin, [Vlad Zahorodnii][blog-vladz],
has done so in the past.

The result of his work were often massive merge requests
and back then,
when I was still contributing directly to KWin,
I had a feeling this was going into the wrong direction.
But I was also working on other upstream projects
and was in no position to tell someone,
who worked exclusively on KWin,
that his work should not go in as is.

This is actually enforced through an unwritten rule in KDE,
which prescribes that "the one who does the work, decides".
This sounds good when heard first,
but the one who does the work is not always right
and in the case of KWin,
Vlad's refactors made the old code even more complicated,
more fragile and less coherent.

## Simple is Difficult
The problem with Vlad's work on KWin is
that he likes to create solutions through the addition of new things.
He [still does][kwin-mr-items].

I call that the "easy way" to solve a problem in an existing code base:
You add new code, which you write against the problem you want to solve.
You ensure the new code does not break any of the old unit tests.
For compliance add another unit test for your new code.

The big downside of this approach is
that the complexity of the code increases every time you do it.
And KWin's windowing code has become absurdly complex over the years.
As an example
take a look at the different [types of geometries][kwin-geometries],
which describe the position and size of a window.

In contrast I chose the hard way: I made the code simpler.

This would of course be also kind of easy if I just removed features,
but I was able to keep in all features of KWinFT's windowing logic
while simplifying major internal concepts and algorithms.

There is one exception though: the [shading of windows][ewmh-shading] got removed.
Sorry to the few people who used it,
but it is one of these features not meant for a Wayland world
and whoever had implemented it at some point in the ancient history of KWin,
had done that by littering special cases and boolean traps all over the code base
in order to get it done.

## Battle Plans and Front Lines
After this prelude let me give you an overview of what this revolution actually contains.

### Flattening the Hierarchy
To get the revolution started I drafted in the beginning,
like I always do with bigger projects like this,
a general plan that I published in an [issue ticket][windowing-overview-task].

You can see that my primary focus was to simplify the sprawling hierarchy of different window types,
which have grown in numbers over the years mostly because of the Wayland changes.

:img-cap{src="assets/2021-02-08-pre-simplified.png" cap="The old windows hierarchy." capMargin='10px'}

My first idea was to flatten the hierarchy through the use of C++ templates
and replacing [inheritance with composition][composition-over-inheritance].
And while not yet fully finished,
the current state absolutely reaffirms my decision to follow through with this idea.

:img-cap{src="assets/2021-02-08-current-simplified.png" cap="The new windows hierarchy." capMargin='10px'}

The classes `AbstractClient` and `XwaylandClient`,
which represented different kinds of windows,
have been removed completely.
This simplifies the hierarchy to only two levels.

In the future I want to also get rid of the `Toplevel` class.
My plan for that is to template the `Workspace` class over its supported window types.
This would mean no more dynamic inheritance at all.

Other dependent properties that were previously stuffed into `AbstractClient`
I carefully dissected out of it.
For example everything related to Scripting
is now contained in a single independent [interface][script-window].

### Clean Code is Comprehensible Code

While moving forward with my initial goals
I realized that huge parts of the code were so outdated, so ugly, so rotten,
that I could not just refactor the logic,
but also had to improve the code styling.
Often the internal logic was incomprehensible
because of the style.

So this project became also about replacing archaic macros with modern lambdas,
reducing code duplication, adding white space where it made sense and so on.

Overall I improved the readability and reduced clutter.
I ensured there is a single coherent style in all refactored files.
One of the largest single commits in that endeavor
was the [overhaul][x11client-overhaul] of the `X11Client` class.

When deciding on how to clean up code,
I follow modern C++ principals in general.
I orientate myself at the Standard Library and the [C++ Core Guidelines][cpp-core-guidelines]
instead of the outdated Qt library style.
This falls in line with my long-term plan to [factor out libraries][library-split-out]
that will be pure C++ and not depend on Qt anymore.

### The Big Ones: Subsurfaces and Window Geometries
While my focus in the beginning of the windowing refactoring
was to simplify the hierarchy of windows,
that was not the initial motivation for this project.
My motivation was to fix a certain issue with Wayland subsurfaces:
they were not correctly transformed by effects.

There had landed [a patch][subsurfaces-kwin] for that in KWin in the middle of last year,
but I had a feeling it was once again a half-baked attempt at a solution,
leading to more complexity instead of less and not solving the problem in a holistic way.
My further analysis of the patch confirmed my initial thoughts
and I decided to look at the problem from a completely different angle.

The solution I came up with I would in fact call *revolutionary*.
In the [Merge Request][subsurfaces-rework]
I described it as a "huge mental shift in what we understand under subsurfaces".
I reused existing concepts from X11 and Wayland,
but interpreted them in a new way,
what simplified the code
and unified the logic over all windows.

As there is much to say about this specific solution,
I split out the discussion of it into a follow-up article.
Stay tuned.

*Note: the [first article](/blog/2021/window-kindergarten) of that follow-up discussion is now available.*

I will also write a separate article about the other big change:
a total redesign of how we store and change the geometries of windows.

These geometries were a pain point for me already for a long time.
Any aspiring new contributor for KWin must feel absolutely shell-shocked,
when trying to understand what all the different geometry types of windows are supposed to mean
and how they relate to each other.

As a reminder [these][kwin-geometries] are just the getters
for the different kinds of geometries in the abstract top level interface class.
And [this][kwin-geometries-set-frame] is one of many ways to change a single one of them.
Yes, that's a pure virtual function in a subclass,
and yes, the second argument of that setter is a masked boolean trap.

To finally squash any hope that new contributor might have,
show him all the different forms on how to save a geometry
[here][kwin-geometries-cache1], [here][kwin-geometries-cache2],
[here][kwin-geometries-cache3] and [here][kwin-geometries-cache4].
And until now we have looked only at header files.

To simplify all that,
eradicate this glaringly unnecessary complexity,
make the code actually comprehensible again,
I redesigned everything about it from the ground up.
This was for sure the most comprehensive and most difficult task.
And I had to go through several iterations before a final overarching model emerged
on how to handle *all* geometries of *all* windows,
on how to save and manipulate them via clearly defined structures and processes.

Some explanation for that model
can be found in the [primary Merge Request][kwinft-mr-geometries-2] of the geometries rework.
But as said, like with subsurfaces,
I plan to write about the reworked geometries soon
in a more detailed follow-up article.

## A Blossoming Heart
Why did I call this project the *Windowing Revolution*?
Does it deserve this pathos?
The project was massive, that's for sure.
In sheer numbers [the result][kwinft-mr-windowing]
is over 50 000 changed lines in over 300 commits.
I sacrificed over months all my time for this project, and my health.

But size or sacrifices alone do not make this a revolution.
Instead it comes through changes in our way of thinking
and how this project will reshape our future:
we radically redesigned the heart of our windowing manager,
we broke with overcome beliefs and traditions,
we simplified and reworked what was left rotten for decades.

In the end this paves the road for all future improvements,
enables us to build them on solid foundations,
on a rebuilt core of what defines KWinFT,
the most advanced, most modern windowing compositor in the world.

That is why this revolution was necessary now,
that is why I decided to push every other potential work item to afterwards.
We first needed to reshape KWinFT's vibrating, pumping
and now finally again blossoming heart,
before work on anything else made sense again,
be it features for our Wayland session or bug fixes on X11.

## Silence in Between the Storms
The last months felt like in a hurricane at times.
The volume of work was just that much.
I have to thank several other contributors to KWinFT,
who helped me throughout the whole time
by testing the constantly changing feature branch of the project.
This feedback was invaluable and pushed me forward
in creating what will now be served to the general public with the upcoming release of 5.21.

I would like to tell you that the work on KWinFT's heart is complete now,
that the windowing code is in a perfect state and there is nothing more to do.
But that's not yet the case.

What has been merged now to KWinFT's master branch and will be included in the upcoming release next week,
is a very well progressed intermediate state.
I believe the biggest and most important objectives have been achieved,
but there are still some smaller refactors to do.

For example one of these smaller refactors is representing unmanaged X11 windows
by the same `x11::window` class like managed ones,
just without compositing the control interface into them.
This will further reduce the complexity
and allow us afterwards to consolidate more X11-only functionality in a single place.
If you are interested in helping with this small but important task take a look at its [issue ticket][kwinft-issue-unmanageds].

Besides that there are lots of small code portions which can be moved now to their respective places in the `win` namespace
in order to clean up further the root directory of the repo.
If you want to help with that,
pick one from [the list][kwinft-issue-move-win] I created.

## The Next Revolution
While there is still some smaller work to do for this Windowing Revolution,
I want to start the next one already now
by setting a new focus for the upcoming release cycle.

This upcoming revolution is about a refactor of our *render* code.
And while we called the windowing logic the heart of a window manager,
we may call the render code its *guts*.

I will write more about this project in the future,
but for now assume some of the most anticipated features on Wayland will be part of it.
If you already now want to know more about it, take a look at the [overview ticket][kwinft-issue-render].

## Join the Cause
If you feel inspired,
of course you are invited to take part in this next revolution.
And the same holds, if you want to help with the remaining tasks of the last one,
the windowing refactor.

Test the current code and give feedback.
Or if you want to start contributing code,
pick one of the tasks from our GitLab [issues list][kwinft-issues].

And join us in our [Gitter community][kwinft-gitter] for a friendly chat.

[blog-vladz]: https://blog.vladzahorodnii.com
[composition-over-inheritance]: https://medium.com/better-programming/prefer-composition-over-inheritance-1602d5149ea1
[cpp-core-guidelines]: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
[ewmh-shading]: https://specifications.freedesktop.org/wm-spec/wm-spec-latest.html#idm45623492381424
[layers-blame]: https://invent.kde.org/plasma/kwin/-/blame/master/layers.cpp
[kwin]: https://en.wikipedia.org/wiki/KWin
[kwin-geometries]: https://invent.kde.org/plasma/kwin/-/blob/4890db3f16d1b9bd244f1a83c8d198ff93f6543b/toplevel.h#L299-349
[kwin-geometries-cache1]: https://invent.kde.org/plasma/kwin/-/blob/4890db3f16d1b9bd244f1a83c8d198ff93f6543b/x11client.h#L483
[kwin-geometries-cache2]: https://invent.kde.org/plasma/kwin/-/blob/4890db3f16d1b9bd244f1a83c8d198ff93f6543b/xdgshellclient.h#L97
[kwin-geometries-cache3]: https://invent.kde.org/plasma/kwin/-/blob/4890db3f16d1b9bd244f1a83c8d198ff93f6543b/toplevel.h#L723-724
[kwin-geometries-cache4]: https://invent.kde.org/plasma/kwin/-/blob/4890db3f16d1b9bd244f1a83c8d198ff93f6543b/abstract_client.h#L1276-1294
[kwin-geometries-set-frame]: https://invent.kde.org/plasma/kwin/-/blob/4890db3f16d1b9bd244f1a83c8d198ff93f6543b/abstract_client.h#L624
[kwin-mr-items]: https://invent.kde.org/plasma/kwin/-/merge_requests/656
[kwinft]: https://gitlab.com/kwinft
[kwinft-gitter]: https://gitter.im/kwinft/community
[kwinft-issue-move-win]: https://gitlab.com/kwinft/kwinft/-/issues/127
[kwinft-issue-render]: https://gitlab.com/kwinft/kwinft/-/issues/128
[kwinft-issue-unmanageds]: https://gitlab.com/kwinft/kwinft/-/issues/125
[kwinft-issues]: https://gitlab.com/groups/kwinft/-/issues
[kwinft-mr-geometries-2]: https://gitlab.com/kwinft/kwinft/-/merge_requests/68
[kwinft-mr-windowing]: https://gitlab.com/kwinft/kwinft/-/merge_requests/71
[library-split-out]: https://gitlab.com/kwinft/kwinft/-/issues/21
[script-window]: https://gitlab.com/kwinft/kwinft/-/blob/5409a4b98a79fdef463076b1c1b847d917cf3eb7/scripting/window_wrapper.h
[subsurfaces-kwin]: https://phabricator.kde.org/D29131
[subsurfaces-rework]: https://gitlab.com/kwinft/kwinft/-/merge_requests/64
[windowing-overview-task]: https://gitlab.com/kwinft/kwinft/-/issues/75
[x11client-overhaul]: https://gitlab.com/kwinft/kwinft/-/commit/71926f30eb014ed2dfd0de715f16c01b93915d28?expanded=1
