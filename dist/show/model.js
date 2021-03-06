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
const table_1 = require("../render/table");
const dom_1 = require("../util/dom");
const math_1 = require("../util/math");
/**
 * Renders a summary of a tf.Model. Displays a table with layer information.
 *
 * ```js
 * const model = tf.sequential({
 *  layers: [
 *    tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
 *    tf.layers.dense({units: 10, activation: 'softmax'}),
 *  ]
 * });
 *
 * const surface = { name: 'Model Summary', tab: 'Model Inspection'};
 * tfvis.show.modelSummary(surface, model);
 * ```
 *
 * @doc {
 *  heading: 'Models & Tensors',
 *  subheading: 'Model Inspection',
 *  namespace: 'show'
 * }
 */
function modelSummary(container, model) {
    return __awaiter(this, void 0, void 0, function* () {
        const drawArea = render_utils_1.getDrawArea(container);
        const summary = getModelSummary(model);
        const headers = [
            'Layer Name',
            'Output Shape',
            '# Of Params',
            'Trainable',
        ];
        const values = summary.layers.map(l => [l.name,
            l.outputShape,
            l.parameters,
            l.trainable,
        ]);
        table_1.table(drawArea, { headers, values });
    });
}
exports.modelSummary = modelSummary;
/**
 * Renders summary information about a layer and a histogram of parameters in
 * that layer.
 *
 * ```js
 * const model = tf.sequential({
 *  layers: [
 *    tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
 *    tf.layers.dense({units: 10, activation: 'softmax'}),
 *  ]
 * });
 *
 * const surface = { name: 'Layer Summary', tab: 'Model Inspection'};
 * tfvis.show.layer(surface, model.getLayer(undefined, 1));
 * ```
 *
 * @doc {
 *  heading: 'Models & Tensors',
 *  subheading: 'Model Inspection',
 *  namespace: 'show'
 * }
 */
function layer(container, layer) {
    return __awaiter(this, void 0, void 0, function* () {
        const drawArea = render_utils_1.getDrawArea(container);
        const details = yield getLayerDetails(layer);
        const headers = [
            'Weight Name',
            'Shape',
            'Min',
            'Max',
            '# Params',
            '# Zeros',
            '# NaNs',
            '# Infinity',
        ];
        // Show layer summary
        const weightsInfoSurface = dom_1.subSurface(drawArea, 'layer-weights-info');
        const detailValues = details.map(l => [l.name, l.shape, l.stats.min, l.stats.max, l.weight.size,
            l.stats.numZeros, l.stats.numNans, l.stats.numInfs]);
        table_1.table(weightsInfoSurface, { headers, values: detailValues });
        const histogramSelectorSurface = dom_1.subSurface(drawArea, 'select-layer');
        const layerValuesHistogram = dom_1.subSurface(drawArea, 'param-distribution');
        const handleSelection = (layerName) => __awaiter(this, void 0, void 0, function* () {
            const layer = details.filter(d => d.name === layerName)[0];
            const weights = yield layer.weight.data();
            histogram_1.histogram(layerValuesHistogram, weights, { height: 150, width: 460, stats: false });
        });
        addHistogramSelector(details.map(d => d.name), histogramSelectorSurface, handleSelection);
    });
}
exports.layer = layer;
//
// Helper functions
//
function getModelSummary(model) {
    return {
        layers: model.layers.map(getLayerSummary),
    };
}
/*
 * Gets summary information/metadata about a layer.
 */
function getLayerSummary(layer) {
    let outputShape;
    if (Array.isArray(layer.outputShape[0])) {
        const shapes = layer.outputShape.map(s => formatShape(s));
        outputShape = `[${shapes.join(', ')}]`;
    }
    else {
        outputShape = formatShape(layer.outputShape);
    }
    return {
        name: layer.name,
        trainable: layer.trainable,
        parameters: layer.countParams(),
        outputShape,
    };
}
/*
 * Gets summary stats and shape for all weights in a layer.
 */
function getLayerDetails(layer) {
    return __awaiter(this, void 0, void 0, function* () {
        const weights = layer.getWeights();
        const layerVariables = layer.weights;
        const statsPromises = weights.map(math_1.tensorStats);
        const stats = yield Promise.all(statsPromises);
        const shapes = weights.map(w => w.shape);
        return weights.map((weight, i) => ({
            name: layerVariables[i].name,
            stats: stats[i],
            shape: formatShape(shapes[i]),
            weight,
        }));
    });
}
function formatShape(shape) {
    const oShape = shape.slice();
    if (oShape.length === 0) {
        return 'Scalar';
    }
    if (oShape[0] === null) {
        oShape[0] = 'batch';
    }
    return `[${oShape.join(',')}]`;
}
function addHistogramSelector(items, parent, 
// tslint:disable-next-line:no-any
selectionHandler) {
    const select = `
    <select>
      ${items.map((i) => `<option value=${i}>${i}</option>`)}
    </select>
  `;
    const button = `<button>Show Values Distribution for:</button>`;
    const content = `<div>${button}${select}</div>`;
    parent.innerHTML = content;
    // Add listeners
    const buttonEl = parent.querySelector('button');
    const selectEl = parent.querySelector('select');
    buttonEl.addEventListener('click', () => {
        selectionHandler(selectEl.selectedOptions[0].label);
    });
}
