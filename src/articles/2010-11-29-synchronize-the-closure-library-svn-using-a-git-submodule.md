---
title: Google Closure - Synchronize the Closure Library SVN Using a Git Submodule
published: "2010-11-29T00:00:00.000Z"
---

The last post in this series [introduced Google Closure](/articles/2010/11/22/google-closure-building-complex-applications-with-javascript/), a suite of JavaScript tools for building and maintaining complex JavaScript projects. Whether you're just starting out with Closure or have been using it awhile, an important problem you'll have to solve is how to keep your copy of the Closure Library up-to-date with the Google Closure SVN. This article describes one method for doing so using git.

# All Articles in this Series

1.  [Google Closure - Building Complex Applications with JavaScript](/articles/2010/11/22/google-closure-building-complex-applications-with-javascript/)
2.  Synchronize the Closure Library SVN Using a Git Submodule

# A Little About the Closure Library

Google Closure goes beyond any JavaScript toolkit in its functionality and scope. Many JavaScript libraries such as [jQuery](http://jquery.com/), [Dojo](http://www.dojotoolkit.org/), and [Prototype](http://www.prototypejs.org/) are mainly just that - libraries. In addition to offering library functionality more advanced than most other JavaScript toolkits, Closure offers two other components that set it apart: the [Closure Compiler](http://code.google.com/closure/compiler/) and [Soy Templates](http://code.google.com/closure/templates). This article will only discuss creating and maintaining a copy of the Closure Library. Future articles may discuss working with these other tools.

# Use Case

[ChemWriter 2](http://chemwriter.com/signups/new) is a rewrite of my company's web-based chemical structure editor from Java to JavaScript.  When it became clear that we'd be using Closure to create ChemWriter 2, we know we'd need a way to continuously merge changes to the Closure Library into our source tree.

The Closure Library is enormous. We didn't want to directly keep the Closure source in the ChemWriter repository due to its size. We also knew we'd be using git, whereas the Closure Library team uses Subversion as its public-facing version control system.

We needed a way to do the following:

1.  Use the Closure Library from within the ChemWriter project without committing and tracking the Closure Library source directly.
2.  Synchronize the Closure Library SVN repository with our own clone of the Closure Library maintained with git.

To my knowledge, the Closure team has not yet produced a release of either the Closure Library or other tools, so for now pulling source directly from repositories is the only way to go.

# Submodules to the Rescue

Git submodules turned out to the be answer to the biggest part of the problems above. For the unfamiliar, a submodule enables one repository to be embedded within another repository. From [the documentation](http://www.kernel.org/pub/software/scm/git/docs/git-submodule.html):

> Submodules allow foreign repositories to be embedded within a dedicated subdirectory of the source tree, always pointed at a particular commit.
>
> They are not to be confused with remotes, which are meant mainly for branches of the same project; submodules are meant for different projects you would like to make part of your source tree, while the history of the two projects still stays completely independent and you cannot modify the contents of the submodule from within the main project. If you want to merge the project histories and want to treat the aggregated whole as a single project from then on, you may want to add a remote for the other project and use the subtree merge strategy, instead of treating the other project as a submodule. Directories that come from both projects can be cloned and checked out as a whole if you choose to go that route.

Great - we've got a way to track changes to the Closure Library without bloating our own repository with all that foreign code. But how do we create and maintain an up-to-date git repository containing the Closure Library to start with?

# Forking the Closure Library

Fortunately, StackOverflow helps out with an [answer to the question of how to fork and sync a Google Code Subversion repository using Git](http://stackoverflow.com/questions/796991/fork-and-sync-google-code-svn-into-github). We're going to use Git's built-in ability to manipulate SVN repositories by creating our own fork.

Pick a place to host the Closure Library fork. Then:

```bash
git svn clone http://closure-library.googlecode.com/svn/trunk/ closure-library -s
```

It's that simple. My company uses a [public-facing Closure Library clone](https://github.com/metamolecular/closure-library). We set it up with two commands:

```bash
git remote add origin git@github.com:metamolecular/closure-library.git
git push origin master
```

As you can see, all changes to our public Closure Library clone track the changes to the original SVN repo maintained by Google itself.

# Updating Your Closure Library Git Clone

The same StackOverflow question that discusses forking an SVN repo into Git also reveals how to push changes to it. We simply change into our local closure-library directory and execute:

```bash
git svn rebase
git push
```

We synchronize our public Closure Library git repo with the official Google SVN weekly using the above two commands. Doing so regularly helps to ensure that we're always compiling and testing ChemWriter against an up-to-date version of the Closure Library.

So far, we haven't had the need (or desire) to alter the Closure Library ourselves. But should the need arise, we can use this system to push any changes we make out to our public git repo.

# A Closure Library Submodule

We have a synchronized git clone of the Closure Library. Now we need to create a submodule from it in a test project. Let's start out by creating an empty git repository:

```bash
mkdir test
cd test
git init .
```

We can now add the closure-library submodule:

```bash
git submodule add git@github.com:metamolecular/closure-library.git lib/closure
```

This tells git to store our submodule in lib/closure at the top level of our project. To store it elsewhere, replace the last argument with your path of choice. Remember, although git will know about this submodule, the Closure Library files themselves will not be stored in our project repository.

When cloning this project, it will be necessary to pull in and configure the closure-library submodule with:

```bash
git submodule init
git submodule update
```

We've created a Closure Library submodule, but how do we propagate changes from our cloned git repository?

# Synchronizing the Submodule

After synchronizing our git clone of the Closure Library SVN repository, we'll need to pull those changes into our closure-library submodule. Fortunately, there's nothing tricky here, although the solution may not be at first glance obvious. From within our test project:

```bash
cd lib/closure
git pull
cd ../..
```

# Conclusions

The article has described one way to set up and synchronize the Google Closure Library in your own JavaScript project. But how do we actually code against this library in our project? Future articles will show one way by describing up a build system.