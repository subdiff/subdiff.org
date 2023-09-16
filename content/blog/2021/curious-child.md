---
title: "Curious Child"
date: 2021-02-28 22:00:00
tags:
- kwinft
- windowing
series: false
cover_image: ./assets/2021-02-28-curious-child.jpg
canonical_url: false
description: "The internal handling of window children on Wayland as on X11 has been reorganized in the latest version of KWinFT. A quick overview of the new implementation."
authors: [roman-gilg]
---
Last week [we studied](/blog/2021/window-kindergarten) window children on X11 and Wayland at a high level.
With this general knowledge acquired, we will quickly go through the recent changes to window children in KWinFT's new version.

## All the X11 Children
As [mentioned](/blog/2021/window-kindergarten#group-transients) in last week's article
we don't only have one kind of transient children on X11.
There are for one the usual transients,
defined by setting the `WM_TRANSIENT_FOR` window property to the window id of a toplevel parent window.
But there are also group transients,
defined by setting the window property to null or alternatively to the id of the root window.

### Transient Leads
Normal transients and group transients were in the past handled in KWinFT by different means.
In the class for managed X11 windows [a field][kwinft-transient-for] indicated
that the window is a transient window.
As expected for normal transients the field specified the id of the parent.
For group transients it was always set to the root window id.
When set to null, the window was not a transient.

Additionally there was a function [`mainClients()`][kwinft-mainclients]
which returned a list with all *transient leads*.
As a reminder these are other windows the window is a *transient for*.
Obviously for normal transients the returned list only contained a single element.

This has now been unified and encapsulated into [a class][kwinft-transient],
simply called *transient*,
which is supposed to be composited into other classes representing windows.
With that there is [a single way][kwinft-transient-is] to check if a window is a transient.
And what is more important
we use this same mechanism for all kinds of window children,
also as seen later on Wayland.

### Around and Around
We said the notion of group transients increases the complexity
when dealing with transient windows.
One reason for that is the danger of cyclic relations.

When a window is a group transient,
other windows in the [window group][window-groups] are transient leads for it.
This of course would lead to cyclic transient relations
when there is more than one group transient in the group.
There would also be cyclic transient relations
when one of the other windows has set a group transient
to be its transient lead in the usual way
of setting its `WM_TRANSIENT_FOR` window property to the other window's id.
Thinking further
this could even be the case
when there is an indirect transient relation via several windows inside or outside the group.

As we use the transient relation for stacking windows,
cyclic transient relations don't make sense.
Also it is likely such relations can lead to tricky bugs
like infinite loops.
So we should simply filter cyclic relations out.

In the old code
this was ensured through
[different][kwinft-check-group-transients] [means][kwinft-has-transient].
In the new implementation we do this [here][kwinft-group-transient-update] nicely packed together
when updating the group or the `WM_TRANSIENT_FOR` value.
For all affected windows
the updated relations are saved into their composited transient class objects.

## Same but Different Wayland Children
The grand goal of this rewrite
was to unify the handling of window children not only for windows on X11
but also for windows on Wayland.
This has been achieved by always recurring to the same idea of window children in general,
and only in detail explicitly defining what is different.

### Subsurfaces as Annexed Children
In the past subsurfaces were [handled][wrapland-subtree] in separate trees per surface.
The decision to implement them this way must have seemed natural
because KWin as an X11 window manager did not handle the parent-child relations of the X11 window tree.
This was done,
as [mentioned](/blog/2021/window-kindergarten#toplevel-children-and-foreign-surfaces) in the previous article,
by the X Server itself.

The problem with this approach is though,
that we ignore that there is already a tree in the window manager,
a tree for stacking all toplevel windows.
We basically double the implementation cost
by providing separate trees for subsurfaces.
With the rewrite this has been corrected.
Subsurfaces are now tracked in the same internal stack in KWinFT
like all other X11 and Wayland windows.
The [stacking algorithm][kwinft-stacking] ensures that they are always above their parent surface.
Input is redirected accordingly.

This greatly simplifies the handling of subsurfaces.
There is one difference though.
In contrast to normal X11 transient windows,
subsurfaces do not have control on their own,
they are no independent entities.
They are rather *annexed* to their parent surface.
It made sense to [define a property][kwinft-transient-annexed] named like this on its own.
When painting the final image the Scene is responsible
for painting subsurfaces [as part of their parent surface][kwinft-transient-annexed-quads].

### Toplevel Transients and Popups
In the last article [we saw](/blog/2021/window-kindergarten#toplevel-children-and-foreign-surfaces)
that the xdg-shell protocol defines parent-child relations between xdg-toplevels.
These relations can be represented in the same way like normal transients on X11.
The implementations on Wayland and X11 are therefore very similar,
only different in how the information is received via each protocol.

The case of xdg-popups is more interesting.
On X11 [we saw](/blog/2021/window-kindergarten#one-last-thing-pop-it)
that popups are basically ignored by the window manager.
But on Wayland popups need to be stacked and positioned by the window manager
as there is no other entity like the X Server doing that for us.

Obviously we want to interpret them as window children again
to reuse our tools.
The refactored implementation was designed that way.
But this is also a good example of how defining the right notion
often can make all the difference
as we interpret them not only as normal window children.

:img-cap{src="assets/2021-02-19-xdg-popup.png" cap="An effect acts on a Wayland popup as it is an annexed child."}

They are now in the same way like subsurfaces set to be annexed children.
This way effects affecting the parent also affect them.

## Restacked Perception

One interesting aspect of the unification work on window children is
that the annexed children motivated an overhaul of the central stacking algorithm.
The [old algorithm][kwinft-stacking-old] was difficult to understand
with several counters and nested loops.
The [new algorithm][kwinft-stacking] uses the transient class with its leads and children
to compute the new stack recursively,
keeping a child above its parent but below other windows.

It is therefore fair to say
that in this case
a different viewpoint on window children
led to improvements in parts
that at first seemed unrelated or at least of no concern.
And this was not the only time that happened
when I worked on this [Windowing Revolution](/blog/2021/the-windowing-revolution).
In general one can say
that fundamental progress is achieved
when traditional views are challenged.
The crucial step here was to find a new definition for unity and difference of window children.

[kwinft-check-group-transients]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.20.0-beta.0/x11client.cpp#L3188-3239
[kwinft-group-transient-update]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.21.0-beta.0/win/x11/transient.h#L161-330
[kwinft-has-transient]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.20.0-beta.0/x11client.cpp#L3347-3394
[kwinft-mainclients]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.20.0-beta.0/x11client.cpp#L3396-3410
[kwinft-stacking]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.21.0-beta.0/layers.cpp#L596-695
[kwinft-stacking-old]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.20.0-beta.0/layers.cpp#L505-623
[kwinft-transient]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.21.0-beta.0/win/transient.h
[kwinft-transient-annexed]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.21.0-beta.0/win/transient.h#L42
[kwinft-transient-annexed-quads]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.21.0-beta.0/scene.cpp#L986-1003
[kwinft-transient-for]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.20.0-beta.0/x11client.h#L506
[kwinft-transient-is]: https://gitlab.com/kwinft/kwinft/-/blob/kwinft@5.21.0-beta.0/toplevel.cpp#L1120-1123
[window-groups]: https://tronche.com/gui/x/icccm/sec-4.html#s-4.1.11
[wrapland-subtree]: https://gitlab.com/kwinft/wrapland/-/blob/wrapland@0.520.0-beta.0/server/surface.cpp#L86-220
