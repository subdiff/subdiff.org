---
title: "Window Kindergarten"
date: 2021-02-19 15:00:00
tags:
- kwinft
- windowing
series: false
cover_image: ./assets/2021-02-19-window-kindergarten.jpg
canonical_url: false
description: "An introduction to child windows and related ideas, what is an important mental model on X11 just as much as on Wayland."
authors: [roman-gilg]
---
In the last post about KWinFT's [Windowing Revolution](/blog/2021/the-windowing-revolution)
I promised follow-up articles with detailed explorations of two elements of that revolution,
which due to their complexity deserve such.

One of them was a new way how Wayland subsurfaces are managed inside KWinFT.
Accompanying the 5.21 release of KWinFT this week,
which was made available in sync with the KDE Plasma release,
let me live up to my promise and start with an exploration of that.

But since even this topic alone is overly complex
with a lot of windowing history behind it,
we will split it up further
and in this first article only look at subsurfaces and related concepts from a high level
but without yet looking at the new and improved implementation in KWinFT.

On a high level the notions we are dealing with
can always be interpreted
as some form of parent-child relation between windows,
on Wayland just as much as on X11.
We will see that this is a very powerful mental model.

## Childhood Legacy
The idea that a window can have children is old.
**X11** has known that for a long time.
It is in fact a central concept in the protocol
and what it comes down to is a single, global window tree.

This tree,
[stored in the X Server][xserver-traverse-tree],
forms a simple hierarchical structure of all windows
starting with a generic *root window* at the top
while every child window is contained inside its parent.
This means also that the root window spans the whole visible area over all screens.
Child windows on the other hand can be further [partitioned][x11-create-window],
[moved and resized][x11-move-resize-window],
[ordered][x11-stack-window]
and even [switch nodes][x11-reparent-window] in the tree.

:img-cap{src="assets/2021-02-19-child.png" cap='VLC playing a video in another child window.' cap-margin='-30px'}

While the details of that windowing logic can become complex very quickly,
I think the general idea behind the window tree itself is simple to grasp.
You still might want to read the [window tree chapter][xplain-window-tree] in Xplain
to get a feel for it.

Now as you can imagine such a hierarchical structure of windows is not something only X11 employs.
But before we come to Wayland,
there is one more relation between windows on X11,
similar to the parent-child relation in the window tree,
that we should explore.

## Distant Relatives
A second concept of window relation in X11,
is that of *transient windows*.
It is similar to the parent-child relation in the global window tree,
but while an X11 window always has a parent,
with the exception of the root window at the top of the tree,
so in particular is a child to this parent,
transient windows are much less often encountered in the wild.

### Jumping the Tree
The parent-child relation in the window tree is simple to understand.
Transient windows break this model up in some way
and build links between windows across different branches of the tree.
That sounds complicated,
and indeed it sometimes is.
In fact I would argue already their name is misleading.

But before coming to that,
let us first hold onto what is unambiguous.
Windows that are direct children of the root window are special,
they are often called *toplevel windows* because of that.
And a child of such a window is obviously – per this definition – *not* a toplevel window.

Transient windows in general come as toplevel windows.
Seen as part of the window tree,
they are *siblings* of the window they are *transient for*.

:img-cap{src="assets/2021-02-19-transient.png" cap='Dialog as a transient window for the Kate window.'}

Typical examples of such are dialog windows,
shown when your application asks you if you *really* want to do what you just tried to do.
The client sets such a helper-window as a transient for the main window of the application.

The window manager still paints decorations around the transient window
and you can move it by grabbing its window bar,
but the window manager normally ensures
that it can't be stacked below the window,
which the window is a transient for.
And if for example you switch the main application window to a different virtual desktop,
the transient often follows the main window to that other desktop.
This is how KWinFT does it.

### What They Are Transient For
You may have noticed
that I've used in the last paragraphs an awful lot the word construct "transient for".

What defines a window to become transient is not specified in the X11 protocol itself,
but in the *Inter-Client Communication Conventions Manual (ICCCM)*
in the form of a window property [with this very name][icccm-transient-for].

This name feels weird, doesn't it?
Let's try to understand what it means:
A window W<sub>2</sub> has the `WM_TRANSIENT_FOR` property set to another window W<sub>1</sub>
if window W<sub>2</sub> is a transient window for window W<sub>1</sub>.

For example when a file explorer opens a dialog
to ask you for a new name for a directory
that it wants to create,
the dialog window is W<sub>2</sub>
and the file explorer window, that was there before, is W<sub>1</sub>.

That we call such a relation at all transient
comes [according to Wikipedia][transient-wikipedia]
from W<sub>2</sub> only existing as long as W<sub>1</sub> exists.
But child windows in the window tree are also only mapped,
i.e. visible and by that existing in practice,
as long as their parents are mapped.
So why are they not called transient windows too?

In theory also nothing is forcing the user to close the dialog
and instead to keep it around forever.
In the case of a dialog
that wouldn't make much sense from a practical viewpoint,
but there are other clients with permanent transient windows
like a Plasma applet when being "pinned" to stay open.
The bottom line is that this name feels wrong.

And then its indirect nature!
The "transient for" property names a window
that *the other* window with that property is the transient for.
That is difficult to understand
because we usually don't name things
by what another thing does to it.

:img-cap{src="assets/2021-02-19-alfred-krupp.jpg" cap='Alfred Krupp, an important "work for" in the 19th century.'}

For example we don't name the owner of a company the "work for"
if there are employees working in that company.
We say instead that the owner is an employer,
what comes from what the owner is doing to the employees
and not the other way around.

But besides the weird naming scheme
the technicalities are clear:
we set the property to another window
and by that the relation is established.

As you can set the property only once per window,
but for many windows to the same window,
the relation is one-to-many.
That feels natural as it reminds us of a single node with its children in a tree structure.
But the X ecosystem has of course means to generalize that concept
so it becomes far more difficult to understand.

### Group Transients
Complexity rises with the introduction of so-called *group transients*.
They are defined by the *Extended Window Manager Hints (EWMH)* specification in the most ridiculous way,
what warrants a direct quotation:

> If the WM_TRANSIENT_FOR property is set to None or Root window, the window should be treated as a transient for all other windows in the same group. It has been noted that this is a slight ICCCM violation, but as this behavior is pretty standard for many toolkits and window managers, and is extremely unlikely to break anything, it seems reasonable to document it as standard.
>
> &mdash; [EWMH][ewmh-group-transients]

This makes transient relations between windows much more complicated,
as a window might not be transient for a single other window but for many.
With that window transiency is a many-to-many relation.

:img-cap{src="assets/2021-02-19-group-transient.png" cap="A rare example of a group transient: Latte Dock's settings window."}

I have yet to see a use case for group transients
that could not also be solved with normal transients,
but as some X11 clients expect group transients to be a thing,
KWinFT needs to support them.

While this was done in the past in KWin in a separate fashion
basically doubling the implementation cost,
the recent windowing refactor has unified it under a single mechanism
together with usual X11 transients and even all kinds of child windows on Wayland.

But before we finally shift our attention over to Wayland
I have to get some words off my chest about the naming of things.

## Nomenclature in Perpetuity
Naming things is difficult.
Especially technical minded people often underestimate the challenge
just as much as its importance.
In contrast humanities has a long tradition
of describing and criticizing concepts of notions and language.

The importance is emphasised in the German language,
where the word for "notion" is *"Begriff"*,
what is related to *"begreifen"*,
meaning to understand something.
*"Etwas auf den Begriff bringen"* means not only to find a name for something
but to understand it.

When we name something we should remember that,
not only for ourselves,
but also for other people who have to understand and memorize the terminology we defined.
This is important for open source projects
that rely on voluntary contributions
just as much as for companies
as it lowers costs when onboarding new employees.

But that doesn't mean a once established nomenclature has to be perfect.
On the opposite I would say that is impossible and as time moves on
we should verify that the terminology still make sense,
and if not revise it.

The reality though is that this is not often done systematically.
Instead the terminology stays frozen in time
but its meaning shifts naturally over time.
That also is not necessarily an issue
but one should be aware of it
and if the gap between intuitive and original meaning
of a notion becomes too wide
one must consider to redefine or at least annotate it.
And the notions of child windows and transients
are good examples of that.

### Transiently Incomprehensible
We learned above what it means for a window
to be a transient for another window.
This included a short discussion
why "transient for" is a silly name for the window
which is not the transient in this relation.
But that does not answer the question why such an unusual naming scheme was used.

The real story behind it probably only few people alive can tell
as the concept seems to be very old.
But I have a suspicion it went down like this:

1. The way better notion for a transient window,
being a child of some parent window,
was already in use by a different concept and we know by which one:
the window tree.
So a different name had to be invented.
2. The first transient windows were indeed only very short-lived windows,
so it made sense to base the new name on the temporal context.
3. And at last but definitely worst:
while the "child" in that relationship was the transient,
nobody had thought of a name for the counterpart.
So it was just named the "transient for" later on.

That story makes sense to me
as it assumes best intentions and a natural progression to the suboptimal status quo.

### Better Names
The terminology in documents like ICCCM of course won't change anymore,
but here is how I bent the names internally
when referencing them in KWinFT's code
and how I will speak about them in the future.
Also that's some advice on how to name things yourself
if you ever have to do it.

First of "transient for" must go.
With the story above we have an idea
what might have led to the creation of this abomination of a notion.
Let's go back to that.
We said the notion of a child window was already in use,
what would have been the way better notion.
Why?
One reason is obviously because it already comes with a name for its counterpart –
parent.

Another reason is more fundamental:
we directly have an image in our mind
what this notion might mean in purely logical terms.
That it is a relation between a more important primary entity and a secondary, dependent one.
Such images are strong and we should use them whenever possible.

To cut it short in KWinFT's code I just went with the following:
I call windows with transient relationships between them
*transient children* instead of just transients
and *transient lead* instead of transient for.

I opted for "lead" instead of "parent"
because as a group transient
a window might have several transient leads
while the word "parent" would rather signal
that there is only a single one.

## Children of Tomorrow
A lot has been said about child windows on X11 now.
But the interesting technology stack today is **Wayland**.
So is the situation similarly tricky as on X11 with normal children,
transients and group transients?
From my experience luckily that is not the case,
albeit interestingly the basic ideas are remarkably similar.

There is directly one big difference though,
in that there does not exist the concept
of a single global window tree in the Wayland protocol.
In particular there is no root window.
This makes sense because clients don't have any knowledge
about the global state of the compositor.
The compositor itself might implement some form of a global tree
but that is of no relevance to the protocol.

On the other side what was in the past handled inside the X Server
is now the responsibility of the window manager,
in particular managing local replacements
for the previously global window tree
and its parent-child relations in the form of subsurfaces.

### Subsurfaces
The previous all-encompassing system
of parent-child relations via the global window tree
has no equivalence in Wayland anymore
but there is still need in some cases
to have such on a local basis,
that means per window or rather in Wayland terminology per surface.
*Subsurfaces* define objects [in the core protocol][wl-subsurface]
which do exactly that.

Their use case is similar to that of child windows in X11.
Clients might use them to display certain UI elements,
for example a drop-down menu.
But their real power comes with views
that use different buffer configurations,
for example the video view of a media player and other controls around it.

:img-cap{src="assets/2021-02-19-subsurfaces.png" cap="Weston provides demos like this one,
which tests subsurfaces."}

We talked a lot about language when we looked at X11.
The situation is much better on Wayland.
"Subsurface" is a nice name for what the objects intend to do
and specific enough to not take away generic names from other concepts
like the parent-child relation of the global window tree in X11 did.

But the Wayland specs
and by that also [other documentation][wayland-book-subsurfaces]
luckily still uses that metaphor of a parent with children when describing subsurfaces.
So to understand them we can think in that terminology without hesitation.

For more information about subsurfaces
read on either the well-written descriptions in the core protocol
or the subsurfaces chapter of the Wayland book linked above.
If you are new to Wayland development though
you should rather start with reading up on [Wayland surfaces][wayland-book-surfaces].

### Toplevel Children and Foreign Surfaces
We said toplevel windows on X11 are windows
that are direct children of the root window.

For an X11 window manager
these windows are the only ones of importance.
These are the windows it may move, resize and in general whose state it manages,
while it does in general not care about all other windows.
And as noted these other windows are, per definition,
children of some of these toplevel windows
or the root window itself.

In this light for Wayland the [xdg-shell][xdg-shell] protocol extension
provides with the [xdg-toplevel][xdg-toplevel] type very similar objects.
These objects behave like the toplevels in X11,
as in the Wayland window manager may move and resize them
on user input or following other events.

And while subsurfaces are the spiritual successors
of the classical parent-child relation of X11,
[setting a parent][xdg-toplevel-set-parent] on an xdg-toplevel object
reminds us of the previously discussed transient windows.

Here as before with transient windows
we establish relations between windows of the same kind,
as in the windows are independent toplevel windows.
Like with transient windows the window manager is supposed
to stack these windows relative to each other
with one of them above the other.

Additionally there is the extension [xdg-foreign-unstable-v2][xdg-foreign],
which allows setting the relation across process boundaries.
This is important for example for Flatpak apps and other sandboxed applications.
It builds though upon the parent-child relation in the xdg-shell protocol.
Thanks to [Simon Ser][emersion] for pointing this out!

Coming quickly back to the discussion about terminology,
it is great to see that the request in xdg-shell
to establish a parent-child relation between xdg-toplevels
is simply called `set_parent`.
And because of the object-oriented design of Wayland,
this name is not used up by that,
but we can still use it in other protocol extensions
when it makes sense.

In the case of the second protocol extension
the adjective *foreign* is very descriptive
about what the extension is meant for.
And the document, which specifies the extension,
keeps using the parent-child metaphor
to describe its usage.
This is also great,
as it allows us to keep using our mental model.

What is not good
is that the request,
to set the *child* of a parent surface,
is called `set_parent_of`.
I wouldn't be surprised
if the name was inspired by the ominous "transient for" construct.
Old habits die hard.

But in the next version of that protocol
let us call that request just `set_child`, ok?

You might ask now: but what about group transients?
I am happy to tell you, they are not a thing on Wayland.

### One Last Thing: Pop It!
There is one more type of child window on Wayland,
which should get mentioned but does not have a direct equivalence on X11:
*popups*, usually in the form of context menus.

On Wayland these can be realized with the xdg-shell protocol extension
providing the [xdg-popup type][xdg-popup].

Now you might say: "Wait a minute, context menus are also a thing on X11!"
That's true,
but on X11 they are not really child windows of anything more than the root window.
They are placed by the client directly in global coordinates
and superimposed by the X Server as [override redirect][x11-override-redirect] windows.
The window manager just ignores them.

On Wayland that is different,
because for one the window manager is the server
and secondly clients can not place surfaces in global coordinates.

:img-cap{src="assets/2021-02-19-xdg-popup.png" cap="Wayland popups are placed and can be moved by the compositor,
here together with the infamous wobbly windows effect."}

A popup must therefore be placed *relative* to some other surface the client knows about.
For example a right-click context menu will be opened directly at the position of the cursor.
A hamburger menu opens relative to the visual boundaries of the hamburger button.

The xdg-shell protocol provides means to allow such initial placement and later correction.
Admittedly that can become complex [pretty quickly][xdg-positioner].

The important fact to remember though, is that on Wayland
the xdg-popup type also establishes a parent-child relation
with another window as its parent,
while popups on X11 did not.

## Recap and Next
In this introduction we took a tour through our "Window Kindergarten".
We learned about the different kinds of window children
by looking at their basic definitions
in the X11 protocol and other X specifications
and in the Wayland protocols with its extensions.
We also mentioned for each of them what their use case is.

The mental model of window children and parents is powerful
and transcends the mere technicalities of each individual protocol.
Due to historic circumstances
or just inexperience
in developing intuitive terminologies,
these fundamental ideas are sometimes
more difficult to understand than necessary.
Luckily this has improved with Wayland.

There seem to be two complementary basic types of children:
* As part of some tree structure,
either a global one with a single root window
or multiple outgoing from different windows.
* Via a direct connection linking windows of similar type
that otherwise would not be connected via that tree structure.

Additionally we have on X11 need for a more complex implementation
because of group transients
while on Wayland subsurfaces and foreign surfaces are more straightforward.
On the other side on Wayland
the window manager needs to take over some work for subsurfaces,
what was in the past handled by the X Server.

So we learned quite a lot about child windows.
In the upcoming article,
that is targeted to be published next week,
we use our knowledge
to take an in-depth look at the recent innovations in KWinFT,
when handling X11 transients, Wayland subsurfaces and foreign surfaces
in a unified way.

[emersion]: https://emersion.fr
[ewmh-group-transients]: https://specifications.freedesktop.org/wm-spec/wm-spec-latest.html#idm45623487728576
[icccm-transient-for]: https://www.x.org/releases/X11R7.6/doc/xorg-docs/specs/ICCCM/icccm.html#wm_transient_for_property
[transient-wikipedia]: https://en.wikipedia.org/wiki/Transient_(computer_programming)#X
[x11-create-window]: https://tronche.com/gui/x/xlib/window/XCreateWindow.html
[x11-move-resize-window]: https://tronche.com/gui/x/xlib/window/XMoveResizeWindow.html
[x11-override-redirect]: https://tronche.com/gui/x/xlib/window/attributes/override-redirect.html
[x11-reparent-window]: https://tronche.com/gui/x/xlib/window-and-session-manager/XReparentWindow.html
[x11-stack-window]: https://tronche.com/gui/x/xlib/window/stacking-order.html
[xplain-window-tree]: https://magcius.github.io/xplain/article/window-tree.html#the-window-tree
[wayland-book-subsurfaces]: https://wayland-book.com/surfaces-in-depth/subsurfaces.html
[wayland-book-surfaces]: https://wayland-book.com/surfaces-in-depth.html
[wl-subsurface]: https://wayland.freedesktop.org/docs/html/apa.html#protocol-spec-wl_subsurface
[xdg-foreign]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/master/unstable/xdg-foreign/xdg-foreign-unstable-v2.xml
[xdg-popup]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/d10d18f3d49374d2e3eb96d63511f32795aab5f7/stable/xdg-shell/xdg-shell.xml#L1072-1248
[xdg-positioner]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/d10d18f3d49374d2e3eb96d63511f32795aab5f7/stable/xdg-shell/xdg-shell.xml#L118-400
[xdg-shell]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/master/stable/xdg-shell/xdg-shell.xml
[xdg-toplevel]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/d10d18f3d49374d2e3eb96d63511f32795aab5f7/stable/xdg-shell/xdg-shell.xml#L577-1070
[xdg-toplevel-set-parent]: https://gitlab.freedesktop.org/wayland/wayland-protocols/-/blob/d10d18f3d49374d2e3eb96d63511f32795aab5f7/stable/xdg-shell/xdg-shell.xml#L605-625
[xserver-traverse-tree]: https://gitlab.freedesktop.org/xorg/xserver/-/blob/7e2875035800887f3f41f75cba4299088daf939a/dix/window.c#L432-455
