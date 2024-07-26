import * as rrweb from "@sentry-internal/rrweb";
import rrwebPlayer from "@sentry-internal/rrweb-player";
import "@sentry-internal/rrweb-player/dist/style.css";
// import * as rrweb from "rrweb";
// import rrwebPlayer from 'rrweb-player';
// import "rrweb-player/dist/style.css";
import { useEffect, useRef, useState } from "react";
import useStore from "../../store";
import "./index.scss";
import { listenerHandler } from "@sentry-internal/rrweb-types";
import IframeNode from "../../components/IframeNode";
import Frame from "react-frame-component";

function App() {
  const { event, setEvent } = useStore();
  const [replayer, setReplayer] = useState<rrwebPlayer>();
  const replayerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawCanvas();
    // iframe 监控
    // window.addEventListener("message", (e) => {
    //   console.log(e.data.event,1)
    //   if (e.data.event) setEvent(e.data.event);
    // });
  }, []);

  // 录制
  function startRecord() {
    console.log("开始录制");
    // record 开始录制
    // stopFn 停止录制
    const stopFn: listenerHandler | undefined = rrweb.record({
      emit(event) {
        // setTimeout(() => {
        //   stopFn();
        //   console.log("结束");
        // }, 12000);
        // 存储

        setEvent(event);
      },
      // 支持 canvans
      recordCanvas: true,
      collectFonts: true,
      getCanvasManager: rrweb.CanvasManager,
      // recordCrossOriginIframes: true,
    });
  }

  // 回放
  function stopRecord() {
    const replayer = new rrwebPlayer({
      target: replayerRef.current,
      props: {
        events: event,
        width: 800,
        UNSAFE_replayCanvas: true,
      },
    });
    replayer.play();
  }

  // 绘制 canvas
  function drawCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    let raf;
    let running = false;

    const ball = {
      x: 100,
      y: 100,
      vx: 5,
      vy: 1,
      radius: 25,
      color: "blue",
      draw: function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      },
    };

    function clear() {
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
      clear();
      ball.draw();
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }

      raf = window.requestAnimationFrame(draw);
    }

    canvas.addEventListener("mousemove", function (e) {
      if (!running) {
        clear();
        ball.x = e.offsetX;
        ball.y = e.offsetY;
        ball.draw();
      }
    });

    canvas.addEventListener("click", function (e) {
      if (!running) {
        raf = window.requestAnimationFrame(draw);
        running = true;
      }
    });

    canvas.addEventListener("mouseout", function (e) {
      window.cancelAnimationFrame(raf);
      running = false;
    });

    ball.draw();
  }

  return (
    <>
      <button onClick={startRecord}>录制</button>
      <button
        onClick={() => {
          if (event.length >= 2) stopRecord();
        }}
      >
        播放
      </button>
      <hr></hr>
      {/* canvas */}
      <canvas
        ref={canvasRef}
        width="400"
        height="200"
        style={{ border: "1px solid black", marginLeft: "20px" }}
      ></canvas>
      <hr></hr>
      {/* iframe 内部组件 */}
      <Frame>
        <IframeNode></IframeNode>
      </Frame>
      {/* iframe 异源网页 */}
      <iframe
        src="https://fanyi.baidu.com/mtpe-individual/multimodal"
        value="false"
        ref={iframeRef}
      ></iframe>
      <hr></hr>
      {/* iframe 同源网页 */}
      <iframe
        src="http://localhost:5173/#/Login"
        value="false"
        height="250"
        width="800"
      ></iframe>
      {/* 录屏展示 */}
      <div className="replayer" ref={replayerRef}></div>
    </>
  );
}

export default App;
