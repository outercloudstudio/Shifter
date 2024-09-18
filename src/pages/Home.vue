<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import test from "@components/test.vue";

const router = useRouter();
const counter = ref(0);
const abc = ref("liam hanrahan");

function goToSubpage(name: string) {
  // router.push(name);
  counter.value++;
  abc.value = "go to login";
}
</script>

<template>
  <h1>Welcome</h1>
  <h2>Please Login or Register</h2>
  <br />
  <button @click="goToSubpage('login')">Go To Login</button>
  <br />
  <test></test>
  <button @click="counter++">Add one</button>
  <p>your counter: {{ counter }}</p>
  <br />
  <input v-model="abc" />
  <p>test value: {{ abc }}</p>
  <test></test>
  <test></test>
</template>
