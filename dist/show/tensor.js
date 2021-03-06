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
const histogram_1 = require("../render/histogram");
const render_utils_1 = require("../render/render_utils");
const math_1 = require("../util/math");
/**
 * Shows a histogram with the distribution of all values in a given tensor.
 *
 * ```js
 * const tensor = tf.tensor1d([0, 0, 0, 0, 2, 3, 4]);
 *
 * const surface = {name: 'Values Distribution', tab: 'Model Inspection'};
 * await tfvis.show.valuesDistribution(surface, tensor);
 * ```
 *
 * @doc {heading: 'Models & Tensors', subheading: 'Model Inspection', namespace:
 * 'show'}
 */
function valuesDistribution(container, tensor) {
    return __awaiter(this, void 0, void 0, function* () {
        const drawArea = render_utils_1.getDrawArea(container);
        const stats = yield math_1.tensorStats(tensor);
        const values = yield tensor.data();
        histogram_1.histogram(drawArea, values, { height: 150, stats });
    });
}
exports.valuesDistribution = valuesDistribution;
