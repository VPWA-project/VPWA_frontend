<template>
  <div :class="{ 'q-py-sm': typingPeople.length > 0 }">
    <q-card v-show="state.showMessage" class="q-my-sm border-15">
      <q-card-section class="bg-grey-2 text-black">
        <div class="text-subtitle2">{{ state.nickname }} is typing</div>
      </q-card-section>

      <q-card-section> {{ state.text }} </q-card-section>

      <q-card-actions align="right">
        <q-btn
          class="rounded-borders self-end bg-grey-2 q-px-sm border-15"
          color="black"
          clickable
          flat
          @click="closeShowMessage"
          icon="close"
        />
      </q-card-actions>
    </q-card>

    <q-chip
      clickable
      outline
      @click="openMessage(person)"
      v-for="person in typingPeople.slice(0, maxChipsToDisplay)"
      :key="person.id"
    >
      {{ person.nickname }}
      <q-spinner-dots class="q-pl-xs q-mt-xs" size="24px" />
    </q-chip>

    <q-chip
      :ripple="false"
      outline
      v-if="typingPeople.length > maxChipsToDisplay"
    >
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
  {
    id: 3,
    nickname: 'john',
    text: 'Hello',
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
      maxChipsToDisplay: 2,
      closeShowMessage,
      openMessage,
    };
  },
});
</script>
