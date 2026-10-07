import { useState } from "react";
import { motion } from "framer-motion";
import type { Photo } from "../types";

// Resting pose for each depth in the stack, and the spread pose on hover.
const REST = [
  { rotate: -3, x: 0, y: 0, scale: 1 },
  { rotate: 5, x: 14, y: -10, scale: 0.95 },
  { rotate: -9, x: -16, y: -18, scale: 0.9 },
];
const FAN = [
  { rotate: -2, x: 0, y: 0, scale: 1 },
  { rotate: 11, x: 70, y: -14, scale: 0.94 },
  { rotate: -13, x: -70, y: -20, scale: 0.9 },
];

/** Stack of polaroid-style photos; click or tap sends the front one to the back. */
interface PhotoStackProps {
  photos: Photo[];
}

export default function PhotoStack({ photos }: PhotoStackProps) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [fanned, setFanned] = useState(false);

  const cycle = () => setOrder(([first = 0, ...rest]) => [...rest, first]);

  return (
    <div
      className="relative mx-auto aspect-[3/4] w-56 sm:w-64 md:w-full md:max-w-[300px]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setFanned(true)}
      onPointerLeave={() => setFanned(false)}
    >
      {order.map((photoIndex, depth) => {
        const photo = photos[photoIndex];
        const pose = (fanned ? FAN : REST)[depth];
        if (!photo || !pose) return null;
        const front = depth === 0;
        return (
          <motion.button
            key={photo.src}
            type="button"
            onClick={cycle}
            tabIndex={front ? 0 : -1}
            aria-label={front ? `${photo.alt}. Show next photo` : undefined}
            aria-hidden={front ? undefined : true}
            className="absolute inset-0 cursor-pointer rounded-2xl bg-white/[0.06] p-2 text-left shadow-2xl shadow-black/60 ring-1 ring-white/10 backdrop-blur"
            style={{ zIndex: photos.length - depth }}
            initial={false}
            animate={pose}
            whileTap={front ? { scale: 0.97 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <img
              src={photo.src}
              alt=""
              loading="lazy"
              draggable="false"
              className="h-full w-full rounded-xl object-cover"
              style={{ objectPosition: photo.position }}
            />
          </motion.button>
        );
      })}
      <p className="absolute -bottom-9 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-stone-400">
        Tap to shuffle
      </p>
    </div>
  );
}
