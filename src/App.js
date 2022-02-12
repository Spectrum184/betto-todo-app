import { useEffect, useState } from 'react'
import './styles/App.css'
import './styles/responsive.css'

function App() {
  const initialTodo = {
    date: '',
    content: '',
    complete: false,
    key: null,

  }

  const [listTodo, setListTodo] = useState([])
  const [todo, setTodo] = useState(initialTodo)
  const [commitFormVisibility, setCommitFormVisibility] = useState(false)
  const [listSearchTodo, setListSearchTodo] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [onSearch, setOnSearch] = useState(false)
  const [countCompleted, setCountCompleted] = useState(0);
  const [allCompleted, setAllCompleted] = useState(false);


  useEffect(() => {
    const listTodo = JSON.parse(localStorage.getItem('todoList'))

    if (listTodo && listTodo.length > 0) {
      setListTodo(listTodo);
      let count = 0;
      for (let i = 0; i < listTodo.length; i++) {
        if (listTodo[i].complete) count++;
      }
      if (count === listTodo.length) setAllCompleted(true);
      setCountCompleted(count);
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

      newListTodo[todo.key] = todo;
      newListTodo[todo.key].key = null;

      setListTodo(newListTodo)
      setTodo(initialTodo)
      localStorage.setItem('todoList', JSON.stringify(newListTodo))
    } else {

      const listTodoTmp = [...listTodo]
      listTodoTmp.push(todo)

      listTodoTmp.sort((a, b) =>
        a.date > b.date ? 1 : a.date < b.date ? -1 : 0
      )
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

  const handleCheckbox = (index) => {
    const newListTodo = [...listTodo];
    if (!newListTodo[index]?.complete) {
      newListTodo[index].complete = true;
      setCountCompleted(countCompleted + 1);
    } else {
      newListTodo[index].complete = false;
      setCountCompleted(countCompleted - 1);
    }
    setListTodo(newListTodo);
    localStorage.setItem('todoList', JSON.stringify(newListTodo))
  }
  const handleChangeAll = () => {
    setAllCompleted(!allCompleted)
    setCountCompleted(allCompleted ? 0: listTodo.length)
    
    const newListTodo = [...listTodo];
    newListTodo.forEach(todo=>{
      todo.complete = !allCompleted
    })
    setListTodo(newListTodo);
    localStorage.setItem('todoList', JSON.stringify(newListTodo))
  }

  const deleteCompleted = () => {
    const initComplete = [];

    for (let i = 0; i < listTodo.length; i++) {
      if (listTodo[i].complete === false) {
        initComplete.push(listTodo[i])
      }
    }
    setCountCompleted(0);
    setListTodo(initComplete);
    localStorage.setItem('todoList', JSON.stringify(initComplete))
  }

  const resetData = () => {
    const listTodo = [];
    setListTodo(listTodo);
    setCountCompleted(0)
    localStorage.setItem("todoList", JSON.stringify(listTodo));
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
      { allCompleted? (
        <h4>All completed</h4>
        ): (
        <h4>You have completed {countCompleted} item(s) in this list</h4>
        )
      }
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
            <div>
              <table className="main-table">
                <thead>
                  <tr>
                    <th>No. <input
                      type="checkbox"
                      checked={allCompleted}
                      onChange={() => handleChangeAll()}
                    /></th>
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
                          onChange={() => handleCheckbox(index)}
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
              <button className='btn-delete-completed' onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm('xóa hết à bạn ey')) deleteCompleted()
              }
              }>Delete Completed</button>
              <button className='btn-delete-all' onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm('xóa hết à bạn ey')) resetData()
              }
              }>Delete All</button>
            </div>
          )}
        </center>
      </div >
    </div >
  )
}

export default App
