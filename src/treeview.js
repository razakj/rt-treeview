import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Input} from 'react-toolbox';

import Node from './node';
import theme from './treeview.css';
import searchTheme from './search.css';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search : ""
        };

        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(value) {
        this.setState({
            search : value
        });
        if(value.length > 3) {
            this.props.search(value);
        } else if(this.state.search !== "" && value.length <= 3) {
            this.props.search("");
        }
    }

    render() {
        return (
            <Input
                label="Search"
                value={this.state.search}
                onChange={this.onValueChange}
                hint="At least 3 characters"
                type="text"
                theme={searchTheme}
            />
        )
    }
}

class TreeView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedNode: props.selectedNode,
            filteredNodes: [],
            expandedNodes: []
        };

        this.nodeRefs = {};

        this.setExpandedNodes = this.setExpandedNodes.bind(this);
        this.recursiveRender = this.recursiveRender.bind(this);
        this.search = this.search.bind(this);
        this.onNodeSelect = this.onNodeSelect.bind(this);
    }

    componentWillMount() {
        this.setExpandedNodes();
    }

    setExpandedNodes() {
        const {selectedNode, expandedNodes} = this.state;
        let newExpandedNodes = [];
        if(selectedNode) {
            const node = this.props.nodes.get(selectedNode);
            if(node) {
                const _fetchParents = (key, n) => {
                    if(n) {
                        newExpandedNodes.push(key);
                        if(n.parent) _fetchParents(n.parent, this.props.nodes.get(n.parent))
                    }
                };
                _fetchParents(selectedNode, node);
            }
        }
        if(newExpandedNodes.length !== expandedNodes) {
            this.setState({
                expandedNodes: newExpandedNodes
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {expandedNodes, filteredNodes} = this.state;
        return !(
            nextState.expandedNodes.length === expandedNodes.length && nextState.filteredNodes.length === filteredNodes.length
        );
    }

    onNodeSelect(code, node) {

        const {selectedNode} = this.state;

        if(selectedNode !== code) {

            if(this.nodeRefs.hasOwnProperty(selectedNode)
                && this.nodeRefs[selectedNode] != null
                && this.nodeRefs[selectedNode] != undefined) {
                this.nodeRefs[selectedNode].deselect();
                if(this.props.onNodeDeselect && typeof this.props.onNodeDeselect === "function")
                    this.props.onNodeDeselect(selectedNode, this.nodeRefs[selectedNode].props.node);
            }

            this.setState({
                selectedNode : code
            }, () => {
                if(this.props.onNodeSelect && typeof this.props.onNodeSelect === "function")
                    this.props.onNodeSelect(code, node);
            })
        }
    }

    recursiveRender(nodes) {
        const filteredNodes = this.state.filteredNodes.length > 0 ? nodes.filter(key=>this.state.filteredNodes.indexOf(key) > -1) : nodes;
        return (
            <ul>
                {filteredNodes.map(key=>{
                    const node = this.props.nodes.get(key);
                    const selected = this.state.selectedNode && this.state.selectedNode === key;

                    return (
                        <Node
                            key={key}
                            ref={refNode => {this.nodeRefs[key] = refNode}}
                            code={key}
                            node={node}
                            selected={selected}
                            expanded={this.state.expandedNodes.indexOf(key) > -1}
                            onNodeSelect={this.onNodeSelect}
                            isLeaf={!node.children || node.children.length === 0}
                            size={this.props.size}
                            onlyLeafsSelectable={this.props.onlyLeafsSelectable}
                        >
                            {node.children && node.children.length > 0 ? this.recursiveRender(node.children) : null}
                        </Node>
                    )
                })}
            </ul>
        );
    }

    search(searchTerm) {
        if(searchTerm !== "") {
            let filteredNodes = [], expandedNodes = [];

            const _addToFiltered = (key, node) => {
                if(filteredNodes.indexOf(key) < 0) filteredNodes.push(key);
                expandedNodes.push(key);
                if(node.parent) _addToFiltered(node.parent, this.props.nodes.get(node.parent));
            };
            this.props.nodes.forEach((node, key)=>{
                if(node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    _addToFiltered(key, node);

                    expandedNodes.push(key);
                    if(node.children && node.children.length > 0) {
                        node.children.forEach(child=>filteredNodes.push(child))
                    }
                }
            });

            this.setState({
                filteredNodes : filteredNodes,
                expandedNodes: expandedNodes
            })

        } else {
            this.setExpandedNodes();
            this.setState({
                filteredNodes: []
            });
        }
    }

    render() {
        const {nodes, search} = this.props;
        const roots = Array.from(nodes.keys()).filter(key=>!nodes.get(key).parent);

        return (
            <div className={classNames(theme.treeView)}>
                {search ? <Search search={this.search} /> : null}
                {this.recursiveRender(roots)}
            </div>
        )
    }
}

TreeView.PropTypes = {
    nodes: PropTypes.object.isRequired,
    selectedNode : PropTypes.string,
    onNodeSelect: PropTypes.func,
    onNodeDeselect: PropTypes.func,
    search: PropTypes.bool,
    error: PropTypes.string,
    size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
    onlyLeafsSelectable: PropTypes.bool
};

export default TreeView;