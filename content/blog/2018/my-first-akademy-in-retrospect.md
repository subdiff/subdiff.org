---
title: "My First Akademy in Retrospect"
date: 2018-09-09 11:00:00
tags:
  - kde
  - conference
  - akademy
series: false
cover_image: ./assets/2018-09-09-my-first-akademy-in-retrospect.jpg
canonical_url: false
description: "Last month KDE Akademy was held in Vienna. It was the first Akademy I visited and there wasn't yet time to write a bit about the impression I got from it. Time to catch up on that."
authors: [roman-gilg]
---
Last month KDE Akademy was held in Vienna. It was the first Akademy I visited and there wasn't yet time to write a bit about the impression I got from it, judging what was nice and what could be improved from the point of view of someone new to it. Time to catch up on that.

Akademy came at a bad point in time for me. I was right in the middle of writing code for a larger feature in KWin's Wayland session: drag-and-drop support between Wayland native and Xwayland windows. When I began the work on this feature back in July I hoped that I could finish it until Akademy. Not being able to do so felt demotivating, but I have to admit my plan was way too optimistic anyways. Only now, several weeks after Akademy, I feel comfortable enough about my code to use it on my work system without constant anxiety for fatal session crashes. But anyway, I went to my first Akademy with a bit less enthusiasm, as I otherwise probably would have shown. On the other side this gives me maybe also a more neutral take on it.

Akademy is basically split into two phases: the talks at the beginning on Saturday and Sunday and the BoFs for the rest of the time from Monday till Friday.

### The Talks
This is basically what you expect from a conference. Talks by people involved in the community or friends from the outside about different topics related to KDE. And these topics were very different indeed, what shows how large the KDE community and its reach really is. Often KDE is identified with the desktop environment Plasma alone, but there is much more to it. Having this kind of diversity in topics is a great plus to Akademy.

Still one has to say that Plasma is KDE's flagship offering and by that deserves a central spot in the lineup. So judging from a Plasma dev point of view was this the case at this Akademy? That's difficult to judge. There were interesting longer talks by [David][dave-talk] and [Nate][nate-talk] about the core Plasma Desktop experience, David's talk technical, Nate's talk on a broader more visionary note they both presented a path forward for Plasma. There were also talks about Plasma in other contexts, for example by Bhushan about [Plasma on Mobile][bhushan-talk].

So judging by quantity there were enough Plasma talks I would say. Also I can't really complain, since I personally did not contribute to increasing the quantity by submitting a talk proposal myself. The reason was just that on my first Akademy I wanted to be a listener only. So let us say quantity was fine and quality from what I can tell as a listener as well.

Still there was a distinct feel of too few, too disconnected, and I believe especially *too disconnected* describes it correctly, not only in regards to Plasma. The talks were spread out over two days in two different sized rooms somewhat randomly. There was no noticeable order to them or a grand arc connecting them besides being somewhat KDE related. One could argue this is a direct result of the KDE community being so diverse in interests and topics. But I believe with good planning by some key figures from the different parts of the community the talks could have been placed better and feel less disjointed. Also more relevant key notes would have helped. They could have provided for example an overarching focus point of the conference interconnecting the talks.

### The BoFs
The second part of Akademy were the BoFs, what went for a full workweek. BoF means Birds of a feather and it denotes an informal discussion group about a specific topic. There were many BoFs, often in parallel, and I visited lots of them.

I won't go into detail for all of them, but a general impression I got was that there is no clear definition of what a BoF should be and what should happen. What is kind of the point of a BoF but somewhat still often disappointing. In an extreme case a BoF I visited was more an internal discussion of a team of half a dozen people working closely together and left everybody just interested in learning more about the project on the outside since they did not know enough about the project's internals yet. The BoF itself was not named as such and outsiders visiting out of interest were for sure disappointed. Other BoFs were more welcoming to newcomers, but still lacked a guiding structure or just someone moderating the discussion efficiently.

A plan to improve the BoF sessions could be the following: split them up into a mandatory common / introductory part and an optional team / current progress / special topic part, and advertise them as such to conference attendees. While both parts would still be open to anyone, the common part would be specifically suited for newcomers to the project while the team part can be used to discuss current topics in-depth. This at first sounds like it is double the work for project members, but the common part could be simply some reusable presentation slides explaining the core structure of the project together with a Q&A session. So I believe the additional amount of work is small. Also people would know what they get into and could plan their time efficiently. Besides one person from the team, which would probably most often be the maintainer or project lead, others could avoid the introductory part and newcomers could avoid the team part if they don't yet feel knowledgeable enough to follow the discussion.

### The Organisation
In general I felt the conference was well organized for being done by volunteers, who were by the way super friendly and keen on helping and solving problems. There were a few issues ranging from non-functional printers to a way too small social event site, but they were so minor to not be worth delving into them more.

But there is one large issue that can not be ignored, and this is the availability and quality of videos form the conference. The videos have just been [published][talk-videos] recently and I think this is too late. They should be online not later than one week after Akademy.

And watching these videos is no fun at all. The talk recordings have a low resolution, filmed from way back in the room, and the voice quality often is abysmal. In comparison to last Akademy the vidoes already have improved, but they still lack the quality you would expect from an open tech community having the web as the main communication channel.

As an example what a good recording looks like take a look at [this talk][microsoft-recording] out of the chamber of darkness. I personally would take some of the Pineapple money and pay a team of professionals at next Akademy to record the talks in HD and upload them timely if we can not do it on our own. Enabling people who can not travel to Akademy to watch the presentations pleasantly and the additional exposure are always worth it.

### The Social and Unofficial Program
Of course technical topics are not everything about Akademy. The conference exists also to connect like-minded people and let otherwise semi-anonymous contributors meet each other in person, what often enables them to work better together on KDE projects in the future. Overall for me personally this was fine. I know most of the Plasma devs already and we just had a meeting in Berlin a few months ago. So there was not really that much need to talk in person again, although it helped for some current hot topics of course.

But there were some members of the VDG I was really looking forward to meet in person and the discussions we had were very fruitful. Also it was great to get to know [Carlos][carlos-blog] from the GNOME project. I hope we can improve the collaboration of our communities in term of Wayland in the future. What I missed was talking more with some of the KDE Apps and Frameworks devs. I am not sure why this was. Maybe my personal area of work just does not intersect that much with apps developers at the moment.

### Conclusion
This article was in some parts quite critical to Akademy, but that does not mean the conference was bad. Quite the contrary, I enjoyed meeting all the members and friends of the KDE community and I can recommend going there to anyone from user to maintainer of KDE software. It doesn't matter what kind of KDE offering you use or contribute to, you will find sessions that interest you and people who share that same interest. Next Akademy is in [less than a year][akademy-2019] and I look forward to meeting you there again or for the first time.

[nate-talk]: https://conf.kde.org/en/Akademy2018/public/events/50
[dave-talk]: https://conf.kde.org/en/Akademy2018/public/events/66
[bhushan-talk]: https://conf.kde.org/en/Akademy2018/public/events/28
[talk-videos]: https://www.youtube.com/playlist?list=PLsHpGlwPdtMraXbFHhkFx7-QHpEl9dOsL
[microsoft-recording]: https://youtu.be/cKPlPJyQrt4?t=123
[carlos-blog]: https://csorianognome.wordpress.com/2018/08/24/a-gnome-dev-enters-an-akademy-and
[akademy-2019]: https://dot.kde.org/2018/05/15/akademy-2019-call-hosts
