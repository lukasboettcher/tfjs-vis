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
const heatmap_1 = require("./heatmap");
describe('renderHeatmap', () => {
    let pixelRatio;
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        pixelRatio = window.devicePixelRatio;
    });
    it('renders a chart', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('renders a chart with rowMajor=true', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20], [8, 2, 8]],
        };
        const numTensorsBefore = tf.memory().numTensors;
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data, { rowMajor: true });
        const numTensorsAfter = tf.memory().numTensors;
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(numTensorsAfter).toEqual(numTensorsBefore);
    }));
    it('renders a chart with rowMajor=true and custom labels', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20], [8, 2, 8]],
            xTickLabels: ['alpha', 'beta', 'gamma'],
            yTickLabels: ['first', 'second', 'third', 'fourth'],
        };
        const numTensorsBefore = tf.memory().numTensors;
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data, { rowMajor: true });
        const numTensorsAfter = tf.memory().numTensors;
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(numTensorsAfter).toEqual(numTensorsBefore);
    }));
    it('renders a chart with a tensor', () => __awaiter(this, void 0, void 0, function* () {
        const values = tf.tensor2d([[4, 2, 8], [1, 7, 2], [3, 3, 20]]);
        const data = {
            values,
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        values.dispose();
    }));
    it('throws an exception with a non 2d tensor', () => __awaiter(this, void 0, void 0, function* () {
        const values = tf.tensor1d([4, 2, 8, 1, 7, 2, 3, 3, 20]);
        const data = {
            values,
        };
        const container = document.getElementById('container');
        let threw = false;
        try {
            // @ts-ignore — passing in the wrong datatype
            yield heatmap_1.heatmap(data, container);
        }
        catch (e) {
            threw = true;
        }
        finally {
            values.dispose();
        }
        expect(threw).toBe(true);
    }));
    it('renders a chart with custom colormap', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data, { colorMap: 'greyscale' });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('renders a chart with custom domain', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data, { domain: [0, 30] });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('renders a chart with custom labels', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
            xTickLabels: ['cheese', 'pig', 'font'],
            yTickLabels: ['speed', 'dexterity', 'roundness'],
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('updates the chart', () => __awaiter(this, void 0, void 0, function* () {
        let data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        data = {
            values: [[43, 2, 8], [1, 7, 2], [3, 3, 20]],
        };
        yield heatmap_1.heatmap(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('sets width of chart', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data, { width: 400 });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('canvas').length).toBe(1);
        expect(document.querySelector('canvas').width).toBe(400 * pixelRatio);
    }));
    it('sets height of chart', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
        };
        const container = document.getElementById('container');
        yield heatmap_1.heatmap(container, data, { height: 200 });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('canvas').length).toBe(1);
        expect(document.querySelector('canvas').height).toBe(200 * pixelRatio);
    }));
    it('throws on wrong number of xTickLabels', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20], [8, 2, 8]],
            xTickLabels: ['alpha'],
            yTickLabels: ['first', 'second', 'third', 'fourth'],
        };
        const container = document.getElementById('container');
        let threw = false;
        try {
            yield heatmap_1.heatmap(container, data, { height: 200 });
        }
        catch (e) {
            threw = true;
        }
        expect(threw).toBe(true);
    }));
    it('throws on wrong number of yTickLabels', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [[4, 2, 8], [1, 7, 2], [3, 3, 20], [8, 2, 8]],
            xTickLabels: ['alpha', 'beta', 'gamma'],
            yTickLabels: ['first'],
        };
        const container = document.getElementById('container');
        let threw = false;
        try {
            yield heatmap_1.heatmap(container, data, { height: 200 });
        }
        catch (e) {
            threw = true;
        }
        expect(threw).toBe(true);
    }));
});
