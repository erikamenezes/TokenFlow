import { assert } from 'chai';
import 'mocha';

import { DynamicGraph, Edge, GraphWalker } from '../../src/graph';
import { StaticGraph } from './static_graph';

// Returns a string representation of the current path and its score.
// The path is rendered as a sequence of vertices, each of which is
// represented by the letters a, b, c, ...
function getPath(g: GraphWalker) {
    const path = [...g.left, ...g.right];
    const current = g.current;
    let score = 0;
    const vertices = [0];
    let text = (current === 0) ? 'a*' : 'a';
    for (const edge of path) {
        const vertex = vertices[vertices.length - 1] + edge.length;
        vertices.push(vertex);
        text = text.concat(String.fromCharCode(97 + vertex));
        if (current === vertices[vertices.length - 1]) {
            text = text.concat('*');
        }
        score += edge.score;
    }
    return `${text}: ${score}`;
}

// Exercises the GraphWalker API to generates all paths in a graph.
function* walk(g: GraphWalker): IterableIterator<string> {
    while (true) {
        // Advance down next edge in current best path.
        g.advance();

        if (g.complete()) {
            // If the path is complete, ie it goes from the first vertex to the
            // last vertex, then yield the path.
            yield(getPath(g));
        }
        else {
            // Otherwise, walk further down the path.
            yield* walk(g);
        }

        // We've now explored all paths down this edge.
        // Retreat back to the previous vertex.
        g.retreat(true);
    
        // Then, attempt to discard the edge we just explored. If, after
        // discarding, there is no path to the end then break out of the loop.
        // Otherwise go back to the top to explore the new path.
        if (!g.discard()) {
            break;
        }
    }
}

function makeEdgeList(vertexCount: number): Edge[][] {
    const edgeList: Edge[][] = [];

    for (let i = 0; i < vertexCount; ++i) {
        const edges: Edge[] = [];
        for (let j = 2; i + j <= vertexCount; ++j) {
            const label = i * 10 + i + j;
            const length = j;
            const score = j - Math.pow(0.2, j);
            edges.push({ score, length, label });
        }
        edgeList.push(edges);
    }

    return edgeList;
}

describe('Graph', () => {
    // This test checks to see that walks of the DynamicGraph and StaticGraph
    // enumerate the same paths in the same order. The theory is that the test
    // will catch some bugs because the two graphs use different algorithms.
    // This test does not verify that the paths are correct or complete.
    // It just verifies that the two algorithsm produce the same output.
    it('enumerate all paths', () => {
        const vertexCount = 6;

        const edgeList1: Edge[][] = makeEdgeList(vertexCount);
        const graph1 = new StaticGraph(edgeList1);
        const walker1 = new GraphWalker(graph1);

        const edgeList2: Edge[][] = makeEdgeList(vertexCount);
        const graph2 = new DynamicGraph(edgeList2);
        const walker2 = new GraphWalker(graph2);

        const walk1 = walk(walker1);
        const walk2 = walk(walker2);

        while (true) {
            const step1 = walk1.next();
            const step2 = walk2.next();

            assert.equal(step1.done, step2.done, "Sequences have different lengths.");

            if (step1.done || step2.done) {
                break;
            }

            assert.equal(step1.value, step2.value, "Paths are not the same.");
        }
    });

    // This test verifies that a walk of DynamicGraph generates the expected
    // number of paths. It does not verify that the paths are correct, unique,
    // or in the right order.
    it('enumerates correct number of paths', () => {
        const vertexCount = 6;

        const edgeList: Edge[][] = makeEdgeList(vertexCount);
        const graph = new DynamicGraph(edgeList);
        const walker = new GraphWalker(graph);

        const observedPathCount = [...walk(walker)].length;
        const expectedPathCount = Math.pow(2, vertexCount - 1);

        assert.equal(observedPathCount, expectedPathCount);
    });

    // This test verfies that each path generated by a walk of DynamicGraph is
    // unique. It does not verify that the paths are correct or in the right
    // order.
    it('each path is unique', () => {
        const vertexCount = 6;

        const edgeList: Edge[][] = makeEdgeList(vertexCount);
        const graph = new DynamicGraph(edgeList);
        const walker = new GraphWalker(graph);

        const set = new Set();
        for (const path of walk(walker)) {
            set.add(path);
        }

        const observedPathCount = set.size;
        const expectedPathCount = Math.pow(2, vertexCount - 1);

        assert.equal(observedPathCount, expectedPathCount);
    });

    // This test verifies that a walk of a specific DynamicGraph generates the
    // expected sequence of paths.
    it('enumerates exact sequence of paths', () => {
        const edgeList: Edge[][] = makeEdgeList(6);
        const graph = new DynamicGraph(edgeList);
        const walker = new GraphWalker(graph);

        const observed = [...walk(walker)];

        const expected = [
            'ag*: 5.999936',
            'adg*: 5.984',
            'adeg*: 4.952',
            'adefg*: 2.992',
            'adfg*: 4.952',
            'acg*: 5.9584',
            'aceg*: 5.88',
            'acefg*: 3.92',
            'acdg*: 4.952',
            'acdeg*: 3.92',
            'acdefg*: 1.96',
            'acdfg*: 3.92',
            'acfg*: 4.952',
            'aeg*: 5.9584',
            'aefg*: 3.9984',
            'abg*: 4.99968',
            'abdg*: 4.952',
            'abdeg*: 3.92',
            'abdefg*: 1.96',
            'abdfg*: 3.92',
            'abeg*: 4.952',
            'abefg*: 2.992',
            'abcg*: 3.9984',
            'abceg*: 3.92',
            'abcefg*: 1.96',
            'abcdg*: 2.992',
            'abcdeg*: 1.96',
            'abcdefg*: 0',
            'abcdfg*: 1.96',
            'abcfg*: 2.992',
            'abfg*: 3.9984',
            'afg*: 4.99968'];
        
        assert.deepEqual(observed, expected);
    });
});


// Tests
//  *1. Both walks produce same results.
//   2. Right number of paths.
//   3. All paths different.
//   4. Paths in correct order.
//   5. Correct number of paths.
//  *6. Exact sequence of paths.
//
// Checkpoint
// Restore
