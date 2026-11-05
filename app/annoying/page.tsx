"use client";
import { useLayoutEffect } from "react";
import "./annoying.scss";

export default function Home() {
  const JUMP_DISTANCE = 2;
  let boxVX = 0;
  let boxVY = 0;
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

    const moveRedBox = (e) => {
      if (!redBox || !cursor) return;
      const boxLocation = redBox.getBoundingClientRect();
      const cursorLocation = cursor.getBoundingClientRect();

      const halfBoxHeight = (boxLocation.height / 2);
      const halfBoxWidth = (boxLocation.width / 2);
      const leftSide = cursorLocation.right >= boxLocation.left && cursorLocation.right < (boxLocation.left + halfBoxWidth);
      const rightSide = cursorLocation.left <= boxLocation.right && cursorLocation.left > (boxLocation.right - halfBoxWidth);
      const topSide = cursorLocation.bottom >= boxLocation.top && cursorLocation.bottom < (boxLocation.top + halfBoxHeight);
      const bottomSide = cursorLocation.top <= boxLocation.bottom && cursorLocation.top > (boxLocation.bottom - halfBoxHeight)
      const insideLeftAndRight = cursorLocation.left >= boxLocation.left && cursorLocation.right <= boxLocation.right;
      const insideTopAndBottom = cursorLocation.top >= boxLocation.top && cursorLocation.bottom <= boxLocation.bottom;

      const leftEdgeContact = leftSide && insideTopAndBottom;
      const rightEdgeContact = rightSide && insideTopAndBottom;
      const topEdgeContact = topSide && insideLeftAndRight;
      const bottomEdgeContact = bottomSide && insideLeftAndRight;

      const currentLeft = parseInt(redBox.style.left) || redBox.offsetLeft;
      const currentTop = parseInt(redBox.style.top) || redBox.offsetTop;

      if (leftEdgeContact) {
        redBox.style.left = `${currentLeft + JUMP_DISTANCE}px`;
      } else if (rightEdgeContact) {
        redBox.style.left = `${currentLeft - JUMP_DISTANCE}px`;
      } else if (topEdgeContact) {
        redBox.style.top = `${currentTop + JUMP_DISTANCE}px`;
      } else if (bottomEdgeContact) {
        redBox.style.top = `${currentTop - JUMP_DISTANCE}px`;
      }

      goalLineCheck(boxLocation);
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousemove', moveRedBox)
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