import Vue from 'vue'
import Vuex from 'vuex'
import {Todo} from "@/types";

import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [] as Todo[]
  },
  getters: {
    getTodoById: (state) => (id: number) => {
      return state.todos.find((todo) => todo.id === id);
    }
  },
  mutations: {
    initialize(state, payload) {
      state.todos = [];
      console.log(payload);
      payload.map((data: {id: number; title: string; completed: boolean}) =>
        state.todos.push({id: data.id, title: data.title, completed: data.completed}));
    },
    addTodo (state, payload) {
      // DB化するときにAPIレスポンスからやってくるあたらしいidをセット
      state.todos.push({id: payload.id , title: payload.title, completed: false})
    },
    deleteTodo (state, {id}) {
      state.todos = state.todos.filter(todo => todo.id !== id)
    },
    editTodo (state, {id, title}) {
      const targetnumber = state.todos.findIndex((todo) => todo.id === id);
      state.todos[targetnumber].title = title;
    }
  },
  actions: {
    async initialize (context) {
      const result = await axios.get("https://todoapp-laravel-sakin.herokuapp.com/api/todos")
      context.commit("initialize", result.data);
    },
    async deleteTodo (context, payload) {
      console.log(payload);
      await axios.delete("https://todoapp-laravel-sakin.herokuapp.com/api/todos/delete",
        {
          params: {
            id: payload.id
          }
        }).then(res => {
          console.log(res);
      });
      context.commit('deleteTodo', payload)
    },
    async addTodo (context, payload) {
      const result =
        await axios.post("https://todoapp-laravel-sakin.herokuapp.com/api/todos/create",
          {
            title: payload.title
          })
      console.log(result.data);
      const p = {
        id : result.data.newid,
        title: payload.title,
      }
      context.commit('addTodo', p)
    },
    async editTodo (context, payload) {
      const result =
        await axios.post("https://todoapp-laravel-sakin.herokuapp.com/api/todos/update",
          {
            id: payload.id,
            title: payload.title
          });
      context.commit('editTodo', payload)
    },
    async toggleComplete(_, payload) {
      console.log(payload);
      // DBの完了、未完了ステータスを変更
      await axios.post("https://todoapp-laravel-sakin.herokuapp.com/api/todos/complete",
        {
          id: payload.id
        })
    }
  },
  modules: {
  }
})
