---
title: "Universal Means to Specific Ends"
date: 2020-09-25 20:00:00
tags:
 - kwinft
 - disman
 - kde
 - kdisplay
 - kscreen
 - wlroots
series: false
cover_image: ./assets/2020-09-25-universal-means-to-specific-ends.jpg
canonical_url: false
description: "Today's beta release of KWinFT features a fundamental upgrade to Disman making it a truly universal display management solution not only for KWinFT and KDE Plasma but for a multitude of other desktop environments and window managers too."
authors: [roman-gilg]
---
Today new beta versions for all KWinFT projects
– that are KWinFT, Wrapland, Disman and KDisplay –
were released.
With that we are on target for the full release
which is aligned with Plasma 5.20 on October 13.

Big changes will unquestionable come to *Disman*,
a previously stifled library for display management,
which now learns to stand on its own feet
providing universal means for the configuration of displays
with different windowing systems and Wayland compositors.

But also for the compositor *KWinFT* a very specific
yet important feature got implemented
and a multitude of stability fixes and code refactors
were accomplished.

In the following we will do a deep dive into
reasons and results of this recent efforts.

For a quick overview of the work on Disman
you can also watch this [lightning talk][xdc-disman]
that I held at the virtual XDC 2020 conference last week.

## Universal Display Management With Disman

It was initially not planned like this
but [Disman][disman] and [KDisplay][kdisplay]
were two later additions to the KWinFT project.


The projects were forked from libkscreen and KScreen respectively
and I saw this as an opportunity to completely rethink and
in every sense overhaul these in the past rather lackluster
and at times completely neglected components
of the KDE Plasma workspace.
This past negligence is rather tragic
since the complaints about miserable output management
in KDE Plasma go back as long as one can think.
Improving this bad state of affairs was my main motivation
when I started working on libkscreen and KScreen
around two years ago.

In my opinion a well functioning
– not necessarily fancy but for sure robust –
display configuration system
is a cornerstone of a well crafted desktop system.
One reason for that is how prevalent multi-display setups are
and another how immeasurable annoying it is
when you can't configure the projector correctly
this one time you have to give a presentation
in front of a room full of people.

Disman now tries to solve this
by providing a solution not only for KWinFT
or the KDE Plasma desktop alone
but for any system running X11 or any Wayland compositor.

### Moving Logic and Ideas
Let us look into the details of this solution
and why I haven't mentioned KDisplay yet.
The reason for this omission is
that KDisplay from now on will be a husk of its former self.

#### Ancient Rituals
As a fork of KScreen no longer than one month ago
KDisplay was still the logical center of any display configuration
with an always active KDE daemon (KDED) module
and a KConfig module (KCM) integrated to the KDE System Settings.

The KDED module was responsible
for reacting to display hot-plug events,
reading control files
of the resulting display combination from the user directory,
generating optimal configurations if none to be found
and writing new files to the hard disk
after the configuration has been applied successfully
to the windowing system.

In this work flow Disman was only relevant
as a provider of backend plugins
that were loaded at runtime.
Disman was used either in-process
or through an included D-Bus service
that got automatically started
whenever the first client tried to talk to it.
According to the [commit][commit-d-bus]
adding this out-of-process mode five years ago
the intention behind it was
to improve performance and stability.
But in the end on a functional level
the service was doing not much more
than forwarding data between
the windowing system and the Disman consumers.

#### Break With Tradition

Interestingly the D-Bus service was only
activatable with the X11 backend
and was explicitly disabled on Wayland.
When I noticed this
I was first tempted to [remove the D-Bus service][remove-d-bus]
in the all eternal struggle
to reduce code complexity.
And after all
if the service is not used on Wayland
we might not need it at all.

But some time later I realized
that this D-Bus service must be appreciated
in a different way than for its initial reasoning.
From a different point of view
this service could be the key
to a much more ambitious grand solution.

The service allows us to serialize and synchronize access
of arbitrary many clients  in a transparent way
while moving all relevant logical systems
to a shared central place
and providing per client a high level
of integration with those systems.

Concretely does this mean
that the Disman D-Bus service becomes an independent entity.
Once being invoked by a single call from a client,
for example by the included command line utility with `dismanctl -o`
the service reads and writes all necessary control files on its own.
It generates optimal display configurations
if no files are found
and even can disable a laptop display in case the lid was closed
while an external output is connected.

In this model Disman consumers solely provide user interfaces
that are informed about the generated or loaded current config
and that can modify this config additionally if desirable.
This way the consumer can concentrate
on providing a user interface
with great usability and design
and leave to Disman all the logic
of handling the modified configuration afterwards.

Making it easy to add other clients is only one advantage.
On a higher level this new design has two more.

#### Auxiliary Data
I noticed already last year
that some basic assumptions in KScreen were questionable.
Its internal data logic relied on a round trip
through the windowing system.

This meant in practice
that the user was supposed
to change display properties
via the KScreen KCM.
These were then sent to the windowing system
which tried to apply them to the hardware.
Afterwards it informed the KScreen KDE daemon
through its own specific protocols
and a libkscreen backend about this new configuration.
Only the daemon then would write
the updated configuration to the disk.

Why it was done this way is clear:
we can be sure
we have written a valid configuration to the disk
and by having only the daemon do the file write
we have the file access logic in a single place
and do not need to sync file writes
of different processes.

But the fundamental problem of this design is
that we sometimes need to share additional information
about our display configuration
for sensible display management
not being of relevance to the windowing system
and because of that can not be passed through it.

A simple example is when a display is auto-rotated.
Smartphones and tablets but also many convertibles
come with orientation sensors
to auto-rotate the built-in display
according to the current device orientation.
When auto-rotation is switched on or off in the KCM
it is not sent through the windowing system
but the daemon or another service needs to know
about such a change in order
to adapt the display rotation correctly
with later orientation changes.

A complex but interesting other example is
the *replication* of displays,
also often called *mirroring*.
When I started work on KScreen two years ago
the mechanism was painfully primitive:
one could only duplicate all displays at once
and it was done by moving all of them to the same position
and then changing their display resolutions
hoping to find some sufficiently alike
to cover a similar area.

Obviously that had several issues,
the worst in my opinion was
that this won't work for displays with different aspect ratios
as I noticed quickly after I got myself a 16:10 display.
Another grave issue was that displays might not run at their full resolution.
In a mixed DPI setup the formerly HiDPI displays
are downgraded to the best resolution common with the LoDPI displays.

The good news is that on X11 and also Wayland methods are available
to replicate displays without these downsides.

On X11 we can apply arbitrary linear transformations to an output.
This solves both issues.

On Wayland all available output management protocols at minimum allow
to set a singular floating point value to *scale* a display.
This solves the mixed DPI problem
since we can still run both displays at an arbitrary resolution
and adapt the *logical size* of the replica through its scale.
If the management protocol provides a way
to even specify the logical size directly
like the [KWinFT protocol does][kwinft-output-manage-logical-size]
we can also solve the problem of diverging display aspect ratios.

From a bird's eye view in this model
there are one or multiple displays
that act as *replicas* for a single *source* display.
Only the transformation, scale or logical size of the replicas is changed,
the source is the invariant.
The important information to remember is therefore for each display solely
if there is a replication source that the display is a replica to.
But neither in X11 nor in any Wayland compositor
this information is conveyed via the windowing system.

With the new design we send all configuration data
including such auxiliary data to the Disman D-Bus service.
The service will save all this data to a configuration-specific file
but send to the windowing system only a relevant subset of the data.
After the windowing system reports that the configuration was applied
the Disman service informs all connected clients about this change
sending the data received from the windowing system
augmented by the auxiliary data
that had not been passed through the windowing system.

This way every display management client receives all relevant data
about the current configuration including the auxiliary data.

The motivation to solve this problem
was the [original driving force][disman-issue-auxiliary-data]
behind the large redesign of Disman
that is coming with this release.

But I realized soon that this redesign also has another advantage
that long-term is likely even more important than the first one.

#### Ready For Everything That Is Not KDE Plasma Too

With the new design
Disman becomes a truly universal solution for display management.

Previously a running KDE daemon process
with KDisplay's daemon module inserted was required
in order to load a display configuration on startup
and to react to display hot-plug events.
The problem to this is that
the KDE daemon commonly only makes sense to run
on a KDE Plasma desktop.

Thanks to the new design the Disman D-Bus service
can now be run as a standalone background service
managing all your displays permanently,
even if you don't use KDE Plasma.

In a non-Plasma environment like a Wayland session with [sway][swaywm]
this can be achieved
by simply calling once `dismanctl -o` in a startup script.

On the other side the graphical user interface
that KDisplay provides
can now be used to manage displays on any desktop
that Disman runs on too.
KDisplay does not require the KDE System Settings to be installed
and can be run as a standalone app.
Simply call `kdisplay` from command line
or start it from the launcher of your desktop environment.

KDisplay still includes a now absolutely gutted KDE daemon module
that will be run in a Plasma session.
The module basically only launches the Disman D-Bus service
on session startup anymore.
So in a Plasma session after installation of Disman and KDisplay
everything is directly setup automatically.
In every other session as said
a simple `dismanctl -o` call at startup is enough
to get the very same result.

Maybe the integration in other sessions than Plasma could be improved
to even make setting up this single call at startup unnecessary.
Should Disman for example install a systemd unit file
executing this call by default?
I would be interested in feedback in this regard
in particular from distributions. What do they prefer?

## KWinFT and Wrapland Improved in Selected Areas

With today's beta release
the greatest changes come to Disman and KDisplay.
But that does not mean [KWinFT][kwinft] and [Wrapland][wrapland]
have not received some important updates.

### Outputs All the Way
The ongoing work on Disman
and by that on displays
– or *outputs*
as they are called in the land of window managers –
stability and feature patches for outputs
naturally came to Wrapland and KWinFT as well.
A large refactor was the [introduction][master-output-class]
of a master output class on the server side of Wrapland.
The class acts as a central entry point for compositors
and deals with the different
output related protocol objects internally.

Having this class in place
it was rather easy to add support for
[xdg-output][xdg-output] version 2 and 3 afterwards.
In order to do that it was also reasonable
to [re-evaluate][output-identify] how
we provide output identifying metadata
in KWinFT and Wrapland in general.

In regards to output identification
a happy coincidence was
that Simon Ser of the wlroots projects
had been [asking himself][wlr-protocols-outputs]
the very same questions already in the past.

I concluded that Simon's
plan for wlroots was spot on
and I decided to help them out a bit
with patches for [wlr-protocols][wlr-protocols-patch]
and [wlroots][wlroots-patch].
In the same vein I [updated][wrapland-output-info]
Wrapland's output device protocol.
That means Wrapland and wlroots based compositors feature
the very same way of identifying outputs now
what made it easy
to provide full support for both in Disman.

### Presentation Timings

This release comes with support
for the [presentation-time][presentation-time-protocol] protocol.

It is one of only three Wayland protocol extensions
that have been officially declared stable.
Because of that supporting it
felt also important in a formal sense.

Primarily though it is essential
to my ongoing work on Xwayland.
I [plan to make use][xwl-present-time]
of the presentation-time protocol in Xwayland's
Present extension [implementation][xwl-present].

With the support in KWinFT I can test
future presentation-time work in Xwayland
now with KWinFT and sway
as wlroots also supports the protocol.
Having two different compositors for alternative testing
will be quite helpful.

## Try Out the Beta

If you want to try out the new beta release of Disman
together with your favorite desktop environment
or the KWinFT beta as a drop-in replacement for KWin
you have to compile from source at the moment.
For that use the *Plasma/5.20* branches
in the respective repositories.

For Disman there are some limited instructions on how to compile it
in the [Readme file][disman-installation].

If you have questions or just want to chat about the projects
feel free to join the official KWinFT [Gitter channel][gitter-kwinft].

If you want to wait for the full release
check back on the release date, October 13.
I plan to write another article to that date
that will then list all distributions
where you will be able to install the KWinFT projects
comfortably by package manager.

That is also a call to distro packagers:
if you plan to provide packages for the KWinFT projects on October 13
get in touch to get support and be featured in the article.


[commit-d-bus]: https://gitlab.com/kwinft/disman/-/commit/a127049ba5ec840c18c5be19f039fc52bcecf5e4
[disman]: https://gitlab.com/kwinft/disman
[disman-installation]: https://gitlab.com/kwinft/disman#installation
[disman-issue-auxiliary-data]: https://gitlab.com/kwinft/disman/-/issues/6
[gitter-kwinft]: https://gitter.im/kwinft/community
[kdisplay]: https://gitlab.com/kwinft/kdisplay
[kwinft]: https://gitlab.com/kwinft/kwinft
[kwinft-output-manage-logical-size]: https://gitlab.com/kwinft/wrapland/-/blob/6c62177f/src/client/protocols/kwinft-output-management-unstable-v1.xml#L154-175
[master-output-class]: https://gitlab.com/kwinft/wrapland/-/merge_requests/72
[output-identify]: https://gitlab.com/kwinft/disman/-/issues/20
[presentation-time-protocol]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/master/stable/presentation-time/presentation-time.xml
[remove-d-bus]: https://gitlab.com/kwinft/disman/-/issues/2
[swaywm]: https://swaywm.org
[wlr-protocols-outputs]: https://github.com/swaywm/wlr-protocols/issues/68
[wlr-protocols-patch]: https://github.com/swaywm/wlr-protocols/pull/98
[wlroots-patch]: https://github.com/swaywm/wlroots/pull/2392
[wrapland]: https://gitlab.com/kwinft/wrapland
[wrapland-output-info]: https://gitlab.com/kwinft/wrapland/-/merge_requests/75
[xdc-disman]: https://youtu.be/C3gltQa-SiM?t=18437
[xdg-output]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/master/unstable/xdg-output/xdg-output-unstable-v1.xml
[xwl-present]: https://gitlab.freedesktop.org/xorg/xserver/blob/master/hw/xwayland/xwayland-present.c
[xwl-present-time]: https://gitlab.freedesktop.org/xorg/xserver/-/issues/971
