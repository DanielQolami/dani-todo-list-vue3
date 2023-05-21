<template>
  <div class="Todo mt-4 px-4">
    <h1 class="mb-4">Todo</h1>

    <form ref="todoForm" @submit="onSubmit">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          id="title"
          name="title"
          v-model="todo.title"
        />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          class="form-control"
          id="description"
          name="description"
          rows="3"
          v-model="todo.description"
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="due-date" class="form-label">Due Date</label>
        <input
          type="date"
          class="form-control"
          id="due-date"
          name="due-date"
          v-model="todo.dueDate"
          :min="today"
        />
      </div>
      <div class="mb-3">
        <label for="priority" class="form-label">Priority</label>
        <select
          class="form-select"
          id="priority"
          name="priority"
          v-model="todo.priority"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="mb-3 form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="completed"
          name="completed"
          v-model="todo.completed"
        />
        <label class="form-check-label" for="completed">Completed</label>
      </div>
      <button type="submit" class="btn btn-primary me-2">Save</button>
      <button type="button" class="btn btn-danger" @click="cancelForm">
        Cancel
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "Todo Page",
  setup() {
    const store = useStore();
    // const todoForm = ref(null);

    const todo = ref({
      title: "",
      description: "",
      dueDate: null,
      priority: "high",
      completed: false,
      creationDate: null,
      id: null,
    });
    const editingTodo = ref(false);

    const route = useRoute();
    onMounted(() => {
      if (store.state.editingTodo) {
        todo.value = store.state.editingTodo;
        editingTodo.value = true;
      }
    });

    const getToday = () => {
      const date = new Date();
      const day =
        date.getUTCDate() > 9 ? date.getUTCDate() : "0" + date.getUTCDate();
      const month =
        date.getUTCMonth() + 1 > 9
          ? date.getUTCMonth() + 1
          : `0${date.getUTCMonth() + 1}`;

      return `${date.getUTCFullYear()}-${month}-${day}`;
    };
    const today = getToday();

    const onSubmit = (event) => {
      event.preventDefault();

      if (!editingTodo.value) {
        const lastTodoId = computed(() => store.getters.lastTodoId);

        todo.value.id =
          lastTodoId.value === null ? Number(0) : Number(lastTodoId.value) + 1;
        todo.value.creationDate = today;
      }

      if (!todo.value.title) {
        alert("title is empty");
        return;
      }
      if (!todo.value.dueDate) {
        alert("due date is empty");
        return;
      }

      if (!editingTodo.value) {
        store.commit("addTodo", todo.value);
      } else {
        store.commit("updateTodo", todo.value);
        editingTodo.value = false;

        cancelForm();
      }
      // todoForm.value.reset();
      todo.value = {
        title: "",
        description: "",
        dueDate: null,
        priority: "high",
        completed: false,
        creationDate: null,
        id: null,
      };
    };

    const cancelForm = () => {
      store.commit("clearEditingTodo");
      goToHome();
    };

    const router = useRouter();
    const goToHome = () => {
      router.push("/");
    };

    return {
      todo,
      today,
      onSubmit,
      cancelForm,
    };
  },
};
</script>

<style scoped></style>
