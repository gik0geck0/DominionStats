/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export function raf(fn) {
    let ticking = false;
    return function (event) {
        if (!ticking) {
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            requestAnimationFrame(() => {
                fn.call(this, event);
                ticking = false;
            });
        }
        ticking = true;
    };
}
