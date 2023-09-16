---
title: "Understanding Xwayland - Part 1 of 2"
date: 2017-06-23 14:00:00
tags:
  - coding
  - gsoc
  - freedesktop
  - xserver
  - xwayland
  - kwin
series: false
cover_image: ./assets/2017-06-23-understanding-xwayland-part-1.jpg
canonical_url: false
description: "In this week's article for my ongoing Google Summer of Code (GSoC) project I give an overview of XWayland's inner working."
authors: [roman-gilg]
---
In this week's article for my ongoing Google Summer of Code (GSoC) project I planned on writing about the basic idea behind the project, but I reconsidered and decided to first give an overview on how Xwayland functions on a high-level and in the next week take a look at its inner workings in detail. The reason for that is, that there is not much Xwayland documentation [available][xwayland-doc] right now. So these two articles are meant to fill this void in order to give interested beginners a helping hand. And in two weeks I'll catch up on explaining the project's idea.

As we go high level this week the first question is, what is Xwayland supposed to achieve at all? You may know this. It's something in a Wayland session ensuring that applications, which don't support Wayland but only the old Xserver still function normally, i.e. it ensures backwards compatibility. But how does it do this? Before we go into this, there is one more thing to talk about, since I called Xwayland only *something* before. What is Xwayland exactly? How does it look to you on your Linux system? We'll see in the next week that it's not as easy to answer as the following simple explanation makes it appear, but for now this is enough: It's a single binary containing an Xserver with a special backend written to communicate with the Wayland compositor active on your system - for example with KWin in a Plasma Wayland session.

To make it more tangible let's take a look at Debian: There is a [package][debian-xwayland] called *Xwayland* and it consists of basically only the aforementioned binary file. This binary gets copied to `/usr/bin/Xwayland`. Compare this to the normal Xserver provided by X.org, which in Debian you can find in the package [xserver-xorg-core][debian-xorg-xserver]. The respective binary gets put into `/usr/bin/Xorg` together with a symlink `/usr/bin/X` pointing to it.

While the latter is the central building block in an X session and therefore gets launched before anything else with graphical output, the Xserver in the Xwayland binary works differently: It is embedded in a Wayland session. And in a Wayland session the Wayland compositor is the central building block. This means in particular that the Wayland compositor also takes up the role of being the server, who talks to Wayland native applications with graphical output as its clients. They send request to it in order to present their painted stuff on the screen. The Xserver in the Xwayland binary is only a necessary link between applications, which are only able to speak to an Xserver, and the Wayland compositor/server. Therefore the Xwayland binary gets launched later on by the compositor or some other process in the workspace. In Plasma it's launched by KWin after the compositor has initialized the rendering pipeline. You find the relevant code [here][kwin-xwayland-start].

Although in this case KWin also establishes some communication channels with the newly created Xwayland process, in general the communication between Xwayland and a Wayland server is done by the normal Wayland protocoll in the same way other native Wayland applications talk to the compositor/server. This means the windows requested by possibly several X based applications and provided by Xwayland acting as an Xserver are translated at the same time by Xwayland to Wayland compatible objects and, acting as a native Wayland client, send to the Wayland compositor via the Wayland protocol. These windows look to the Wayland compositor just like the windows - in Wayland terminology *surfaces* - of every other Wayland native application. When reading this keep in mind, that an application in Wayland is not limited to using only one window/surface but can create multiple at the same time, so Xwayland as a native Wayland client can do the same for all the windows created for all of its X clients.

In the second part next week we'll have a close look at the Xwayland code to see how Xwayland fills its role as an Xserver in regards to its X based clients and at the same time acts as a Wayland client when facing the Wayland compositor.

[xwayland-doc]: https://wayland.freedesktop.org/xserver.html
[debian-xwayland]: https://packages.debian.org/en/sid/xwayland
[debian-xorg-xserver]: https://packages.debian.org/en/sid/xserver-xorg-core
[kwin-xwayland-start]: https://cgit.kde.org/kwin.git/tree/main_wayland.cpp#n322
