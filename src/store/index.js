import { createStore } from "vuex";

function updateLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export default createStore({
  state: {
    todos: JSON.parse(localStorage.getItem("todos")) || [],
    editingTodo: null,
    firstVisit: true,
  },
  getters: {
    todos: (state) => {
      return state.todos;
    },
    lastTodoId: (state) => {
      if (!state.todos.length) return null;
      return state.todos[state.todos.length - 1].id;
    },
    // getTodoById: (state, getters) => (id) => {
    //   console.log(
    //     "getter",
    //     getters.todos.find((todo) => todo.id === id)
    //   );
    //   return getters.todos.find((todo) => todo.id === id);
    // },
  },
  mutations: {
    addTodo: (state, payload) => {
      state.todos.push(payload);

      updateLocalStorage(state.todos);
    },
    updateTodo: (state, payload) => {
      const index = state.todos.findIndex((todo) => todo.id === payload.id);

      state.todos[index].completed = payload.completed;
      state.todos[index].title = payload.title;
      state.todos[index].description = payload.description;
      state.todos[index].priority = payload.priority;
      state.todos[index].dueDate = payload.dueDate;

      updateLocalStorage(state.todos);
    },
    deleteTodo: (state, payload) => {
      const index = state.todos.findIndex((todo) => todo.id === payload.id);

      if (index > -1) state.todos.splice(index, 1);

      updateLocalStorage(state.todos);
    },
    fillEditingTodo: (state, todoId) => {
      const index = state.todos.findIndex((todo) => todo.id === todoId);

      state.editingTodo = state.todos[index];
    },
    clearEditingTodo: (state) => {
      state.editingTodo = null;
    },

    changeFirstVisit: (state) => {
      state.firstVisit = false;
    },
  },
  actions: {},
  modules: {},
});
