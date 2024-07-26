import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);
  const canvasRef3 = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    canvasImage();
    canvasImage2();
    drawCanvas();
  }, []);

  function canvasImage() {
    const now = new Date();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, 150, 150);
    ctx.translate(75, 75);
    ctx.scale(0.4, 0.4);
    ctx.rotate(-Math.PI / 2);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    // 小时刻度
    ctx.save();
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.rotate(Math.PI / 6);
      ctx.moveTo(100, 0);
      ctx.lineTo(120, 0);
      ctx.stroke();
    }
    ctx.restore();

    // 分钟刻度
    ctx.save();
    ctx.lineWidth = 5;
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        ctx.beginPath();
        ctx.moveTo(117, 0);
        ctx.lineTo(120, 0);
        ctx.stroke();
      }
      ctx.rotate(Math.PI / 30);
    }
    ctx.restore();

    const sec = now.getSeconds();
    // 要显示扫秒式的时钟，请使用：
    // const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes();
    const hr = now.getHours() % 12;

    ctx.fillStyle = "black";

    // 显示图像描述
    canvas.innerText = `当前时间：${hr}:${min}`;

    // 时针
    ctx.save();
    ctx.rotate(
      (Math.PI / 6) * hr + (Math.PI / 360) * min + (Math.PI / 21600) * sec
    );
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(80, 0);
    ctx.stroke();
    ctx.restore();

    // 分针
    ctx.save();
    ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-28, 0);
    ctx.lineTo(112, 0);
    ctx.stroke();
    ctx.restore();

    // 秒针
    ctx.save();
    ctx.rotate((sec * Math.PI) / 30);
    ctx.strokeStyle = "#D40000";
    ctx.fillStyle = "#D40000";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(83, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fillStyle = "rgb(0 0 0 / 0%)";
    ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#325FA2";
    ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.restore();

    window.requestAnimationFrame(canvasImage);
  }

  function canvasImage2() {
    const canvas = canvasRef2.current;
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");

      ctx.fillRect(25, 25, 100, 100);
      ctx.clearRect(45, 45, 60, 60);
      ctx.strokeRect(50, 50, 50, 50);
    }
  }

  function drawCanvas() {
    const canvas = canvasRef3.current;
    const ctx = canvasRef3.current?.getContext("2d");
    let raf;
    let running = false;

    const ball = {
      x: 100,
      y: 100,
      vx: 5,
      vy: 1,
      radius: 25,
      color: "red",
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

  window.requestAnimationFrame(canvasImage);

  return (
    <>
      <span onClick={()=>navigate('/Child')}>跳转到CHILD</span>
      <br></br>
      <input type="text" id="username" />
      <br></br>
      <input type="text" id="password" />
      <br></br>
      <canvas ref={canvasRef3} style={{ border: "1px solid black" }}></canvas>
      <canvas ref={canvasRef} width={200}></canvas>
      <canvas ref={canvasRef2} width={200}></canvas>
    </>
  );
}

export default Login;
