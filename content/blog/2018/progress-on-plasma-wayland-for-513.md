---
title: "Progress on Plasma Wayland for 5.13"
date: 2018-04-21 23:30:00
tags:
  - kde
  - plasma
  - wayland
series: false
cover_image: ./assets/2018-04-21-progress-on-plasma-wayland-for-513.jpg
canonical_url: false
description: "Since the Plasma 5.13 beta is now less than one month away it is time for a status report on what has been achieved and what we still plan to work on."
authors: [roman-gilg]
---
In February after Plasma 5.12 was released we held a [meeting][wayland-meeting] on how we want to improve Wayland support in Plasma 5.13. Since its beta is now less than one month away it is time for a status report on what has been achieved and what we still plan to work on.

Also today started a week-long Plasma Sprint in Berlin, what will hopefully accelerate the Wayland work for 5.13. So in order to kick-start the sprint this is a good opportunity to sum up where we stand now.

### QT_QPA_PLATFORM
Let us start with a small change, but with huge implications: the decision to not set the environment variable `QT_QPA_PLATFORM` to `wayland` anymore in Plasma's startup script.

Qt based applications use this environment variable to determine the platform plugin they should load. The environment variable was set to `wayland` in Plasma's Wayland session in order to tell Qt based applications that they should act like Wayland native clients. Otherwise they load the default plugin, which is `xcb` and means that they try to be X clients in a Wayland session.

This also works, thanks to *Xwayland*, but of course in a Wayland session we want as many applications to be Wayland native clients as possible. That was probably the rationale behind setting the environment variable in the first place. The problem is though, that this is *not* always possible. While KDE applications are compiled with the Qt Wayland platform plugin, some third-party Qt applications were not. A prominent example is the Telegram desktop client, which would just give up on launch in a Wayland session because of that.

With the change this is no longer a problem. Not being forced in its `QT_QPA_PLATFORM` environment variable to some unavailable plugin the Telegram binary will just execute using the `xcb` plugin and therefore run as Xwayland client in our Wayland session.

One drawback is that this now applies to *all* Qt based applications. While the Plasma processes were adjusted to now be able to select the Wayland plugin themselves based on session information other applications might not although the `wayland` plugin might be availale and then still run as Xwayland clients. But this problem might go away with Qt 5.11, which is supposed to either [change][qt-review-qpa] the behavior of `QT_QPA_PLATFORM` itself or feature a [new environment variable][qt-review-qpas] such that an application can express preferences for plugins and fallback if to the first supported one by the session.

Martin Flöser, who wrote most of the patches for this change, talked about it and the consequences in [his blog][martin-blog] as well.

### Screencasts
A huge topic on Desktop Wayland was screen recording and sharing. In the past application developers had a single point of entry to write for in order to receive screencasts: the XServer. In Wayland the compositor as Wayland server has replaced the XServer and so an application would need to talk to the compositor if it wants access to screen content.

This rightfully raised the fear that now developers of screencast apps would need to write for every other Wayland compositor a different backend to receive video data. As a spoiler: luckily this won't be necessary.

So how did we achieve this? First of all support for screencasts had to be added to KWin and KWayland. This [was][D1230] [done][D1231] by Oleg Chernovskiy. While this is still a KWayland specific interface the trick was now to proxy via [xdg-desktop-portal][xdg-desktop-portal] and [PipeWire][pipewire]. Jan Grulich jumped in and [implemented][D10965] the necessary backend code on the xdg-desktop-portal side.

A screencast app therefore in the future only needs to talk with xdg-desktop-portal and receive video data through PipeWire on Plasma Wayland. Other compositors then will have to add a similar backend to xdg-desktop-portal as it was done by Jan, but the screencast app stays the same.

### Configure your mouse
I wrote a system settings module (KCM) for touchpad configuration on Wayland last year. The touchpad KCM had higher priority than the Mouse KCM back then because there was no way to configure anything about a touchpad on Wayland, while there was a small hack in KWin to at least control the mouse speed.

Still this was no long term solution in regards to the Mouse KCM, and so I wrote a libinput based Wayland Mouse KCM similar to the one I wrote for touchpads.

:img-cap{src="assets/progress-on-plasma-wayland-for-513-wayland-mouse-kcm.png" cap="Wayland Mouse KCM"}

I went one step further and made the Mouse KCM interact with Libinput on X as well. There was some work on this in the Mouse KCM done in the past, but now it features a fitting Ui like on Wayland and uses the same backend abstraction.

### Dmabuf-based Wayland buffers
Fredrik Höglund [uploaded][D10747] [patches][D10750] for review to add support for dmabuf-based Wayland buffer sharing. This is a somewhat technical topic and will not directly influence the user experience in 5.13. But it is to see in the context of bigger changes upstream in Wayland, X and Mesa. The keyword here is *buffer modifiers*. You can read more about them in [this article][collabora-blog-new-era-2] by Daniel Stone.

### Per output color correction
Adjusting the colors and overall gamma of displays individually is a feature, which is quite important to some people and is provided in a Plasma X session via KGamma in a somewhat simplistic fashion.

Since I wrote Night Color as a replacement for Redshift in our Wayland session not long ago I was already somewhat involved in the color correction game.

But this game is becoming increasingly more complex: my current solution for per output color correction includes changes to KWayland, KWin, libkscreen, libcolorcorrect and adds a KCM replacing KGamma on Wayland to let the user control it.

Additionally there are different opinions on how this should work in general and some explanations by upstream more confused me than guided me to the one best solution. I will most likely ignore these opinions for the moment and concentrate on the one solution I have at the moment, which might already be sufficient for most people. I believe it will be actually quite nice to use, for example I plan to provide a color curve widget borrowed from Krita to set the color curves via some control points and curve interpolation.

### More on 5.13 and beyond
In the context of per output color correction another topic, which I am working on right now, is [abstracting][D11781] our output classes in KWin's Drm and Virtual backends to the compositing level. This will first enable my color correction code to be nicely integrated and I anticipate in the long term will be even necessary for two other far more important topics: layered rendering and compositing per output, what will improve performance and allow different refresh rates on multi-monitor setups. But these two tasks will need much more time.

Scaling on Wayland can be done per output and while I am no expert on this topic from what I heard because of that and for other reasons scaling should work much better on Wayland than on X. But there is currently one huge drawback in our Wayland session: we can only scale integer factors. To change this David Edmundson has posted patches for review adding support for xdg-output [to KWayland][D12235] and [to KWin][D12243]. This is one step in allowing fractional scaling on Wayland. There is more to do according to Davd and since he takes part in the sprint I hope we can talk about scaling on Wayland extensively in order for me to better understand the current mechanism and what all needs to be changed in order to provide fractional scaling.

At last there is cursor locking, which is in theory supported by KWin, but in practice does not work well in the games I tried it with. I hope to start work on this topic before 5.13, but I will most likely not finish it for 5.13.

So overall there is lots of progress, but still quite some work to do. In this regard I am certain the Plasma Sprint this week will be fruitful. We can discuss problems, exchange knowledge and simply code in unity (no pun intended). If you have questions or feedback that you want us to address at this sprint, feel free to comment this article.

[wayland-meeting]: https://mail.kde.org/pipermail/plasma-devel/2018-February/081015.html
[martin-blog]: https://blog.martin-graesslin.com/blog/2018/03/unsetting-qt_qpa_platform-environment-variable-by-default/
[qt-review-qpa]: https://codereview.qt-project.org/#/c/220294/
[qt-review-qpas]: https://codereview.qt-project.org/#/c/224330/
[D1230]: https://phabricator.kde.org/D1230
[D1231]: https://phabricator.kde.org/D1231
[xdg-desktop-portal]: https://github.com/flatpak/xdg-desktop-portal
[pipewire]: https://pipewire.org/
[D10965]: https://phabricator.kde.org/D10965
[D10747]: https://phabricator.kde.org/D10747
[D10750]: https://phabricator.kde.org/D10750
[collabora-blog-new-era-2]: https://www.collabora.com/news-and-blog/blog/2018/03/23/a-new-era-for-linux-low-level-graphics-part-2/
[D11781]: https://phabricator.kde.org/D11781
[D12235]: https://phabricator.kde.org/D12235
[D12243]: https://phabricator.kde.org/D12243
