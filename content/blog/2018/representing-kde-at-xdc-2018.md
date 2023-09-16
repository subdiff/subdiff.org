---
title: "Representing KDE at XDC 2018"
date: 2018-10-31 11:00:00
tags:
  - xorg
  - freedesktop
  - kde
  - conference
series: false
cover_image: ./assets/2018-10-31-representing-kde-at-xdc-2018.jpg
canonical_url: false
description: "Last month the X.Org Developer's Conference (XDC) was held in A Coruña, Spain. I took part as a Plasma/KWin developer."
authors: [roman-gilg]
---
Last month the X.Org Developer's Conference (XDC) was held in A Coruña, Spain. I took part as a Plasma/KWin developer. My main goal was to simply get into contact with developers from other projects and companies working on open source technology in order to show them that the KDE community aims at being a reliable partner to them now and in the future.

Instead of recounting chronologically what went down at the conference let us look at three key groups of attendees, who are relevant to KWin and Plasma: the graphics drivers and kernel developers, upstream userland and colleagues working on other compositor projects.

### Graphics Drivers and Kernel
If you search on Youtube for videos of talks from previous XDC conferences or for the videos from this year's XDC you will notice that there are many talks by graphics drivers developers, often directly employed by hardware vendors.

The reason is that hardware vendors have enough money to employ open source developers and send them to conferences and that they [benefit greatly][xdc2017-talk] from contributing directly to open source projects. Something which also Nvidia management will realize at some point.

On the other side I talked to the Nvidia engineers at the conference, who were very friendly and eager to converse about their technical solutions which they are allowed to share with the community. Sadly their primarily usage of proprietary technology in general hinders them in taking a more active role in the community and there is apparently no progress on their proposed open standard Wayland buffer sharing API.

At least we arranged that they would send some hardware for testing purposes. I won't be the recipient, since my work focus will be on other topics in the immediate future, but I was able to point to another KWin contributor, who should receive some Nvidia hardware in the future so he can better troubleshoot problems our users on Nvidia experience.

The situation looks completely different for Intel and AMD. In particular Intel has a longstanding track record of open development of their own drivers and contributing to generic open source solutions also being supported by other vendors. And AMD decided not too long ago to open source their most commonly used graphics drivers on Linux. In both cases it is a bliss to target their latest hardware and it was as great as I imagined it to be talking to their developers at XDC, because they are not only interested in their own products but in boosting the whole ecosystem and finding suitable solutions for everyone. I want to explicitly mention Martin Peres from Intel and Harry Wentland from AMD, who I had long, interesting discussions with and who showed great interest in improving the collaboration of low-level engineers and us in userland.

Who I haven't mentioned yet is ARM. Although they are just like Nvidia, Intel and AMD an XDC "Gold Sponsor" their contribution in terms of content to the conference was minimal, most likely for the same reason of being mostly closed source as in the Nvidia case. And that is equally sad, since we do have some interest in making ARM a well supported target for Plasma. An example is Plasma on the [Pinebook][pine-plasma]. But the driver situation for ARM Mali GPUs is just ugly, developing for them is torture. I know because I did some of the integration work for the Pinebook. All the more I respect the efforts by several extremely talented hackers to provide open-source drivers for ARM Mali GPUs. Some of them [presented][mali-panfrost] their work at XDC.

### X.Org and freedesktop.org Upstream
Linux graphics drivers are cool and all, but without XServer, Wayland and other auxiliary cross-vendor user space libraries there would be not much to show off to the user. And after all it is the *X.Org* Developer's conference, most notably being home to the XServer and maybe in the future [governance wise][fdo-xorg] also to freedesktop.org. So after looking at low-level driver development, what role did these projects and their developers play at the conference?

First I have to say, that the dichotomy established in the previous paragraph is of course not that distinct. Several graphics drivers are part of mesa, which is again part of freedesktop.org and many graphics drivers developers are also contributing to user land or involved in organizational aspects of X.Org and freedesktop.org. A more prominent one of these organizational aspects is hosting of projects. There was a presentation by Daniel Stone about the freedesktop.org transition to GitLab, what was a rather huge project this year and is still ongoing.

But regarding technical topics there were not many presentations about XServer, Wayland and other high level components. After seeing some lightning talks on the first day of the conference I decided to hold a lightning talk myself about my Xwayland GSOC project in 2017. I got one of the last slots on Friday and you can watch a video of my presentation [here][youtube-own-talk]. Also Drew De Vault presented a demo of wlroot's layer shell.

So there were not so many talks about the higher level user space graphics stack, but some of us plan to increase the ratio of such talks in the future. After talking about graphics drivers developers and upstream userland this brings me directly to the last group of people:

### Compositors Developers
We were somewhat a special crowd at XDC. From distinct projects, some of us were from wlroots, Guido from Purism and me from KWin, we were united in, to my knowledge, all of us being the first time at XDC.

If you look at past conferences the involvement of compositor developers was marginal. My proclaimed goal and I believe also the one of all the others is to change this from now on. Because from embedded to desktop we will all benefit by working together where possible and exchanging information with each other, with upstream and with hardware vendors. I believe X.Org and freedesktop.org can be a perfect platform for that.

### Final Remarks on Organisation
The organisation of the conference was simply great. Huge thanks to igalia for hosting XDC in their beautiful home town.

What I really liked about the conference schedule was that there were always three long breaks every day and long pauses between the talks allowing the attendees to talk to each other.

What I didn't like about the conference was that all the attendees were spread over the city in different hotels. I do like the KDE Akademy approach better in this regard: everyone in one place so you can drink together a last beer at the hotel bar before going to bed. That said there were events at multiple evenings throughout the week, but recommending a reasonable priced default hotel for everyone not being part of a large group might still be an idea for next XDC.

[xdc2017-talk]: https://www.youtube.com/watch?v=R2XHZd4uXRI&t=16m20s
[pine-plasma]: https://twitter.com/thepine64/status/1057379204021583872
[mali-panfrost]: https://www.youtube.com/watch?v=qtt2Y7XZS3k
[fdo-xorg]: https://lists.freedesktop.org/archives/wayland-devel/2018-October/039533.html
[youtube-own-talk]: https://www.youtube.com/watch?v=Wjs_Yoz5n_c
[youtube-drew-talk]: https://www.youtube.com/watch?v=VuRXHJu5Kmg
