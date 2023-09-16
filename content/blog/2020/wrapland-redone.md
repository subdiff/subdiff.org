---
title: "Wrapland Redone"
date: 2020-05-25 10:00:00
tags:
 - kwinft
 - wrapland
 - disman
 - kde
 - kdisplay
 - kscreen
series: false
cover_image: ./assets/2020-05-25-wrapland-redone.jpg
canonical_url: false
description: "A first update on ongoing developments in the KWinFT project featuring a redesign of Wrapland's server library and two more projects joining KWinFT."
authors: [roman-gilg]
---
The KWinFT project with its two major open source offerings KWinFT and Wrapland was [announced](/blog/2020/the-kwinft-project) one month ago. This made quite [some][gamingonlinux] [headlines][phoronix] back then but I decided to keep it down afterwards and push the project silently forward on a technical side.

Now I am pleased to announce the release of a beta version for the next *stable release 5.19* in two weeks. The highlights of this release are a complete redesign of Wrapland's server library and two more projects joining KWinFT.

## Wrapland Server Library Redesign

One of the goals of KWinFT is to facilitate large upsetting changes to the internal structure and technological base of its open source offerings. As mentioned one month ago in the project announcement these changes include pushing back the usage of Qt in lower-level libraries and instead making use of modern C++ to its full potential.

We achieved the first milestone on this route in an impressively short timeframe: the redesign of Wrapland's server library for improved encapsulation of external libwayland types and providing template-enhanced meta-classes for easy extension with new functionality in the future.

This redesign work was organized on a separate branch and [merged this weekend][server-remodel-mr] into master. In the end that included over 200 commits and 40'000 changed lines. Here I have to thank in particular Adrien Faveraux who joined KWinFT shortly after its announcement and contributed several class refactors. Our combined work enabled us to deliver this major redesign already now with the upcoming release.

Aside from the redesign I used this opportunity to add clang-based tools for static code analysis: [clang-format][clang-format] and [clang-tidy][clang-tidy]. Adding to our autotests that run with and without sanitizers Wrapland's CI pipelines now provide efficient means for handling contributions by GitLab merge requests and checking back on the result after merge. You can see a full pipeline with linters, static code analysis, project build and autotests passing in the article picture above or check it out [here][pipeline] directly in the project.

## New in KWinFT: Disman and KDisplay

With this release [Disman][disman] and [KDisplay][kdisplay] join the KWinFT project. Disman is a fork of libkscreen and KDisplay one of KScreen. KScreen is the main UI in a KDE Plasma workspace for display configuration and I was its main contributor and maintainer in the last years.

Disman can be installed in parallel with libkscreen. For KDisplay on the other side it is recommended to remove KScreen when KDisplay is installed. This way not both daemons try to meddle with the display configuration at the same time. KDisplay can make use of plugins for KWinFT, KWin and wlroots so you could also use KDisplay as a general replacement.

Forking libkscreen and KScreen to Disman and KDisplay was an unwanted move from my side because I would have liked to keep maintaining them inside KDE. But my efforts to integrate KWinFT with them were not welcomed by some members of the Plasma team. Form your own opinion by reading the discussion in the [patch review][phab-kscreen].

I am not happy about this development but I decided to make the best out of a bad situation and after forking and rebranding directly created CI pipelines for both projects which now also run linters, project builds and autotests on all merge requests and branch pushes. And I defined some more [courageous goals][disman-flow] for the two projects now that I have more control.

One would think after years of being the only person putting real work into KScreen I would have had this kind of freedom also inside KDE but that is not how KDE operates.

Does it need to be this way? What are arguments for and against it? That is a discussion for another article in the future.

## Very Next Steps
There is an overall technical vision I am following with KWinFT: building a modern C++ framework for Wayland compositor creation. A framework that is built up from independent yet well interacting small libraries.

Take a look at [this task][modularization-kwinft] for an overview. The first one of these libraries that we have now put work in was Wrapland. I plan for the directly next one to be the backend library that provides interfacing capabilities with the kernel or a host window system the compositor runs on, what in most cases means talking to the [Direct Rendering Manager][wiki-drm].

The work in Wrapland is not finished though. After the basic representation of Wayland objects has been improved we can push further by layering the server library like [this task][server-layers] describes. The end goal here is to get rid of the Qt dependency and make it an optional facade only.

## How to Try Out or Contribute to KWinFT
You can try out KWinFT on [Manjaro][manjaro]. At the moment you can install KWinFT and its dependencies on Manjaro's unstable images but it is planned to make this possible also in the stable images with the upcoming 5.19 stable release.

I explicitly recommend the Manjaro distribution nowadays to any user from being new to Linux to experts. I have Manjaro running on several devices and I am very pleased with Manjaro's technology, its development pace and its community.

If you are an advanced user you can also use Arch Linux directly and install a [KWinFT AUR package][aur-kwinft] that builds KWinFT and its dependencies directly from Git. I hope a package of KWinFT's stable release will also be soon available from Arch' official repositories.

If you want to contribute to one of the KWinFT projects take a look at the [open tasks][open-tasks] and come join us in our [Gitter channel][gitter-kwinft]. I am very happy that already several people joined the project who provide QA feedback and patches. There are also opportunities to work on DevOps, documentation and translations.

I am hoping KWinFT will be a welcoming place for everyone interested in high-quality open source graphics technology. A place with low entry barriers and many opportunities to learn and grow as an engineer.

[aur-kwinft]: https://aur.archlinux.org/packages/kwinft-git/
[clang-format]: https://clang.llvm.org/docs/ClangFormat.html
[clang-tidy]: https://clang.llvm.org/extra/clang-tidy/
[disman]: https://gitlab.com/kwinft/disman
[disman-flow]: https://gitlab.com/kwinft/disman/-/issues/6
[gamingonlinux]: https://www.gamingonlinux.com/articles/kdes-window-manager-kwin-gets-forked-with-kwinft-to-accelerate-the-development-and-better-wayland.16446
[gitter-kwinft]: https://gitter.im/kwinft/community
[kdisplay]: https://gitlab.com/kwinft/kdisplay
[manjaro]: https://manjaro.org
[modularization-kwinft]: https://gitlab.com/kwinft/kwinft/-/issues/21
[open-tasks]: https://gitlab.com/groups/kwinft/-/issues
[phab-kscreen]: https://phabricator.kde.org/D29024
[phoronix]: https://www.phoronix.com/scan.php?page=news_item&px=KWinFT-KDE-KWin-Forked
[pipeline]: https://gitlab.com/kwinft/wrapland/pipelines/149043262
[server-remodel-mr]: https://gitlab.com/kwinft/wrapland/-/merge_requests/59
[server-layers]: https://gitlab.com/kwinft/wrapland/-/issues/65
[wiki-drm]: https://en.wikipedia.org/wiki/Direct_Rendering_Manager
