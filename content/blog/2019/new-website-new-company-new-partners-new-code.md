---
title: "New Website, New Company, New Partners, New Code"
date: 2019-06-21 10:00:00
tags:
  - internal affairs
  - plasma
series: false
cover_image: ./assets/2019-06-21-new-website-new-company-new-partners-new-code.jpg
canonical_url: false
description: "The obvious change to announce is the new website design. But there is much more to talk about."
authors: [roman-gilg]
---
The obvious change to announce is the new website design. But there is much more to talk about.

### Website Overhaul
The old website, reachable primarily on the domain [subdiff.de][subdiff.de], was a pure blog built with Jekyll and the design was some random theme I picked up on GitHub. It was a quick thing to do back in the days when I needed a blog up fast for community interaction as a KWin and Plasma developer.

But on the back burner my goal was already for quite some time to rebuild the website with a more custom and professional design. Additionally I wanted this website to not only be a blog but also a landing page with some general information about my work. The opportunity arose now and after several months of research and coding I finished the website rebuild.

This all needed longer because it seemed to me like an ideal occasion to learn about modern web development techniques and so I didn't settle for the first plain solution I came across but invested some more time into selecting and learning a suitable technology stack.

In the end I decided to use [Gridsome][gridsome], a static site generator leveraging [Vue.js][vue] for the frontend and [GraphQL][graphql] as data backend when generating the site. By that Gridsome is a prime example of the [JAMstack][jamstack], a most modern and very sensible way of building small to medium sized websites with only few selected dynamic elements through JavaScript APIs while keeping everything else static.

After all that learning, decision taking and finally coding I'm now really happy with this solution and I definitely want to write in greater detail about it in the future.

Feature-wise the current website provides what I think are the necessary basics and it could still be extended in several ways, but as for now I will stick to these basics and only look into new features when I get an urge to do it.

### Freelancer Business
Since January I work as a freelancer. This means in Germany that I basically had to start a company, so I did that.

I called it *subdiff : software system*, and the brand is still the domain name you are currently browsing. I used it already before as this website's domain name and as an online nickname. It is derived from a mathematical concept and on the other side stands for a slogan I find sensible on a practical level in work and life:

> Subtract the nonsense, differentiate what's left.

### Part of Valve's Open Source Group
As a freelancer I am contracted by Valve to work on certain gaming-related XServer projects and improve KWin in this regard and for general desktop usage.

In the XServer there are two main projects at the moment. The technical details of one of them are currently discussed on a work-in-progress patch series [on Gitlab][xserver-composite-accel-patch] but I want to write accessible articles about both projects here on the blog as well in the near future.

In KWin I have several large projects I will look into, which would benefit KWin on X11 and Wayland alike. The most relevant one is [reworking the compositing pipeline][phab-comp-rework]. You can expect more info about this project and the other ones in KWin in future blog posts too.

### New Code
While there are some big projects in the pipeline I was also able to commit some major changes in the last few months to KWin and Plasma.

The largest one was for sure [XWayland drag-and-drop support][xwl-dnd] in KWin. But in best case scenario the user won't even notice this feature because drag-and-drop between any relevant windows will just work from now on in our Wayland session. Inside KWin though the technical solution enabling this was built up from the ground. And in a way such that we should be able to later support something like middle-click-paste between XWayland and Wayland native windows easily.

There were two other major initiatives by me that I was able to merge: the finalization of basing every display representation in KWin on the generic `AbstractOutput` class and in Plasma's display management library, daemon and settings panel to [save display-individual values][kscreen-patch] in a consistent way by introducing a new communication channel between these components.

While the results of both enhancements are again supposed to be unnoticeable by the user but should improve the code structure and increase the overall stability there is more work lined up for display management which then will directly affect the interface. Take a look at [this task][display-further-work-task] to see what I have planned.

So there is interesting work ahead. Luckily this week I am with my fellow KWin and Plasma developers at the Plasma and Usability sprint in Valencia to discuss and plan work on such projects.

The sprint officially started yesterday and the first day already was very productive. We strive to keep up that momentum till the end of the sprint next week and I plan on writing an article about the sprint results afterwards. In the meantime you can follow [@kdecommunity][twitter-kdecommunity] on Twitter if you want to receive timely updates on our sprint while it's happening.

### Final Remarks and Prospect
I try to keep the articles in this blog rather prosaic and technical but there are so many things moving forward and evolving right now that I want to spend a few paragraphs in the end on the opposite.

In every aspect there is just immense *potential* when looking at our open source graphics stack consisting of KDE Plasma with KWin, at the moment still good old X but in the future Wayland, and the Linux graphics drivers below.

While the advantages of free and open source software for the people were always obvious, how rapidly this type of software became the backbone of our global economy signifies that it is immensely valuable for companies alike.

In this context the opportunities on how to make use of our software offerings and improve them are endless while the technical challenges we face when doing that are interesting. By this we can do our part such that the open source community will grow and foster.

As a reader of these sentences you are already in a prime position to take part in this great journey as well by becoming an active member of the community through contributing.

Maybe you already do this for example by coding, designing, researching, donating or just by giving us feedback on how our technology can become better. But if you are not yet, this is a great time to get involved and bring in your individual talents and motivation to build up something great together for ourselves and everybody.

You can find out more on how to do that by visiting KDE's [Get Involved page][kde-involved] or join in on the ongoing discussion about KDE's [future goals][goals-blog].

[subdiff.de]: https://subdiff.de
[gridsome]: https://gridsome.org
[vue]: https://vuejs.org
[graphql]: https://graphql.org
[jamstack]: https://jamstack.org
[xserver-composite-accel-patch]: https://gitlab.freedesktop.org/xorg/xserver/merge_requests/211
[phab-comp-rework]: https://phabricator.kde.org/T11071
[xwl-dnd]: https://phabricator.kde.org/R108:548978bfe1f714e51af6082933a512d28504f7e3
[kscreen-patch]: https://phabricator.kde.org/T10028
[display-further-work-task]: https://phabricator.kde.org/T11095
[twitter-kdecommunity]: https://twitter.com/kdecommunity
[kde-involved]: https://community.kde.org/Get_Involved
[goals-blog]: http://blog.lydiapintscher.de/2019/06/09/evolving-kde-lets-set-some-new-goals-for-kde/
