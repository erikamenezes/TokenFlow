import { assert } from 'chai';
import 'mocha';

import { PID, Tokenizer } from '../../src/tokenizer';

describe('Tokenizer', () => {
    describe('#addItem', () => {
        it('should add item text to `this.items` and PIDs to `this.pids`', () => {
            const downstreamWords = new Set([]);
            const tokenizer = new Tokenizer(downstreamWords, undefined, false);
            const items:Array<[PID, string]> = [
                [1, 'one'],
                [2, 'two'],
                [3, 'three']];

            items.forEach((item, index) => {
                const pid = item[0];
                const text = item[1];
                tokenizer.addItem(pid, text, false);
                assert.equal(tokenizer.aliases.length, index + 1);
                assert.equal(tokenizer.aliases[index].text, text);
                assert.equal(tokenizer.aliases[index].pid, pid);
            });
        });

        it('should apply MurmurHash3 with seed value of 0.', () => {
            const downstreamWords = new Set([]);
            const tokenizer = new Tokenizer(downstreamWords, undefined, false);
            const input = 'small unsweeten ice tea';
            tokenizer.addItem(1, input, false);
            const observed = tokenizer.aliases[0].hashes;
            const expected:number[] = [2557986934, 1506511588, 4077993285, 1955911164];
            assert.deepEqual(observed, expected);
        });

        it('should build posting lists.', () => {
            const downstreamWords = new Set([]);
            const tokenizer = new Tokenizer(downstreamWords, undefined, false);

            // DESIGN NOTE: the terms 'a'..'f' are known to stem to themselves.
            const items = ['a b c', 'b c d', 'd e f'];

            items.forEach((item, index) => {
                tokenizer.addItem(index, item, false);
            });
    
            // Verify that item text and stemmed item text are recorded.
            items.forEach((item, index) => {
                assert.equal(tokenizer.aliases[index].text, items[index]);
                assert.equal(tokenizer.aliases[index].stemmed, items[index]);
            });

            // Verify that posting lists are correct.
            const terms = ['a', 'b', 'c', 'd', 'e', 'f'];
            const expectedPostings = [
                [0],        // a
                [0, 1],     // b
                [0, 1],     // c
                [1, 2],     // d
                [2],        // e
                [2]         // f
            ];

            const observedPostings = terms.map((term) =>
                tokenizer.postings[tokenizer.hashTerm(term)]);
            assert.deepEqual(observedPostings, expectedPostings);

            // Verify that term frequencies are correct.
            const expectedFrequencies = [
                1,  // a
                2,  // b
                2,  // c
                2,  // d
                1,  // e
                1   // f
            ];
            const observedFrequencies = terms.map((term) =>
                tokenizer.hashToFrequency[tokenizer.hashTerm(term)]);
            assert.deepEqual(observedFrequencies, expectedFrequencies);
        });

        // it should add tokens to downstream terms
    });

    describe('#stemTerm', () => {
        it('should apply the Snowball English Stemmer', () => {
            const downstreamWords = new Set([]);
            const tokenizer = new Tokenizer(downstreamWords, undefined, false);
            const input = 'red convertible sedan rims tires knobby spinners slicks turbo charger';
            const terms = input.split(/\s+/);
            const stemmed = terms.map((term) => tokenizer.stemTerm(term));
            const observed = stemmed.join(' ');
            const expected = 'red convert sedan rim tire knobbi spinner slick turbo charger';
            assert.equal(observed, expected);
        });
    });

    describe('#exactMathScore', () => {
        it('should return the length of the common prefix', () => {
            const downstreamWords = new Set([]);
            const tokenizer = new Tokenizer(downstreamWords, undefined, false);

            assert.deepEqual({score: 2, length: 2}, tokenizer.exactMatchScore([1, 2, 3, 4, 5], [1, 2]));
            assert.deepEqual({score: 0, length: 0}, tokenizer.exactMatchScore([1, 2, 3, 4, 5], [1, 2, 4]));
            assert.deepEqual({score: 0, length: 0}, tokenizer.exactMatchScore([1, 2, 3, 4, 5], [2]));
            assert.deepEqual({score: 0, length: 0}, tokenizer.exactMatchScore([1, 2, 3, 4, 5], []));
            assert.deepEqual({score: 0, length: 0}, tokenizer.exactMatchScore([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6, 7]));
            assert.deepEqual({score: 0, length: 0}, tokenizer.exactMatchScore([], [1, 2, 3, 4, 5, 6, 7]));
        });
    });

});
