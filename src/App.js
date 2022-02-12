import { useEffect, useState } from 'react'
import './styles/App.css'
import './styles/responsive.css'

function App() {
  const initialTodo = {
    date: '',
    content: '',
    complete:false,
    key: null,
    
  }

  const [listTodo, setListTodo] = useState([])
  const [todo, setTodo] = useState(initialTodo)
  const [commitFormVisibility, setCommitFormVisibility] = useState(false)
  const [listSearchTodo, setListSearchTodo] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [onSearch, setOnSearch] = useState(false)
  const [checked, setChecked] = useState(false)


  useEffect(() => {
    const listTodo = JSON.parse(localStorage.getItem('todoList'))

    if (listTodo && listTodo.length > 0) {
      setListTodo(listTodo)
    }
  }, [])

  const toggleCommitForm = () => {
    setOnSearch(false)
    setSearchValue('')
    setCommitFormVisibility(!commitFormVisibility)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setTodo({ ...todo, [name]: value })
  }

  const upsertTodo = () => {
    setListSearchTodo([])
    if (!todo.date || !todo.content) {
      return alert('Điền cái ngày với nội dung vào!')
    }

    if (todo.key !== null) {
      const newListTodo = [...listTodo]

      newListTodo[todo.key] = todo

      setListTodo(newListTodo)
      setTodo(initialTodo)
      localStorage.setItem('todoList', JSON.stringify(newListTodo))
    } else {
      
      const listTodoTmp = [...listTodo]
      listTodoTmp.push(todo)

      setListTodo(listTodoTmp)

      setTodo(initialTodo)
      localStorage.setItem('todoList', JSON.stringify(listTodoTmp))
    }
  }

  const handleEditTodo = (value) => {
    setCommitFormVisibility(true)
    setTodo(value)
  }

  const handleDeleteTodo = (indexDelete) => {
    const newListTodo = []

    for (let index = 0; index < listTodo.length; index++) {
      if (index !== indexDelete) {
        newListTodo.push(listTodo[index])
      }
    }

    setListTodo(newListTodo)
    localStorage.setItem('todoList', JSON.stringify(newListTodo))
  }

  const handleSearch = () => {
    if (!searchValue) return alert('Chọn cái ngày cơ, ngu vcl!')

    const newSearchData = listTodo.filter((item) => item.date === searchValue)

    setListSearchTodo(newSearchData)
    setOnSearch(true)
    setCommitFormVisibility(false)
  }

 

  return (
    <div className="App">
      
      <div className='search'>
        <h1>Betto Todo App</h1>
        <input
          className="search-field"
          type="date"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className="btn-search" onClick={handleSearch}>
          Search
        </button>
        {onSearch && (
          <button className="btn-reset" onClick={() => setOnSearch(false)}>
            Reset
          </button>
        )}
      </div>
      <button className="btn-add" onClick={toggleCommitForm}>
        Add
      </button>
      <div className="container">
        {commitFormVisibility && (
          <div className="folder-commit">
            <div className="addDate">
              <h4 className="date"> date </h4>
              <input
                className="date-input-field"
                type="date"
                onChange={handleChange}
                name="date"
                value={todo.date}
              />
            </div>

            <div className="folder-commit">
              <div className="addPlan">
                <h4 className="plan"> content of plan </h4>
                <textarea
                  className="content-input-field"
                  type="text"
                  placeholder="coming to cinemas near you..."
                  onChange={handleChange}
                  name="content"
                  value={todo.content}
                />
              </div>
              <button className="btn-commit" onClick={upsertTodo}>
              Commit
              </button>
             </div>
          </div>
        )}
        <center>
          {listTodo.length > 0 && (
            <table className="main-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Plan of content</th>
                  {!onSearch && (
                    <>
                      <th>Edit</th>
                      <th>Delete</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {onSearch ? (
                  listSearchTodo.length > 0 ? (
                    listSearchTodo.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.date}</td>
                        <td>{item.content}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No Result</td>
                    </tr>
                  )
                ) : (
                  listTodo.map((value, index) => (
                    <tr key={index}>
                      <td>{index + 1}  <input
                        type="checkbox"
                        checked={value.complete}
                        onChange={e => setChecked(e.target.checked)}
                      /> </td>
                      <td>{value.date}</td>
                      <td>{value.content}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleEditTodo({ ...value, key: index })
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm('Có xoá không bạn êi!')) {
                              handleDeleteTodo(index)
                            }
                          }}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </center>
      </div>
    </div>
  )
}

export default App
