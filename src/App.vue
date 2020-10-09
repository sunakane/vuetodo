<template>
  <div id="app">
    <h1>TodoApp</h1>
    <ul style="list-style: none">
      <li v-for="todo in $store.state.todos" :key="todo.id">
        <input
          :id="todo.id"
          type="checkbox"
          v-model="todo.completed"
          @change="toggleComplete(todo.id)"
        />
        <span v-bind:class="{ done: todo.completed }">
          <label :for="todo.id">
            {{ todo.id }}
            {{ todo.title }}
          </label>
        </span>
        <span v-show="!todo.completed">
          <button @click="deleteTodo(todo.id)">削除</button>
          <button @click="selectToEdit(todo.id)">編集</button>
        </span>
      </li>
    </ul>

    <form v-if="editing !== null" @submit="editTodo">
      <input name="title" v-model="title" placeholder="New Todo" />
      <button type="submit">{{ editing }}を編集</button>
    </form>
    <form v-else @submit="addTodo">
      <input name="title" v-model="title" />
      <button type="submit">追加</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Todo } from "@/types";

export default Vue.extend({
  name: "App",
  created() {
    this.$store.dispatch("initialize");
  },
  methods: {
    deleteTodo(id: number) {
      if (confirm("本当に削除してよろしいですか？")) {
        this.$store.dispatch("deleteTodo", { id: id });
      }
    },
    addTodo(event: Event) {
      event.preventDefault();
      this.$store.dispatch("addTodo", { title: this.title });
      this.title = "";
    },
    selectToEdit(id: number) {
      this.title = this.$store.getters.getTodoById(id).title;
      this.editing = id;
    },
    editTodo(event: Event) {
      event.preventDefault();
      this.$store.dispatch("editTodo", { id: this.editing, title: this.title });
      this.editing = null;
      this.title = "";
    },
    toggleComplete(id: number) {
      this.$store.dispatch("toggleComplete", { id: id });
    },
  },
  data() {
    return {
      title: "",
      editing: null as null | number,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.done {
  text-decoration: line-through;
}
</style>
