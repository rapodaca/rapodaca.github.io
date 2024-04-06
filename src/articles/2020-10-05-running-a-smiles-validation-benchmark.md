---
title: Running a SMILES Validation Benchmark
summary: Cleaner cheminformatics datasets begin with standards.
twitter: true
summary-image: images/posts/20201005/summary.png
published: "2020-10-05T18:00:00Z"
updated: "2020-10-05T21:30:00Z"
---

SMILES is an industry standard with a checkered standardization history. Both [primary literature descriptions](https://doi.org/10.1021/ci00057a005) and [online documentation](https://www.daylight.com/dayhtml/doc/theory/theory.smiles.html) left crucial points unaddressed. These limitations resulted in [OpenSMILES](http://opensmiles.org/opensmiles.html), the first independent attempt to codify the syntax and semantics of the SMILES language. Even so, the situation today still resembles that of two decades ago: the rules of SMILES are encoded by a handful of commonly-used cheminformatics toolkits. This state of affairs may have been tolerable two decades ago when large compound collections rarely left the confines of their host institutions. But the increasing importance of shared public datasets exposes cracks that are increasingly hard to ignore.

Recent articles on this blog have highlighted [ChemCore](/articles/2020/06/01/chemcore-a-cheminformatics-toolkit-for-rust/), an evolving cheminformatics toolkit written in Rust. Among its features is an OpenSMILES-based reader. The lack of an OpenSMILES validation suite leaves toolkit developers without a way to demonstrate compliance. Fortunately, a workaround exists in the form of validation benchmark that reports the behavior of the most common toolkits. This article reports the results of implementing that benchmark with ChemCore.

# About the Benchmark

The approach used here was outlined in a [presentation](https://www.slideshare.net/NextMoveSoftware/a-de-facto-standard-or-a-freeforall) and [poster](https://www.nextmovesoftware.com/products/SMILESBenchmark_ICCS_May2018.pdf) from Noel O'Boyle in 2018. It begins with a simple question: although toolkits can usually read their own SMILES, how well do they read SMILES written by other toolkits? Contained within the question is the realization that no toolkit is authoritative. They merely exhibit behavior that is more or less consistent with publicly-available documentation.

The result was the [SMILES reading benchmark](https://github.com/nextmovesoftware/smilesreading) ("the benchmark"). At its center the benchmark contains a master file of 47,463 SMILES drawn from the [ChEMBL23 dataset](https://www.ebi.ac.uk/chembl/). For maximum readability, the entries in this file are encoded with [aromaticity](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/) disabled. Each toolkit then translates this file into one with aromaticity enabled. Each file produced in this way is then processed by each cheminformatics toolkit in turn to produce a family of output files encoding atomic hydrogen counts. Differences in SMILES reading behavior can be identified by diffing two output files.

# ChemCore SMILES Support

[ChemCore](/articles/2020/06/01/chemcore-a-cheminformatics-toolkit-for-rust/) is an open source cheminformatics toolkit written in Rust. It implements a `read` function supporting most of the [Open SMILES](http://opensmiles.org/opensmiles.html) specification, including aromaticity. As need and opportunity arise, additional SMILES support will be added in the form of a `write` function.

# The Project

It's one thing to make the claim that a toolkit conforms to published documentation, but another to prove it. In the absence of a validation suite, the benchmark offers a convenient way to get some basic information. Here's an overview of my implementation:

1. Create a blank Rust project.
2. Add a `main` method.
3. `main` reads each aromatic smiles benchmark file.
4. For each file, write an output file in which each line records the hydrogen counts on each atom.
5. Use the Unix utility `diff` to compare the generated output files with those provided by the benchmark.

[The project](https://github.com/rapodaca/smiles_benchmark) is available on GitHub, and the benchmark is included as a Git submodule for convenience. The following sequence will clone the repository and initialize the benchmark submodule.

```console
git clone https://github.com/rapodaca/smiles_benchmark.git
cd smiles_benchmark
git submodule update --init
```

# Run the Benchmark

Once cloned and initialized, the project can be run in the usual way with:

```console
cargo run
```

Allow about ten minutes for the program to run. On completion, the `results` directory will contain a collection of output files ready for use. Execution can be aborted by pressing control-c.

# Output

The text files produced by the Rust program all have the same format. Each line represents the result of parsing an aromatic SMILES and summing atomic [virtual and implicit hydrogen](/articles/2019/11/06/virtual-hydrogens/) counts. The first entry on the line is the SMILES ID, obtained from the benchmark source file. The remaining entries are hydrogen counts.

For example, the first line of the file `openbabel_dev4Aug17.txt` output file is:

```console
0 2 0 2
```

This line says that the SMILES assigned to ID 0 has three atoms, and their hydrogen counts are 2, 0, and 2, respectively. This approach requires that: (1) atomic indexes are faithfully captured by the `read` function; and (2) atomic indexes are stable. ChemCore meets both requirements by design.

# Evaluation

Evaluation relies on the Unix `diff` utility to compare the file generated by ChemCore with the the one generated by another toolkit reading exactly the same file. For example, the following will compare ChemCore's atomic hydrogen counts with those of the Aug 2017 version of [Open Babel](http://openbabel.org/wiki/Main_Page):

```console
diff results/openbabel_dev4Aug17.txt  <(gzip -dc smilesreading/3-results/chembl/openbabel_dev9May18_reading_openbabel_dev4Aug17.txt.gz) --strip-trailing-cr | code -
```

Two things are noteworthy here. First, the output is piped to my editor of choice, Visual Studio Code. If using this approach, the trailing dash (`-`) is required. Other editors may have their own requirements. Alternatively, pipe can be omitted, directing output to the console. Second, `diff` is comparing the uncompressed output file produced by the program with a compressed file contained in the benchmark. This is the part starting with the less than (`<`) symbol and wrapped in parentheses.

The result is the following diff:

```console
2235c2235
< # 2234 Bad_valence
---
> 2234 1 1 0 0 1 0 3
6441c6441
< # 6440 Bad_valence
---
> 6440 1 1 1 0 0 1 0 1 1
8288c8288
< # 8287 Bad_valence
---
> 8287 1 0 1 1 0 0 1 1 1
19611c19611
< # 19610 Bad_valence
---
> 19610 1 1 2 2 2 0 2 2 1 1 2 2 1 1 2 2 2
42337c42337
< # 42336 Bad_valence
---
> 42336 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 1 1 1 1
```

Out of over 47,000 tests, only five differences were found between ChemCore's interpretation and that of Open Babel. All of the differences result from ChemCore *rejecting* SMILES that were accepted by Open Babel. What are these SMILES and what causes the difference in behavior?

The relevant identifiers are 2234, 6440, 8287, 19610, and 42336. The corresponding SMILES can be obtained by opening the applicable source benchmark file:

```console
cat <(gzip -dc smilesreading/2-aromaticsmiles/chembl/openbabel_dev4Aug17.smi.gz) | code -
```

To recap, the `*.smi.gz` benchmark file was produced from Open Babel's translation of the non-aromatic benchmark file. Searching the translation for the given identifiers yields the following SMILES, in which comments refer to a zero-based atomic indexing system:

- 2234 (`N1[CH](=S)N(C=N1)C`). Atom 1 is pentavalent carbon.
- 6440 (`C1=CC=C2[C](=C1)=NC=C2`). Atom 4 is pentavalent carbon.
- 8287 (`C1=[C]2=CC=NC2=CC=C1`). Atom 1 is pentavalent carbon.
- 19610 (`C12C(CCC[H]1)CCC1C2CCC2C1CCC2`). Atom 5 is divalent hydrogen.
- 42336 (`O1[Mg]2(Oc3c(cccc3)C(=O)O2)Oc2c(C1=O)cccc2`). Atom 1 is tetravalent magnesium.

The reason for the discrepancy is the same in all cases: ChemCore considers bonding arrangements requiring the promotion of core electrons or the invocation of negative electron counts to be errors.

Recall that abundant experimental evidence demonstrates that covalent bonding of the type SMILES captures occurs through valence electrons only. Core electrons do not participate in covalent bonding. A SMILES with a pentavalent carbon requires at least one bond formed with a core electron. In the vast majority of cases, such SMILES represent encoding or software errors. Although less obvious, a similar argument applies to tetravalent magnesium. The situation is even more obvious with divalent hydrogen, which requires the invocation of *negative* electron count.

For this reason, ChemCore considers molecules containing pentavalent carbon, tetravalent magnesium, and divalent hydrogen to be errors by default. In the interest in breaking the chain of error propagation, attempting to generate such a molecule yields an error.

Note that ChemCore tolerates *[hypervalence](https://en.wikipedia.org/wiki/Hypervalent_molecule)*. Hypervalence occurs when an atom taps normally inert valence electrons to yield an unusual valence state. For example, nitrogen has five valence electrons. If all are used in covalent bonding the result is pentavalent nitrogen. Such species do not involve core electrons. OpenSMILES explicitly allows pentavalent nitrogen and other hypervalent states as well.

ChemCore supports all forms of hypervalence involving valence electrons. For those extremely rare cases in which the rules are too strict, ChemCore's underlying SMILES reader [Purr](/articles/2020/05/25/lets-build-a-smiles-parser-in-rust/) can be used directly.

# Comparison with Other Toolkits

Before discussing differences between ChemCore and other toolkits, it should be emphasized that the benchmark was compiled two years ago. This is ample time to address the issues reported here. Nor is the intent to bash any other software. Instead, the goal is to highlight the kinds of differences that can arise when comparing SMILES reading across a wide range of implementations.

Diffing ChemCore's output with that of the relevant benchmark files yielded several observations about other toolkits. They include:

- **Invalid Aromatic Atoms.** OpenSMILES supports a limited set of aromatic (lower case) atoms. Not among them are aromatic tellurium (`te`) or iodine (`i`). These atoms are rejected by ChemCore, but some toolkits nevertheless wrote and read them. Aromatic tellurium was especially common, as found in: BIOVIADraw; KnowItAll; OEChem; and RDKit. BIOVIADraw wrote and read aromatic iodine (`i`).
- **Inconsistent Double Bond Conformation.** OpenSMILES presents detailed guidelines about the encoding of double bond conformation, which ChemCore follows. Two toolkits read and wrote SMILES with inconsistent encodings: Avalon and OpenChemLib.
- **Missed Kekulization Error.** OpenSMILES offers little in the way of actionable advice for the kekulization of molecules encoded by aromatic SMILES. To address this problem, [I wrote this detailed proposal](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/), which ChemCore follows. In a nutshell, ChemCore will kekulize only those molecules whose π-subgraphs produce a [perfect matching](/articles/2020/09/28/edmonds-blossom-algorithm-part-1-cast-of-characters/). A SMILES failing this test is considered invalid. Some toolkits kekulized these SMILES without errors, including: Avalon; ChemDoodle API; KnowItAll; OEChem and OpenChemLib.
- **False Kekulization Error.** One toolkit (JChem) was unable to kekulize several valid aromatic SMILES. This may be [connected](https://twitter.com/baoilleach/status/1313186117374574592) to the use of differing toolkit releases to write and read SMILES.
- **Overwriting Virtual Hydrogen Count.** OpenSMILES requires virtual hydrogen counts, as defined within bracket atoms, to override implicit hydrogen counts. Lack of a count in a bracket atom is interpreted as zero hydrogens. One toolkit, BIOVIADraw, overwrote virtual hydrogen counts, leading to discrepancies with ChemCore's output.
- **False Valence Error.** One toolkit, Indigo, reported as errors SMILES that are explicitly permitted by OpenSMILES. For example, the presence of pentavalent nitrogen caused entries to be rejected.
- **Inaccurate Implicit Hydrogen Count.** Two toolkits, BIOVIADraw and iwtoolkit, reported implicit hydrogen counts inconsistent with the [SMILES valence model](/articles/2020/06/08/hydrogen-suppression-in-smiles/).
- **Missed Valence Error.** Toolkits found to allow SMILES encoding atoms in which core electrons are used for covalent bonding included: BioVIADraw; CDK; Indigo; and OpenBabel.

# Not Included

The benchmark supports comparisons other than the one highlighted here. Unfortunately, they tend to require the ability to write SMILES. When ChemCore gains that capability, the remaining comparisons will be reported.

# Rust Implementation

To the best of my knowledge, the ChemCore SMILES validation project adheres to widely-practiced Rust coding standards. As such, it can be used as template for other projects that read text file data and write one or more reports to disk.

The `main` function kicks things off by setting up read and write directories, then iterating over each entry in the read directory.

```rust

fn main() -> io::Result<()> {
    let write_root = "./results/";
    let _ = fs::create_dir(write_root);
    let read_root = "./smilesreading/2-aromaticsmiles/chembl";

    for result in fs::read_dir(read_root)? {
        let entry = result?;
        let writer = create_writer(&entry, write_root)?;
        let reader = create_reader(&entry)?;

        process_file(reader, writer)?;
    }

    Ok(())
}
```

For each entry, `process_file` is called. Taking a reader and mutable writer as arguments, its job is to deflate a gzipped source file, extract its id and SMILES, then pass this information to `write_line`.

```rust
fn process_file(
    reader: io::BufReader<GzDecoder<std::fs::File>>,
    mut writer: io::LineWriter<std::fs::File>
) -> io::Result<()> {
    for result in reader.lines() {
        let line = result?;
        let parts = line.split_whitespace().collect::<Vec<_>>();
        let id = parts.last().expect("no parts");

        if parts.len() == 1 {
            writeln!(&mut writer, "# {} No_input", id)?;
            
            continue;
        }

        write_line(id, parts.first().expect("no smiles"), &mut writer)?;
    }

    Ok(())
}
```

`write_line` accepts an id, SMILES, and `LineWriter`, using the writer to write one line reporting the status of the SMILES analysis. The analysis consists of counting the hydrogens on each atom when SMILES parsing through ChemCore is successful. Otherwise, one of three error lines is reported.

```rust
fn write_line(
    id: &str,
    smiles: &str,
    writer: &mut io::LineWriter<std::fs::File>
) ->io::Result<()> {
    match daylight::read(smiles) {
        Ok(molecule) => {
            let hcounts = molecule.nodes().iter().map(|id| {
                molecule.hydrogens(*id).unwrap().to_string()
            }).collect::<Vec<_>>();

            writeln!(writer, "{} {}", id, hcounts.join(" "))?;
        },
        Err(Error::CanNotKekulize) => {
            writeln!(writer, "# {} Kekulization_failure", id)?;
        },
        Err(Error::Hypervalent(_)) => {
            writeln!(writer, "# {} Bad_valence", id)?;
        },
        Err(error) => {
            writeln!(writer, "# {} ERROR: {:?}", id, error)?;
        }
    }

    Ok(())
}
```

# Conclusion

Testing ChemCore in the benchmark revealed few unexpected differences between it and more established toolkits. This can be credited to the fact that the benchmark was used to develop the reader. Doing so caught numerous non-obvious bugs. The benchmark demonstrated clear value to this toolkit developer.

Additionally, I think the benchmark could be useful to certain toolkit *users*. For example, any user who cares about data quality may want to consider running their toolkit against the benchmark. Users with access to more than one toolkit might use the benchmark when considering which one to use for processing external data. I suspect there will be a few surprises.

In principle, a given SMILES should unambiguously represent a specific molecular graph. In practice, things are complicated. As of 2017 the benchmark reveals important differences in how SMILES are interpreted. As long as these differences persist or at least remain undocumented, those working to improve dataset quality in cheminformatics will have the deck stacked against them.

Two changes would go a long way to correcting the situation. First, SMILES standardization efforts should nail down currently-vague areas such as the interpretation of aromatic SMILES. Second, a freely-available validation suite that exercises all SMILES features would allow developers to better align their products with any proposed standard, and document deviations from it.