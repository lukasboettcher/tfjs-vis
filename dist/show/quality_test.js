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
const quality_1 = require("./quality");
describe('perClassAccuracy', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
    });
    it('renders perClassAccuracy', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const acc = [
            { accuracy: 0.5, count: 10 },
            { accuracy: 0.8, count: 10 },
        ];
        const labels = ['cat', 'dog'];
        yield quality_1.perClassAccuracy(container, acc, labels);
        expect(document.querySelectorAll('table').length).toBe(1);
    }));
    it('renders perClassAccuracy without explicit labels', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const acc = [
            { accuracy: 0.5, count: 10 },
            { accuracy: 0.8, count: 10 },
        ];
        yield quality_1.perClassAccuracy(container, acc);
        expect(document.querySelectorAll('table').length).toBe(1);
    }));
});
