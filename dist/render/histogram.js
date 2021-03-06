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
const d3_format_1 = require("d3-format");
const vega_embed_1 = __importDefault(require("vega-embed"));
const dom_1 = require("../util/dom");
const math_1 = require("../util/math");
const table_1 = require("./table");
const defaultOpts = {
    maxBins: 12,
    fontSize: 11,
};
/**
 * Renders a histogram of values
 *
 * ```js
 * const data = Array(100).fill(0)
 *   .map(x => Math.random() * 100 - (Math.random() * 50))
 *
 * // Push some special values for the stats table.
 * data.push(Infinity);
 * data.push(NaN);
 * data.push(0);
 *
 * const surface = { name: 'Histogram', tab: 'Charts' };
 * tfvis.render.histogram(surface, data);
 * ```
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
function histogram(container, data, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const values = prepareData(data);
        const options = Object.assign({}, defaultOpts, opts);
        const embedOpts = {
            actions: false,
            mode: 'vega-lite',
            defaultStyle: false,
        };
        const histogramContainer = dom_1.subSurface(container, 'histogram');
        if (opts.stats !== false) {
            const statsContainer = dom_1.subSurface(container, 'stats', {
                prepend: true,
            });
            let stats;
            if (opts.stats) {
                stats = opts.stats;
            }
            else {
                stats = math_1.arrayStats(values.map(x => x.value));
            }
            renderStats(stats, statsContainer, { fontSize: options.fontSize });
        }
        // If there are no data values return early
        if (values.length === 0) {
            return undefined;
        }
        // Now that we have rendered stats we need to remove any NaNs and Infinities
        // before rendering the histogram
        const filtered = [];
        for (let i = 0; i < values.length; i++) {
            const val = values[i].value;
            if (val != null && isFinite(val)) {
                filtered.push(values[i]);
            }
        }
        const histogramSpec = {
            'width': options.width || dom_1.getDefaultWidth(histogramContainer),
            'height': options.height || dom_1.getDefaultHeight(histogramContainer),
            'padding': 0,
            'autosize': {
                'type': 'fit',
                'contains': 'padding',
                'resize': true,
            },
            'data': { 'values': filtered },
            'mark': {
                'type': 'bar',
                'tooltip': true,
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
            'encoding': {
                'x': {
                    'bin': { 'maxbins': options.maxBins },
                    'field': 'value',
                    'type': 'quantitative',
                },
                'y': {
                    'aggregate': 'count',
                    'type': 'quantitative',
                },
                'color': {
                    'value': options.color || '#001B44',
                }
            }
        };
        return vega_embed_1.default(histogramContainer, histogramSpec, embedOpts);
    });
}
exports.histogram = histogram;
function renderStats(stats, container, opts) {
    const format = d3_format_1.format(',.4~f');
    const pctFormat = d3_format_1.format('.4~p');
    const headers = [];
    const vals = [];
    if (stats.numVals != null) {
        headers.push('Num Vals');
        vals.push(format(stats.numVals));
    }
    if (stats.min != null) {
        headers.push('Min');
        vals.push(format(stats.min));
    }
    if (stats.max != null) {
        headers.push('Max');
        vals.push(format(stats.max));
    }
    if (stats.numZeros != null) {
        headers.push('# Zeros');
        let zeroPct = '';
        if (stats.numVals) {
            zeroPct = stats.numZeros > 0 ?
                `(${pctFormat(stats.numZeros / stats.numVals)})` :
                '';
        }
        vals.push(`${format(stats.numZeros)} ${zeroPct}`);
    }
    if (stats.numNans != null) {
        headers.push('# NaNs');
        let nanPct = '';
        if (stats.numVals) {
            nanPct = stats.numNans > 0 ?
                `(${pctFormat(stats.numNans / stats.numVals)})` :
                '';
        }
        vals.push(`${format(stats.numNans)} ${nanPct}`);
    }
    if (stats.numInfs != null) {
        headers.push('# Infinity');
        let infPct = '';
        if (stats.numVals) {
            infPct = stats.numInfs > 0 ?
                `(${pctFormat(stats.numInfs / stats.numVals)})` :
                '';
        }
        vals.push(`${format(stats.numInfs)} ${infPct}`);
    }
    table_1.table(container, { headers, values: [vals] }, opts);
}
/**
 * Formats data to the internal format used by this chart.
 */
function prepareData(data) {
    if (data.length == null) {
        throw new Error('input data must be an array');
    }
    if (data.length === 0) {
        return [];
    }
    else if (typeof data[0] === 'object') {
        if (data[0].value == null) {
            throw new Error('input data must have a value field');
        }
        else {
            return data;
        }
    }
    else {
        const ret = Array(data.length);
        for (let i = 0; i < data.length; i++) {
            ret[i] = { value: data[i] };
        }
        return ret;
    }
}
