import * as path from 'path';
import { Pipeline } from './pipeline';
import { stemmerConfusionMatrix } from '../src/stemmer_confusion_matrix';
import { Tokenizer } from '../src/tokenizer';

function stemmerConfusionDemo() {
    const pipeline = new Pipeline(
        path.join(__dirname, './data/cars/catalog.yaml'),
        path.join(__dirname, './data/intents.yaml'),
        path.join(__dirname, './data/attributes.yaml'),
        path.join(__dirname, './data/quantifiers.yaml'),
        undefined);

    stemmerConfusionMatrix(pipeline.compositeRecognizer, Tokenizer.defaultStemTerm);
}

stemmerConfusionDemo();
