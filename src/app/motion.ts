import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, ScrollToPlugin)

export { gsap, Flip, ScrollTrigger, ScrollToPlugin, SplitText, useGSAP }

export const motion = {
  duration: { quick: 0.3, reveal: 0.6, scene: 1.0, feature: 1.4 },
  ease: { reveal: 'power3.out', scene: 'expo.inOut', soft: 'power2.out' },
  stagger: { words: 0.045, cards: 0.1 },
  distance: { small: 12, medium: 32, large: 64 },
} as const
