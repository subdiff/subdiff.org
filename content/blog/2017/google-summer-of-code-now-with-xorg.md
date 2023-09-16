---
title: "Google Summer of Code - now with X.Org"
date: 2017-06-16 12:00:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xserver
  - xwayland
series: false
cover_image: ./assets/2017-06-16-google-summer-of-code-now-with-xorg.jpg
canonical_url: false
description: "One of my project ideas got accepted to Google Summer of Code and I now have the opportunity to work on a very interesting project concerning Xwayland for the X.Org Foundation."
authors: [roman-gilg]
---
There is a saying that persistence is the key to success. Not that I'm always following this advice, but I did luckily earlier this year when I had to decide if I wanted to apply again for a [Google Summer of Code][gsoc] (GSoC) spot after my application in the last year was rejected by my organisation of choice back then. I talked about it in [one](../2016/kde-what-have-i-done) of my last posts. Anyway, thanks to being persistent this year one of my project ideas got accepted and I now have the opportunity to work on a very interesting project concerning Xwayland, this time for the X.Org Foundation.

The [project][gsoc-project] is kind of difficult though. At least it feels this way to me right now, after I've already spent quite some time on digging into it and getting a feel for it.

The main reason for the difficulty is, that various components of the XServer are in play and documentation for them is most often missing. Would I be on my own, I could basically only work with the code and try to comprehend the steps done one after the other. I'm not on my own though! With Daniel Stone I have one of the core developers of several key parts of the Linux graphic stack as my mentor, who seems to really want to help me to understand the difficult stuff on a large scale and still gives concrete advice on what to do next. He even drew a diagram for me!

I plan on publishing in future blog posts resources like this otherwise clearly underused diagram, since such material to understand the XServer code is otherwise only sparsely to find on the web. Additionally I'll try to explain the idea of my project and the general structure of the code I'm dealing with in my own words. Regarding these future posts a nasty surprise for me was this week, that it's expected from me to publish one blog post per week about my project. This somewhat spoils my plans for this blog, where I wanted to publish very few but in comparison more sophisticated posts. Nevertheless you can therefore expect to have frequent weekly posts until August. Next week I want to explain the basic idea of my project.

[gsoc]: https://summerofcode.withgoogle.com
[gsoc-project]: https://summerofcode.withgoogle.com/projects/#6137065216409600
