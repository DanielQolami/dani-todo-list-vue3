<template>
  <div class="home my-4">
    <div class="my-4 d-flex gap-3 align-items-center">
      <h2>Add new task</h2>
      <RouterLink to="todo" class="btn btn-primary">Add</RouterLink>
    </div>
    <div class="mb-4">
      <p>Filters:</p>
      <div class="row mb-2">
        <div class="col">
          <label class="form-label">Priority</label>
          <select class="form-select" v-model="filterPriority">
            <option value=""></option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="col">
          <label for="due-date" class="form-label">Address</label>

          <input
            type="date"
            class="form-control"
            id="due-date"
            name="due-date"
            :min="today"
            v-model="filterDate"
          />
        </div>
      </div>

      <!-- <button type="button" class="btn btn-secondary">Apply filters</button> -->
    </div>
    <div v-if="filteredTodos.length === 0">
      <p>There is no task to do</p>
    </div>
    <template v-else>
      <div class="cards--grid">
        <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
      </div>
    </template>

    <div class="modal" id="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Upcoming Tasks (Due Dates)</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul>
              <li v-for="(todo, dateIndex) in todos" :key="dateIndex">
                {{ todo.title }} &rAarr; {{ todo.dueDate }}
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- button for modal -->
    <button
      type="button"
      class="btn btn-primary"
      id="launchModalBtn"
      data-bs-toggle="modal"
      data-bs-target="#modal"
    >
      Launch modal
    </button>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, computed, ref } from "vue";
// @ is an alias to /src
import TodoItem from "@/components/TodoItem.vue";

export default {
  name: "HomePage",
  components: {
    TodoItem,
  },
  setup() {
    const store = useStore();

    const todos = store.getters.todos;

    const filterPriority = ref(null);
    const filterDate = ref(null);
    const filteredTodos = computed(() => {
      if (filterDate.value && filterPriority.value) {
        return todos.filter(
          (todo) =>
            todo.dueDate === filterDate.value &&
            todo.priority === filterPriority.value
        );
      }
      if (filterPriority.value) {
        console.log("filters", filteredTodos.value);
        return todos.filter((todo) => todo.priority === filterPriority.value);
      }
      if (filterDate.value) {
        console.log("filters", filteredTodos.value);
        return todos.filter((todo) => todo.dueDate === filterDate.value);
      }

      return todos;
    });

    onMounted(() => {
      if (todos.length === 0) {
        return;
      }
      if (store.state.firstVisit) {
        const launchModalBtn = document.getElementById("launchModalBtn");
        launchModalBtn.click();
        store.commit("changeFirstVisit");
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

    return {
      todos,
      filteredTodos,
      today,
      filterDate,
      filterPriority,
    };
  },
};
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.cards--grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media screen and (max-width: 600px) {
  .cards--grid {
    grid-template-columns: 1fr;
  }
}

#launchModalBtn {
  border: 0;
  padding: 0;
  margin: 0;
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  /* IE6, IE7 - a 0 height clip, off to the bottom right of the visible 1px box */
  clip: rect(1px 1px 1px 1px);
  /* maybe deprecated but we need to support legacy browsers */
  clip: rect(1px, 1px, 1px, 1px);
  /* modern browsers, clip-path works inwards from each corner */
  clip-path: inset(50%);
  /* added line to stop words getting smushed together (as they go onto seperate lines and some screen readers do not understand line feeds as a space */
  white-space: nowrap;
}
</style>
