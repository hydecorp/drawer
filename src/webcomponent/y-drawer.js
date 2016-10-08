/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import htmlElement from 'y-component/src/html-element';

import drawerCore from '../core';

export default class extends htmlElement(drawerCore(HTMLElement)) {}
