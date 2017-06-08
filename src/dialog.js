import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';

import TreeView from './index'
import dialogTheme from './dialog.css';

class TreeViewDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        return (
            <div>
                <Input
                    label={this.props.inputLabel}
                    value={this.props.inputValue}
                    onClick={this.handleToggle}
                    readOnly={true}
                    error={this.props.error}
                    style={{cursor: 'pointer'}}
                />
                <Dialog
                    active={this.state.isOpen}
                    actions={[
                        { label: "CLOSE", onClick: this.handleToggle }
                    ]}
                    onEscKeyDown={this.handleToggle}
                    onOverlayClick={this.handleToggle}
                    title={this.props.dialogTitle ? this.props.dialogTitle : ""}
                    theme={dialogTheme}
                >
                    {this.props.children}
                </Dialog>
            </div>

        )
    }
}

TreeViewDialog.PropTypes = {
    children: PropTypes.element.isRequired,
    inputLabel: PropTypes.string,
    inputValue: PropTypes.string,
    error: PropTypes.string,
    dialogTitle: PropTypes.string
};

export default TreeViewDialog;