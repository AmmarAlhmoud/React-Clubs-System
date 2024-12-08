import { motion } from "framer-motion";
import styles from "./BarLoader.module.css";

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

const BarLoader = (props) => {
  const {
    dashboard,
    requests,
    events,
    clubPage,
    form,
    noReq,
    noItemWeekly,
    noItemWeeklyCl,
    noItemWeeklyST,
  } = props;

  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className={`${styles.container} ${dashboard ? styles.dashboard : ""} ${
        requests ? styles.requests : ""
      } ${events ? styles.events : ""} ${clubPage ? styles.clubPage : ""} ${
        form ? styles.form : ""
      } ${noReq ? styles.noReq : ""} ${
        noItemWeekly ? styles.noItemWeekly : ""
      } ${noItemWeeklyCl ? styles.noItemWeeklyCl : ""} ${
        noItemWeeklyST ? styles.noItemWeeklyST : ""
      } `}
    >
      <motion.div variants={variants} className={styles.bar} />
      <motion.div variants={variants} className={styles.bar} />
      <motion.div variants={variants} className={styles.bar} />
      <motion.div variants={variants} className={styles.bar} />
      <motion.div variants={variants} className={styles.bar} />
    </motion.div>
  );
};

export default BarLoader;
