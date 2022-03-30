import { combineReducers } from 'redux';
import { mac, makeFetchingReducer, makeSetReducer, reduceReducers, makeCrudReducer } from './utils';

export const setPending = mac('todos/pending')
export const setFulfilled = mac('todos/fulfilled', 'payload')
export const setError = mac('todos/error', 'error')
export const setComplete = mac('todo/complete', 'payload')
export const setFilter = mac('filter/set', 'payload')

export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch(setFulfilled(todos));
  } catch (e) {
    dispatch(setError());
  }
};

// Reducers
export const filterReducer = makeSetReducer(['filter/set']);

export const fetchingReducer = makeFetchingReducer([
  'todos/pending',
  'todos/fulfilled',
  'todos/rejected',
]);

const fulfilledReducer = makeSetReducer(['todos/fulfilled'])
const crudReducer = makeCrudReducer(['todo/add', 'todo/complete'])

export const todosReducer = reduceReducers(crudReducer, fulfilledReducer)

export const reducer = combineReducers({
  todos: combineReducers({
    entities: todosReducer,
    status: fetchingReducer,
  }),
  filter: filterReducer,
});

// Selectors
export const selectTodos = (state) => {
  const {
    todos: { entities },
    filter,
  } = state;
  if (filter === 'complete') {
    return entities.filter((todo) => todo.completed);
  }

  if (filter === 'incomplete') {
    return entities.filter((todo) => !todo.completed);
  }

  return entities;
};

export const selectStatus = (state) => state.todos.status;
