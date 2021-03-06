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
Object.defineProperty(exports, "__esModule", { value: true });
const histogram_1 = require("./histogram");
describe('renderHistogram', () => {
    let pixelRatio;
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        pixelRatio = window.devicePixelRatio;
    });
    it('renders a histogram', () => __awaiter(this, void 0, void 0, function* () {
        const data = [
            { value: 50 },
            { value: 100 },
            { value: 100 },
        ];
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('table thead tr').length).toBe(1);
        expect(document.querySelectorAll('table thead th').length).toBe(6);
        expect(document.querySelectorAll('table tbody tr').length).toBe(1);
        expect(document.querySelectorAll('table tbody td').length).toBe(6);
    }));
    it('renders a histogram with number array', () => __awaiter(this, void 0, void 0, function* () {
        const data = [50, 100, 100];
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('table thead tr').length).toBe(1);
        expect(document.querySelectorAll('table thead th').length).toBe(6);
        expect(document.querySelectorAll('table tbody tr').length).toBe(1);
        expect(document.querySelectorAll('table tbody td').length).toBe(6);
    }));
    it('renders a histogram with typed array', () => __awaiter(this, void 0, void 0, function* () {
        const data = new Int32Array([50, 100, 100]);
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('table thead tr').length).toBe(1);
        expect(document.querySelectorAll('table thead th').length).toBe(6);
        expect(document.querySelectorAll('table tbody tr').length).toBe(1);
        expect(document.querySelectorAll('table tbody td').length).toBe(6);
    }));
    it('re-renders a histogram', () => __awaiter(this, void 0, void 0, function* () {
        const data = [
            { value: 50 },
            { value: 100 },
            { value: 100 },
        ];
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('updates a histogram chart', () => __awaiter(this, void 0, void 0, function* () {
        let data = [
            { value: 50 },
            { value: 100 },
            { value: 100 },
        ];
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        data = [
            { value: 150 },
            { value: 100 },
            { value: 150 },
        ];
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('renders correct stats', () => __awaiter(this, void 0, void 0, function* () {
        const data = [
            { value: 50 },
            { value: -100 },
            { value: 200 },
            { value: 0 },
            { value: 0 },
            { value: NaN },
            { value: NaN },
            { value: NaN },
        ];
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('table tbody tr').length).toBe(1);
        const statsEls = document.querySelectorAll('table tbody td');
        expect(statsEls.length).toBe(6);
        expect(statsEls[0].textContent).toEqual('8');
        expect(statsEls[1].textContent).toEqual('-100');
        expect(statsEls[2].textContent).toEqual('200');
        expect(statsEls[3].textContent).toEqual('2 (25%)');
        expect(statsEls[4].textContent).toEqual('3 (37.5%)');
    }));
    it('does not throw on empty data', () => __awaiter(this, void 0, void 0, function* () {
        const data = [];
        const container = document.getElementById('container');
        expect(() => __awaiter(this, void 0, void 0, function* () {
            yield histogram_1.histogram(container, data);
        })).not.toThrow();
        expect(document.querySelectorAll('.vega-embed').length).toBe(0);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('table thead tr').length).toBe(1);
        expect(document.querySelectorAll('table thead th').length).toBe(3);
    }));
    it('renders custom stats', () => __awaiter(this, void 0, void 0, function* () {
        const data = [
            { value: 50 },
        ];
        const stats = {
            numVals: 200,
            min: -30,
            max: 140,
            numZeros: 2,
            numNans: 5,
        };
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data, { stats });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('table tbody tr').length).toBe(1);
        const statsEls = document.querySelectorAll('table tbody td');
        expect(statsEls.length).toBe(5);
        expect(statsEls[0].textContent).toEqual('200');
        expect(statsEls[1].textContent).toEqual('-30');
        expect(statsEls[2].textContent).toEqual('140');
        expect(statsEls[3].textContent).toEqual('2 (1%)');
        expect(statsEls[4].textContent).toEqual('5 (2.5%)');
    }));
    it('sets width of chart', () => __awaiter(this, void 0, void 0, function* () {
        const data = [
            { value: 50 },
            { value: 100 },
            { value: 230 },
        ];
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data, { width: 400 });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('canvas').length).toBe(1);
        expect(document.querySelector('canvas').width).toBe(400 * pixelRatio);
    }));
    it('sets height of chart', () => __awaiter(this, void 0, void 0, function* () {
        const data = [
            { value: 50 },
            { value: 100 },
            { value: 230 },
        ];
        const container = document.getElementById('container');
        yield histogram_1.histogram(container, data, { height: 200 });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('canvas').length).toBe(1);
        expect(document.querySelector('canvas').height).toBe(200 * pixelRatio);
    }));
});
