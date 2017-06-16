import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {FontIcon, Ripple} from 'react-toolbox';

import rippleTheme from 'react-toolbox/lib/ripple/theme.css';
import treeviewTheme from './treeview.css';

const Header = props => {
    return (
        <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={props.style}
            className={classNames(treeviewTheme.header, {
                [treeviewTheme.selected] : props.selected,
                [props.size ? treeviewTheme[props.size] : treeviewTheme['sm']] : true
            })}
        >
            {props.node.name}
            {props.hasChildren ? (
                <FontIcon  value="keyboard_arrow_down" className={classNames(treeviewTheme.arrow, {
                    [treeviewTheme.arrowExpanded] : props.expanded
                })}/>
            ) : null}
            {props.children}
        </div>
    )
};

const RippleHeader = Ripple({spread: 1})(Header);

class Node extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: props.selected,
            expanded: props.expanded
        };

        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selected,
            expanded: nextProps.expanded
        });
    }

    deselect() {
        this.setState({
            selected: false
        })
    }

    onClick(e) {
        e.stopPropagation();
        const {expanded, selected} = this.state;
        let newSelectedState = false;

        if(!this.props.onlyLeafsSelectable
            || (this.props.onlyLeafsSelectable && this.props.isLeaf)) {

            if(!selected) this.props.onNodeSelect(this.props.code, this.props.node);
            newSelectedState = true;

        }

        this.setState({
            selected: newSelectedState,
            expanded: !expanded
        });

    }

    render() {
        const {expanded, selected} = this.state;
        const {node} = this.props;
        return (
            <li onClick={this.onClick}>
                <div className={classNames(treeviewTheme.node)}>
                    <RippleHeader
                        node={node}
                        selected={selected}
                        expanded={expanded}
                        hasChildren={node.children && node.children.length > 0}
                        theme={rippleTheme}
                        style={{overflow: 'hidden'}}
                        size={this.props.size}
                    />
                </div>
                <div style={{overflow: 'hidden'}} className={classNames(treeviewTheme.children, {
                    [treeviewTheme.childrenExpanded] : expanded
                })}>
                    {expanded ? this.props.children : null}
                </div>
            </li>
        )
    }
}

Node.PropTypes = {
    code: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    expanded : PropTypes.bool,
    hasChildren: PropTypes.bool,
    size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
    onlyLeafsSelectable: PropTypes.bool,
    node: PropTypes.shape({
        name: PropTypes.string.isRequired,
        parent: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

export default Node;