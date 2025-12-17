import { defineStore, acceptHMRUpdate } from 'pinia'

export const UseStore = defineStore('UseStore', {
  state: () => ({
    app_version: "1.0.0"
  })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(UseStore, import.meta.hot))
}