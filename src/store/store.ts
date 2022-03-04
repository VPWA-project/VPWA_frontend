import { createStore } from 'vuex';

export const store = createStore({
    state: {
        channels: [
            {
                name: 'Channel 1',
                icon: 'lock'
            },
            {
                name: 'Channel 2',
                icon: 'lock'
            }
        ]
    }
})