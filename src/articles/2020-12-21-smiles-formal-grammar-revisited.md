---
title: SMILES Formal Grammar Revisited
summary: "Encapsulating the full OpenSMILES syntax using a set of streamlined production rules."
twitter: true
summary-image: images/posts/20201221/summary.png
published: "2020-12-22T18:00:00Z"
---

A [previous article](/articles/2020/04/20/smiles-formal-grammar/) presented a formal grammar for the SMILES language. Its most notable feature was the lack of left-recursion, which enables simple, efficient parsers to be written. However, that first attempt left some room for improvement. In this article, a new grammar is presented that addresses outstanding points.

# Limitations of Previous Grammar

Limitations of the previous grammar included:

1. Multiple unbounded quantifiers. Three production rules (`<line>`, `<chain>`, and `<branch>`) require loops, which complicates parser development, testing, and debugging.
2. Complex logic in the `<chain>` production, which complicated parser development.
3. No star symbol (`*`), a key feature of SMILES.
4. Non-tetrahedral stereo templates (e.g., `OH1`) were not supported.
5. Only three-digit atom classes were supported, which may limit certain applications.

The new grammar addresses all of these points. 

Powerful though grammars may be, there are many things they *can not* do. A grammar merely describes syntax. Semantics are out of scope. Examples of SMILES language features that can not be addressed by a formal grammar include:

- valance analysis
- double bond conformation analysis
- isotope validation
- kekulization and kekulizability determination
- ring closure balancing

# Using a Formal Grammar

The SMILES grammar described here belongs to a class designated as *[LL(1)](https://en.wikipedia.org/wiki/LL_parser)*. LL(1) grammars are desirable because they can be parsed from left to right with only one character of lookahead. This enables a technique I call [Scanner-Driven Parser Development](/articles/2019/01/22/scanner-driven-parser-development/). The idea is to wrap a string with an object of type `Scanner`. Doing so allows character-by-character processing to occur through just three simple operations. With a `Scanner` in hand, the grammar's production rules can be transformed into functions that call themselves or each other. The result is a recursive descent parser.

Aside from serving as a parser blueprint, a formal grammar can be used to make and test claims about specific SMILES strings. For example, SMILES does not support a dot character (`.`) preceding a ring closure number. This excludes strings such as `C.1CC1`. A grammar should make low-level syntax rules like this clear. As such, a well-crafted formal grammar can play a pivotal role in language standardization.

# A Toy Grammar

Having outlined the main goals, an improved SMILES grammar can now be developed. As before, we start with a toy grammar illustrating the overall structure of SMILES syntax:

```bnf
<smiles>   ::= <atom> <body>*
<body>     ::= <branch> | <split> | <union>
<branch>   ::= "(" ( <dot> | <bond> )? <smiles> ")"
<split>    ::= <dot> <smiles>
<union>    ::= <bond>? ( <smiles> | <rnum> )
<dot>      ::= "."
<bond>     ::= "-"
<atom>     ::= "*"
<rnum>     ::= "1"
```

This grammar can be tested using the [EBNF Evaluator](https://mdkrajnak.github.io/ebnftest/). Copy the above EBNF grammar into the text area labeled "EBNF Grammar." Then test different text inputs for validity.

Three points about this grammar are worth noting:

1. Only one unbounded quantifier is present, `<body>*`. A parser based on the grammar will therefore require only one explicit loop.
2. Production rules lack complex logic.
3. Production rules have more descriptive names.

# Full Stereochemical Parities

The previous grammar supported only two stereochemical parities: clockwise (`@@`) and counterclockwise(`@`). But as the [OpenSMILES specification documents](http://opensmiles.org/opensmiles.html), SMILES supports more sophisticated stereochemical templates, including square planar (`SP`), trigonal bipyramidal (`TB`), and octahedral (`OH`).

The full range of stereochemical parities can be represented with the following production rules:

```bnf
<parity>        ::= "@" ( "@" | <parity_suffix> )?
<parity_suffix> ::= <parity_th> | <parity_al> | <parity_sp> | <parity_tb> | <parity_oh>
<parity_th>     ::= "TH" ("1" | "2" )
<parity_al>     ::= "AL" ("1" | "2" )
<parity_sp>     ::= "SP" ( "1" | "2" | "3" )
<parity_tb>     ::= "TB" <twenty>
<parity_oh>     ::= "OH" <thirty>
<twenty>        ::= ( "1" <digit>? )
                  | ( "2" "0"? )
                  | ( "3" | "4" | "5" | "6" | "7" | "8" | "9" )
<thirty>        ::= ( "1" <digit>? )
                  | ( "2" <digit>? )
                  | ( "3" "0"? )
                  | ( "4" | "5" | "6" | "7" | "8" | "9" )
<digit>         ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

That's a lot of effort for some rarely-used stereo parities. But to build a parser capable of reading the entire OpenSMILES syntax, these production rules are all required.

# Full Grammar

The toy grammar uses pared-down atom and bond definitions. Let's remedy that by putting everything together:

```bnf
<smiles>           ::= <atom> <body>*
<body>             ::= <branch> | <split> | <union>
<branch>           ::= "(" ( <dot> | <bond> )? <smiles> ")"
<split>            ::= <dot> <smiles>
<union>            ::= <bond>? ( <smiles> | <rnum> )
<atom>             ::= <organic> | <bracket> | <star>
<bracket>          ::= "[" <isotope>? ( <symbol> | <bracket_aromatic> | <star> ) <parity>? <hcount>? <charge>? <map>? "]"
<isotope>          ::= <digit>? <digit>? <digit>
<hcount>           ::= "H" <digit>?
<charge>           ::= "+" ( "+" | <fifteen> )? | "-" ( "-" | <fifteen> )?
<map>              ::= ":" <digit>? <digit>? <digit>? <digit>
<rnum>             ::= <digit> | "%" <digit> <digit>
<parity>           ::= "@" ( "@" | <parity_suffix> )?
<parity_suffix>    ::= <parity_th> |<parity_al> | <parity_sp> | <parity_tb> | <parity_oh>
<parity_th>        ::= "TH" ("1" | "2" )
<parity_al>        ::= "AL" ("1" | "2" )
<parity_sp>        ::= "SP" ( "1" | "2" | "3" )
<parity_tb>        ::= "TB" <twenty>
<parity_oh>        ::= "OH" <thirty>
<organic>          ::= "B" "r"? | "C" "l"? | "N" | "O" | "P" | "S"
                     | "F" | "I" | "At" | "Ts"
                     | "b" | "c" | "n" | "o" | "p" | "s"
<symbol>           ::= "A" ( "c" | "g" | "l" | "m" | "r" | "s" | "t" | "u" )
                     | "B" ( "a" | "e" | "h" | "i" | "k" | "r" )?
                     | "C" ( "a" | "d" | "e" | "f" | "l" | "m" | "n" | "o"
                     | "r" | "s" | "u" )?
                     | "D" ( "b" | "s" | "y" )
                     | "E" ( "r" | "s" | "u" )
                     | "F" ( "e" | "l" | "m" | "r" )?
                     | "G" ( "a" | "d" | "e" )
                     | "H" ( "e" | "f" | "g" | "o" | "s" )?
                     | "I" ( "n" | "r" )?
                     | "K" "r"?
                     | "L" ( "a" | "i" | "r" | "u" | "v" )
                     | "M" ( "c" | "g" | "n" | "o" | "t" )
                     | "N" ( "a" | "b" | "d" | "e" | "h" | "i" | "o" | "p" )?
                     | "O" ( "g" | "s" )?
                     | "P" ( "a" | "b" | "d" | "m" | "o" | "r" | "t" | "u" )?
                     | "R" ( "a" | "b" | "e" | "f" | "g" | "h" | "n" | "u" )
                     | "S" ( "b" | "c" | "e" | "g" | "i" | "m" | "n" | "r" )?
                     | "T" ( "a" | "b" | "c" | "e" | "h" | "i" | "l" | "m"
                     | "s" )
                     | "U" | "V" | "W" | "Xe" | "Y" "b"?
                     | "Z" ( "n" | "r" )
<bracket_aromatic> ::= "b" | "c" | "n" | "o" | "p" | "s" "e"? | "as"
<bond>             ::= "-" | "=" | "#" | "$" | "/" | "\\"
<fifteen>          ::= "1" ("0" | "1" | "2" | "3" | "4" | "5")?
                     | ( "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" )
<twenty>           ::= ( "1" <digit>? )
                     | ( "2" "0"? )
                     | ( "3" | "4" | "5" | "6" | "7" | "8" | "9" )
<thirty>           ::= ( "1" <digit>? )
                     | ( "2" <digit>? )
                     | ( "3" "0"? )
                     | ( "4" | "5" | "6" | "7" | "8" | "9" )
<digit>            ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<dot>              ::= "."
<star>             ::= "*"
```

This new grammar supports all features defined by the [OpenSMILES specification](http://opensmiles.org). As the previous section highlighted, the core set of rules can be expressed with a handful of productions. Unlocking the full set of features, particularly bracket atom properties, requires many more productions.

# Conclusion

An improved LL(1) SMILES formal grammar has been developed. It supports all features in the OpenSMILES specification. The grammar presented here simplifies some previously-presented production rules and uses more descriptive production names. As such, the new grammar be used as a starting point for the development of efficient and robust OpenSMILES-compliant parsers. It can also help to address a number of questions regarding allowed SMILES syntax.