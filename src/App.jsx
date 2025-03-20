import { useState, useEffect } from 'react'


function App() {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [draggedTodoId, setDraggedTodoId] = useState(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (newTodo.trim() === '' || newTodo.length > 500) {
      alert('Todo cannot be empty or more than 500 characters')
      return
    }

    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    }

    setTodos([...todos, todo])
    setNewTodo('')
  }

  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ))
  }

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleSortTodos = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc')
  }

  const handleDragStart = (id) => {
    setDraggedTodoId(id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (targetId) => {
    if (draggedTodoId === targetId) return

    const draggedTodoIndex = todos.findIndex(todo => todo.id === draggedTodoId)
    const targetTodoIndex = todos.findIndex(todo => todo.id === targetId)

    const newTodos = [...todos]
    const [draggedTodo] = newTodos.splice(draggedTodoIndex, 1)
    newTodos.splice(targetTodoIndex, 0, draggedTodo)

    setTodos(newTodos)
    setDraggedTodoId(null)
  }

  const sortedTodos = [...todos].sort((a, b) => sortOrder === 'asc' ? a.completed - b.completed : b.completed - a.completed)

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-4 mt-12">Todo List</h1>
      <div className='flex items-center justify-center gap-2'>
        <div className='flex items-center'>
          <button type="button" onClick={handleSortTodos} 
          className="bg-blue-400 text-white px-4 py-2 rounded-md ml-2 w-[150px]">
            Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
        <form onSubmit={handleAddTodo} className="flex justify-center items-center gap-2">
          <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} 
            className="border border-gray-300 p-2 rounded-md w-[300px] h-[40px]" 
            placeholder="Add a new todo" />
          <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded-md">Add</button>
        </form>
      </div>
      

      <ul className="space-y-[6px] mx-auto w-[600px] mt-6">
        {sortedTodos.map(todo => (
          <li key={todo.id} className={`flex items-center pl-2 pr-1 rounded-md gap-2 justify-between h-[40px] 
            ${todo.completed ? 'bg-green-300' : 'bg-gray-100'} hover:border-2 hover:border-gray-400
            ${draggedTodoId === todo.id ? 'opacity-50' : 'opacity-100'}`} 
            draggable={true}
            onDragStart={() => handleDragStart(todo.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(todo.id)}
            onDragEnd={() => setDraggedTodoId(null)}
          >
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none'}} 
            className='text-lg max-w-[500px] overflow-hidden text-ellipsis'
            onClick={() => handleToggleComplete(todo.id)}>{todo.text}</span>
            <div className='flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md'>
              <input
                type="checkbox" 
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
                className="mx-2 cursor-pointer"
              />
              <button onClick={() => handleDeleteTodo(todo.id)} className='cursor-pointer pr-2'>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App

