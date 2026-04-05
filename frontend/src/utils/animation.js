// GSAP动画封装
import gsap from 'gsap'

// 页面入场动画
export function pageEnterAnimation(element) {
  gsap.fromTo(element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
  )
}

// 卡片hover动画
export function cardHoverAnimation(element, isHover) {
  gsap.to(element, {
    scale: isHover ? 1.02 : 1,
    duration: 0.3,
    ease: 'power2.out'
  })
}

// 成就弹出动画
export function achievementPopupAnimation(element) {
  const tl = gsap.timeline()
  tl.fromTo(element,
    { opacity: 0, scale: 0.5, y: 50 },
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
  )
  .to(element, {
    opacity: 0,
    y: -30,
    duration: 0.3,
    delay: 2,
    ease: 'power2.in',
    onComplete: () => {
      element.style.display = 'none'
    }
  })
}

// 宠物互动动画
export function petInteractAnimation(element) {
  gsap.to(element, {
    y: -20,
    duration: 0.3,
    yoyo: true,
    repeat: 3,
    ease: 'power2.out'
  })
}

// 按钮点击波纹效果
export function buttonRipple(event, element) {
  const rect = element.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const ripple = document.createElement('span')
  ripple.style.cssText = `
    position: absolute;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    left: ${x}px;
    top: ${y}px;
    width: 100px;
    height: 100px;
    margin-left: -50px;
    margin-top: -50px;
  `
  
  element.appendChild(ripple)
  
  gsap.to(ripple, {
    scale: 4,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => ripple.remove()
  })
}

// 产线设备动画
export function deviceAnimation(element, type, duration = 1) {
  switch (type) {
    case 'move':
      return gsap.to(element, { x: '+=100', duration, ease: 'power2.inOut' })
    case 'rotate':
      return gsap.to(element, { rotation: '+=90', duration, ease: 'power2.inOut' })
    case 'grab':
      return gsap.to(element, { scale: 0.8, duration: 0.3, yoyo: true, repeat: 1 })
    case 'up':
      return gsap.to(element, { y: '-=50', duration: 0.5, ease: 'power2.out' })
    case 'down':
      return gsap.to(element, { y: '+=50', duration: 0.5, ease: 'power2.out' })
    default:
      return null
  }
}

// 数字滚动动画
export function numberRollAnimation(element, targetValue, duration = 1) {
  const obj = { value: 0 }
  gsap.to(obj, {
    value: targetValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value)
    }
  })
}
