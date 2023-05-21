<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <div>
          <h5 class="card-title">{{ todo.title }}</h5>
          <h6 class="card-subtitle text-secondary mb-2">
            Created: {{ todo.creationDate }}
          </h6>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="todo.completed"
            :id="todo.title"
            @change="updateTodo"
          />
          <label class="form-check-label" :for="todo.title"> Completed </label>
        </div>
      </div>

      <p class="card-text">
        {{ todo.description }}
      </p>
      <div class="text-end">
        <button type="button" class="btn btn-primary" @click="goToTodoPage">
          Edit
        </button>
        <button type="button" class="btn btn-danger ms-2" @click="deleteTodo">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Todo Item",
  props: {
    todo: Object,
  },

  setup(props) {
    const todo = props.todo;
    const store = useStore();

    const updateTodo = () => {
      store.commit("updateTodo", todo);
      console.log(todo);
    };

    const deleteTodo = (e) => {
      e.preventDefault();
      store.commit("deleteTodo", todo);
    };

    const router = useRouter();

    const goToTodoPage = (e) => {
      e.preventDefault();
      store.commit("fillEditingTodo", todo.id);
      router.push("todo");
      //   router.push({
      //     name: "todo",
      //     query: {
      //       id: todo.id,
      //     },
      //   });
    };

    return {
      todo,
      updateTodo,
      deleteTodo,
      goToTodoPage,
    };
  },
};
</script>

<style scoped>
.card {
  margin: 0.5rem 0;
  width: 18rem;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-title {
  word-break: break-all;
}
.card-subtitle {
  font-size: small;
}

.checkbox-group--position {
  right: 1rem;
  top: 0.5rem;
}
</style>
