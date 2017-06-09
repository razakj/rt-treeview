import React from 'react';
import ReactDOM from 'react-dom';
import {TreeViewDialog, TreeView} from '../lib';

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

const Examples = props => {
    return (
        <div className="container">
            <div style={{width:400, margin:15}}>
                <h3>TreeView</h3>
                <TreeViewExample />
            </div>
            <div style={{width:400, margin:15}}>
                <h3>TreeViewDialog</h3>
                <TreeViewDialogExample />
            </div>
        </div>
    )
}

ReactDOM.render((
    <Examples />
), document.getElementById('examples-app'));