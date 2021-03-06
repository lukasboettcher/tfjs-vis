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
const glamor_1 = require("glamor");
const render_utils_1 = require("../render/render_utils");
const DEFAULT_SUBSURFACE_OPTS = {
    prepend: false,
};
/**
 * Utility function to create/retrieve divs within an HTMLElement|Surface
 */
function subSurface(parent, name, opts = {}) {
    const container = render_utils_1.getDrawArea(parent);
    const style = glamor_1.css({
        '& canvas': {
            display: 'block',
        },
        marginTop: '.5rem',
        marginBottom: '.5rem',
    });
    const titleStyle = glamor_1.css({
        backgroundColor: 'white',
        display: 'inline-block',
        boxSizing: 'border-box',
        borderBottom: '1px solid #357EDD',
        lineHeight: '2em',
        padding: '0 10px 0 10px',
        marginBottom: '20px',
        fontWeight: '600',
        textAlign: 'left',
    });
    const options = Object.assign({}, DEFAULT_SUBSURFACE_OPTS, opts);
    let sub = container.querySelector(`div[data-name=${name}]`);
    if (!sub) {
        sub = document.createElement('div');
        sub.setAttribute('class', `${style}`);
        sub.dataset.name = name;
        if (options.title) {
            const title = document.createElement('div');
            title.setAttribute('class', `subsurface-title ${titleStyle}`);
            title.innerText = options.title;
            sub.appendChild(title);
        }
        if (options.prepend) {
            container.insertBefore(sub, container.firstChild);
        }
        else {
            container.appendChild(sub);
        }
    }
    return sub;
}
exports.subSurface = subSurface;
function getDefaultWidth(element) {
    const DEFAULT_PADDING = 50;
    let padding = 0;
    let current = element;
    while (current && current.clientWidth === 0) {
        current = current.parentElement;
        padding = DEFAULT_PADDING;
    }
    return (current.clientWidth - padding);
}
exports.getDefaultWidth = getDefaultWidth;
function getDefaultHeight(element) {
    if (element.clientHeight === 0) {
        return 200;
    }
    else {
        return element.clientHeight;
    }
}
exports.getDefaultHeight = getDefaultHeight;
