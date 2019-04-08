// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/util.js")
var app = getApp();
Page({

  data: {
    movies:{},
    navigateTitle: "",
    requestUrl:"",
    totaCount:0,
    isEmpty:true
  },
  onLoad: function(options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    });
    var dataUrl="";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "v2/movie/top250";
        break;
    }
    this.data.requestUrl=dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },

  onPullDownRefresh:function(event){
    var refreshUrl=this.data.requestUrl+"?star=0&count=20";
    util.http(refreshUrl,this.processDoubanData);
    wx.showNavigationBarLoading()
  },

  processDoubanData: function (moviesDouban){
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp)
    }
    var totalMovies={};
    if(!this.data.isEmpty){
      totalMovies=this.data.movies.concat(movies);
    }else{
      totalMovies=movies;
      this.data.isEmpty=false;
    }
    
    this.setData({movies:totalMovies})
    this.data.totaCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },


  onScrollLower:function(event){
    var nexUrl=this.data.requestUrl+"?start="+this.data.totaCount+"&count=20;"
    util.http(nexUrl, this.processDoubanData)
    wx.showNavigationBarLoading()

  },
 

  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },



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