import React, { Component } from 'react';
import './Menu.css';
import demos from './demos.js';
import { VaadinGrid, VaadinGridTreeColumn } from 'react-vaadin-components';

class Menu extends Component {

  constructor() {
    super();
    this.state = {
      pages: demos,
      expandedItems: [demos.find(demo => demo.id === this._parseHash().componentId)]
    }
    this._boundDataProvider = this.dataProvider.bind(this);
  }

  _parseHash() {
    const hash = window.location.hash.substr(2);
    const parts = hash.split('/');
    return {componentId: parts[0], demoId: parts[1]};
  }

  dataProvider(params, callback) {
    const pages = params.parentItem ? params.parentItem.pages : this.state.pages;

    if (params.parentItem) {
      pages.forEach(page => page.link = `${params.parentItem.id}/${page.id}`);
    } else {
      pages.unshift({title: "intro", link: ""});
    }

    callback(pages, pages.length);
  }

  expandedChanged(item, expanded) {
    let expandedItems = this.state.expandedItems.slice(0);
    if (expanded) {
      if (expandedItems.indexOf(item) === -1) {
        expandedItems.push(item);
      }
    } else {
      const idx = expandedItems.indexOf(item);
      expandedItems.splice(idx, 1);
    }
    this.setState({
      expandedItems
    });
  }

  _activeItemChanged(e) {
    if (e.detail.value && e.detail.value.link !== undefined) {
      window.location.hash = '/' + e.detail.value.link;
    }
  }

  render() {
    return (
      <div className="Menu">
        <VaadinGrid
          className="Menu-grid"
          theme="no-border no-row-borders"
          dataProvider={this._boundDataProvider}
          expandedItems={this.state.expandedItems}
          heightByRows={true}
          onActiveItemChanged={this._activeItemChanged.bind(this)}>
          <VaadinGridTreeColumn path="title" itemHasChildrenPath="pages" header=" ">
          </VaadinGridTreeColumn>
        </VaadinGrid>
      </div>
    );
  }
}

export default Menu;