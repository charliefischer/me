"use client";
import { useLayoutEffect } from "react";
import "./annoying.scss";

export default function Home() {
  let mouseX = 0;
  let mouseY = 0;
  let boxX = 0;
  let boxY = 0;
  let boxVX = 0;
  let boxVY = 0;
  let animationFrameId: null;;
  useLayoutEffect(() => {
    const cursor = document.querySelector('.cursor');
    const redBox = document.querySelector('.red-box');
  
    const moveCursor = (e)=> {
      const { clientX, clientY } = e;
      if (cursor) {
        cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    }

    const goalLineCheck = (box: object) => {
      const goal = document.querySelector('.goal');

      if (!goal) return;
      const leftPost = goal.querySelector('.post-left');
      const rightPost = goal.querySelector('.post-right');

      if (!leftPost || !rightPost) return ;
      const goalLine = goal.getBoundingClientRect().top;
      const leftEdge = leftPost.getBoundingClientRect().right;
      const rightEdge = rightPost.getBoundingClientRect().left;

      if (box.bottom < goalLine && box.left > leftEdge && box.right < rightEdge) {
        const goalIndicator = document.querySelector('.goal-indicator');
        if (goalIndicator && goalIndicator.style.display != 'block') {
          goalIndicator.style.display = 'block';
        }
      }      
    }
    
    const initialRect = redBox.getBoundingClientRect();
    boxX = initialRect.left;
    boxY = initialRect.top;

    const moveRedBox = (e) => {
      if (!redBox || !cursor) return;


      const boxRect = redBox.getBoundingClientRect();
    
      const boxCenterX = boxRect.left + boxRect.width / 2;
      const boxCenterY = boxRect.top + boxRect.height / 2;
      
      const dx = boxCenterX - mouseX;
      const dy = boxCenterY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = (boxRect.width / 2) + 20;

      if (distance < hitRadius) {
        // Push the box away proportional to how close/fast the cursor hit it
        boxVX += (dx / distance) * 2;
        boxVY += (dy / distance) * 2;
      }

      boxVX *= 0.90;
      boxVY *= 0.90;

      boxX += boxVX;
      boxY += boxVY;

      // Apply new positions
      redBox.style.left = `${boxX}px`;
      redBox.style.top = `${boxY}px`;

      goalLineCheck(boxRect);
      animationFrameId = requestAnimationFrame(moveRedBox);
    }
    animationFrameId = requestAnimationFrame(moveRedBox);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    });
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(animationFrameId);
    }
  }, [])


  return (
    <div>
      <div className="cursor"></div>
      <div className="goal">
        <div className="post post-left" /><div className="post post-right" />
      </div>
      <div className="red-box"></div>
      <div className="goal-indicator">GOAL!</div>
    </div>
  )
}