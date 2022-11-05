/*
 * @Author: BORING GHOST
 * @Date: 2022-09-09 09:11:09
 * @LastEditTime: 2022-09-09 09:13:02
 * @Description:
 */
import Video from "video.js";
import "video.js/dist/video-js.css";

const useVedio = {
    install(app) {
        app.prototype.$video = Video;
    }
};

export default useVedio;
