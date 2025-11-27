// components/badge-modal/badge-modal.js
Component({
    properties: {
        visible: {
            type: Boolean,
            value: false
        },
        badge: {
            type: Object,
            value: {
                name: '星火燎原',
                desc: '连续打卡7天，点燃心中的理想之火。',
                icon: '🔥',
                date: '2023.10.01'
            }
        }
    },

    methods: {
        close() {
            this.triggerEvent('close');
        },

        preventScroll() { }
    }
})
