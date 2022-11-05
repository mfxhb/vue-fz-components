<!--
 * @Author: BORING GHOST
 * @Date: 2022-09-09 09:00:48
 * @LastEditTime: 2022-09-10 14:48:04
 * @Description: vedio插件
 * 1. 根据最大分屏数创建相应的实例容器,并且渲染响应数量的video元素,然后将元素全部隐藏
 * 2. 再根据当前分屏数将对应的元素显示
 * 3. 元素默认显示的是select模块,播放器模块默认隐藏
 * 4. 根据select选择,初始化某个id播放器,并将url地址插入开始加载
-->
<template>
    <div class="VideoCompler__">
        <div v-if="urls.length > 0" :class="currentP" class="video-xlb-player-container">
            <template v-for="item in current_video">
                <div :class="item.id + '-tag'" :key="item.id" class="player-item">
                    <div class="tag-player">
                        <div class="control-close" @click="closeVideo(item.id)">x</div>
                        <div class="control-label">{{ item.label }}</div>
                        <video :id="item.id" class="video-js vjs-big-play-centered vjs-fluid"></video>
                    </div>
                    <div class="tag-list">
                        <span @click="selectURLEvent(item)" class="button-xlb">选取监控地址</span>
                    </div>
                </div>
            </template>
        </div>
        <div v-else style="text-align: center; color: blank; font-weight: 700">没有数据</div>
        <!-- dialog -->
        <div v-show="dialogShow" class="xlb-dialog-vedio-plugin">
            <div @click="closeDialog" class="close-button-pu button-xlb">关闭</div>
            <div class="search-contol">
                <input type="text" v-model="searchv" />
                <span @click="searchEvent" style="margin: 0 10px" class="button-xlb">搜索监控名</span>
            </div>
            <div class="select-contol">
                <select v-model="selectV">
                    <template v-for="(item, index) in urls">
                        <option :key="index" :value="item">{{ item.label || "无" }}</option>
                    </template>
                </select>
                <span @click="submitDialog('', '')" style="margin: 0 10px" class="button-xlb">查看此监控</span>
            </div>
            <div class="search-result">
                <div v-for="(item, index) in searchList" :key="index" class="result-item">
                    <span class="label">{{ item.label }}</span>
                    <span @click="submitDialog(item.url, item.label)" style="margin: 0 10px" class="button-xlb">
                        查看此监控
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createVideo } from "./wrench.js";

/* eslint-disable */
export default {
    name: "Vedio",
    data() {
        return {
            fenP: 1, //当前分屏数
            maxFenP: 9, // 最大分屏数跟classList长度要一致
            classList: ["", "oneP", "twoP", "threeP", "fourP", "fiveP", "sixP", "servenP", "enterP", "nineP"],

            current_video: [], // 当前所有分屏的播放器容器
            currentIds: [], // 当前已经被渲染的id
            currentP: "", //当前分屏类名

            dialogShow: false,
            searchv: "",
            searchList: [],
            selectV: "",
            select_curentID: "",
            select_curentLabel: ""
        };
    },
    props: {
        splitP: {
            type: Number,
            default: () => 1
        },
        urls: {
            type: Array,
            default: () => []
        }
    },
    created() {
        this.initVideoContainer();
    },
    watch: {
        splitP: {
            handler(newv, oldv) {
                // 读取相应布局的类名
                let index = Math.abs(parseFloat(newv));
                const last = this.fenP; // 保存上一次分屏数
                if (index > this.maxFenP) {
                    index = this.maxFenP;
                    this.fenP = this.maxFenP;
                } else {
                    this.fenP = this.splitP;
                }
                this.currentP = this.classList[this.fenP];
                this.disposeFenps(last, this.fenP); // 将不需要的屏幕销毁
            },
            immediate: true
        }
    },
    beforeDestroy() {},

    methods: {
        // 分屏时如果需要减少屏幕,那么相应的实例也要销毁
        // last:上一次分屏数,now这一次分屏数
        disposeFenps(last, now) {
            let cha = now - last;
            if (cha < 0) {
                cha = Math.abs(cha);
                for (let k = 0, len = cha; k < len; k++) {
                    const lastIndex = this.current_video.length - 1;
                    this.xiaoHui(this.current_video[lastIndex - k]["id"]);
                }
            }
        },
        // 初始化播放器容器
        initVideoContainer() {
            const preffix = "myVideo-";
            // 创建最大分屏数量的固定容器
            for (let k = 0, len = this.maxFenP; k < len; k++) {
                this.current_video.push({
                    id: preffix + k,
                    label: "",
                    video: ""
                });
            }
        },
        /**
         * 当前id是否已经占用
         */
        idHasId(id) {
            const index = this.currentIds.indexOf(id);
            return index >= 0;
        },
        /**
         * 开始选取某个监控
         */
        selectURLEvent(item) {
            this.dialogShow = true;
            this.select_curentID = item.id;
        },
        submitDialog(url, label) {
            let resultUrl = "";
            if (url) {
                resultUrl = url;
                this.select_curentLabel = label;
            } else {
                if (!this.selectV) return alert("请至少选择一项!");
                resultUrl = this.selectV.url;
                this.select_curentLabel = this.selectV.label;
            }
            if (!this.select_curentID) return;
            this.loadIdVideo(this.select_curentID, resultUrl, this.select_curentLabel);
        },
        closeDialog() {
            this.dialogShow = false;
            this.select_curentID = "";
        },
        /**
         * 初始化某个容器的播放器
         */
        loadIdVideo(id, url, label) {
            try {
                if (this.idHasId(id)) return alert("当前位置以有监控画面显示!");
                const index = this.current_video.findIndex(v => v.id === id);
                if (index >= 0) {
                    this.current_video[index]["label"] = label;
                    this.current_video[index]["video"] = createVideo(id, url);
                    this.currentIds.push(id);
                    this.showId(id); //初始化完成后显示容器
                    this.closeDialog(); //关闭弹窗
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 关闭播放器
         */
        closeVideo(id) {
            this.xiaoHui(id);
        },
        /**
         * 销毁某个播放器
         */
        xiaoHui(id) {
            const index = this.current_video.findIndex(v => v.id === id);
            if (index >= 0) {
                if (this.current_video[index]["video"]) {
                    this.current_video[index]["video"].dispose();
                    // 播放器被移除同时去除 id的记录
                    const idIndex = this.currentIds.indexOf(id);
                    // 销毁后隐藏video显示select列表
                    this.hideId(id);
                    // 销毁后需要创建一个崭新的video标签
                    this.createVideo(id);
                    this.current_video[index]["video"] = "";
                    if (idIndex >= 0) {
                        this.currentIds.splice(idIndex, 1);
                    }
                }
            }
        },
        //搜索
        searchEvent() {
            let result = [];
            if (!this.searchv) {
                this.searchList = [];
                return;
            }
            for (let k = 0, len = this.urls.length; k < len; k++) {
                const item = this.urls[k];
                const index = item.label.indexOf(this.searchv);
                if (index >= 0) {
                    result.push(item);
                }
            }
            this.searchList = result;
        },
        /**
         * 隐藏某个播放器
         */
        hideId(id) {
            const doc = document.querySelector("." + id + "-tag .tag-player");
            const tagList = document.querySelector("." + id + "-tag .tag-list");
            doc.style.display = "none";
            tagList.style.display = "block";
        },
        /**
         * 显示某个播放器
         */
        showId(id) {
            const doc = document.querySelector("." + id + "-tag .tag-player");
            const tagList = document.querySelector("." + id + "-tag .tag-list");
            doc.style.display = "block";
            tagList.style.display = "none";
        },
        /**
         * 创建video元素
         */
        createVideo(id) {
            const father = document.querySelector("." + id + "-tag .tag-player");
            const videoDoc = document.createElement("video");
            videoDoc.id = id;
            videoDoc.classList = "video-js vjs-big-play-centered vjs-fluid";
            father.appendChild(videoDoc);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
