import React, { useEffect, useRef, useState } from 'react';
import styles from './IntroCanvas.module.css';

const FRAME_COUNT = 65;
const pad = (n) => n.toString().padStart(5, '0');



export default function IntroCanvas({ onFinish }) {
  const canvasRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const [images, setImages] = useState([]);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const [maskActive, setMaskActive] = useState(false);
  const [maskZoomed, setMaskZoomed] = useState(false);

  // Загружаем PNG-секвенцию из /public
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/logoAnim/logoAnim_${pad(i)}.png`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
        }
      };

      img.onerror = () => {
        console.error(`Ошибка загрузки: logoAnim_${pad(i)}.png`);
      };

      loadedImages.push(img);
    }
  }, []);

  // Анимация секвенции
  useEffect(() => {
    if (images.length !== FRAME_COUNT) return;

    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = 2048;
    canvasRef.current.height = 2048;

    let frame = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const drawFrame = () => {
      ctx.clearRect(0, 0, 2048, 2048);
      ctx.drawImage(images[frame], 0, 0, 2048, 2048);
    };

    const animate = () => {
      drawFrame();
      frame++;
      if (frame < FRAME_COUNT) {
        setTimeout(() => requestAnimationFrame(animate), interval);
      } else {
        setAnimationFinished(true);
      }
    };

    animate();
  }, [images]);

  // Нажатие на кнопку включает маску и запускает её масштабирование
  const handleClick = () => {
    setMaskActive(true);
    requestAnimationFrame(() => setMaskZoomed(true));
    setTimeout(() => {
      setHideIntro(true);
      if (onFinish) onFinish();
    }, 1600);
  };


  if (hideIntro) return null;

  return (
    <div
      className={`${styles.wrapper} ${maskActive ? styles.maskApplied : ''} ${maskZoomed ? styles.maskZoom : ''}`}
    >

    <div className={styles.wrapper}>


      <div ref={logoWrapperRef} className={styles.logoMaskLayer}>

        <canvas ref={canvasRef} className={styles.canvas} />
        </div>


      {animationFinished && (
        <div className={styles.textContent}>
          <p className={styles.title}>
            Visualization is not embellishment — it's the structure of thought.
          </p>
          <p className={styles.subtext}>
            Every image is an idea translated into form.
          </p>
          <div className={styles.buttons}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className={styles.outlineBtn}
            >
              INSTAGRAM
            </a>
            <button onClick={handleClick} className={styles.fillBtn}>
              CHECK THE WEBSITE
            </button>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className={styles.outlineBtn}
            >
              TIKTOK
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
