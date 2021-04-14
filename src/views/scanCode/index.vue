<template>
  <div>
    <button id="take">拍照</button>
    <br />
    
    <!-- <video id="v" style="width: 640px; height: 480px"></video>
    <canvas id="canvas" style="display: none"></canvas>
    <img id="photo" alt="photo" /> -->
  </div>
</template>
<script>
//import QRcode from "./QRcode";
import QrCode from 'qrcode-decoder'
//import  "@/utils/reqrcode.js"

export default {
  components: {
   // QRcode,
  },
  data() {
    return {
      url: "(需要生成二维码的网址)",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      !(function () {
        function userMedia() {
          return (navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia ||
            null);
        }
        if (userMedia()) {
          let videoPlaying = false;
          let constraints = {
            video: true,
            audio: false,
          };
          let video = document.getElementById("v");
          console.log(video);
          let media = navigator.getUserMedia(
            constraints,
            function (stream) {
              let url = window.URL || window.webkitURL;
              try {
                video.src = window.URL.createObjectURL(stream);
              } catch (error) {
                console.log(error);
                video.srcObject = stream;
              }
              video.play();
              videoPlaying = true;
            },
            function (error) {
              console.log("ERROR");
              console.log(error);
            }
          );
          document.getElementById("take").addEventListener(
            "click",
            function () {
              if (videoPlaying) {
                let canvas = document.getElementById("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                //var context = canvas.getContext("2d").drawImage(video, 0, 0);
                canvas.getContext("2d").drawImage(video, 0, 0);
                var context = canvas.getContext("2d");
                var data = context.getImageData(0, 0, canvas.width, canvas.height);
                //var QrCode = require('qrcode-reader');
                //var qr = new QrCode();

                //qr.decode(data);

                //let data = canvas.toDataURL("image/webp");
                //document.getElementById("photo").setAttribute("src", data);

                // var QrCode = require("qrcode-reader");
                // var qr = new QrCode();
                // qr.decode(data);
                // qr.callback = function (error, result) {
                //   if (error) {
                //     console.log(error);
                //     return;
                //   }
                //   console.log(result);
                // };
              }
            },
            false
          );
        } else {
          console.log("不支持");
        }
      })();
    },
  },
};
</script>