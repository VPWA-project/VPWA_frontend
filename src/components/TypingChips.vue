<template>
  <div :class="{ 'q-py-sm': typingPeople.length > 0 }">
    <q-card v-show="state.showMessage" class="q-my-sm">
      <q-card-section class="bg-primary text-white">
        <div class="text-subtitle2">{{ state.nickname }} is typing</div>
      </q-card-section>

      <q-separator />

      <q-card-section> {{ state.text }} </q-card-section>

      <q-card-actions align="right">
        <q-btn flat @click="closeShowMessage">Close</q-btn>
      </q-card-actions>
    </q-card>

    <q-chip
      clickable
      outline
      @click="openMessage(person)"
      icon="textsms"
      v-for="person in typingPeople.slice(0, maxChipsToDisplay)"
      :key="person.id"
    >
      {{ person.nickname }} is typing...
    </q-chip>

    <q-chip :ripple="false" outline v-if="typingPeople.length > maxChipsToDisplay">
      and {{ typingPeople.length - maxChipsToDisplay }} more...
    </q-chip>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

const typingPeople = [
  {
    id: 1,
    nickname: 'sangalaa',
    text: 'Hi all',
  },
  {
    id: 2,
    nickname: 'adam',
    text: 'Bye',
  },
];

type TypingPerson = {
  id: number;
  nickname: string;
  text: string;
};

export default defineComponent({
  setup() {
    const state = reactive({
      showMessage: false,
      nickname: '',
      text: '',
      lastOpenedPersonId: -1,
    });

    const openShowMessage = () => (state.showMessage = true);
    const closeShowMessage = () => {
      state.showMessage = false;
      state.lastOpenedPersonId = -1;
    };

    const openMessage = (person: TypingPerson) => {
      if (state.lastOpenedPersonId === person.id) {
        closeShowMessage();
        return;
      }

      state.nickname = person.nickname;
      state.text = person.text;
      state.lastOpenedPersonId = person.id;

      openShowMessage();
    };

    return {
      state,
      typingPeople,
      maxChipsToDisplay: 5,
      closeShowMessage,
      openMessage,
    };
  },
});
</script>
