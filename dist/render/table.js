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
Object.defineProperty(exports, "__esModule", { value: true });
const d3_format_1 = require("d3-format");
const d3_selection_1 = require("d3-selection");
const glamor_1 = require("glamor");
const render_utils_1 = require("./render_utils");
/**
 * Renders a table
 *
 * ```js
 * const headers = [
 *  'Col 1',
 *  'Col 2',
 *  'Col 3',
 * ];
 *
 * const values = [
 *  [1, 2, 3],
 *  ['4', '5', '6'],
 *  ['strong>7</strong>', true, false],
 * ];
 *
 * const surface = { name: 'Table', tab: 'Charts' };
 * tfvis.render.table(surface, { headers, values });
 * ```
 *
 * @param opts.fontSize fontSize in pixels for text in the chart.
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
function table(container, 
// tslint:disable-next-line:no-any
data, opts = {}) {
    if (data && data.headers == null) {
        throw new Error('Data to render must have a "headers" property');
    }
    if (data && data.values == null) {
        throw new Error('Data to render must have a "values" property');
    }
    const drawArea = render_utils_1.getDrawArea(container);
    const options = Object.assign({}, defaultOpts, opts);
    let table = d3_selection_1.select(drawArea).select('table.tf-table');
    const tableStyle = glamor_1.css({
        fontSize: options.fontSize || '.875rem',
        width: '100%',
        maxWidth: '64rem',
        marginRight: 'auto',
        marginLeft: 'auto',
    });
    // If a table is not already present on this element add one
    if (table.size() === 0) {
        table = d3_selection_1.select(drawArea).append('table');
        table.attr('class', ` ${tableStyle} tf-table`);
        table.append('thead').append('tr');
        table.append('tbody');
    }
    if (table.size() !== 1) {
        throw new Error('Error inserting table');
    }
    //
    // Add the reader row
    //
    const headerRowStyle = glamor_1.css({
        fontWeight: '600',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderColor: 'rgba( 0, 0, 0, .2 )',
        textAlign: 'left',
        paddingBottom: '1rem',
        paddingRight: '1rem',
        backgroundColor: '#fff',
    });
    const headers = table.select('thead').select('tr').selectAll('th').data(data.headers);
    const headersEnter = headers.enter().append('th').attr('class', `${headerRowStyle}`);
    headers.merge(headersEnter).html(d => d);
    headers.exit().remove();
    //
    // Add the data rows
    //
    const format = d3_format_1.format(',.4~f');
    const rows = table.select('tbody').selectAll('tr').data(data.values);
    const rowsEnter = rows.enter().append('tr');
    // Nested selection to add individual cells
    const cellStyle = glamor_1.css({
        padding: '0.25rem',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderColor: 'rgba( 0, 0, 0, .2 )',
    });
    const cells = rows.merge(rowsEnter).selectAll('td').data(d => d);
    const cellsEnter = cells.enter().append('td').attr('class', `${cellStyle}`);
    cells.merge(cellsEnter).html(d => typeof d === 'number' ? format(d) : d);
    cells.exit().remove();
    rows.exit().remove();
}
exports.table = table;
const defaultOpts = {
    fontSize: 14,
};
