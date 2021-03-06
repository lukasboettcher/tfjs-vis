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
const tfl = __importStar(require("@tensorflow/tfjs-layers"));
const model_1 = require("./model");
describe('modelSummary', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
    });
    it('renders a model summary', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const model = tfl.sequential();
        model.add(tfl.layers.dense({ units: 1, inputShape: [1] }));
        yield model_1.modelSummary(container, model);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('tr').length).toBe(2);
    }));
});
describe('layer', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
    });
    it('renders a layer summary', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const model = tfl.sequential();
        const dense = tfl.layers.dense({ units: 1, inputShape: [1] });
        model.add(dense);
        model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
        yield model_1.layer(container, dense);
        expect(document.querySelectorAll('table').length).toBe(1);
        expect(document.querySelectorAll('tr').length).toBe(3);
    }));
});
