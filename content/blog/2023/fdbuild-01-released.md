---
title: "FDBuild 0.1 Released"
draft: false
date: 2023-10-11 16:00:00
tags:
- fdbuild
- tooling
description: "FDBuild is a development tool designed to pull, configure, and build multiple projects with a single command. It is now available in its initial release. Read on to learn how to make use of it."
authors: [roman-gilg]
---
If you are involved in open source, and maybe more specifically in Linux userspace development, you might be familiar with the problem of regularly rebuilding various projects from different Git repositories.

You need to pull changes and remember different build commands, as well as configuration parameters for each project individually.

At least for me, this was painful enough to create a tool that made this cumbersome task much more accessible. I called it **FDBuild**, as my original motivation was to build all the freedesktop.org projects with it.

Having used this tool for years now in production, I recently published its first official development release. Better late than never. To let FDBuild help you with your development tasks, simply run `pip install fdbuild` to get it from the [Python Package Index](https://pypi.org/project/fdbuild/).

## Simple To Use As It Should Be

With FDBuild, you can easily build all, some, or a single project. Once a project hierarchy has been set up in the file system, just run `fdbuild` from any path in this hierarchy to build all projects below or the single project you are currently in.

So, your location in the file system determines which project FDBuild will work on. This feels absolutely natural and is the right thing to do. I can confidently say this because I've used it for years.

If you change some code in one of the projects, you're usually already in there with a terminal. Simply execute `fdbuild` to rebuild and reinstall.

## Get Started

FDBuild comes with generators to create initial folder hierarchies for some well-known Linux userspace projects.

For example, you can create a directory hierarchy to build the Wayland library and related projects via: `fdbuild --init-with-template wayland`.

:img-cap{src="https://asciinema.org/a/08bG95UXStklafyMU0Ij6sfZl.svg" cap="Template usage with FDBuild" href="https://asciinema.org/a/08bG95UXStklafyMU0Ij6sfZl" effect="shadow"}

All currently available templates can be found in the [FDBuild repository](https://gitlab.com/kwinft/fdbuild/-/blob/master/fdbuild/templates/). These range from small templates that create single projects, like the [GCC template](https://gitlab.com/kwinft/fdbuild/-/blob/master/fdbuild/templates/gcc.yaml), to larger ones that include other templates, like the [Linux Graphics Meta template](https://gitlab.com/kwinft/fdbuild/-/blob/master/fdbuild/templates/linux-graphics-meta.yaml). With the latter, you can build all important userspace projects for a graphical Linux session.

Now, having created a basic project hierarchy, you may simply run `fdbuild` in the top-level directory. FDBuild will then start with the first project and go through all projects one by one to the very end. If a build fails, for example, because a build dependency is missing, FDBuild will exit after printing the last lines of error output, allowing you to fix the problem and rerun it, starting from the failed project with `fdbuild --resume-from your-failed-project`.

## Build All Of KDE With The Structurizer

KDE has its own meta build tool, called [kdesrc-build](https://apps.kde.org/de/kdesrc_build/). Before creating FDBuild, I used kdesrc-build myself, but it didn't fulfill all my requirements. Most importantly, it was and still is only able to process KDE projects (and Qt), but not other projects like the upstream projects from freedesktop.org.

FDBuild can do all that, including any KDE project. FDBuild comes with a *structurizer* to create a project hierarchy for any KDE project and all its dependencies, starting with the multitude of KDE frameworks.

This structurizer is defined via special settings files that define an FDBuild project and are written in the human-friendly YAML format.

## Settings Files

When you initialize a project hierarchy with a template or run `fdbuild --init` to start with a blank project, you will notice that `fdbuild.yaml` files are created in subdirectories.

These files serve two purposes. They define in which subdirectories FDBuild will try to process projects, and they allow us to configure FDBuild's behavior and the project properties.

A typical `fdbuild.yaml` file of a leaf project looks like this:

```yaml
source:
  plugin: git
  origin: https://gitlab.freedesktop.org/libinput/libinput.git
  branch: main
configure:
  plugin: meson
  options:
    - debug-gui=false
build:
  plugin: ninja
  threads: max
install:
  path: /opt/libinput
  sudo: false
  hooks:
    post: sudo udevadm hwdb --update
```

Most of these options should be self-explanatory, so I'll skip going through them here.

The top-level dictionaries of this YAML structure are called *steps* that FDBuild takes when processing the project. Their position in the YAML file does not determine the sequence in which they are processed when running FDBuild.

Instead, this sequence is determined by how steps depend on each other semantically. For example, a project must first be built before it can be installed.

A special step is a structurizer. This was mentioned earlier, and the only structurizer available right now is the one for KDE projects. A typical structurizer step looks like this:

```yaml
structure:
  plugin: kde
  enabled: false
  branch-group: kf6-qt6
  git origin update: true
  selection:
  - kde/workspace
  - kde/kdeutils/kwalletmanager
  - kdeconnect-kde
  ...
```

Such a structurizer is run at the very beginning to create a subdirectory structure with projects. After the structurizer step has succeeded, a user can decide to continue with running further steps or exit to customize project settings.

Usually, a structurizer is only run once in the beginning and then never again. So after using it, you can either delete the structure entry from the settings file or set the "enabled" entry to false.

## Alternatives
When I started FDBuild, I wasn't able to find any other tool that offered similar functionality and ease of use. It's possible that I may have overlooked one accidentally. If you know of other tools that are similar to FDBuild, please provide a link in the comments.

So far, I've only found one similar tool, which is [West](https://docs.zephyrproject.org/latest/develop/west/index.html), a tool for building the Zephyr operating system.

Its open-source development started in 2018, one year after I began working on FDBuild. It appears to be a professional tool for building multiple projects in the context of Zephyr.

In that sense though, FDBuild is more generic, as it was not created for building only in the context of a single project. I need to look more into West to come to a final conclusion, but right now, I assume that much of its functionality could also be covered by FDBuild and its extensive plugin system.

## Used In Production For Years
This is the first official release of FDBuild, and only as an unstable 0.1 version. This allows me to gather feedback from early adopters and make breaking changes in the future if needed.

However, this does not mean that FDBuild can't be already used in production. In fact, it has been used for many years. I am using it in the [KWinFT project](https://gitlab.com/kwinft/) to regularly build Docker images on which pipelines for GitLab merge requests run.

For example, [this script](https://gitlab.com/kwinft/ci-images/-/blob/1686c2fb721d8feb154120d3e4333bada78ff4e9/archlinux/frameworks-master.sh) runs FDBuild to build all KDE frameworks with Qt 6 inside a Docker container via Podman.

## For Your Open Source Work Or Your Company's Tech Stack
The FDBuild tool can be helpful in many use cases. While its primary application has been building complex open source infrastructure, based on my industry experience, it may also prove valuabe for companies with many internal projects. It streamlines the onboarding of new developers and establishes a standardized approach for building the company's product portfolio.

Conservative companies will, of course, prefer a stable release. I plan to reach this in under a year. Until then, you are invited to try FDBuild for your personal or more dynamic professional projects.

And if you want to contribute to the project or have a specific feature request, take a look at the [issue board](https://gitlab.com/kwinft/fdbuild/-/issues). FDBuild is written in Python and follows modern Python coding standards.
