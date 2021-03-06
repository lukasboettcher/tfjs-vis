"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
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
require("@tensorflow/tfjs-core");
// tslint:disable-next-line: no-imports-from-dist
require("@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops");
const barchart_1 = require("./render/barchart");
const confusion_matrix_1 = require("./render/confusion_matrix");
const heatmap_1 = require("./render/heatmap");
const histogram_1 = require("./render/histogram");
const linechart_1 = require("./render/linechart");
const scatterplot_1 = require("./render/scatterplot");
const table_1 = require("./render/table");
const history_1 = require("./show/history");
const model_1 = require("./show/model");
const quality_1 = require("./show/quality");
const tensor_1 = require("./show/tensor");
const math_1 = require("./util/math");
const version_1 = require("./version");
exports.version_vis = version_1.version;
const render = {
    barchart: barchart_1.barchart,
    table: table_1.table,
    histogram: histogram_1.histogram,
    linechart: linechart_1.linechart,
    scatterplot: scatterplot_1.scatterplot,
    confusionMatrix: confusion_matrix_1.confusionMatrix,
    heatmap: heatmap_1.heatmap,
};
exports.render = render;
const metrics = {
    accuracy: math_1.accuracy,
    perClassAccuracy: math_1.perClassAccuracy,
    confusionMatrix: math_1.confusionMatrix,
};
exports.metrics = metrics;
const show = {
    history: history_1.history,
    fitCallbacks: history_1.fitCallbacks,
    perClassAccuracy: quality_1.perClassAccuracy,
    valuesDistribution: tensor_1.valuesDistribution,
    layer: model_1.layer,
    modelSummary: model_1.modelSummary,
};
exports.show = show;
var visor_1 = require("./visor");
exports.visor = visor_1.visor;
__export(require("./types"));
