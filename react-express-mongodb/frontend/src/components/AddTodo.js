import React from 'react';

export default class AddTodo extends React.Component {

    _onAddTodo = () => {
        if(this.refs.todo.value.length > 0) {
            this.props.handleAddTodo(this.refs.todo.value);
            this.refs.todo.value = '';
        }
    };

    render() {
        return (
            <div className="new-todo form-group">
                <input type="text" className="form-control" ref="todo"/>
                <button className="btn btn-primary" onClick={this._onAddTodo}>
                    Add Todo
                </button>
            </div>
        )
    }
}