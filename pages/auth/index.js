import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx.js";

Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {

      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2 获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      //  3 发送请求 获取用户的token，这里无法获取，因为该APPID不在白名单之内
      const token = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      //  如果拿不到token，则提示用户获取失败，并返回上一个页面
      if (!token) {
        // 没有获取到token
        wx.showToast({
          title: '获取权限失败',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 2000)
        return;
      }
      // 4 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });

    } catch (error) {
      console.log(error);
    }
  }
})