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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs-core"));
const vega_embed_1 = __importDefault(require("vega-embed"));
const dom_1 = require("../util/dom");
const utils_1 = require("../util/utils");
const render_utils_1 = require("./render_utils");
/**
 * Renders a heatmap.
 *
 * ```js
 * const cols = 50;
 * const rows = 20;
 * const values = [];
 * for (let i = 0; i < cols; i++) {
 *   const col = []
 *   for (let j = 0; j < rows; j++) {
 *     col.push(i * j)
 *   }
 *   values.push(col);
 * }
 * const data = { values };
 *
 * // Render to visor
 * const surface = { name: 'Heatmap', tab: 'Charts' };
 * tfvis.render.heatmap(surface, data);
 * ```
 *
 * ```js
 * const data = {
 *   values: [[4, 2, 8, 20], [1, 7, 2, 10], [3, 3, 20, 13]],
 *   xTickLabels: ['cheese', 'pig', 'font'],
 *   yTickLabels: ['speed', 'smoothness', 'dexterity', 'mana'],
 * }
 *
 * // Render to visor
 * const surface = { name: 'Heatmap w Custom Labels', tab: 'Charts' };
 * tfvis.render.heatmap(surface, data);
 * ```
 *
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
function heatmap(container, data, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = Object.assign({}, defaultOpts, opts);
        const drawArea = render_utils_1.getDrawArea(container);
        let inputValues = data.values;
        if (options.rowMajor) {
            inputValues = yield convertToRowMajor(data.values);
        }
        // Data validation
        const { xTickLabels, yTickLabels } = data;
        if (xTickLabels != null) {
            const dimension = 0;
            assertLabelsMatchShape(inputValues, xTickLabels, dimension);
        }
        // Note that we will only do a check on the first element of the second
        // dimension. We do not protect users against passing in a ragged array.
        if (yTickLabels != null) {
            const dimension = 1;
            assertLabelsMatchShape(inputValues, yTickLabels, dimension);
        }
        //
        // Format data for vega spec; an array of objects, one for for each cell
        // in the matrix.
        //
        // If custom labels are passed in for xTickLabels or yTickLabels we need
        // to make sure they are 'unique' before mapping them to visual properties.
        // We therefore append the index of the label to the datum that will be used
        // for that label in the x or y axis. We could do this in all cases but choose
        // not to to avoid unnecessary string operations.
        //
        // We use IDX_SEPARATOR to demarcate the added index
        const IDX_SEPARATOR = '@tfidx@';
        const values = [];
        if (inputValues instanceof tf.Tensor) {
            utils_1.assert(inputValues.rank === 2, 'Input to renderHeatmap must be a 2d array or Tensor2d');
            // This is a slightly specialized version of TensorBuffer.get, inlining it
            // avoids the overhead of a function call per data element access and is
            // specialized to only deal with the 2d case.
            const inputArray = yield inputValues.data();
            const [numRows, numCols] = inputValues.shape;
            for (let row = 0; row < numRows; row++) {
                const x = xTickLabels ? `${xTickLabels[row]}${IDX_SEPARATOR}${row}` : row;
                for (let col = 0; col < numCols; col++) {
                    const y = yTickLabels ? `${yTickLabels[col]}${IDX_SEPARATOR}${col}` : col;
                    const index = (row * numCols) + col;
                    const value = inputArray[index];
                    values.push({ x, y, value });
                }
            }
        }
        else {
            const inputArray = inputValues;
            for (let row = 0; row < inputArray.length; row++) {
                const x = xTickLabels ? `${xTickLabels[row]}${IDX_SEPARATOR}${row}` : row;
                for (let col = 0; col < inputArray[row].length; col++) {
                    const y = yTickLabels ? `${yTickLabels[col]}${IDX_SEPARATOR}${col}` : col;
                    const value = inputArray[row][col];
                    values.push({ x, y, value });
                }
            }
        }
        const embedOpts = {
            actions: false,
            mode: 'vega-lite',
            defaultStyle: false,
        };
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
                },
                'scale': { 'bandPaddingInner': 0, 'bandPaddingOuter': 0 },
            },
            //@ts-ignore
            'data': { 'values': values },
            'mark': { 'type': 'rect', 'tooltip': true },
            'encoding': {
                'x': {
                    'field': 'x',
                    'type': options.xType,
                    'title': options.xLabel,
                    'sort': false,
                },
                'y': {
                    'field': 'y',
                    'type': options.yType,
                    'title': options.yLabel,
                    'sort': false,
                },
                'fill': {
                    'field': 'value',
                    'type': 'quantitative',
                }
            }
        };
        //
        // Format custom labels to remove the appended indices
        //
        const suffixPattern = `${IDX_SEPARATOR}\\d+$`;
        const suffixRegex = new RegExp(suffixPattern);
        if (xTickLabels) {
            // @ts-ignore
            spec.encoding.x.axis = {
                'labelExpr': `replace(datum.value, regexp(/${suffixPattern}/), '')`,
            };
        }
        if (yTickLabels) {
            // @ts-ignore
            spec.encoding.y.axis = {
                'labelExpr': `replace(datum.value, regexp(/${suffixPattern}/), '')`,
            };
        }
        // Customize tooltip formatting to remove the appended indices
        if (xTickLabels || yTickLabels) {
            //@ts-ignore
            embedOpts.tooltip = {
                sanitize: (value) => {
                    const valueString = String(value);
                    return valueString.replace(suffixRegex, '');
                }
            };
        }
        let colorRange;
        switch (options.colorMap) {
            case 'blues':
                colorRange = ['#f7fbff', '#4292c6'];
                break;
            case 'greyscale':
                colorRange = ['#000000', '#ffffff'];
                break;
            case 'viridis':
            default:
                colorRange = 'viridis';
                break;
        }
        if (colorRange !== 'viridis') {
            //@ts-ignore
            const fill = spec.encoding.fill;
            // @ts-ignore
            fill.scale = { 'range': colorRange };
        }
        if (options.domain) {
            //@ts-ignore
            const fill = spec.encoding.fill;
            // @ts-ignore
            if (fill.scale != null) {
                // @ts-ignore
                fill.scale = Object.assign({}, fill.scale, { 'domain': options.domain });
            }
            else {
                // @ts-ignore
                fill.scale = { 'domain': options.domain };
            }
        }
        yield vega_embed_1.default(drawArea, spec, embedOpts);
    });
}
exports.heatmap = heatmap;
function convertToRowMajor(inputValues) {
    return __awaiter(this, void 0, void 0, function* () {
        let originalShape;
        let transposed;
        if (inputValues instanceof tf.Tensor) {
            originalShape = inputValues.shape;
            transposed = inputValues.transpose();
        }
        else {
            originalShape = [inputValues.length, inputValues[0].length];
            transposed = tf.tidy(() => tf.tensor2d(inputValues).transpose());
        }
        utils_1.assert(transposed.rank === 2, 'Input to renderHeatmap must be a 2d array or Tensor2d');
        // Download the intermediate tensor values and
        // dispose the transposed tensor.
        const transposedValues = yield transposed.array();
        transposed.dispose();
        const transposedShape = [transposedValues.length, transposedValues[0].length];
        utils_1.assert(originalShape[0] === transposedShape[1] &&
            originalShape[1] === transposedShape[0], `Unexpected transposed shape. Original ${originalShape} : Transposed ${transposedShape}`);
        return transposedValues;
    });
}
function assertLabelsMatchShape(inputValues, labels, dimension) {
    const shape = inputValues instanceof tf.Tensor ?
        inputValues.shape :
        [inputValues.length, inputValues[0].length];
    if (dimension === 0) {
        utils_1.assert(shape[0] === labels.length, `Length of xTickLabels (${labels.length}) must match number of rows` +
            ` (${shape[0]})`);
    }
    else if (dimension === 1) {
        utils_1.assert(shape[1] === labels.length, `Length of yTickLabels (${labels.length}) must match number of columns (${shape[1]})`);
    }
}
const defaultOpts = {
    xLabel: null,
    yLabel: null,
    xType: 'ordinal',
    yType: 'ordinal',
    colorMap: 'viridis',
    fontSize: 12,
    domain: null,
    rowMajor: false,
};
