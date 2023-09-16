---
title: "KDE Sprints in Summer Heat"
date: 2019-08-18 20:00:00
tags:
  - kde
  - plasma
  - kwin
  - conference
series: false
cover_image: ./assets/2019-08-18-kde-sprints-in-summer-heat.jpg
canonical_url: false
description: "End of June I attended the annual Plasma sprint as well as in July the KDE&#160;Connect and the KWin sprints in Nuremberg. This is a summary of what was important to me at these sprints."
authors: [roman-gilg]
---
End of June I attended the annual Plasma sprint that was this year held in Valencia in conjunction with the Usability sprint. And in July we organised on short notice a KWin sprint in Nuremberg directly following up on the KDE&#160;Connect sprint. Let me talk you through some of the highlights and what I concentrated on at these sprints.

### Plasma Sprint in Valencia
It was great to see many new faces at the Plasma sprint. Most of these new contributors were working on the Plasma and KDE Apps Ui and Ux and we definitely need some new blood in these areas. KDE's [Visual Design Group][vdg-wiki], the VDG, thinned out over the last two years because some leading figures left. But now seeing new talented and motivated people joining as designers and Ux experts I am optimistic that there will be a revival of the golden time of the VDG that brought us Breeze and Plasma&#160;5.

In regards to technical topics there is always a wide field of different challenges and technologies to combine at a Plasma sprint. From my side I wanted to discuss current topics in KWin but of course not everyone at the sprint is directly working on KWin and some topics require deeper technical knowledge about it. Still there were some fruitful discussions, of course in particular with David, who was the second KWin core contributor present besides me.

As a direct product of the sprint my work on dma-buf support in KWin and KWayland can be counted. I started work on that at the sprint mostly because it was a feature requested already for quite a long time by Plasma Mobile developers who need it on some of their devices to get them to work. But this should in general improve in our Wayland session the performance and energy consumption on many devices. Like always such larger features need time so I was not able to finish them at the sprint. But last week I [landed][dmabuf-patch-kwayland] [them][dmabuf-patch-kwin].

### Megasprint in Nuremberg
At the Plasma sprint we talked about the current state of KWin and what our future goals should be. I wanted to talk about this some more but the KWin core team was sadly not complete at the Plasma sprint. It was Eike's idea to organize a separate sprint just for KWin and I took the next best opportunity to do this: as part of the [KDE&#160;Connect][kde-connect-sprint] and the [Onboarding][onboarding-sprint] sprints in the SUSE offices in Nuremberg just a few weeks later. Jokingly we called the whole endeavor because of the size of three combined sprints the *Megasprint*.

#### KDE&#160;Connect Sprint
I was there one or two days earlier to also attend the KDE&#160;Connect sprint. This was a good idea because the KDE&#160;Connect team needs us to provide some additional functionality in our Wayland session.

The first feature they rely on is a clipboard management protocol to read out and manipulate the clipboard via connected devices. This is something we want to have in our Wayland session also in general because without it we can not provide a clipboard history in the Plasma applet. And a clipboard selection would be lost as soon as the client providing it is closed. This can be intentionally but in most cases you expect to at least have simple text fragments still available after the source client quit.

The second feature are fake inputs of keyboard and mouse via other KDE&#160;Connect linked devices. In particular fake input via keyboard is tricky. My approach would be to implement the protocols developed by Purism for virtual keyboards and input methods. Implementation of these looks straight forward at first, the tricky part comes in when we look at the current internal keyboard input code in KWayland and KWin: there is not yet support for multiple seats or for one set multiple keyboards at the same time. But this is a prerequisite for virtual keyboards if we want to do it right including the support of different layouts on different keyboards.

#### KWin Sprint
After the official begin of the KWin sprint we went through a long list of topics. As this was the first KWin sprint for years or even forever there was a lot to talk about, starting with small code style issues we needed to agree on till large long-time goals on what our development efforts should concentrate in the future. Also we discussed current topics and one of the bigger ones is for sure my compositing [rework][glx-patch].

But in the overall picture this again is only one of several areas we need to put work in. In general it can be said that KWin is a great piece of software with many great features and a good performance but its foundations have become old and in some cases rotten over time. Fixes over fixes have been put in one after the other increasing the complexity and decreasing the overall cohesion. This is normal for actively used software and nothing to criticize but I think we are now at a point in the product life cycle of KWin to either phase it out or put in the hours to rework many areas from the ground up.

I want to put in the hours but on the other side in light of possible regressions with such large changes the question arises if this should be done dissociated with normal KWin releases. There was not yet a decision taken on that.

### Upcoming Conferences
While the season of sprints for this year is over now there are some important conferences I will attend and if you can manage I invite you to join these as well. No entry fee! In the second week of September the [KDE&#160;Akademy][kde-akademy] is held in Milan, Italy. And in the first week of October the [X.Org Developer's Conference][xdc] (XDC) is held in Montreal, Canada. At XDC I have two talks lined up myself: a [full length talk][kwin-talk] about KWin and a [lightning talk][xwl-talk] about a work-in-progress solution by me for multi DPI scaling in XWayland. And if there is time I would like to hold a third one about my ongoing work on [auto-list compositing][x-talk].

In the beginning I planned only to travel to Canada for XDC but just one week later the [WineConf 2019][wineconf] is held close to Montreal, in Toronto, so I might prolong the stay a bit to see how or if at all I as a compositor developer could help the Wine community in achieving their goals. To my knowledge this would be the first time a KWin developer attends WineConf.

[vdg-wiki]: https://community.kde.org/Get_Involved/design
[dmabuf-patch-kwayland]: https://cgit.kde.org/kwayland.git/commit/?id=1dd57d909165c5f618aedc9befbbc24d7074b3ba
[dmabuf-patch-kwin]: https://cgit.kde.org/kwin.git/commit/?id=6613327a9c3e5db5928060b246db76914642ec37
[glx-patch]: https://phabricator.kde.org/D23105
[kde-akademy]: https://akademy.kde.org/2019
[xdc]: https://xdc2019.x.org/
[wineconf]: https://wiki.winehq.org/WineConf2019
[kwin-talk]: https://xdc2019.x.org/event/5/contributions/311/
[xwl-talk]: https://xdc2019.x.org/event/5/contributions/358/
[x-talk]: https://gitlab.freedesktop.org/xorg/xserver/merge_requests/211
[kde-connect-sprint]: https://simonredman.wordpress.com/2019/07/25/welcome-to-kde-nuremberg-megaspring-part-1/
[onboarding-sprint]: http://neofytosk.com/post/kdes-onboarding-sprint-making-it-easier-to-setup-a-development-environment/
