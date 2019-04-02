import React from 'react'
import './dashboard.css'

const blockstack = require('blockstack');
const STORAGE_FILE = 'todos.json'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      todos: [],
      todo: '',
      uidCount: 0
    }

    this.addTodo = this.addTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.pushData = this.pushData.bind(this)
    this.toggleComplete = this.toggleComplete.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevState) {
    if (this.state.todos !== prevState.todos) {
      this.pushData()
    }
  }

  addTodo(e) {
    e.preventDefault()
    const { todo, uidCount } = this.state

    if (!todo.trim()) {
      return
    }

    const newTodo = {
      id: uidCount + 1,
      text: todo.trim(),
      completed: false
    }

    this.setState({
      todo: '',
      todos: [...this.state.todos, newTodo],
      uidCount: this.state.uidCount + 1
    })
  }

  deleteTodo(event) {
    const index = event.target.value
    const newArr = this.state.todos.slice()

    newArr.splice(index, 1)

    this.setState({
      todos: newArr
    })
  }

  fetchData() {
    blockstack.getFile(STORAGE_FILE) // decryption is enabled by default
    .then((todosText) => {
      const todos = JSON.parse(todosText || '[]')
      this.setState({
        todos: todos,
        uidCount: todos.length
      })
    })
  }

  onTextChange(event) {
    this.setState({
      todo: event.target.value
    })
  }

  pushData() {
    blockstack.putFile(STORAGE_FILE, JSON.stringify(this.state.todos))
  }

  toggleComplete(event) {
    const index = event.target.value
    const newArr = this.state.todos.slice()
    const todoStatus = newArr[index].completed

    newArr[index].completed = !todoStatus
    this.setState({
      todos: newArr
    })
  }

  render() {
    const { todo, todos } = this.state

    const displayList = () => {
      return todos.slice(0).reverse().map(todo => {
        return (
          <li className='dashboard__list-item' key={todo.id}>
            <label className='dashboard__label'>
              <input
                checked={todo.completed}
                className='dashboard__checkbox'
                onChange={this.toggleComplete}
                type='checkbox'
                value={todos.indexOf(todo)} />
              <span
                className={ todo.completed ? 'dashboard__todo-text--completed' : null }>
                {todo.text}
              </span>
            </label>
            {todo.completed &&
            <button
              className='dashboard__delete-button'
              onClick={this.deleteTodo}
              value={todos.indexOf(todo)}>
              &times;
            </button>
            }
          </li>
        )
      })
    }

    return (
      <div className='container'>
        <div className='dashboard'>
          <form>
            <fieldset>
              <input
                autoFocus
                className='dashboard__input'
                onChange={this.onTextChange}
                placeholder='Write a todo...'
                type='text'
                value={todo} />
              <button
                className='dashboard__input-button'
                onClick={this.addTodo}>
                Add
              </button>
            </fieldset>
          </form>

          <ul className='dashboard__list'>
            {displayList()}
          </ul>

        </div>
      </div>
    )
  }
}

export default Dashboard
