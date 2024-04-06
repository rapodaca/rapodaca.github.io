---
title: Hacking JSpecView - Enhancing the User Interface
published: "2008-02-01T00:00:00.000Z"
---

The [last installment](/articles/2008/01/28/hacking-jspecview-creating-an-html-test-harness) of this series showed how to set up an HTML testing harness for JSpecView. With the preliminaries taken care of, this installment will show how to enhance the user interface.

# The Goal

The live applet shown above illustrates the changes that were made. As you move your mouse cursor into the spectrum area, you'll see a vertical red line appear and track the movements of the mouse. As you presss the mouse key to begin a selection, a grey rectangle will show you exactly where the selection area will be.

If you can't view the applet, be sure you system has [JDK 1.5 or higher](http://www.java.com/en/download/index.jsp) installed, and that you've enabled applets for your browser.

Clearly, these modifications need more work. For example, you can extend the selection box outside the boundary of the spectrum area. And green might be a better color for the cursor. Then again, maybe the cursor should use an alpha channel. But I digress.

# One More Thing

Being a [longtime Eclipse user](/articles/2008/01/11/my-favorite-eclipse-shortcut-quick-fix), I prefer this tool for my Java development. So far, only the use of Ant has been described. Fortunately, Eclipse offers an elegant way to import an existing Ant project. File->New gives a dialog like the one shown below:

![New Project](/images/posts/20080201/new_project.png "New Project")

Selecting "Java Project from Existing Ant Buildfile" gives this dialog:

![Create Project](/images/posts/20080201/create_project.png "Create Project")

Filling in the fields as shown should give a fully-functional Eclipse project.

# Still One More Thing

If you check the HTML source for this page, you'll notice that the `applet` tag is used to display the applet. Yet on Internet Explorer, there is no "click to activate" message. The reason is that Depth-First is using the excellent JavaScript library [JActivating](/articles/2007/11/02/eolas-and-jactivating-working-around-a-workaround), which re-writes the `applet` tag so that it isn't detected by the Eolas workaround. This lets us stick with plain HTML, rather than using `document.write` to specify the applet.

# Changing the Source Code

Too many changes were made to detail individually. In general, they related to:

-  Removing non-applet classes such as those involved with the desktop application.
-  Removing code flagged by Eclipse as unused.
-  Editing the `jspecview.common.JSVPanel` source to add the UI modifications. The `drawGraph`, `drawCursor`, and `drawZoomBox` methods contained most of the changes.

The complete Eclipse project should be [available from SourceForge](http://sourceforge.net/project/showfiles.php?group_id=161398&package_id=260592) shortly.

# Conclusions

Given the right tools, modifying JSpecView is not that difficult. We've gone from raw souce code to a complete Eclipse project, and even added some functionality in the process.

Where would you like to take JSpecView?