/*
 * @Author: BORING GHOST
 * @Date: 2022-09-09 09:17:11
 * @LastEditTime: 2022-09-09 19:52:45
 * @Description:
 */

import Video from "video.js";

// 测试地址
export const testURL = "https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8";

/**
 * 创建一个Video播放器
 * @param {string} 必传 el 播放器id
 * @param {string} 可选 url 视频地址
 * @param {object} 可选 options 配置项
 * @return 返回一个video播放器实例
 */
export function createVideo(el, url, options = {}) {
    try {
        url = url || testURL;
        if (!url || !el) throw new Error("创建视频播放器时缺少参数~");
        const defaultOpt = {
            sources: [
                {
                    src: url,
                    type: "application/x-mpegURL"
                }
            ],
            controls: true,
            controlBar: {
                children: [
                    { name: "playToggle" }, // 播放按钮
                    { name: "currentTimeDisplay" }, // 当前已播放时间
                    { name: "durationDisplay" }, // 总时间
                    {
                        name: "volumePanel", // 音量控制
                        inline: false // 不使用水平方式
                    },
                    { name: "FullscreenToggle" } // 全屏
                ]
            },
            fluid: true, // 自适应宽高
            //自动播放属性,muted:静音播放
            autoplay: "muted",
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto"
        };
        Object.assign(defaultOpt, options || {});
        const currentVideo = Video(el, defaultOpt, function onPlayerReady() {
            this.on("error", function () {
                alert("此监控读取失败,请重新选择!" + url);
            });
        });
        return currentVideo;
    } catch (error) {
        console.log("创建播放器失败~", error);
    }
}
