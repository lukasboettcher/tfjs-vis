"use strict";
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs-core"));
const math_1 = require("./math");
const utils_1 = require("./utils");
//
// arrayStats
//
describe('arrayStats', () => {
    it('throws on non array input', () => {
        // @ts-ignore
        expect(() => math_1.arrayStats('string')).toThrow();
    });
    it('handles empty arrays', () => {
        const stats = math_1.arrayStats([]);
        expect(stats.max).toBe(undefined);
        expect(stats.min).toBe(undefined);
        expect(stats.numVals).toBe(0);
        expect(stats.numNans).toBe(0);
        expect(stats.numZeros).toBe(0);
    });
    it('computes correct stats', () => {
        const data = [2, 3, -400, 500, NaN, -800, 0, 0, 0];
        const stats = math_1.arrayStats(data);
        expect(stats.max).toBe(500);
        expect(stats.min).toBe(-800);
        expect(stats.numVals).toBe(9);
        expect(stats.numNans).toBe(1);
        expect(stats.numZeros).toBe(3);
    });
    it('computes correct stats — all negative', () => {
        const data = [-2, -3, -400, -500, NaN, -800];
        const stats = math_1.arrayStats(data);
        expect(stats.max).toBe(-2);
        expect(stats.min).toBe(-800);
        expect(stats.numVals).toBe(6);
        expect(stats.numNans).toBe(1);
        expect(stats.numZeros).toBe(0);
    });
    it('computes correct stats — all zeros', () => {
        const data = [0, 0, 0, 0];
        const stats = math_1.arrayStats(data);
        expect(stats.max).toBe(0);
        expect(stats.min).toBe(0);
        expect(stats.numVals).toBe(4);
        expect(stats.numNans).toBe(0);
        expect(stats.numZeros).toBe(4);
    });
    it('computes correct stats — all NaNs', () => {
        const data = [NaN, NaN, NaN, NaN];
        const stats = math_1.arrayStats(data);
        expect(isNaN(stats.max)).toBe(true);
        expect(isNaN(stats.min)).toBe(true);
        expect(stats.numVals).toBe(4);
        expect(stats.numNans).toBe(4);
        expect(stats.numZeros).toBe(0);
    });
    it('computes correct stats — some infs', () => {
        const data = [10, 4, Infinity, -Infinity, NaN];
        const stats = math_1.arrayStats(data);
        expect(stats.max).toBe(Infinity);
        expect(stats.min).toBe(-Infinity);
        expect(stats.numVals).toBe(5);
        expect(stats.numNans).toBe(1);
        expect(stats.numZeros).toBe(0);
        expect(stats.numInfs).toBe(2);
    });
});
//
// tensorStats
//
describe('tensorStats', () => {
    it('computes correct stats', () => __awaiter(this, void 0, void 0, function* () {
        const data = tf.tensor([2, 3, -400, 500, NaN, -800, 0, 0, 0]);
        const stats = yield math_1.tensorStats(data);
        expect(stats.max).toBeCloseTo(500);
        expect(stats.min).toBeCloseTo(-800);
        expect(stats.numVals).toBe(9);
        expect(stats.numNans).toBe(1);
        expect(stats.numZeros).toBe(3);
    }));
    it('computes correct stats — all negative', () => __awaiter(this, void 0, void 0, function* () {
        const data = tf.tensor([-2, -3, -400, -500, NaN, -800]);
        const stats = yield math_1.tensorStats(data);
        expect(stats.max).toBeCloseTo(-2);
        expect(stats.min).toBeCloseTo(-800);
        expect(stats.numVals).toBe(6);
        expect(stats.numNans).toBe(1);
        expect(stats.numZeros).toBe(0);
    }));
    it('computes correct stats — all zeros', () => __awaiter(this, void 0, void 0, function* () {
        const data = tf.tensor([0, 0, 0, 0]);
        const stats = yield math_1.tensorStats(data);
        expect(stats.max).toBe(0);
        expect(stats.min).toBe(0);
        expect(stats.numVals).toBe(4);
        expect(stats.numNans).toBe(0);
        expect(stats.numZeros).toBe(4);
    }));
    it('computes correct stats — all NaNs', () => __awaiter(this, void 0, void 0, function* () {
        const data = tf.tensor([NaN, NaN, NaN, NaN]);
        const stats = yield math_1.tensorStats(data);
        expect(isNaN(stats.max)).toBe(true);
        expect(isNaN(stats.min)).toBe(true);
        expect(stats.numVals).toBe(4);
        expect(stats.numNans).toBe(4);
        expect(stats.numZeros).toBe(0);
    }));
    it('computes correct stats — some infs', () => __awaiter(this, void 0, void 0, function* () {
        const data = tf.tensor([10, 4, Infinity, -Infinity, NaN]);
        const stats = yield math_1.tensorStats(data);
        expect(stats.max).toBe(Infinity);
        expect(stats.min).toBe(-Infinity);
        expect(stats.numVals).toBe(5);
        expect(stats.numNans).toBe(1);
        expect(stats.numZeros).toBe(0);
        expect(stats.numInfs).toBe(2);
    }));
});
//
// confusionMatrix
//
describe('confusionMatrix', () => {
    it('computes a confusion matrix', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4]);
        const predictions = tf.tensor1d([2, 2, 4]);
        const expected = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1],
        ];
        const result = yield math_1.confusionMatrix(labels, predictions);
        expect(result).toEqual(expected);
    }));
    it('computes a confusion matrix with explicit numClasses', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4]);
        const predictions = tf.tensor1d([2, 2, 4]);
        const numClasses = 6;
        const expected = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        const result = yield math_1.confusionMatrix(labels, predictions, numClasses);
        expect(result).toEqual(expected);
    }));
    it('computes a confusion matrix with custom weights', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([0, 1, 2, 3, 4]);
        const predictions = tf.tensor1d([0, 1, 2, 3, 4]);
        const weights = tf.tensor1d([0, 1, 2, 3, 4]);
        const expected = [
            [0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 2, 0, 0],
            [0, 0, 0, 3, 0],
            [0, 0, 0, 0, 4],
        ];
        const result = yield math_1.confusionMatrix(labels, predictions, undefined, weights);
        expect(result).toEqual(expected);
    }));
    it('computes a confusion matrix where preds and labels do not intersect', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 1, 2, 3, 5, 1, 3, 6, 3, 1]);
        const predictions = tf.tensor1d([1, 1, 2, 3, 5, 6, 1, 2, 3, 4]);
        const expected = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 1, 0, 1],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 0],
        ];
        const result = yield math_1.confusionMatrix(labels, predictions);
        expect(result).toEqual(expected);
    }));
    it('computes a confusion matrix with multiple matches', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([4, 5, 6]);
        const predictions = tf.tensor1d([1, 2, 3]);
        const expected = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
        ];
        const result = yield math_1.confusionMatrix(labels, predictions);
        expect(result).toEqual(expected);
    }));
    it('errors on non 1d label tensor', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor([1, 2, 4, 4], [2, 2]);
        const predictions = tf.tensor1d([2, 2, 4, 3]);
        let errorMessage;
        try {
            //@ts-ignore
            yield math_1.confusionMatrix(labels, predictions);
        }
        catch (e) {
            errorMessage = e.message;
        }
        expect(errorMessage).toEqual('labels must be a 1D tensor');
    }));
    it('errors on non 1d prediction tensor', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4, 4]);
        const predictions = tf.tensor([2, 2, 4, 3], [2, 2]);
        let errorMessage;
        try {
            //@ts-ignore
            yield math_1.confusionMatrix(labels, predictions);
        }
        catch (e) {
            errorMessage = e.message;
        }
        expect(errorMessage).toEqual('predictions must be a 1D tensor');
    }));
    it('errors on tensors of different lengths', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4]);
        const predictions = tf.tensor1d([2, 2, 4, 3, 6]);
        let errorMessage;
        try {
            //@ts-ignore
            yield math_1.confusionMatrix(labels, predictions);
        }
        catch (e) {
            errorMessage = e.message;
        }
        expect(errorMessage)
            .toEqual('labels and predictions must be the same length');
    }));
});
//
// accuracy
//
describe('accuracy', () => {
    it('computes accuracy', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4]);
        const predictions = tf.tensor1d([2, 2, 4]);
        const result = yield math_1.accuracy(labels, predictions);
        expect(result).toBeCloseTo(2 / 3, utils_1.DECIMAL_PLACES_TO_CHECK);
    }));
    it('computes accuracy, no matches', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4]);
        const predictions = tf.tensor1d([5, 6, 8]);
        const result = yield math_1.accuracy(labels, predictions);
        expect(result).toBeCloseTo(0, utils_1.DECIMAL_PLACES_TO_CHECK);
    }));
    it('computes accuracy, all matches', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 3]);
        const predictions = tf.tensor1d([1, 2, 3]);
        const result = yield math_1.accuracy(labels, predictions);
        expect(result).toBeCloseTo(1, utils_1.DECIMAL_PLACES_TO_CHECK);
    }));
    it('computes accuracy, tensor 2d', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor2d([
            [1, 2],
            [3, 4],
            [5, 6],
        ]);
        const predictions = tf.tensor2d([
            [1, 9],
            [3, 4],
            [5, 6],
        ]);
        const result = yield math_1.accuracy(labels, predictions);
        expect(result).toBeCloseTo(5 / 6, utils_1.DECIMAL_PLACES_TO_CHECK);
    }));
    it('errors on tensors of different shapes', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4, 4]);
        const predictions = tf.tensor([2, 2, 4, 3], [2, 2]);
        let errorMessage;
        try {
            //@ts-ignore
            yield math_1.accuracy(labels, predictions);
        }
        catch (e) {
            errorMessage = e.message;
        }
        expect(errorMessage)
            .toEqual('Error computing accuracy. Shapes 4 and 2,2 must match');
    }));
});
//
// accuracy
//
describe('per class accuracy', () => {
    it('computes per class accuracy', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([0, 0, 1, 2, 2, 2]);
        const predictions = tf.tensor1d([0, 0, 0, 2, 1, 1]);
        const result = yield math_1.perClassAccuracy(labels, predictions);
        expect(result.map(d => d.accuracy)).toEqual([1, 0, 1 / 3]);
        expect(result.map(d => d.count)).toEqual([2, 1, 3]);
    }));
    it('computes per class accuracy, no matches', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 1, 1, 1, 1]);
        const predictions = tf.tensor1d([0, 0, 0, 0, 0]);
        const result = yield math_1.perClassAccuracy(labels, predictions);
        expect(result.map(d => d.accuracy)).toEqual([0, 0]);
        expect(result.map(d => d.count)).toEqual([0, 5]);
    }));
    it('computes per class accuracy, all matches', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([0, 1, 2, 3, 3, 3]);
        const predictions = tf.tensor1d([0, 1, 2, 3, 3, 3]);
        const result = yield math_1.perClassAccuracy(labels, predictions);
        expect(result.map(d => d.accuracy)).toEqual([1, 1, 1, 1]);
        expect(result.map(d => d.count)).toEqual([1, 1, 1, 3]);
    }));
    it('computes per class accuracy, explicit numClasses', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([0, 1, 2, 2]);
        const predictions = tf.tensor1d([0, 1, 2, 1]);
        const result = yield math_1.perClassAccuracy(labels, predictions, 5);
        expect(result.map(d => d.accuracy)).toEqual([1, 1, 0.5, 0, 0]);
        expect(result.map(d => d.count)).toEqual([1, 1, 2, 0, 0]);
    }));
    it('errors on non 1d label tensor', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor([1, 2, 4, 4], [2, 2]);
        const predictions = tf.tensor1d([2, 2, 4, 3]);
        let errorMessage;
        try {
            //@ts-ignore
            yield math_1.perClassAccuracy(labels, predictions);
        }
        catch (e) {
            errorMessage = e.message;
        }
        expect(errorMessage).toEqual('labels must be a 1D tensor');
    }));
    it('errors on non 1d prediction tensor', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4, 4]);
        const predictions = tf.tensor([2, 2, 4, 3], [2, 2]);
        let errorMessage;
        try {
            //@ts-ignore
            yield math_1.perClassAccuracy(labels, predictions);
        }
        catch (e) {
            errorMessage = e.message;
        }
        expect(errorMessage).toEqual('predictions must be a 1D tensor');
    }));
    it('errors on tensors of different lengths', () => __awaiter(this, void 0, void 0, function* () {
        const labels = tf.tensor1d([1, 2, 4]);
        const predictions = tf.tensor1d([2, 2, 4, 3, 6]);
        let errorMessage;
        try {
            //@ts-ignore
            yield math_1.perClassAccuracy(labels, predictions);
        }
        catch (e) {
            errorMessage = e.message;
        }
        expect(errorMessage)
            .toEqual('labels and predictions must be the same length');
    }));
});
