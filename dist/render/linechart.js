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
 * Renders a line chart
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
 * const surface = { name: 'Line chart', tab: 'Charts' };
 * tfvis.render.linechart(surface, data);
 * ```
 *
 * ```js
 * const series1 = Array(100).fill(0)
 *   .map(y => Math.random() * 100 + 50)
 *   .map((y, x) => ({ x, y, }));
 *
 * const data = { values: [series1] }
 *
 * // Render to visor
 * const surface = { name: 'Zoomed Line Chart', tab: 'Charts' };
 * tfvis.render.linechart(surface, data, { zoomToFit: true });
 * ```
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
function linechart(container, data, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Nest data if necessary before further processing
        const _data = Array.isArray(data.values[0]) ? data.values :
            [data.values];
        const numValues = _data[0].length;
        // Create series names if none were passed in.
        const _series = data.series ? data.series : _data.map((_, i) => `Series ${i + 1}`);
        utils_1.assert(_series.length === _data.length, 'Must have an equal number of series labels as there are data series');
        if (opts.seriesColors != null) {
            utils_1.assert(opts.seriesColors.length === _data.length, 'Must have an equal number of series colors as there are data series');
        }
        const vlChartValues = [];
        for (let valueIdx = 0; valueIdx < numValues; valueIdx++) {
            const v = {
                x: valueIdx,
            };
            _series.forEach((seriesName, seriesIdx) => {
                const seriesValue = _data[seriesIdx][valueIdx].y;
                v[seriesName] = seriesValue;
                v[`${seriesName}-name`] = seriesName;
            });
            vlChartValues.push(v);
        }
        const options = Object.assign({}, defaultOpts, opts);
        const yScale = () => {
            if (options.zoomToFit) {
                return { 'zero': false };
            }
            else if (options.yAxisDomain != null) {
                return { 'domain': options.yAxisDomain };
            }
            return undefined;
        };
        const sharedEncoding = {
            x: {
                field: 'x',
                type: options.xType,
                title: options.xLabel,
            },
            tooltip: [
                { field: 'x', type: 'quantitative' },
                ..._series.map(seriesName => {
                    return {
                        field: seriesName,
                        type: 'quantitative',
                    };
                }),
            ]
        };
        const lineLayers = _series.map((seriesName) => {
            return {
                // data will be defined at the chart level.
                'data': undefined,
                'mark': { 'type': 'line', 'clip': true },
                'encoding': {
                    // Note: the encoding for 'x' is shared
                    // Add a y encoding for this series
                    'y': {
                        'field': seriesName,
                        'type': options.yType,
                        'title': options.yLabel,
                        'scale': yScale(),
                    },
                    'color': {
                        'field': `${seriesName}-name`,
                        'type': 'nominal',
                        'legend': { 'values': _series, title: null },
                        'scale': {
                            'range': options.seriesColors,
                        }
                    },
                }
            };
        });
        const tooltipLayer = {
            'mark': 'rule',
            'selection': {
                'hover': {
                    'type': 'single',
                    'on': 'mouseover',
                    'nearest': true,
                    clear: 'mouseout',
                }
            },
            'encoding': {
                'color': {
                    'value': 'grey',
                    'condition': {
                        'selection': { 'not': 'hover' },
                        'value': 'transparent',
                    }
                }
            }
        };
        const drawArea = render_utils_1.getDrawArea(container);
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
            'data': { 'values': vlChartValues },
            'encoding': sharedEncoding,
            'layer': [
                ...lineLayers,
                tooltipLayer,
            ],
        };
        const embedOpts = {
            actions: false,
            mode: 'vega-lite',
            defaultStyle: false,
        };
        yield vega_embed_1.default(drawArea, spec, embedOpts);
        return Promise.resolve();
    });
}
exports.linechart = linechart;
const defaultOpts = {
    xLabel: 'x',
    yLabel: 'y',
    xType: 'quantitative',
    yType: 'quantitative',
    zoomToFit: false,
    fontSize: 11,
};
