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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vega_embed_1 = __importDefault(require("vega-embed"));
const dom_1 = require("../util/dom");
const render_utils_1 = require("./render_utils");
/**
 * Renders a confusion matrix.
 *
 * Can optionally exclude the diagonal from being shaded if one wants the visual
 * focus to be on the incorrect classifications. Note that if the classification
 * is perfect (i.e. only the diagonal has values) then the diagonal will always
 * be shaded.
 *
 * ```js
 * const rows = 5;
 * const cols = 5;
 * const values = [];
 * for (let i = 0; i < rows; i++) {
 *   const row = []
 *   for (let j = 0; j < cols; j++) {
 *     row.push(Math.round(Math.random() * 50));
 *   }
 *   values.push(row);
 * }
 * const data = { values };
 *
 * // Render to visor
 * const surface = { name: 'Confusion Matrix', tab: 'Charts' };
 * tfvis.render.confusionMatrix(surface, data);
 * ```
 *
 * ```js
 * // The diagonal can be excluded from shading.
 *
 * const data = {
 *   values: [[4, 2, 8], [1, 7, 2], [3, 3, 20]],
 * }
 *
 * // Render to visor
 * const surface = {
 *  name: 'Confusion Matrix with Excluded Diagonal', tab: 'Charts'
 * };
 *
 * tfvis.render.confusionMatrix(surface, data, {
 *   shadeDiagonal: false
 * });
 * ```
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
function confusionMatrix(container, data, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = Object.assign({}, defaultOpts, opts);
        const drawArea = render_utils_1.getDrawArea(container);
        // Format data for vega spec; an array of objects, one for for each cell
        // in the matrix.
        const values = [];
        const inputArray = data.values;
        const tickLabels = data.tickLabels || [];
        const generateLabels = tickLabels.length === 0;
        let nonDiagonalIsAllZeroes = true;
        for (let i = 0; i < inputArray.length; i++) {
            const label = generateLabels ? `Class ${i}` : tickLabels[i];
            if (generateLabels) {
                tickLabels.push(label);
            }
            for (let j = 0; j < inputArray[i].length; j++) {
                const prediction = generateLabels ? `Class ${j}` : tickLabels[j];
                const count = inputArray[i][j];
                if (i === j && !options.shadeDiagonal) {
                    values.push({
                        label,
                        prediction,
                        count,
                        noFill: true,
                    });
                }
                else {
                    values.push({
                        label,
                        prediction,
                        count,
                        scaleCount: count,
                    });
                    // When not shading the diagonal we want to check if there is a non
                    // zero value. If all values are zero we will not color them as the
                    // scale will be invalid.
                    if (count !== 0) {
                        nonDiagonalIsAllZeroes = false;
                    }
                }
            }
        }
        if (!options.shadeDiagonal && nonDiagonalIsAllZeroes) {
            // User has specified requested not to shade the diagonal but all the other
            // values are zero. We have two choices, don't shade the anything or only
            // shade the diagonal. We choose to shade the diagonal as that is likely
            // more helpful even if it is not what the user specified.
            for (const val of values) {
                if (val.noFill === true) {
                    val.noFill = false;
                    val.scaleCount = val.count;
                }
            }
        }
        const embedOpts = {
            actions: false,
            mode: 'vega-lite',
            defaultStyle: false,
        };
        //@ts-ignore
        const spec = {
            'width': options.width || dom_1.getDefaultWidth(drawArea),
            'height': options.height || dom_1.getDefaultHeight(drawArea),
            'padding': 0,
            'autosize': {
                'type': 'fit',
                'contains': 'padding',
                'resize': true,
            },
            'config': {
                'axis': {
                    'labelFontSize': options.fontSize,
                    'titleFontSize': options.fontSize,
                },
                'text': { 'fontSize': options.fontSize },
                'legend': {
                    'labelFontSize': options.fontSize,
                    'titleFontSize': options.fontSize,
                }
            },
            //@ts-ignore
            'data': { 'values': values },
            'encoding': {
                'x': {
                    'field': 'prediction',
                    'type': 'ordinal',
                    'title': options.xLabel || 'prediction',
                    // Maintain sort order of the axis if labels is passed in
                    'scale': { 'domain': tickLabels },
                },
                'y': {
                    'field': 'label',
                    'type': 'ordinal',
                    'title': options.yLabel || 'label',
                    // Maintain sort order of the axis if labels is passed in
                    'scale': { 'domain': tickLabels },
                },
            },
            'layer': [
                {
                    // The matrix
                    'transform': [
                        { 'filter': 'datum.noFill != true' },
                    ],
                    'mark': {
                        'type': 'rect',
                    },
                    'encoding': {
                        'color': {
                            'field': 'scaleCount',
                            'type': 'quantitative',
                            //@ts-ignore
                            'scale': { 'range': options.colorMap },
                        },
                        'tooltip': [
                            { 'field': 'label', 'type': 'nominal' },
                            { 'field': 'prediction', 'type': 'nominal' },
                            { 'field': 'count', 'type': 'quantitative' },
                        ]
                    },
                },
            ]
        };
        if (options.shadeDiagonal === false) {
            //@ts-ignore
            spec.layer.push({
                // render unfilled rects for the diagonal
                'transform': [
                    { 'filter': 'datum.noFill == true' },
                ],
                'mark': {
                    'type': 'rect',
                    'fill': 'white',
                },
                'encoding': {
                    'tooltip': [
                        { 'field': 'label', 'type': 'nominal' },
                        { 'field': 'prediction', 'type': 'nominal' },
                        { 'field': 'count', 'type': 'quantitative' },
                    ]
                },
            });
        }
        if (options.showTextOverlay) {
            //@ts-ignore
            spec.layer.push({
                // The text labels
                'mark': { 'type': 'text', 'baseline': 'middle' },
                'encoding': {
                    'text': {
                        'field': 'count',
                        'type': 'nominal',
                    },
                }
            });
        }
        const colorMap = typeof options.colorMap === 'string' ?
            { scheme: options.colorMap } :
            options.colorMap;
        //@ts-ignore
        spec.layer[0].encoding.color.scale.range = colorMap;
        yield vega_embed_1.default(drawArea, spec, embedOpts);
    });
}
exports.confusionMatrix = confusionMatrix;
const defaultOpts = {
    xLabel: null,
    yLabel: null,
    xType: 'nominal',
    yType: 'nominal',
    shadeDiagonal: true,
    fontSize: 12,
    showTextOverlay: true,
    height: 400,
    colorMap: ['#f7fbff', '#4292c6'],
};
