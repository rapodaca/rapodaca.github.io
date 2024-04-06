---
title: Building ChemWriter - What to Do When Requesting Applet Keyboard Focus Leads to Disappearing Popup Windows
published: "2008-11-06T00:00:00.000Z"
---

Recently a customer reported a problem in which mousing over an instance of the [ChemWriter](http://metamolecular.com/chemwriter) editor applet caused browser popup windows to disappear behind the parent window. Although many view browser popup windows as bad UI design, there are situations in which no alternative exists. This article describes the window focus problem in detail and outlines one solution.

# Background

One of the ways ChemWriter makes chemists more efficient at drawing chemical structures is through the use of [keyboard shortcuts](http://metamolecular.com/articles/chemwriter-keyboard). Rather than having to mouse back and forth between a tool palette and drawing canvas to put in atom labels, simply hover the mouse over the atom to label, and press a key on the keyboard. In addition to atom labels, there are keyboard shortcuts for chains (keys 1-9 while hovered over atom), for benzene rings ("a" key), and to edit bond order (1-3 while hovered over bond). [A short movie](http://depth-first.com/articles/2008/06/18/screencast-drawing-structures-quickly-with-chemwriter) explains the feature in more detail.

Although quite helpful to users, this feature requires some behind-the-scenes magic. Keyboard focus is one of those topics at the boundary between applet and browser for which very little documentation exists and, not surprisingly, one sees the most variation in platform and browser behavior.

The approach ChemWriter takes is to wait for a signal that the mouse cursor has entered the canvas area. When this happens, keyboard focus is requested through `Component.requestFocus()`.

# Scope of the Problem

It turns out that on Windows, `Component.requestFocus()` also causes the hosting window to be pulled to the top of the windows stack, explaining the behavior described above. On Linux and OS X, this doesn't happen, which is the behavior you'd expect.

All Windows browsers, except the much maligned Internet Explorer 6, show this behavior. This includes Internet Explorer 7, Firefox 3, and Google Chrome. Internet Explorer 8 beta 2 also shows the behavior, but only once per popup window.

Minimizing, then maximizing the popup window eliminated the problem some of the time. But a new popup window would still show the behavior.

# The Solution

The root of the problem is that on Windows, keyboard focus is granted to an object regardless of whether the object's hosting browser window is focused. What's needed, therefore, is a way for the applet to implement a window focus check.

Apparently, nothing in the Applet API itself can solve this problem. The `Applet`, `JApplet`, and `AppletContext` classes only deal with much higher-level considerations. 

However, it's possible to take advantage of support for [LiveConnect](https://developer.mozilla.org/En/Core_JavaScript_1.5_Guide:LiveConnect_Overview) technology on Windows, which is actually quite good. Using LiveConnect in combination with JavaScript's `Document.hasFocus()` method offers the makings of a solution. For example, the following code can be used as a starting point within a Java applet to determine if the containing browser window is focused:

```js
netscape.javascript.JSObject js = netscape.javascript.JSObject.getWindow(this);
Object result = js.eval("document.hasFocus();");

if ("true".equals(result.toString()))
{
  requestFocusMethod();
}
```

Of course, `requestFocusMethod()` needs to be defined, we need to check for `null`, and we need to handle exceptions that could arise from a missing `netscape.javascript` package. You'll also need to ensure that non-windows browsers such as Safari/OS X never even try to execute the LiveConnect code due to a very buggy implementation.

# Issues

I've seen mixed signals about the status of LiveConnect in the next major release of the Java plugin. Regardless of the specific way it's implemented, it seems safe to say that Java-Javascript communication is far too valuable to abandon. The only question is what form support for this feature will take going forward.

# Conclusions

ChemWriter's ability to accept keyboard input is a helpful user interface feature, but one that resulted in window focus issues on Windows. Using LiveConnect in combination with some simple JavaScript in the focus-management code offered an effective solution.