// components/daily-sign-modal/daily-sign-modal.js
const app = getApp();

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    todayQuote: {
      type: Object,
      value: {}
    }
  },

  data: {
    canvasWidth: 750,
    canvasHeight: 1334,
    posterPath: '',
    isGenerating: false,
    posterReady: false,
    showPreview: true,
    currentMonth: new Date().getMonth() + 1,
    currentDay: new Date().getDate()
  },

  observers: {
    'visible': function(visible) {
      if (visible && !this.data.posterReady) {
        // 弹窗打开时，后台静默生成海报
        this.generatePosterInBackground();
      }
    }
  },

  lifetimes: {
    attached() {
      // 计算画布尺寸（rpx转px）
      const systemInfo = wx.getSystemInfoSync();
      const ratio = systemInfo.windowWidth / 750;
      this.setData({
        canvasWidth: 750 * ratio,
        canvasHeight: 1334 * ratio
      });
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    // 后台静默生成海报（不阻塞UI）
    async generatePosterInBackground() {
      if (this.data.isGenerating || this.data.posterReady) return;
      
      this.setData({ isGenerating: true });

      try {
        const posterPath = await this.drawPoster();
        this.setData({ 
          posterPath,
          posterReady: true,
          showPreview: false
        });
        console.log('海报生成完成（后台）');
      } catch (err) {
        console.error('后台生成海报失败', err);
        this.setData({ posterReady: false });
      } finally {
        this.setData({ isGenerating: false });
      }
    },

    // 生成海报（带Loading，用于保存时强制生成）
    async generatePosterWithLoading() {
      if (this.data.posterReady) return;
      
      this.setData({ isGenerating: true });
      wx.showLoading({ title: '生成中...', mask: true });

      try {
        const posterPath = await this.drawPoster();
        this.setData({ 
          posterPath,
          posterReady: true,
          showPreview: false
        });
        wx.hideLoading();
      } catch (err) {
        wx.hideLoading();
        wx.showToast({
          title: '生成失败',
          icon: 'none'
        });
        console.error('生成海报失败', err);
        throw err;
      } finally {
        this.setData({ isGenerating: false });
      }
    },

    // 绘制海报
    drawPoster() {
      return new Promise((resolve, reject) => {
        const query = wx.createSelectorQuery().in(this);
        query.select('#posterCanvas')
          .fields({ node: true, size: true })
          .exec(async (res) => {
            if (!res[0]) {
              reject(new Error('Canvas节点未找到'));
              return;
            }

            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            const dpr = wx.getSystemInfoSync().pixelRatio;
            
            canvas.width = this.data.canvasWidth * dpr;
            canvas.height = this.data.canvasHeight * dpr;
            ctx.scale(dpr, dpr);

            try {
              // 1. 绘制背景图
              await this.drawBackground(ctx, canvas);
              
              // 2. 绘制半透明蒙层
              this.drawMask(ctx);
              
              // 3. 绘制日期印章
              this.drawDateStamp(ctx);
              
              // 4. 绘制竖排诗词
              this.drawVerticalQuote(ctx);
              
              // 5. 绘制用户信息
              await this.drawUserInfo(ctx, canvas);
              
              // 6. 绘制小程序码（可选）
              // await this.drawQRCode(ctx, canvas);

              // 导出图片
              wx.canvasToTempFilePath({
                canvas: canvas,
                success: (res) => {
                  resolve(res.tempFilePath);
                },
                fail: reject
              }, this);
            } catch (err) {
              reject(err);
            }
          });
      });
    },

    // 绘制背景
    drawBackground(ctx, canvas) {
      return new Promise((resolve, reject) => {
        const bgImage = canvas.createImage();
        bgImage.onload = () => {
          ctx.drawImage(bgImage, 0, 0, this.data.canvasWidth, this.data.canvasHeight);
          resolve();
        };
        bgImage.onerror = reject;
        bgImage.src = this.data.todayQuote.image_url || '/images/default-bg.jpg';
      });
    },

    // 绘制蒙层
    drawMask(ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.data.canvasHeight);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(211, 47, 47, 0.5)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    },

    // 绘制日期印章
    drawDateStamp(ctx) {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const stampSize = 120;
      const stampX = this.data.canvasWidth - stampSize - 40;
      const stampY = 80;

      // 绘制圆形印章背景
      ctx.save();
      ctx.fillStyle = '#D32F2F';
      ctx.shadowColor = 'rgba(211, 47, 47, 0.5)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(stampX + stampSize/2, stampY + stampSize/2, stampSize/2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 绘制日期文字
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`${month}月`, stampX + stampSize/2, stampY + stampSize/2 - 20);
      
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText(`${day}`, stampX + stampSize/2, stampY + stampSize/2 + 20);
    },

    // 绘制竖排诗词
    drawVerticalQuote(ctx) {
      const quote = this.data.todayQuote.quote_content || '';
      const author = this.data.todayQuote.author || '';
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '36px "Songti SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // 竖排绘制（从右到左）
      const startX = this.data.canvasWidth - 180;
      const startY = 250;
      const lineHeight = 50;
      const columnSpacing = 60;

      // 将诗词按标点符号分行
      const lines = this.splitQuoteToLines(quote);
      
      lines.forEach((line, colIndex) => {
        const x = startX - colIndex * columnSpacing;
        [...line].forEach((char, charIndex) => {
          const y = startY + charIndex * lineHeight;
          ctx.fillText(char, x, y);
        });
      });

      // 绘制作者（小字）
      if (author) {
        ctx.font = '24px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const authorX = startX - lines.length * columnSpacing - 40;
        [...author].forEach((char, index) => {
          ctx.fillText(char, authorX, startY + index * 35);
        });
      }
    },

    // 分割诗词为多行
    splitQuoteToLines(quote) {
      // 简单处理：按逗号、句号分割，每行最多12字
      const punctuation = ['，', '。', '、', '；', '！', '？'];
      const lines = [];
      let currentLine = '';
      
      for (let char of quote) {
        currentLine += char;
        if (punctuation.includes(char) || currentLine.length >= 12) {
          lines.push(currentLine);
          currentLine = '';
        }
      }
      
      if (currentLine) lines.push(currentLine);
      return lines;
    },

    // 绘制用户信息
    drawUserInfo(ctx, canvas) {
      return new Promise((resolve) => {
        const userInfo = app.globalData.userInfo || { nickName: '星火学习者' };
        const y = this.data.canvasHeight - 200;

        // 绘制文字
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${userInfo.nickName} 正在星火学习`, this.data.canvasWidth / 2, y);

        // 绘制头像（如果有）
        if (userInfo.avatarUrl) {
          const avatarImage = canvas.createImage();
          avatarImage.onload = () => {
            const avatarSize = 80;
            const avatarX = (this.data.canvasWidth - avatarSize) / 2;
            const avatarY = y + 40;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
            ctx.restore();
            
            resolve();
          };
          avatarImage.onerror = () => resolve();
          avatarImage.src = userInfo.avatarUrl;
        } else {
          resolve();
        }
      });
    },

    // 保存到相册
    async onSaveToAlbum() {
      try {
        // 如果海报还没生成完成，显示Loading等待
        if (!this.data.posterReady) {
          await this.generatePosterWithLoading();
        }

        // 请求授权
        const authResult = await wx.getSetting();
        if (!authResult.authSetting['scope.writePhotosAlbum']) {
          await wx.authorize({ scope: 'scope.writePhotosAlbum' });
        }

        // 保存图片
        await wx.saveImageToPhotosAlbum({
          filePath: this.data.posterPath
        });

        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });

        // 更新打卡记录
        this.updateCheckInRecord();
        
      } catch (err) {
        if (err.errMsg && String(err.errMsg).includes('auth deny')) {
          wx.showModal({
            title: '需要授权',
            content: '请允许保存图片到相册',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
        console.error('保存失败', err);
      }
    },

    // 分享给好友
    async onShareToFriend() {
      // 如果海报还没生成完成，显示Loading等待
      if (!this.data.posterReady) {
        await this.generatePosterWithLoading();
      }

      wx.showToast({
        title: '长按图片分享',
        icon: 'none',
        duration: 2000
      });
    },

    // 更新打卡记录
    updateCheckInRecord() {
      const today = this.formatDate(new Date());
      let checkInRecords = wx.getStorageSync('checkInRecords') || [];
      
      // 确保是数组
      if (!Array.isArray(checkInRecords)) {
        checkInRecords = [];
      }
      
      if (!checkInRecords.includes(today)) {
        checkInRecords.push(today);
        wx.setStorageSync('checkInRecords', checkInRecords);
        
        // 触发打卡事件
        this.triggerEvent('checkin', { date: today });
      }
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
});
