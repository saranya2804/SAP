import React, { useRef, useEffect, useState } from 'react';
import '../App.css';

const BubbleAnimation = ({ currentSection }) => {
    const canvasRef = useRef(null);
    const isDragging = useRef(false);
    const bubble = useRef(null);
    const [bubbleSize, setBubbleSize] = useState(50); // Initial bubble size

    const bubbleColor = 'rgba(173, 216, 230, 0.7)';
    const borderColor = 'rgba(0, 0, 0, 0.2)'; // Transparent border color

    const createBubble = () => {
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: bubbleSize,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: bubbleColor,
            isBurst: false,
            fragments: []
        };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        bubble.current = createBubble();

        const drawBubble = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!bubble.current.isBurst) {
                // Draw bubble
                const gradient = ctx.createRadialGradient(bubble.current.x, bubble.current.y, bubble.current.size / 4, bubble.current.x, bubble.current.y, bubble.current.size);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(0.5, bubble.current.color);
                gradient.addColorStop(1, 'rgba(173, 216, 230, 0.5)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(bubble.current.x, bubble.current.y, bubble.current.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw transparent border
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(bubble.current.x, bubble.current.y, bubble.current.size, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                drawFragments();
            }
        };

        const drawFragments = () => {
            bubble.current.fragments.forEach((fragment) => {
                ctx.fillStyle = fragment.color;
                ctx.beginPath();
                ctx.arc(fragment.x, fragment.y, fragment.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const moveBubble = () => {
            if (!bubble.current.isBurst) {
                // Smooth movement
                bubble.current.x += bubble.current.speedX * 0.5;
                bubble.current.y += bubble.current.speedY * 0.5;

                // Bounce off edges
                const hitLeft = bubble.current.x < bubble.current.size;
                const hitRight = bubble.current.x > canvas.width - bubble.current.size;
                const hitTop = bubble.current.y < bubble.current.size;
                const hitBottom = bubble.current.y > canvas.height - bubble.current.size;

                if (hitLeft || hitRight) {
                    bubble.current.speedX = -bubble.current.speedX;
                    bubble.current.x = Math.max(bubble.current.size, Math.min(bubble.current.x, canvas.width - bubble.current.size));
                }

                if (hitTop || hitBottom) {
                    bubble.current.speedY = -bubble.current.speedY;
                    bubble.current.y = Math.max(bubble.current.size, Math.min(bubble.current.y, canvas.height - bubble.current.size));
                }
            } else {
                bubble.current.fragments.forEach((fragment, index) => {
                    fragment.x += fragment.speedX;
                    fragment.y += fragment.speedY;

                    // Remove fragments off-screen
                    if (fragment.x < 0 || fragment.x > canvas.width || fragment.y < 0 || fragment.y > canvas.height) {
                        bubble.current.fragments.splice(index, 1);
                    }
                });
            }

            drawBubble();
            requestAnimationFrame(moveBubble);
        };

        const createBurstEffect = () => {
            bubble.current.isBurst = true;
            const numberOfFragments = 30;
            for (let i = 0; i < numberOfFragments; i++) {
                bubble.current.fragments.push({
                    x: bubble.current.x,
                    y: bubble.current.y,
                    size: Math.random() * 5 + 5,
                    speedX: Math.random() * 4 - 2,
                    speedY: Math.random() * 4 - 2,
                    color: `rgba(173, 216, 230, ${Math.random() * 0.8 + 0.2})`
                });
            }

            setTimeout(() => {
                Object.assign(bubble.current, createBubble());
            }, 1000);
        };

        const onMouseDown = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const distance = Math.sqrt((mouseX - bubble.current.x) ** 2 + (mouseY - bubble.current.y) ** 2);
            if (distance < bubble.current.size && !bubble.current.isBurst) {
                isDragging.current = true;
            }
        };

        const onMouseMove = (e) => {
            if (isDragging.current && !bubble.current.isBurst) {
                bubble.current.x = e.clientX;
                bubble.current.y = e.clientY;

                const hitLeft = bubble.current.x < bubble.current.size;
                const hitRight = bubble.current.x > canvas.width - bubble.current.size;
                const hitTop = bubble.current.y < bubble.current.size;
                const hitBottom = bubble.current.y > canvas.height - bubble.current.size;

                if (hitLeft || hitRight || hitTop || hitBottom) {
                    createBurstEffect();
                }
            }
        };

        const onMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        moveBubble();

        return () => {
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    useEffect(() => {
        // Update bubble size based on the current section
        const newSize = 50 + (currentSection * 20); // 50 is the base size, increase size by 20 for each section
        setBubbleSize(newSize);

        // Update the bubble instance size
        if (bubble.current) {
            bubble.current.size = newSize;
        }
    }, [currentSection]);

    return <canvas ref={canvasRef} className="bubbleCanvas"></canvas>;
};

export default BubbleAnimation;