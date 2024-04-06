---
title: "SMILES Reading Performance: RDKit vs ChemCore"
summary: "Rust and C++/Python cheminformatics toolkits face off on a core task."
twitter: true
summary-image: images/posts/20201019/summary.png
published: "2020-10-19T15:00:00Z"
---

The [Rust homepage](https://www.rust-lang.org) cites "blazingly fast" performance as an important reason to consider the language, and top-tier performance is often cited by developers as a reason they chose Rust. So far, this blog has emphasized Rust's many other compelling features. This article breaks from that focus to examine performance. Specifically, it compares the speed with which RDKit (Python/C++) and ChemCore (Rust only) can read SMILES.

# Results

On average, ChemCore completed SMILES reading benchmarks faster than RDKit/Python by a factor of 3.8 to 4.3.

# The Benchmark Tasks

The performance benchmark described here builds on the previously-reported [validation benchmark](/articles/2020/10/05/running-a-smiles-validation-benchmark/). To recap, that benchmark compared ChemCore against several other toolkits for accuracy of SMILES reading. The results showed ChemCore to perform favorably against all established toolkits. Given that SMILES are being interpreted correctly, it makes sense to move on to performance.

Using the same data set as before, the benchmark consisted of two tasks:

1. **Integration.** Read the input file and write an output file summarizing hydrogen count on each atom. This is essentially the validation benchmark. Total run time is reported.
2. **Micro.** Read all SMILES from the input file into memory. The time required to read all SMILES from memory (with no further processing) is reported.

# Project Repository

The project for this comparison is [available on Github](https://github.com/rapodaca/smiles_performance). The repository is set up as a Rust crate with subdirectories for data and python scripts. To comply with GitHub's file size limits, files within the `data` directory were compressed. They will need to be uncompressed using `gunzip` or something similar before use.

# Rust Code

The two Rust tasks can be found at `src/integration.rs` and `src/micro.rs`. A third task, `src/pcba.rs` processes a raw dataset to be discussed below.

`src/integration.rs` consists of a single function, `main` that reads an input SMILES file, converts each SMILES to a ChemCore `Molecule` instance, and then writes a file reporting atomic hydrogen counts.

```rust
use std::{ fs, io };
use io::prelude::*;
use chemcore::daylight;
use chemcore::molecule::{ Molecule, Error };
use gamma::graph::Graph;

fn main() -> io::Result<()> {
    let _ = fs::create_dir("./results");
    let in_path = "./data/rdkit_2017.03.3.smi";
    let out_path = "./results/chemcore-out.txt";
    // let in_path = "./data/pcba.smi";
    // let out_path = "./results/chemcore-pcba-out.txt";
    let in_file = fs::File::open(in_path)?;
    let out_file = fs::File::create(out_path)?;
    let reader = io::BufReader::new(in_file);
    let mut writer = io::LineWriter::new(out_file);

    for result in reader.lines() {
        let line = result?;
        let parts = line.split_whitespace().collect::<Vec<_>>();
        let id = parts.last().expect("no parts");

        if parts.len() == 1 {
            writeln!(&mut writer, "# {} No_input", id)?;

            continue;
        }

        let smiles = parts.first().expect("no smiles");

        match daylight::read(smiles) {
            Ok(molecule) => {
                let hcounts = molecule.nodes().iter().map(|id| {
                    molecule.hydrogens(*id).unwrap().to_string()
                }).collect::<Vec<_>>();

                writeln!(&mut writer, "{} {}", id, hcounts.join(" "))?;
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
    }

    Ok(())
}
```

Run this task using the following command. Output times are representative for my system.

```console
$ time cargo run --release --bin integration
    Finished release [optimized] target(s) in 0.00s
     Running `target/release/integration`

real    0m3.439s
user    0m3.151s
sys     0m0.264s
```

The choice of which set of files to run can be made by commenting/uncommenting the appropriate path line assignments at the top of `main`.

The `src/micro.rs` task also consists of a single `main` function. In this case, the goal is to first read all SMILES into memory and then determine how much time is required to convert them all to ChemCore `Molecule` instances.

```rust
use std::{ fs, io, time };
use io::prelude::*;
use chemcore::daylight;

fn main() -> io::Result<()> {
    let in_path = "./data/rdkit_2017.03.3.smi";
    let in_file = fs::File::open(in_path)?;
    let reader = io::BufReader::new(in_file);
    let mut inputs = Vec::new();

    for result in reader.lines() {
        let line = result?;
        let parts = line.split_whitespace().collect::<Vec<_>>();

        if parts.len() == 1 {
            continue;
        }

        let smiles = parts.first().expect("no smiles").to_string();

        inputs.push(smiles);
    }

    let start = time::Instant::now();

    for smiles in inputs {
        let _ = daylight::read(&smiles);
    }

    println!("elapsed: {}", start.elapsed().as_secs_f32());

    Ok(())
}
```

Run this task using the following command. Output times are representative for my system.

```console
$ cargo run --release --bin micro
    Finished release [optimized] target(s) in 0.01s
     Running `target/release/micro`
elapsed: 2.8601365
```

# Python Code

The two Python/RDkit tasks can be found at `py/integration.py` and `py/micro.py`. `py/integration.py` was based on a similar script contained within the [smilesreading](https://github.com/nextmovesoftware/smilesreading) repository.

```python
import sys
import pathlib
from io import StringIO
from rdkit import Chem

in_path = "./data/rdkit_2017.03.3.smi"
out_path = "./results/rdkit-out.txt"
# in_path = "./data/pcba.smi"
# out_path = "./results/rdkit-pcba-out.txt"

pathlib.Path('./results').mkdir(exist_ok=True)
Chem.WrapLogs()

sio = sys.stderr = StringIO()

with open(in_path) as in_file, open(out_path, 'w') as out_file:
    for line in in_file:
        parts = line.strip().split()
        id = parts[-1]

        if len(parts) == 1:
            out_file.write(f'# {id} No_input\n')
            continue

        smiles = parts[0]

        mol = Chem.MolFromSmiles(smiles)
        err = sio.getvalue()
        if err:
            sio = sys.stderr = StringIO()
            if "Can't kekulize" in err:
                out_file.write(f'# {id} Kekulization_failure\n')
                continue
            elif "Explicit valence" in err:
                out_file.write(f'# {id} Bad_valence\n')
                continue
            elif "SMILES Parse Error" in err:
                out_file.write(f'# {id} SMILES_parse_error\n')
                continue
            elif "Aromatic bonds on non aromatic atom" in err:
                out_file.write(f'# {id} Aromatic_bonds_on_non_aromatic_atom\n')
                continue
            elif "non-ring" in err and "marked aromatic" in err:
                out_file.write(f'# {id} Non_ring_atom_marked_aromatic\n')
                continue
            elif "WARNING" not in err:
                out_file.write(f'# {id} ERROR: {err}\n')
                continue

        if mol is None:
            out_file.write(f'# {id} No_output\n')
            continue
    
        counts = ' '.join(str(atom.GetTotalNumHs()) for atom in mol.GetAtoms())

        out_file.write(f'{id} {counts}\n')
```

Run this file using the following (timings are representative for my system):

```console
$ time python py/integration.py
[17:13:06] Can't kekulize mol.  Unkekulized atoms: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 25 26 27 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 46 47 48 56 57 58 59 60 61 62 63 64

real    0m14.302s
user    0m14.764s
sys     0m0.090s
```

As with the Rust task, a larger dataset can be run by commenting/uncommenting the top two sets of path assignments.

`py/micro.py`, like its Rust counterpart, reads all SMILES into memory, then converts them to an RDKit molecule using the `Chem.MolFromSmiles` function.

```python
import sys
import time
from rdkit import Chem

in_path = "./data/rdkit_2017.03.3.smi"

with open(in_path) as in_file:
    inputs = [ ]
    
    for line in in_file:
        parts = line.strip().split()
        
        if len(parts) == 1:
            continue

        inputs.append(parts[0])

    start = time.time()

    for smiles in inputs:
        Chem.MolFromSmiles(smiles)

    print("elapsed: " + str(time.time() - start))
```

Run this task using the following (timings are representative for my system):

```console
$ python py/micro.py 
[16:02:38] Can't kekulize mol.  Unkekulized atoms: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 25 26 27 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 46 47 48 56 57 58 59 60 61 62 63 64

elapsed: 11.64182710647583
```

The SMILES that RDKit does not kekulize is successfully kekulized by ChemCore (id 47434). In addition, a SMILES read without error by RDKit is actually not kekulizable and is flagged as such by ChemCore (id 44643). As described previously, kekulization in ChemCore means that a [perfect matching on the corresponding π-subgraph](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/) was found. RDKit has a few open issues around kekulization (see, for example [this one](https://github.com/rdkit/rdkit/issues/1900)).

# Results in Detail

On average, and across every benchmark, RDKit task run times were at least 3.8 times the run time of the corresponding ChemCore task (n=4 for each determination):

- Integration/ChEMBL RDKit: 14.568 s (s=0.138)
- Integration/ChEMBL ChemCore: 3.404 s (s=0.034)
- Integration/PCBA RDKit: 173.569 s (s=1.23)
- Integration/PCBA ChemCore: 46.115 s (s=0.196)
- Micro RDKit: 11.609 s (s=0.079)
- Micro ChemCore: 2.708 s (s=0.0.30)

RDKit version 2020.03.5 and ChemCore version 0.3.1 running on macOS were used for all tests.

# Differences between ChemCore and RDKit

Without knowing a lot about how RDKit works under the hood, it's hard explain ChemCore's performance advantage. However, an obvious factor to consider would be RDKit's use of Python, a language whose speed trails that of many popular languages. Indeed, benchmarks routinely put Python at a substantial performance disadvantage relative to Rust ([example](https://www.nicolas-hahn.com/python/go/rust/programming/2019/07/01/program-in-python-go-rust/)). If RDKit's `GetMolFromSMILES` function used Python in performance-critical areas, then language could be a factor.

Along the same lines, perhaps the difference arises from the small amount of Python orchestration code used in the benchmark itself. This seems unlikely, at least according to the [RDKit documentation](https://rdkit.org/docs/GettingStartedInC++.html#should-you-use-c-or-python):

> ... If all you are going to do is use scripts to do relatively simple things, essentially stitching RDKit function calls together, there should be little or no speed issues with using the Python interpreted language, as all the RDKit functions are compiled C++ and well optimised. ...

As noted above, RDKit is also written in C++. Benchmarks routinely put the performance of idiomatic C++ on par with idiomtic Rust. If RDKit's SMILES processing were exclusively driven by idiomatic and performant C++, I would expect the benchmarks to reveal comparable run times. This was, however, not observed. To account for the difference, we must look elsewhere. For example, maybe there's something about ChemCore's [molecular representation](/articles/2020/05/11/cheminformatics-in-rust-implementing-a-minimal-molecule-api/) that leads to more performant code overall. If this were true, one might expect other benchmarks to similarly favor ChemCore over RDKit.

Then there's the benchmark data set itself. To my eye, the ChEMBL set appears to contain an overabundance of fullerenes. Perhaps RDKit is just not that performant when it comes to kekulization of extended pi-systems. Similarly, the benchmark data set consists mainly of ring systems. Maybe there's something about that focus that disadvantages RDKit.

One way to test this idea would be to re-run the benchmarks against a more drug-like data set. A good source is [MoleculeNet](http://moleculenet.ai/datasets-1). One of its sets, "PCBA," contains 437,929 PubChem compounds screened in one or more bioassays. As such, it seems likely to be more representative of SMILES found in a pharma setting. The MoleculeNet documentation describes PCBA this way:

>  Selected from PubChem BioAssay, consisting of measured biological activities of small molecules generated by high-throughput screening.

The PCBA set is available as a single CSV file. It can be used as-is, but with one caveat: each row is terminated by two newline characters (`\n\n`). This will confound many CSV readers. [The CSV spec](https://tools.ietf.org/html/rfc4180) calls for records to be terminated by a CRLF character sequence (`\r\n`), so it's not clear what's going on. You can get an idea of what characters are involved by piping into `od` (octal dump):

```console
head -n 2 pcba.csv | od -c
```

After globally adjusting line terminators, I used the task `src/pcba.rs` to transform the PCBA set into the sort of SMILES file that could be read directly by the `src/integration.rs` task.

Running the integration task with the PCBA data set revealed a speed advantage for ChemCore of 3.8x, which compares well with results obtained for the ChEMBL set. The PCBA result demonstrates that on a set of over 400,000 SMILES pulled from a public-domain bioassay set, ChemCore on average performs better than RDKit at parsing SMILES by a wide margin.

Whatever the reason for ChemCore's better performance, the effect was observed in data sets of different composition and size.

# Correctness

A fast implementation that delivers the wrong answer isn't that useful. As a sanity check, the output for both integration tasks was compared using diff:

```console
$ diff results/chemcore-pcba-out.txt results/rdkit-pcba-out.txt 
```

As expected, there were few differences. However, a few points are worth mention:

1. RDKit accepts aromatic symbols (e.g, `te`) that are rejected by ChemCore and not valid according to [OpenSMILES](http://opensmiles.org).
2. RDKit reads and assigns tetrahedral stereochemistry on sulfoxides. The OpenSMILES documentation suggests this is not a valid application of tetrahedral templates due to the presence of only three substituents. See [this thread](https://sourceforge.net/p/rdkit/mailman/rdkit-discuss/thread/56B8B0BE.1080307%40unito.it/#msg34832597) for a discussion on how/why RDKit chooses to support this combination.
3. RDKit accepts some SMILES double bond conformations that are rejected by ChemCore and ambiguous at best according to OpenSMILES. In particular, OpenSMILES disallows double bond conformations in which two alkene subsituents on the same atom are put into the same quadrant. Based on this reading, ChemCore also disallows such encodings, even though they might be rationalized as not introducing conflicts.

Overall, the differences between ChemCore and RDKit interpretations are minor. Just 20 differences were found in one data set containing 400,000 records and eight differences were found in a set of over 40,000.

# Ergonomics

Raw performance is nice to have, but ergonomics is also important. How does the Rust version of each task compare to the same task written in Python?

The two sets of implementations are similar in both structure and length. The Python versions are shorter by a few lines, but there's a remarkable degree of similarity in both look and feel between the two code samples. This may in part reflect my much better familiarity with Rust than Python. If there are more Pythonic ways to write the RDKit code, I'd like to hear about them.

Nevertheless, I ascribe most of the similarity to Rust's automatic type inference. Other than in the function signature, the Rust version requires almost no manual encoding of types. Given that both languages use the same `snake_case` convention for variables, the result is two languages that look quite similar, at least when [programming in the small](https://en.wikipedia.org/wiki/Programming_in_the_large_and_programming_in_the_small).

Of course, one important difference between the ChemCore and RDKit implementations is that the former requires a compilation step. I'll let you judge for yourself how much of a burden that is given Rust's Cargo build system and package manager.

# Conclusion

The speed of SMILES reading for two cheminformatics toolkits was compared. One was ChemCore, written in Rust. The other was RDKit, written in C++ and Python. Across all tests, including those with and without disk i/o, ChemCore outperformed RDKit on average better than threefold. Some speculations on the possible origins of this observation are offered.