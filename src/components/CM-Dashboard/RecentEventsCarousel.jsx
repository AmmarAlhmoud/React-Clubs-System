import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RecentEventItem from "./RecentEventItem";
import styles from "./RecentEventsCarousel.module.css";

const RecentEventsCarousel = ({ items }) => {
  const [idx, setIdx] = useState(0);
  const max = items.length;

  const prev = () => setIdx((i) => (i - 1 + max) % max);
  const next = () => setIdx((i) => (i + 1) % max);

  return (
    <div className={styles.wrapper}>
      <button onClick={prev} className={`${styles.nav} ${styles.left}`}>
        <FaChevronLeft size={12} />
      </button>

      <div
        className={styles.slider}
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === idx ? styles.active : ""}`}
          >
            <RecentEventItem
              key={i}
              item={{
                clubName: item?.clubName,
                clubIcon: item?.clubIcon,
                event: { ...item },
              }}
            />
          </div>
        ))}
      </div>

      <button onClick={next} className={`${styles.nav} ${styles.right}`}>
        <FaChevronRight size={12} />
      </button>

      <div className={styles.dots}>
        {items.map((_, i) => (
          <span
            key={i}
            className={`${styles.dotIndicator} ${
              i === idx ? styles.current : ""
            }`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentEventsCarousel;
