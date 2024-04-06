---
title: "Reading and Writing the System Clipboard in JavaScript: Copy and Paste Molfiles in ChemWriter on Internet Explorer"
published: "2011-01-24T00:00:00.000Z"
---

Integrating the system clipboard with Web applications is no easy feat. For good reason, most browsers make it nearly impossible for client-side JavaScript to arbitrarily read and write the system clipboard. But as with all things relating to browsers, behavior does vary. This article describes how copy and paste between [ChemWriter](http;//chemwriter.com) (my company's pure JavaScript chemical structure editor) and the Windows system clipboard was enabled in Internet Explorer (IE).

# A Singular Innovation

Although not widely known, [IE versions 6, 7, and 8 support read and write access to plain text data stored on the system clipboard from arbitrary JavaScript code](http://msdn.microsoft.com/en-us/library/ms535220\(v=vs.85\).aspx). Whether you see this as a [security hole](http://www.zdnetasia.com/users-warned-over-ie-clipboard-exploit-39105357.htm) or not depends on what you're trying to do. Different versions of IE support various levels of control over this behavior:

1.  **Enable** Allow any JavaScript to read and write the system clipboard without notifying the user.
2.  **Prompt** Allow any JavaScript to read and write the system clipboard, presenting a cancelable dialog first.
3.  **Disable** Never allow access to the system clipboard from JavaScript.

These settings can be applied to security zones, like the other IE security settings.

Out of security concerns, no other browser vendor supports programmatic JavaScript clipboard access out of the box. There have been numerous [legitimate, white-hat attempts to get around this situation](http://almaer.com/blog/supporting-the-system-clipboard-in-your-web-applications-what-a-pain), an indication that this feature is in high demand from many sectors of Web development.

# How It Works

We wanted a simple way for chemists copy and paste [molfiles](/articles/2010/06/28/latest-ctfile-formats-specification-available-now-from-symyx/) (a text-based file format) to/from their system clipboards and a ChemWriter instance deployed in a Web page. This is currently supported through separate text area import dialogs, but we wanted to offer something more streamlined. We also wanted a solution that would enable chemists to use the familiar ctrl-c and ctrl-v keyboard shortcuts in an intuitive way.

Visiting the [chemwriter.com homepage](http://chemwriter.com), you'll see an example of this new feature in action. Place a molfile onto your system clipboard and either press ctrl-v or use the 'Import Molfile' button at the bottom of the editor.

Depending on your security settings, you'll see one of three behaviors:

-  **Enable** An interactive, graphical representation of your molfile will appear in the editor window.
-  **Prompt** A consent dialog will appear, asking permission to access the clipboard:

![ChemWriter Clipboard Prompt](/images/posts/chemwriter_clipboard_prompt.png "ChemWriter Clipboard Prompt")

-  **Disable** If your clipboard access setting is 'Disable', or you refuse access to your clipboard from the dialog, the editor falls back to presenting the default import molfile dialog, from which you can paste the molfile and then dismiss the dialog.

It should be emphasized that the consent dialog only appears at the moment a script attempts to access the system clipboard.

You can test clipboard access on IE in your own scripts (or interactively with the 'Developer Tools' console). To read the clipboard:

```js
var data = window.clipboardData.getData('Text');
```

To write the clipboard:

```js
window.clipboardData.setData('Text', 'this is a test');
```

# IE Quirks

As might be expected, the user experience for this feature varies according to the version of IE being used. Given a setting of 'Prompt' for clipboard access, here's a summary of what we've found:

-  **IE6** Always prompts with dialog for clipboard access.
-  **IE7** Prompts with dialog on first clipboard access. All other accesses on the same page without intervening page jumps proceed without consent dialog. Loading another page and then re-visiting the original presents a new consent dialog.
-  **IE8** Same as IE7.

# Conclusions

Integration with the system clipboard is one of the most difficult things to achieve in current Web development. We've used the capability offered by Internet Explorer as one solution that, we think, may offer a good tradeoff between convenience and security in some situations.

Are there other, better ways to enable well-integrated system clipboard access in client-side JavaScript? Yes, I think so. But that's a story for another time.