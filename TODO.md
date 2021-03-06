
* ~~EnglishNumberParser needs to gather ownHashedTerms.~~
* ~~Lexicon needs to add these terms to the domains as downstream terms.~~

* Fix casing in data.yaml alias patterns - should all be lower case
* Bring in new repl code
* Repl command to show alternates/alternate paths.
* Token references
    * What is the new analog to this concept? Some sort of graph rewriting?
    * Scenario is parameterized tokens: NEED_MORE_TIMEL `I need @QUANTITY seconds`
    * In this scenario, text wraps around tokens.
    * Remove concept of isTokenHash
    * Remove concept of token references (terms that start with `@`)
* isNeverDownstreamTerm
* ~~Stemmer needs special handling for numbers~~
    * ~~Why? As long as numbers are stemmed the same way as other words, what's the problem?~~
    * ~~Tokenizer constructor should take NumberParser~~
    * ~~NumberParser should make its terms available for stemmer.~~
* ~~Alias generator should allow specification of matcher.~~
* ~RESTORE: stemmer_confusion_matrix and demo~~

* ~~Remove PID. This is a samples concept now.~~
* ~~UNIFY HASH and Hash~~
* ~~TermModel unit tests - factor from Tokenizer unit tests~~
* ~~rename numbers to number-parser~~
* ~~MOVE tokenizer/item_collection.ts~~
* ~~MOVE tokenizer/alias_generator.ts~~
* 
~~Figure out how to make non-public members available for unit testing.~~
* ~~remove number-to-words dependency~~
* ~~decodeTerm should be in ... Lexicon? Nope.~~
* ~~Remove Tokenizer downstream words concept.~~
* ~~Remove Tokenizer stemAndHash concept.~~
* ~~REMOVE Tokenizer.hashTerm(). Need to update unit tests.~~
* ~~REFACTOR Tokenizer.decodeTerm(). Used for debugging. Should move to TermModel. Nope.~~

* ~~Pipeline teardown~~
    * ~~pipeline_demo, relevance_demo_cars, relevance_demo_helper~~
    * ~~samples/pipeline, samples/recognizers~~
    * ~~src/tokenizer/patternRecognizer, src/recognizers,~~
* WordTokens
    * Perhaps tokenizer should build default edges
    * and default edges should contain the HASH value
    * and TermModel or Lexicon should contqin the HASH to text mapping.
    * Edge.isNumber might become Edge.type.
    * ALTERNATIVE: text of edge is recovered later, perhaps by RelevanceSuite.
* INVESTIVATE: `GraphWalker`: `this.left.length !== this.current`
* New Relevance Test
    * Some means to parse expected tokens from test.yaml.
        * Perhaps just break expected text on spaces? 
    * Some means to express alternate results.
    * Backtracking comparison algorithm.
* ~~Downstream terms~~
    * ~~Tokenizer no longer gets/manages downstream terms~~
    * ~~Lexicon provides term hash iterator (or set?)~~
    * ~~Recognizers provide term hash iterator (more likely set?)~~
    * ~~Alternately, could one build a pipeline on top of a Lexicon of domains?~~
* isDownstreamTerm function needs to handle number tokens
* ~~Move lexicon.ts to src/tokenizer~~
* ~~`Tokenizer.matchAndScore` should get `isTokenHash` from termModel.~~
* ~~Remove `Tokenizer` members~~
    * ~~`Tokenizer.matcher`~~
    * ~~`Tokenizer.downstreamWords`~~
    * ~~`Tokenizer.hashedDownstreamWordSet`~~
    * ~~`isNumberHash`~~
    * ~~`isTokenHash`~~
    * ~~`stemAndHash`~~
    * ~~`addHashedDownstreamTerm`~~
    * ~~`stemTermInternal`~~
    * ~~`hashTerm`~~
    * `decodeTerm` - needed for debug spew.
    * ~~`addItem2`, `addItem`~~
    * ~~`PID`, `pidToName`~~
    * ~~`aliasFromEdge`~~
    * ~~`processQuery`~~
* ~~Remove `Tokenizer.constructor()` parameters~~
    * ~~`downstreamWords`~~
    * ~~`relaxedMatching`~~ parameter.
* ~~`Tokenizer.addItem2()`~~
    * ~~Remove `addTokensToDOwnstream`~~
    * ~~Move alias splitting, stemming, and hashing to caller. Take `TokenizerAlias` as parameter. Role is now just to update inverted index.~~
* ~~Make `Tokenizer` members private.~~
* Logging
    * Consider getting `debugMode` from the logging framework.
* ~~Tokenizer~~
    * ~~Eliminate `PIDs.` Replace with `Token`.~~
    * ~~Move alias splitting, stemming, and hashing to `Lexicon`.~~
* ~~Lexicon~~
    * ~~Splits, stems, and hashes.~~
    * ~~Provisions domains with downStreamTerms.~~
    * ~~Ingests into tokenizer.~~
* Domain