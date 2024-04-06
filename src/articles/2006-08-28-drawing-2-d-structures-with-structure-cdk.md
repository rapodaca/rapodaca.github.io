---
title: "Drawing 2-D Structures with Structure-CDK"
published: "2006-08-28T00:00:00.000Z"
---

Rendering 2-D molecular structures is a fundamental part of chemical informatics. It's used in building end user systems, and more immediately, it can be critical for creating and debugging developer tools.

The <a href="http://cdk.sf.net">Chemistry Development Kit</a> (CDK) is a highly-functional chemical informatics library written in Java. Although it provides built-in 2-D rendering capabilities through the `org.openscience.cdk.renderer` package, I wanted something a little easier for me to customize. The result is <a href="http://structure.sf.net">Structure-CDK</a>, a 37K add-on library for the CDK. This article discusses the main features of Structure-CDK with some screenshots and code.

To begin using Structure-CDK, <a href="http://sourceforge.net/project/showfiles.php?group_id=103744&amp;package_id=202103&amp;release_id=443008">download</a> the current release. This package contains a complete copy of the most recent CDK release, so there is nothing else to install or download. Structure-CDK was developed with JDK-1.5.0. Because it contains no 1.5-specific features, it may work on earlier Java versions. <a href="http://ant.apache.org/">Ant</a> is useful, but not essential.

The packages contains an interactive viewing application, which can be invoked with the "vis" Ant task:

```bash
ant vis
```

Two types of molecules can be viewed. The first consists of those defined in `org.openscience.cdk.templates.MoleculeFactory`, which can be found under the **Structure** menu. 2-D coordinates are provided by CDK's `StructureDiagramGenerator`. Additionally, molecules can be opened as molfiles (**File->Open**), several samples of which are contained in the distribution's **molfiles** directory. Let's take a look at oseltamivir (Tamiflu).

This view can be changed in a couple of ways. Resizing the window automatically resizes and centers the image, while maintaining proportionality of all measurements. This feature, when used with antialiasing, results in the image staying readable regardless of its size. Additionally, **Edit->Preferences** produces a dialog for changing the rendering settings.

Now let's see some code that will read a molecule from a molfile and write a 2-D PNG image to disk. This can be done via the static convenience methods found in `ImageKit`:

```java
import java.io.FileReader;

import org.openscience.cdk.io.MDLReader;
import org.openscience.cdk.interfaces.IMolecule;
import org.openscience.cdk.Molecule;

import net.sf.structure.cdk.util.ImageKit;
...

public void writePNG(String pathToMolfile, String pathToPNG) throws Exception
{
  MDLReader mdlReader = new MDLReader(new FileReader(pathToMolfile));
  IMolecule mol = (IMolecule) mdlReader.read(new Molecule());

  ImageKit.writePNG(mol, 300, 300, pathToPNG);
}
```

The above code fragment creates a 300x300 PNG image from the contents of the molfile specified by `pathToMolfile`.

Although several rendering features, both aesthetic and functional, are supported, some are missing. Most importantly, atom labels are only rendered without hydrogen atoms and there is no stereochemistry support. Performance has not been optimized at all. Future versions of Structure-CDK will be aimed at addressing these issues.

Given the central nature of 2-D structure rendering, it's nice to have options. Structure-CDK provides a convenient, interactive solution. Future articles will discuss the integration of Structure-CDK into more complex chemical informatics systems.