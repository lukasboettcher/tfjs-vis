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
const utils_1 = require("../util/utils");
const render_utils_1 = require("./render_utils");
/**
 * Renders a scatter plot
 *
 * ```js
 * const series1 = Array(100).fill(0)
 *   .map(y => Math.random() * 100 - (Math.random() * 50))
 *   .map((y, x) => ({ x, y, }));
 *
 * const series2 = Array(100).fill(0)
 *   .map(y => Math.random() * 100 - (Math.random() * 150))
 *   .map((y, x) => ({ x, y, }));
 *
 * const series = ['First', 'Second'];
 * const data = { values: [series1, series2], series }
 *
 * const surface = { name: 'Scatterplot', tab: 'Charts' };
 * tfvis.render.scatterplot(surface, data);
 * ```
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
function scatterplot(container, data, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let _values = data.values;
        const _series = data.series == null ? [] : data.series;
        // Nest data if necessary before further processing
        _values = Array.isArray(_values[0]) ? _values :
            [_values];
        const values = [];
        _values.forEach((seriesData, i) => {
            const seriesName = _series[i] != null ? _series[i] : `Series ${i + 1}`;
            const seriesVals = seriesData.map(v => Object.assign({}, v, { series: seriesName }));
            values.push(...seriesVals);
        });
        if (opts.seriesColors != null) {
            utils_1.assert(opts.seriesColors.length === _values.length, 'Must have an equal number of series colors as there are data series');
        }
        const drawArea = render_utils_1.getDrawArea(container);
        const options = Object.assign({}, defaultOpts, opts);
        const embedOpts = {
            actions: false,
            mode: 'vega-lite',
            defaultStyle: false,
        };
        const xDomain = () => {
            if (options.zoomToFit) {
                return { 'zero': false };
            }
            else if (options.xAxisDomain != null) {
                return { 'domain': options.xAxisDomain };
            }
            return undefined;
        };
        const yDomain = () => {
            if (options.zoomToFit) {
                return { 'zero': false };
            }
            else if (options.yAxisDomain != null) {
                return { 'domain': options.yAxisDomain };
            }
            return undefined;
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
                }
            },
            //@ts-ignore
            'data': {
                'values': values,
            },
            'mark': {
                'type': 'point',
                'clip': true,
                'tooltip': { 'content': 'data' },
            },
            'encoding': {
                'x': {
                    'field': 'x',
                    'type': options.xType,
                    'title': options.xLabel,
                    'scale': xDomain(),
                },
                'y': {
                    'field': 'y',
                    'type': options.yType,
                    'title': options.yLabel,
                    'scale': yDomain(),
                },
                'color': {
                    'field': 'series',
                    'type': 'nominal',
                    'scale': {
                        'range': options.seriesColors,
                    }
                },
                'shape': {
                    'field': 'series',
                    'type': 'nominal',
                }
            },
        };
        yield vega_embed_1.default(drawArea, spec, embedOpts);
        return Promise.resolve();
    });
}
exports.scatterplot = scatterplot;
const defaultOpts = {
    xLabel: 'x',
    yLabel: 'y',
    xType: 'quantitative',
    yType: 'quantitative',
    zoomToFit: false,
    fontSize: 11,
};
