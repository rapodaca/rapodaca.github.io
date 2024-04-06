---
title: Building a Molecule Preview with Firefly - The Joy of Swing
published: "2007-07-18T00:00:00.000Z"
---

Previous articles have discussed [Firefly](http://depth-first.com/articles/tag/firefly), the codename for a new 2D structure editor for the Web. Although it can be deployed as a self-contained applet on Web pages, Firefly is composed of modules that are readily re-used. By taking advantage of this design and Java's native UI toolkit Swing, new UI elements can be built with relatively little effort. This article outlines one such use - the creation of a file dialog that contains a molecule preview.

Many image processing applications such as Photoshop or GIMP provide an image preview that appears in file browser dialogs. Wouldn't it be nice if applications that process molecular structure files came with a similar feature? The screenshot below shows a file chooser with an embedded molecule preview based of Firefly's Painter component:

![Dialog](/images/posts/20070718/dialog1.png "Dialog")

When a new molfile is highlighted, a new preview is automatically generated:

![Dialog](/images/posts/20070718/dialog2.png "Dialog")

The molecule preview is capable of all of the customizations available in Firefly including background, bond, and atom colors, borders, and atom label fonts. No matter how large or small the molecule, and regardless of its starting coordinates, it will always be exactly scaled to fit the available space and precisely centered.

This dialog was rapidly implemented using the accessory capability provided by Swing's <code>JFileChooser</code>:

```java
JFileChooser chooser = new JFileChooser();
PreviewAccessory accessory = new PreviewAccessory(chooser);

accessory.setPreferredSize(new Dimension(150, 150));

chooser.setAccessory(accessory);
chooser.addPropertyChangeListener(accessory);

// ...
```

Defining a JComponent implmenting the <code>PropertyChangeListener</code> interface is all that's needed to get a working molecule preview:

```java
class PreviewAccessory extends DefaultPainter implements PropertyChangeListener
{
  // implementation
}
```

Swing has come a long way since the dark days of JDK 1.2. What started out as the dog-slow ugly duckling of user interface toolkits has developed into one of the best platforms for building desktop applications out there. Advanced tools such as the WYSIWYG interface builder [Matisse](http://www.netbeans.org/kb/articles/matisse.html) and the polished components offered by [JIDE](http://www.jidesoft.com/) make Swing an even more attractive option. The example described here is just one instance of how Swing's well-conceived design simplifies the job of building rich user interfaces.