Component({
  data: {
    show: true,
    expanded: false,
    tasks: [
      { id: 1, name: '完成一次学习', completed: false, reward: 10 },
      { id: 2, name: '参与PK对战', completed: false, reward: 20 },
      { id: 3, name: '解锁新藏品', completed: false, reward: 30 }
    ],
    completedTasks: 0,
    totalTasks: 3
  },

  lifetimes: {
    attached() {
      this.loadTasks()
    }
  },

  methods: {
    loadTasks() {
      const tasks = wx.getStorageSync('dailyTasks') || this.data.tasks
      const completed = tasks.filter(t => t.completed).length
      this.setData({ 
        tasks,
        completedTasks: completed
      })
    },

    togglePath() {
      this.setData({ expanded: !this.data.expanded })
    },

    closePath() {
      this.setData({ expanded: false })
    },

    toggleTask(e) {
      const id = e.currentTarget.dataset.id
      const tasks = this.data.tasks.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed }
        }
        return task
      })

      const completed = tasks.filter(t => t.completed).length
      this.setData({ 
        tasks,
        completedTasks: completed
      })

      wx.setStorageSync('dailyTasks', tasks)
      
      if (completed === this.data.totalTasks) {
        wx.showToast({
          title: '今日任务完成！',
          icon: 'success'
        })
      }
    }
  }
})
