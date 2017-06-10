# rt-treeview

[![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/rt-treeview)
[![GitHub tag](https://img.shields.io/github/tag/razakj/rt-treeview.svg?style=flat-square)]()

TreeView component based on a great [react-toolbox](https://github.com/react-toolbox/react-toolbox) 
UI framework.

## Demo

[HERE](https://razakj.github.io/rt-treeview/)

## Status
This package is currently under an active development and API might change in the future. The package is used
in an active project so adding a new features and bug fixing is mainly driven by the input
from the project.

### ToDo

* Configurable search behaviour
* Custom styling/theming including proper CSS nesting
* Configurable sizing
* Improved animation

## Overview
This package was developed as part of a couple of internal projects where react-toolbox is used as a main UI
framework and we weren't able to find a suitable TreeView component for our needs.

Main focus is on

* **Performance** - Reconsolidate and update only nodes which really need to be.
* **Maps** - Taking an advantage of [Map](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) which defines tree structure.
* **Material UI** - This package is proudly based and dependent on [react-toolbox](https://github.com/react-toolbox/react-toolbox).
* **Interactive** - Make the TreeView interactive and as flexible as possible.

### Features & Limitations

* Only **one node** can be selected **at the time**. As soon as a new node is selected the current selection
is deselected.
* TreeView is defined by nodes which must be given as input in form of Map which may not be supported by older
browsers. See status [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map).
I'd suggest using babel-polyfill or core-js in order to support older browsers.
* The package will only work with **react-toolbox-beta8 and higher**

#### Search

Searching functionality can be enabled via a `search` property. Searching is optional due to its impact
on the performance when performing the actual search.

At the moment all the siblings (collapsed) along with matched node's parent structure (expanded) are displayed. 
This is behaviour is expected to become configurable in the future.

#### Initial selection

Initial selection can be defined by providing a key value of initially selected node via `selectedNode` property.
The parent structure of the initially selected node will be expanded.


## Installation
No surprise here
```
npm install rt-treeview
```

## Usage
There are two components exposed by the package - TreeView and TreeViewDialog.

Similar to react-toolbox the components are written using React, PostCSS(http://postcss.org/) and CSSNext(http://cssnext.io/).
That means in order to use the components you should use package bundler ([webpack](https://webpack.js.org/)) for your application
along with PostCSS and CSSNext loaders.

### TreeView
```javascript
import {TreeView} from 'rt-treeview'
```
TreeView component can be embedded directly into your application. The tree is defined and constructed by ```nodes```.

#### TreeView.PropTypes
| name          | type          | isRequired  | description |
|---------------|:-------------:|:-----------:|:------------|
| nodes         | MapOf(Node)   | yes         | Map of nodes used to construct the tree.
| selectedNode  | string        | no          | Initially selected node on a first render
| search        | bool          | no          | Display search input
| error         | string        | no          | Error message displayed above the tree
| onNodeSelect  | func          | no          | Callback called on a node selection with *(nodeKey, node)*
| onNodeDeselect| func          | no          | Callback called when a node is de-selected with *(nodeKey, node)*
#### Node.PropTypes
| name          | type          | isRequired  | description |
|---------------|:-------------:|:-----------:|:------------|
| name          | string        | yes         | 
| parent        | string        | no          | Key of parent node from the Map
| children      | array         | no          | Keys of children nodes from the Map

#### Example
```javascript
import React from 'react';
import {TreeView} from 'rt-treeview';

class TreeViewExample extends React.Component {
    constructor(props) {
        super(props);
        
        const nodeArray = [
            ['N1', {name: 'Node #1', children: ['N2', 'N3']}],
            ['N2', {name: 'Node #2', parent: 'N1'}],
            ['N3', {name: 'Node #3', parent: 'N1', children: ['N4']}],
            ['N4', {name: 'Node #4', parent: 'N3'}],
            ['N5', {name: 'Node #5', children: ['N6']}],
            ['N6', {name: 'Node #6', parent: 'N5'}]
        ];
        
        this.nodes = new Map(nodeArray);
        this.onNodeSelect = this.onNodeSelect.bind(this);
    }
    
    onNodeSelect(nodeKey, node) {
        // Do Stuff
    }
    
    onNodeDeselect(nodeKey, node) {
        // Do stuff
    }
    
    render() {
        return (
            <TreeView
                nodes={this.nodes} // Map of nodes
                search={true} // Search enabled/disabled
                onNodeSelect={this.onNodeSelect} // Event called on node selection
            />
        )
    }
}
```

### TreeViewDialog
```javascript
import {TreeViewDialog} from 'rt-treeview'
```
TreeViewDialog is embedded only as a read-only Input which triggers a dialog with the TreeView component. 
This is useful when you don't want to embed the TreeView directly into the main view and only display 
selected value as a regular input value.

Please note that setting the value of Input is not handled by the rt-treeview and must
be taken care of by user ie. as shown in the example below.
#### TreeViewDialog.PropTypes
| name          | type          | isRequired  | description |
|---------------|:-------------:|:-----------:|:------------|
| inputLabel    | string        | no          | Label for the Input component
| inputValue    | string        | no          | Value for the Input component
| error         | string        | no          | Error for the Input component
| dialogTitle   | string        | no          | Dialog title
| children      | element       | yes         | [TreeView](#treeview)

#### Example
```javascript
import React from 'react';
import {TreeView, TreeViewDialog} from 'rt-treeview';

class TreeViewDialogExample extends React.Component {
    constructor(props) {
        super(props);
        
        const nodeArray = [
            ['N1', {name: 'Node #1', children: ['N2', 'N3']}],
            ['N2', {name: 'Node #2', parent: 'N1'}],
            ['N3', {name: 'Node #3', parent: 'N1', children: ['N4']}],
            ['N4', {name: 'Node #4', parent: 'N3'}],
            ['N5', {name: 'Node #5', children: ['N6']}],
            ['N6', {name: 'Node #6', parent: 'N5'}]
        ];
        
        this.state = {
            selectedKey : 'N1'
        };
        
        this.nodes = new Map(nodeArray);
        this.onNodeSelect = this.onNodeSelect.bind(this);
    }
    
    onNodeSelect(nodeKey, node) {
        this.setState({
            selectedKey: nodeKey
        });
    }
    
    render() {
        const node = this.nodes.get(this.state.selectedKey);
        return (
            <TreeViewDialog
                inputValue={node ? node.name : "Unknown"}
                inputLabel="Selected Node"
                dialogTitle="Select random node"
            >
                <TreeView
                    nodes={this.nodes}
                    search={true} 
                    onNodeSelect={this.onNodeSelect}
                />
            </TreeViewDialog>
        )
    }
}
```

## Examples

```
git clone https://github.com/razakj/rt-treeview.git
cd rt-treeview
npm install
npm run examples
```

You should be able to access the examples via web browser at http://localhost:9876. Please 
note that currently there is a bug with styles not loading properly in the provided examples.

The examples can be found under *./examples/index.js*

## LICENSE

[MIT]()