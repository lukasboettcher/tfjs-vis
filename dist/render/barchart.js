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
 * Renders a barchart.
 *
 * ```js
 * const data = [
 *   { index: 0, value: 50 },
 *   { index: 1, value: 100 },
 *   { index: 2, value: 150 },
 *  ];
 *
 * // Render to visor
 * const surface = { name: 'Bar chart', tab: 'Charts' };
 * tfvis.render.barchart(surface, data);
 * ```
 *
 * @param data Data in the following format, (an array of objects)
 *    `[ {index: number, value: number} ... ]`
 *
 * @returns Promise - indicates completion of rendering
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
function barchart(container, data, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const drawArea = render_utils_1.getDrawArea(container);
        const values = data;
        const options = Object.assign({}, defaultOpts, opts);
        // If we have rendered this chart before with the same options we can do a
        // data only update, else  we do a regular re-render.
        if (instances.has(drawArea)) {
            const instanceInfo = instances.get(drawArea);
            if (render_utils_1.shallowEquals(options, instanceInfo.lastOptions)) {
                yield render_utils_1.nextFrame();
                const view = instanceInfo.view;
                const changes = view.changeset().remove(() => true).insert(values);
                yield view.change('values', changes).runAsync();
                return;
            }
        }
        const { xLabel, yLabel, xType, yType } = options;
        let xAxis = null;
        if (xLabel != null) {
            xAxis = { title: xLabel };
        }
        let yAxis = null;
        if (yLabel != null) {
            yAxis = { title: yLabel };
        }
        const embedOpts = {
            actions: false,
            mode: 'vega-lite',
            defaultStyle: false,
        };
        let colorEncoding;
        if (options.color != null) {
            if (Array.isArray(options.color)) {
                colorEncoding = {
                    'field': 'index',
                    'type': 'nominal',
                    'scale': {
                        'range': options.color,
                    }
                };
            }
            else {
                colorEncoding = { 'value': options.color };
            }
        }
        else {
            colorEncoding = { 'value': '#4C78A0' };
        }
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
            'data': { 'values': values, 'name': 'values' },
            'mark': {
                'type': 'bar',
                'tooltip': true,
            },
            'encoding': {
                'x': { 'field': 'index', 'type': xType, 'axis': xAxis },
                'y': { 'field': 'value', 'type': yType, 'axis': yAxis },
                'color': colorEncoding,
            },
        };
        yield render_utils_1.nextFrame();
        const embedRes = yield vega_embed_1.default(drawArea, spec, embedOpts);
        instances.set(drawArea, {
            view: embedRes.view,
            lastOptions: options,
        });
    });
}
exports.barchart = barchart;
const defaultOpts = {
    xLabel: '',
    yLabel: '',
    xType: 'ordinal',
    yType: 'quantitative',
    fontSize: 11,
};
// We keep a map of containers to chart instances in order to reuse the
// instance where possible.
const instances = new Map();
