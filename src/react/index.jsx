// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';

import { drawerMixin } from '../mixin';

export class ReactDrawer extends drawerMixin(Component) {
  constructor(props) {
    super(props);
    this.defaultProps = {
      tagName: 'div',
    };
  }

  componentDidMount() {
    this.setupComponent(this.rel, this.props);
  }

  render() {
    // TODO: what about style?
    return (
      React.createElement(this.props.tagName, { ref: (el) => { this.rel = el; } },
        React.createElement('div', { className: 'y-drawer-scrim' }),
        React.createElement('div', { className: 'y-drawer-content' }, this.props.children)));
    // return (
    //   <div ref={(el) => { this.rel = el; }}>
    //     <div className="y-drawer-scrim" />
    //     <div className="y-drawer-content">{this.props.children}</div>
    //   </div>
    // );
  }
}
