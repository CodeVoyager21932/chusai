// components/daily-letter/daily-letter.js
Component({
    properties: {
        visible: {
            type: Boolean,
            value: false
        },
        content: {
            type: String,
            value: '星星之火，可以燎原。我们在黑暗中寻找光明，在荆棘中开辟道路。愿你接过这把火炬，照亮前行的路。'
        },
        quote: {
            type: String,
            value: '世界是你们的，也是我们的，但是归根结底是你们的。'
        },
        author: {
            type: String,
            value: '一位老兵'
        }
    },

    data: {
        isOpen: false,
        todayDate: ''
    },

    lifetimes: {
        attached() {
            const now = new Date();
            this.setData({
                todayDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
            });
        }
    },

    methods: {
        close() {
            this.triggerEvent('close');
            // 延迟重置状态，以便下次打开时仍是信封
            setTimeout(() => {
                this.setData({ isOpen: false });
            }, 300);
        },

        openLetter() {
            this.setData({ isOpen: true });
            // 播放拆信音效 (可选)
            wx.vibrateShort({ type: 'light' });
        },

        checkIn() {
            // 1. 获取今日日期
            const today = this.formatDate(new Date());
            
            // 2. 读取现有签到记录
            let checkInRecords = wx.getStorageSync('checkInRecords') || [];
            if (!Array.isArray(checkInRecords)) {
                checkInRecords = [];
            }
            
            // 3. 检查今日是否已签到
            if (checkInRecords.includes(today)) {
                wx.showToast({ title: '今日已签收', icon: 'none' });
                this.close();
                return;
            }
            
            // 4. 添加今日签到记录并持久化
            checkInRecords.push(today);
            wx.setStorageSync('checkInRecords', checkInRecords);
            
            // 5. 计算连续签到天数
            const continuousDays = this.calculateContinuousDays(checkInRecords);
            
            // 6. 更新用户统计数据
            let userStats = wx.getStorageSync('userStats') || {};
            userStats.continuous_days = continuousDays;
            userStats.total_days = checkInRecords.length;
            wx.setStorageSync('userStats', userStats);
            
            // 7. 触发签到事件，通知父页面
            this.triggerEvent('checkin', { 
                date: today,
                continuousDays: continuousDays 
            });
            
            wx.showToast({ title: '信念已签收', icon: 'success' });
            this.close();
        },

        // 格式化日期为 YYYY-MM-DD
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        // 计算连续签到天数
        calculateContinuousDays(records) {
            if (!records || records.length === 0) return 0;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let continuous = 0;
            let currentDate = new Date(today);
            
            for (let i = 0; i < 365; i++) {
                const dateStr = this.formatDate(currentDate);
                if (records.includes(dateStr)) {
                    continuous++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }
            return continuous;
        },

        preventScroll() { }
    }
})
