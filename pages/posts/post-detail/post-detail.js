// pages/posts/post-detail/post-detail.js
var postsDate = require("../../../data/posts-data.js");
var app = getApp();
var backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAutoAudio: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsDate.postList[postId];
    
    this.setData({
      postData
    })
    var postscollected = wx.getStorageSync("post_collected");
    if (postscollected) {
      var postcollected = postscollected[postId]
      if (!postcollected) {
        this.setData({
          collected: false
        })
      } else {
        this.setData({
          collected: true
        })
      }
    } else {
      var postscollected = {};
      postscollected[postId] = false;
      wx.setStorageSync("post_collected", postscollected)
    }
    if (app.globalData.g_isPlayMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isAutoAudio:true
      })
    }
    this.setMuiscSwich()
  },
  oncollectionTop: function(event) {
    var postscollected = wx.getStorageSync("post_collected");
    var postcollected = postscollected[this.data.currentPostId];

    postcollected = !postcollected;
    console.log(postcollected);
    postscollected[this.data.currentPostId] = postcollected;
    wx.setStorageSync("post_collected", postscollected)
    this.setData({
      collected: postcollected
    })
    wx.showToast({
      title: postcollected ? "收藏成功" : "取消收藏",
    })

    // wx.showModal({
    //   title: '收藏',
    //   content: '是否收藏该文章',
    //   showCancel:"true",
    //   cancelText:"不收藏",
    //   cancelColor:"#333",
    //   confirmText:"收藏",
    //   confirmColor:"#405f80"
    // })
  },
  onShareTap: function(event) {
    var itemList = [
      "分享到给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: "用户是否取消" + '现在无法实现分享功能',
        })
      }
    })
  },
  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsDate.postList[currentPostId];
    if (this.data.isAutoAudio) {
      backgroundAudioManager.pause();
      this.setData({
        isAutoAudio: false
      })

    } else {
      backgroundAudioManager.src = postData.music.url
      console.log(postData.music.url);
      backgroundAudioManager.title = postData.music.title
      backgroundAudioManager.coverImgUrl = postData.music.coverImg
      this.setData({
        isAutoAudio: true
      })
    }
    
  },
  setMuiscSwich:function(event){
    backgroundAudioManager.onPause(() => {
      this.setData({
        isAutoAudio: false
      })
      app.globalData.g_isPlayMusic = false
      app.globalData.g_currentMusicPostId = null
    })

    backgroundAudioManager.onPlay(() => {
      this.setData({
        isAutoAudio: true
      })
      app.globalData.g_isPlayMusic = true
      app.globalData.g_currentMusicPostId = this.data.currentPostId
    })

    backgroundAudioManager.onStop(() => {
      this.setData({
        isAutoAudio: false
      })
      app.globalData.g_isPlayMusic = false
      app.globalData.g_currentMusicPostId = null
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})