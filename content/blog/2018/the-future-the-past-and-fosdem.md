---
title: "The Future, the Past and FOSDEM"
date: 2018-02-02 22:30:00
tags:
  - gsoc
  - freedesktop
  - kde
  - blue systems
  - conference
  - fosdem
series: false
cover_image: ./assets/2018-02-02-the-future-the-past-and-fosdem.jpg
canonical_url: false
description: "A recap of what happened in the last few months and what are my plans for the future."
authors: [roman-gilg]
---
Long time no see, something had happened for sure. So let's begin with that.

### The Past
My [last post](../2017/preparing-patches) was from 25th August 2017. It was about my GSoC project and how I was preparing the final patch set, that would then be posted to the xorg-devel mailing list.

That's quite some time ago and I also didn't follow up on what exactly happened now with the patch set.

Regarding the long pause in communication, it was because of my Master's thesis in mathematics. I finished it in December and the title is "Vertex-edge graphs of hypersimplices: combinatorics and realizations".

While the thesis was a lot of work, I'm very happy with the result. I found a relatively intuitive approach to [hypersimplices][wiki-hypersimplex] describing them as geometric objects and in the context of graph theory. I even wrote a small application that calculates certain properties of arbitrary hypersimplices and depicts their spectral representations up to the fourth dimension with Qt3D.

I'm currently waiting for my grade, but besides that my somewhat long student career suddenly came to an end.

Regarding my patch set: It did not get merged directly, but I got some valuable feedback from experienced Xserver devs back then. Of course I didn't want to give up on them, but I had to first work on my thesis and I planned to rework the patches once the thesis was handed in.

At this time I also watched some of the videos from XDC2017 and was happyily surprised that my mentor, Daniel Stone said that he wants my GSoC work in the next Xserver release. His trust in my work really motivated me. I had also some contact to Intel devs, who said that they look forward to my project being merged.

So after I handed in my thesis, I first was working on some other stuff and also needed some time off after the exhausting thesis end phase, but in the last two weeks I reworked my patches and posted a new patch set to the mailing list. I hope this patch set can be accepted in the upcoming Xserver 1.20 release.

### The Future
I already knew for a prolonged time, that after my master's degree in mathematics I wanted to leave university and not go for a scientific career. The first reason for this was, that after 10 years of study, most of the time with very abstract topics, I just wanted to interact with some real world problems again. And in retrospective I always was most motivated in my studies when I could connect abstract theory with practical problems in social science or engineering.

Since computers were a passion of mine already at a young age, the currently most interesting techonological achievements happen in the digital field and it is somewhat near to the work of a mathematician, I decided to go into this direction.

I had participated in some programming courses through my studies - and in one semester break created a Pong clone in Java for mobile phones being operated by phone movement; it was fun but will forever remain in the depths of one of my old hard disks somewhere - but I had to learn much more if I wanted to work on interesting projects.

In order build up my own experience pretty exactly two years ago I picked a well-known open-source project, which I found interesting for several reasons, to work on. Of course first I did [baby steps][dolphin-hidden-files-patch], but later on I could [accelerate][ams-patch].

So while writing the last paragraph it became apparent to me, that indeed this all was still describing the past. But to know where you're heading, you need to know where you're coming from, bla, bla. Anyways finally looking forward I now have the great opportunity to work full-time on KDE technology thanks to Blue Systems.

This foremost means to me to help Martin with the remaining tasks for making Plasma Wayland the new default. I will also work on some ARM devices, what in particular means being more exposed to kernel development. That sounds interesting!

Finally with my GSoC project, I already have some experience working on an upstream freedesktop.org project. So another goal for me is to foster the relationship of the Plasma project with upstream graphics development by contributing code and feedback. In comparision to GNOME we were a bit underrepresented in this regard, most of all through financial constraints of course.

Another topic, more long-term, that I'm personally interested in, is KWin as a VR/AR platform. I imagine possible applications kind of like Google tried it with their Glass project. Just as a full desktop experience with multiple application windows floating in front of you. Basically like in every other science fiction movie up to date. But yeah, first our Wayland session, then the future.

### The FOSDEM
Writing these lines I'm sitting in a train to Brussels. So if you want to meet up and talk about anything, you will presumably often find me the next two days at the KDE booth or on Saturday in the graphics devroom. But this is my first time at FOSDEM, so maybe I'll just stand somewhere in between and am not able to orientate myself anymore. In this case please lead me back to the KDE booth. Thanks in advance and I look forward to meeting you and other interesting people in the next two days at FOSDEM.

[wiki-hypersimplex]: https://en.wikipedia.org/wiki/Hypersimplex
[dolphin-hidden-files-patch]: https://git.reviewboard.kde.org/r/125094/
[ams-patch]: https://phabricator.kde.org/D2370
