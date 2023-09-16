---
title: "The KWinFT Project"
date: 2020-04-15 23:00:00
tags:
 - kde
 - kwayland
 - kwin
 - kwinft
 - wrapland
series: false
cover_image: ./assets/2020-04-15-the-kwinft-project.jpg
canonical_url: false
description: "Announcing the birth of the KWinFT project, a reboot of the window manager KWin and its accompanying libwayland wrapping library KWayland in the form of Wrapland. Its first release is available now."
authors: [roman-gilg]
---
I am pleased to announce the *KWinFT project* and with it the first public release of its major open source offerings [KWinFT][kwinft] and [Wrapland][wrapland], drop-in replacements for KDE's window manager KWin and its accompanying KWayland library.

The KWinFT project was founded by me at the beginning of this year with the goal to accelerate the development significantly in comparison to KWin. Classic KWin can only be moved with caution, since many people rely on it in their daily computing and there are just as many other stakeholders. In this respect, at least for some time, I anticipated to be able to push KWinFT forward in a much more dynamic way.

Over time I refined this goal though and defined additional objectives to supplement the initial vision to ensure its longevity. And that became in my view now equally important: to provide a sane, modern, well organized development process, something KWinFT users won't notice directly but hopefully will benefit from indirectly by enabling the achievement of the initial goal of rapid pace development while retaining the overall stability of the product.

## What Is in There for You

If you are primarily a consumer of Linux graphics technology this announcement may not seem especially exciting for you. Right now and in the near future the focus of KWinFT is inwards: to formulate and establish great structures for its development process, multiplying all later development efforts.

Examples are continuous integration with different [code linters][clang-linters], scheduled and automatic [builds and tests][wrapland-pipelines], as well as [policies][submission-guideline] to increase developer's effectiveness. This will hopefully in many ways accelerate the KWinFT progress in the future.

But there are already some experimental features in the first release that you might look out for:

* My **rework of KWin's composition pipeline** that, according to some early feedback last year, improves the presentation greatly on X11 and Wayland. Additionally a timer was added to minimize the latency from image creation to its depiction on screen.
* The **Wayland viewporter extension** was implemented enabling better presentation of content for example for video players and with the next XWayland major release to emulate resolution changes for many older games.
* Full support for **output rotation and mirroring** in the Wayland session.

## How to Get KWinFT Not Later Than Now

Does this sound interesting to you? You are in luck! The first official release is [already][wrapland-release] [available][kwinft-release] and if you use [Manjaro Linux][manjaro] with its unstable branch enabled, you can even try it out *right now* by installing the *kwinft* package.

And you may switch back to classic KWin in no time by installing again the kwin package. Your dependencies will be updated in both directions without further ado.

I hope KWinFT and Wrapland will soon become available in other distributions as well. But at this moment I must thank the Manjaro team for making this happen on very short notice.

Here I also want to thank Ilya Bizyaev for testing my builds from time to time in the last few weeks and giving me direct feedback when something needed to be fixed.

## Future Directions
For the rest of this article let me outline the strategy I will follow in the future with the KWinFT project. I will expand on these goals in upcoming blog posts as time permits.

### An Optimized Development Process
I already mentioned that defining and maintaining a healthy development process in KWinFT is an absolute focus objective for me.

This is the basis on that any future development effort can pick up momentum or if neglected will be held back. And that was a huge problem with KWin in the last year and I can say with certainty that I was not the only developer who suffered because of that.

I tried to improve the situation in the past inside KWin but the larger an organization and the more numerous the stakeholders become the more difficult it is for any form of change to manifest.

In open source software development we have the amazing advantage to be able to circumvent this blockade by rebooting a project in a fresh organisational paradigm what we call a fork. This has all so many risks and challenges as one could expect, so such a decision should not be taken lightly and needs a lot of conviction, preparation and dedication.

I won't go into anymore detail here but I plan to write more articles on what I see as current deficits in KDE's organisation of development processes, how I plan to make sure such issues won't plague KWinFT as well and in which ways these solutions could be at least partly adopted in KDE as well in order to improve the situation there too.

And while I don't have to say much positive about the current state of KDE right now, don't forget that KDE is an organisation which withstood the test of time with a history reaching back more than 20 years. An organisation that had a positive impact on many people. Such an organisation must not be slated but fostered and enhanced.

### KWinFT With Focus On Wayland
The project is called KWinFT because its primary offering right now is the window manager KWinFT, a fork of KWin. The strategy I will follow for this open source offering is centered around *developer focus*.

The time and resources of open source developers are not limitless and the window compositor is a central building piece in any desktop making it a natural point of contention.

One solution is permanently trying to make everyone happy through compromise and consensus. That is the normal pattern in large organisations. Dynamic progress is the opposite of that, instead featuring a trial-and-error approach and the sad reality that sometimes corners must be cut and hearts be broken for achieving a greater good.

Both these patterns can be valid approaches in different times and contexts. KDE naturally can only employ the first one, KWinFT is destined to employ the second one.

A major focus for the overall KWinFT project and in particular its window manager will be Wayland. That won't mean to make it just about usable at whatever the cost, but to put KWinFT's Wayland session on a rock-solid solution, rework it as often as needed, grind it out until it is right without any compromise.

And boy, does it need that! To say it bluntly, even with the risk of getting cited out of context: in 2020 still KWin and KWayland are a mess.

Sure, the superficial impression improved over time but there are many deep and fundamental flaws in the architecture that require one or better several developers and project lifetimes of not days or weeks, but months. Let me skip the details for now and instead go directly to the biggest offender.

### Wrapland in Modern C++ and Without Qt
Wrapland was forked from KWayland alongside with KWinFT. I knew KWayland's architecture before of course already, but there is knowing and understanding. And what I have learned additionally about KWayland's internals in the last few months was shocking. And with the current vision that I follow for Wrapland I would not call Wrapland a fork anymore, rather a *reboot*.

The very first [issue ticket][wrapland-remove-qt] I opened in Wrapland was somewhat a gamble back at that time but in hind sight quite visionary. The issue asks to remove Wrapland's Qt dependency. When I opened this ticket I wasn't aware of all the puzzle pieces, I couldn't be. But now two months later I am more convinced by that goal than ever before.

A C++ library that provides a wrapper for the C-style library libwayland is useful, a C++ library in conformance with the C++ Core Guidelines, leveraging the most current C++ standard. That means in particular without using Qt concepts like their moc, raw pointers everywhere and the prevailing use of dynamic over static inheritance.

KWinFT and potentially many other applications, for example from games with nested composition up to the UIs of large industrial machinery, could make great use of a well designed, unit tested, battle-hardened C++ Wayland library that employs modern C++ features for type and memory safety to their full extend. And that only covers Wrapland's server part. Although clients often use complete toolkit for their windowing system integration it is not hard to envision use cases where more direct access is needed and a C++ library is preferred.

The advantages by leveraging Qt in comparison would be primarily the possibility to add QML bindings. This can be useful as some [interesting applications][qtwayland] leveraging QtWayland's server part prove. But it is minuscule in KWinFT's use case. And what the compositor that Wrapland is written against does not make use of can not be a development objective of this library in the foreseeable future.

I am currently rewriting the server part of Wrapland in this spirit. You can check out the [overview ticket][server-objects-overview] that I created for planning the rewrite and the [current prototype][server-objects-prototype] I am working on. Note that the development is still ongoing on a fundamental level and there might be more iterations necessary before a final structure manifests.

While the remodel of the server part is certainly exciting and I do plan something similar for the client part, this project will need to wait some more. For now I "only" reworked most of the client library to not leak memory in every second place. This allows to run unit tests on the GitLab CI for merge requests and on push in a robust manner. This rework, which contained also fixes for the server part, resulted in a massive [merge][memory-rework] with 40 commits and over 6000 changed lines.

### A Beacon of Modern Technologies
Leveraging modern language features of C++ is one objective, but a far more important one for this project is in the domain to find KWinFT is really created for: computer graphics and their presentation and organisation in an optimal way to the user.

But here I declare just a single goal: KWinFT must be at the top of every major development in this domain.

Too often in the past KWin was sidelined, or rather sidelined itself, when new technology emerged trying to catch up later on. The state of Wayland on Plasma in 2020 is testament to that. In contrast KWinFT shall be open to new developments in the larger community and if manpower permits spearhead such itself, not necessarily as a maverick but in concert with the many other great single and multi-developer projects on freedesktop.org and beyond. This leads over to the final founding principle of KWinFT.

### Open to Other Communities and Technologies
A major goal I pursued last year already as a KWin developer and that I want to expand upon with KWinFT is my commitment to building and maintaining meaningful relations with other open source communities.

Meaningful means here on one side on a personal level, like when I attended the X.Org Developer and Wine conferences on two consecutive weekends in October last year in Canada and on the way back home the Gnome Shell meetup in the Netherlands.

But meaningful also means working together, being open to the technologies other projects provide, trying to increase the interoperability instead of locking yourself into the own technology stack.

Of course in this respect the primary address that comes to mind is freedesktop.org with the Wayland and X11 projects. But also working together with teams developing other compositors can be very rewarding.

For example in Wrapland I recently added a [client implementation][wrapland-wlr-outputs] of wlroots' output management protocol. This will allow users of wlroots-based compositors in the future to [use KScreen][kscreen-wlroots] for configuring their outputs.

I want to expand upon that by sharing more protocols and more tools with fellow compositor developers. How about an internal [wlroots-based compositor][wrapland-wlroots-autotests] for Wrapland's autotests? This would double-check not only Wrapland's protocol implementation but also wlroot's ones at the same time. If you are interested in designing such a solution in greater details check out Wrapland's [contributing guideline][wrapland-contributing] and get in touch.

[kwinft]: https://gitlab.com/kwinft/kwinft
[wrapland]: https://gitlab.com/kwinft/wrapland
[clang-linters]: https://gitlab.com/kwinft/wrapland/-/issues/17
[wrapland-pipelines]: https://gitlab.com/kwinft/wrapland/pipelines
[submission-guideline]: https://gitlab.com/kwinft/kwinft/-/blob/master/CONTRIBUTING.md#submission-guideline
[wrapland-release]: https://gitlab.com/kwinft/wrapland/-/releases/wrapland%25400.518.0
[kwinft-release]: https://gitlab.com/kwinft/kwinft/-/releases/kwinft%25405.18.0
[manjaro]: https://manjaro.org
[wrapland-remove-qt]: https://gitlab.com/kwinft/wrapland/-/issues/1
[server-objects-overview]: https://gitlab.com/kwinft/wrapland/-/issues/14
[server-objects-prototype]: https://gitlab.com/kwinft/wrapland/-/issues/15
[memory-rework]: https://gitlab.com/kwinft/wrapland/-/merge_requests/4
[wrapland-wlr-outputs]: https://gitlab.com/kwinft/wrapland/-/merge_requests/8
[kscreen-wlroots]: https://twitter.com/subdiff/status/1247885925150949377
[wrapland-wlroots-autotests]: https://gitlab.com/kwinft/wrapland/-/issues/20
[wrapland-contributing]: https://gitlab.com/kwinft/wrapland/-/blob/master/CONTRIBUTING.md
[qtwayland]: https://archive.fosdem.org/2017/schedule/event/device_specific_compositors/
