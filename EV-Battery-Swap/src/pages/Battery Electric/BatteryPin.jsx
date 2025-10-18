
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BatteryPin.css';

// Đăng ký plugin ScrollTrigger với GSAP một lần duy nhất
gsap.registerPlugin(ScrollTrigger);



export default function BatteryPin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatteryIndex, setSelectedBatteryIndex] = useState(null);

  const handleBatteryClick = (index) => {
    setSelectedBatteryIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBatteryIndex(null);
  };

  // --- Thêm các Ref cần thiết cho animation ---
  const canvasRef = useRef(null);
  const sectionRef = useRef(null); // Ref cho section "Power Packed"

  // --- Logic cho animation cuộn trang ---
  useEffect(() => {
  // Chỉ lấy các ảnh pin, không lấy ảnh xe máy
  // Đảm bảo chỉ vẽ các ảnh sequence-gn-battery-01.jpg đến 50.jpg
  const frameFiles = Array.from({length: 50}, (_, i) => `/pin/sequence-gn-battery-${String(i+1).padStart(2, '0')}.jpg`);
    const imageCache = [];
    frameFiles.forEach(src => {
      const img = new window.Image();
      img.src = src;
      imageCache.push(img);
    });
    const frameCount = frameFiles.length;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    // Đặt kích thước canvas phù hợp với ảnh (có thể điều chỉnh lại nếu ảnh khác size)
  canvas.width = 800;
  canvas.height = 900;
    // Vẽ ảnh đầu tiên lên canvas ngay khi nó tải xong
    imageCache[0].onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
  // Vẽ ảnh căn giữa, giữ tỉ lệ và zoom lớn hơn
  const img = imageCache[0];
  const zoom = 1.5; // Zoom lớn hơn 1.5 lần
  const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * zoom;
  const x = (canvas.width - img.width * scale) / 2;
  const y = (canvas.height - img.height * scale) / 2;
  context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    let lastFrame = 0;
    const frameData = { frame: 0 };
    // Thiết lập animation với GSAP
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1500', // Giảm chiều dài cuộn để animation diễn ra nhanh hơn
        scrub: 0.3, // scrub nhỏ hơn để animation mượt hơn
        pin: true,
      },
    });
    tl.to(frameData, {
      frame: frameCount - 1,
      ease: 'none',
      onUpdate: () => {
        // Lerp để chuyển đổi frame mượt hơn
        lastFrame += (frameData.frame - lastFrame) * 0.25;
        const frameIndex = Math.round(lastFrame);
        const currentImg = imageCache[frameIndex];
        if (currentImg && currentImg.complete) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          // Vẽ ảnh căn giữa, giữ tỉ lệ và zoom lớn hơn
          const zoom = 2;
          const scale = Math.min(canvas.width / currentImg.width, canvas.height / currentImg.height) * zoom;
          const x = (canvas.width - currentImg.width * scale) / 2;
          const y = (canvas.height - currentImg.height * scale) / 2;
          context.drawImage(currentImg, x, y, currentImg.width * scale, currentImg.height * scale);
        }
      },
    });
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <div className="battery-pin-page">
      {/* Main Container */}
      <div className="gogoro-container">
        {/* Background Video */}
        <video 
          className="background-video"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/Pin.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Left Side - Text Content */}
        <div className="text-content">
          <h1>Always quick. Always ready.</h1>
          <p>GoStation Sites make swapping batteries a breeze. Way cleaner than gas. Infinitely faster than charging. Full batteries are ready when you are. No waiting. No fumes. No fuss.</p>
        </div>

        {/* Right Side - Battery Station */}
        <div className="station-container">
          {/* Battery Grid */}
          <div className="battery-grid">
            {[...Array(18)].map((_, index) => (
              <div 
                key={index} 
                className="battery-slot"
                onClick={() => handleBatteryClick(index)}
                style={{'--i': index}}
              >
                <div className="battery-inner"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section ảnh và số liệu nổi bật */}
      <section className="statsSection">
        <h2 className="title">
          Nền tảng năng lượng tiên tiến cho xe điện hai bánh
        </h2>
        <p className="subtitle">
          Hơn 50 thành phố | Một nền tảng | Hơn 55 mẫu xe điện hỗ trợ
        </p>
        <div className="statsRow">
          <div className="statBlock">
            <div className="statNumber blue">50<sup>+</sup></div>
            <div className="statLabel">Thành phố</div>
          </div>
          <div className="statBlock">
            <div className="statNumber green">ONE</div>
            <div className="statLabel">Nền tảng</div>
          </div>
          <div className="statBlock">
            <div className="statNumber blue">55<sup>+</sup></div>
            <div className="statLabel">Mẫu xe</div>
          </div>
        </div>
        <img
          src="/img-pbgn-avengers@2x.jpg"
          alt="EV Battery Platform"
          className="statsImage"
        />
      </section>

      {/* Section pin nổi bật với animation cuộn ảnh */}
      <section ref={sectionRef} className="battery-pin-highlight">
        <div className="bph-text-content">
          <h2 className="bph-title">Power Packed.</h2>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
          <canvas ref={canvasRef} className="bph-canvas" style={{display: 'block', margin: '32px auto 0 auto', maxWidth: '700px', width: '100%', height: 'auto', background: 'none'}}></canvas>
        </div>
      </section>

      {/* Section trống để có không gian cuộn */}
      <div style={{ height: '100vh', background: '#fff' }}>
        <h2>
          ádasda
        </h2>
      </div>
    </div>
    
  );
}