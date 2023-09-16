---
title: "Changes of Substance"
date: 2022-11-22 14:00:00
tags:
- kwinft
- open source
- funding
- industry
series: false
cover_image: ./assets/2022-11-22-changes-of-substance.jpg
canonical_url: false
description: "The KWinFT project has now been going on for over two years
as an alternative to the KDE default compositor KWin.
In 2022 it has experienced some larger changes, for better and for worse."
authors: [roman-gilg]
---
Since the [last status update](more-wlroots-with-kwinft-524) on the KWinFT project
several months have passed already.
There were two releases since then and a lot of the internal technology has changed.
I am very happy about these changes since many of the biggest milestones,
that I had set out for the project two years ago,
have now been reached.

But there were also some non-technical developments,
which are honestly speaking not positive for the KWinFT project.
We are trying to make the best of it though
and I will tell you more about it
after quickly giving you an overview of the technical changes in the last months.

## New Technologies

The topics discussed here are rather technical.
And while I won't go into much detail
it will still be uninteresting to uninformed users who are only consumers of open source software.
But these changes have been high priority ones in order to facilitate our planned library split-out.
They should be interesting to other developers
who might look next year for a robust and *batteries included* framework
that they can leverage to create their own Wayland or X11 compositor.

### Compile-Time Dependency Injection
[Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)
is a common pattern in software engineering.
Developers writing code in various programming languages
often make use of the pattern without even knowing about it.

The typical form of dependency injection in C++ is by making use of inheritance and
[dynamic dispatch](https://en.wikipedia.org/wiki/Dynamic_dispatch#Example_in_C++).
This technique has several downsides that have been discussed
[in literature](https://en.wikipedia.org/wiki/Object-oriented_programming#Criticism) over the years.

An alternative is to inject dependencies already
[at compile-time](https://www.youtube.com/watch?v=zYPb7oBU5_E)
via template parameters.
This approach is [more robust](https://lukasatkinson.de/2016/dynamic-vs-static-dispatch/)
since types are fully resolved at compile-time,
and at run-time it is [more performant](https://www.youtube.com/watch?v=n6PvvE_tEPk)
since the compiler can better optimize and there are less cache misses.

There are also some downsides.
C++ template programming is infamously difficult to get started with.
Usually it is not taught in beginner courses while object-oriented C++ is at length.
Also previous C++ standards lacked constructs for ergonomic usage of templates.
This has improved a lot though.

In KWinFT we now use compile-time dependency injection for the very core classes we define,
things like the Wayland server representation, the space of windows, the input platform.
This change touched basically all areas of the code
and was a massive endeavour from
[first discussions](https://gitlab.com/kwinft/kwinft/-/issues/21#note_423078472)
in 2020 to the
[final commit](https://gitlab.com/kwinft/kwinft/-/merge_requests/231/diffs?commit_id=4b47d2be234d2f8a2d3334405cd14f6b39f1c715)
in August this year.

There is much more that could be said about this radical and most fundamental refactoring of KWinFT's internal structure.
If there is interest I will try to find some time to talk more about it in a future article.

### C++20
Every new C++ standard over the last ten years has massively expanded the usefulness of C++.
It is no different with the most recent C++20 standard.

For us C++20 is most interesting because of the introduction of
[modules](https://en.cppreference.com/w/cpp/language/modules).
But compilers still lack support for these.
Nevertheless we can still make use of various other already available C++20 features.
This required a few adaptations in our source code
but besides that was mainly a simple switch of a CMake flag
as the central [merge request](https://gitlab.com/kwinft/kwinft/-/merge_requests/240) documents.

At the moment we use C++20 primarily for template metaprogramming techniques,
facilitating the newly introduced [concepts](https://en.cppreference.com/w/cpp/language/constraints).
In particular the combination with constexpr-if [is powerful](https://www.cppstories.com/2018/03/ifconstexpr/).

One drawback is that after we now compile against C++20,
 [Coverity Scan](https://scan.coverity.com/projects/kwinft)
— one of our external static analysis tools — is failing to run.
Let's hope that they soon add support for C++20.

### Heterogeneous Window Containers
Another long-standing goal was flattening our windows hierarchy.
With the introduction of Wayland support
KWin's internal representation of windows had become an unbearable mess featuring multiple levels of inheritance.
In many aspects this structure failed basic principles of object-oriented design hygiene.

This had been identified as a major problem
[early on](../2021/the-windowing-revolution#flattening-the-hierarchy)
in KWinFT's development and over the years has been steadily improved.
Recently we see improvements to this [in KWin](https://invent.kde.org/plasma/kwin/-/merge_requests/2250) too
by reducing the number of inheritance levels.

In comparison though KWinFT is more radical in its solution,
which is based on the idea to get rid of any inheritance
and instead use `std::variant` to track windows in heterogeneous containers.
This basic idea was formulated already
[very early](https://gitlab.com/kwinft/kwinft/-/issues/75#note_437085531).
But only with the latest release it could finally be
[realized in practise](https://gitlab.com/kwinft/kwinft/-/merge_requests/251).

There are different reasons for going with this radical approach.
If there is interest I can write a more in-depth article.
One important reason was that I want to allow building KWinFT
as a Wayland-only library without any X11 dependency and vice versa.

### Waiting on Modules
A major downside of all the new and nice technologies we now use is
that compile times increase.
With a lot of template code especially recompiling code changes becomes painfully slow.

This is supposed to be tackled by C++20 modules
but as mentioned above currently they are still not supported by GCC nor Clang.
In particular the integration with CMake is coming in late.

But there is work going on and I hope that we can move to modules already next year.
For a very recent status update on the progress in compilers and CMake check out Bill Hoffman's
[talk at CppCon](https://www.youtube.com/watch?v=5X803cXe02Y).

## The Difficulties of Independent Projects
Let's talk now about the non-technical stuff.
There is mostly one topic to discuss.
That [Valve](https://www.valvesoftware.com),
the main sponsor of my open source work,
has stopped for now to fund my work on KWinFT.

### Funding Woes
I have written before
[in this blog](/blog/2019/new-website-new-company-new-partners-new-code#part-of-valves-open-source-group)
about Valve funding my work on KWin, the XServer and other open source projects.

I have always seen my open source work as a holistic mission,
trying to improve the open source Linux graphics space as the big diverse ecosystem it is in general
and not just working against a single downstream project.

That's why I decided early on to not only work on KDE software
but also do a Google Summer of Code project for X.Org working on Xwayland.
That's also why I have tried in the past to regularly visit the X.Org Developer Conference
in order to present my own work and talk with other compositor developers as well as upstream
and why I visited a Gnome sprint to exchange ideas with Mutter developers.

There were different reasons for me to start with the KWinFT project.
I have stated them [in the beginning](/blog/2020/the-kwinft-project).
Overall it was an experiment to try out a new direction
on how the window manager should be imagined and developed.

In retrospect I am very happy with where this freedom led me in technical terms.
What I described above in the technical part,
especially the long-term planning aspect of such fundamental technical changes,
wouldn't have been possible within the constraints of the KDE development model.

But in non-technical terms this obviously was a big risk.
How would my fellow colleagues in KDE react to it?
Hint: [not good](/blog/2020/wrapland-redone#new-in-kwinft-disman-and-kdisplay).
And what would Valve say about this?
On whom at this point I had been very much dependent financially.

Over time it became clear that Valve and I had different ideas
on what needs to be done to push the Linux desktop forward.
Valve puts their customers first.
They want to provide value for the consumers of open source software.
A focus on the actual needs of users is of course a good thing.
But I believe there are other values too
that are important for any software project and in particular when the product is open source.

For example in the case of open source projects
the question on how strongly the adoption of new technologies is prioritized
and the quality of code is ensured
directly affects the willingness of independent senior developers
to learn about and contribute to the project in their free time.

Of course respecting such values feeds back into the quality of the software,
so in the long run also brings value to the customer.
But it is much more difficult to communicate the importance of these values
as for example you could instead also just spend your time on simply adding singular new features
that directly affect the user.

I have to admit that I must have failed at communicating the importance of such values from my point of view
to my contact at Valve.
And I can absolutely understand
why from the viewpoint of a company,
foremost interested in creating value for their customers,
it seems natural to ignore such values.
Still I believe objectively the Linux graphics and desktop ecosystem needs a different,
more transformative approach to improving projects and results featuring both:
user focus *and* values that transcend it.

On a more personal note I have to say though that
I'm frustrated that KWinFT was always underfunded in comparison to KWin.
I was the only full time developer working on it
while KWin had several paid full time developers,
who could of course implement several more features
that we yet have to catch up with.
One can only imagine what would have been possible with a similar amount of funding for KWinFT
when looking at the large refactorings that we were still able to pull off.

Nevertheless I must be grateful to Valve for having continued to fund me for close to two years
to work on my radically different development vision with KWinFT,
even though we had from early on different ideas on what we need to focus on
to improve open source graphics and the Linux desktop.

And I am sure Valve will continue to support good work on Linux graphics in different areas of the stack.
While I think their current focus on users and features is missing out on more fundamental improvements,
Valve is a force for good in open source.
They have achieved a lot for open source graphics and the Linux desktop and they will continue to do so.
What is in stark contrast to many other companies
that use open source software a lot but don't give back to it due to
egoistic motives, their internal organization or external legal status.

### Work in the Industry

Talking about other companies,
let me quickly disclose what else I now do besides KWinFT.
When Valve stopped financing my full time work on KWinFT earlier this year
I decided that I wanted to try out working in the industry and not on another open source project,
if possible part time so I could still spend the other half of my time on KWinFT and occasional upstream tasks.

The reason for looking for a job in the industry and not specifically in open source
was mostly due to me wanting to gain experience on industry projects.
After my degree I had directly started working on open source software.
Of course some methods and organizational aspects must be different.
Another reason was that after years of remote work I actually wanted to work in an office for once,
with water cooler talk and all that fun.

The job market for experienced C++ developers is pretty good in Germany,
so I quickly found a company in the professional audio sector offering me all that.

Their products are very interesting
but being originally a hardware company their software stack needs improvements.
Luckily there seems to be a common understanding in the company
that this is indeed necessary and of course I can help with kickstarting this process,
also thanks to the experience I gained from working on the KWinFT project.

So I am looking forward to how this project evolves.
Of course as a freelancer I am still open to other contracts.
If you have one to give,
especially if it's about refactoring your decades old brittle C or C++ code base
so it becomes more ergonomic to work with,
more robust and easier to enrich with additional features,
contact me.

### Contributors for the Good and the Knowledge

So if industry projects are also interesting,
one has less headache with open source politics
and you have a stable income
why do I keep working on KWinFT?
I continue doing so mostly because I still believe
this project can transform a lot to the better in the Linux graphics space.
And because it allows me to hone my skills as a software developer
working on an ideal project absolutely independent of any customer demands
or financial interest spoiling the purity of the technical vision.

It is wonderful that I am not the only one who sees it this way.
There are a handful of other contributors who believe in this project,
who just like me want to grow as developers
and who have been contributing a lot to KWinFT in terms of coding and testing.
I am very thankful for that.
Their enthusiasm and commitment have been incredibly motivating to me.
It held me back from giving up on the project
when it became clear that I won't be able to work full time on it anymore
and which required me to set out smaller goals for the project as I would  have liked.
Goals nevertheless.

If you are interested in joining this small circle of elite developers,
visit us on [GitLab](https://gitlab.com/kwinft/) or [Gitter/Matrix](https://gitter.im/kwinft/community).
