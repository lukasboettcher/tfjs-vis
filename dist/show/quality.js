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
const render_utils_1 = require("../render/render_utils");
const table_1 = require("../render/table");
/**
 * Renders a per class accuracy table for classification task evaluation
 *
 * ```js
 * const labels = tf.tensor1d([0, 0, 1, 2, 2, 2]);
 * const predictions = tf.tensor1d([0, 0, 0, 2, 1, 1]);
 *
 * const result = await tfvis.metrics.perClassAccuracy(labels, predictions);
 * console.log(result)
 *
 * const container = {name: 'Per Class Accuracy', tab: 'Evaluation'};
 * const categories = ['cat', 'dog', 'mouse'];
 * await tfvis.show.perClassAccuracy(container, result, categories);
 * ```
 *
 * @param container A `{name: string, tab?: string}` object specifying which
 * surface to render to.
 * @param classAccuracy An `Array<{accuracy: number, count: number}>` array with
 * the accuracy data. See metrics.perClassAccuracy for details on how to
 * generate this object.
 * @param classLabels An array of string labels for the classes in
 * `classAccuracy`. Optional.
 *
 * @doc {
 *  heading: 'Models & Tensors',
 *  subheading: 'Model Evaluation',
 *  namespace: 'show'
 * }
 */
function perClassAccuracy(container, classAccuracy, classLabels) {
    return __awaiter(this, void 0, void 0, function* () {
        const drawArea = render_utils_1.getDrawArea(container);
        const headers = [
            'Class',
            'Accuracy',
            '# Samples',
        ];
        const values = [];
        for (let i = 0; i < classAccuracy.length; i++) {
            const label = classLabels ? classLabels[i] : i.toString();
            const classAcc = classAccuracy[i];
            values.push([label, classAcc.accuracy, classAcc.count]);
        }
        return table_1.table(drawArea, { headers, values });
    });
}
exports.perClassAccuracy = perClassAccuracy;
