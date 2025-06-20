import clsx from "clsx";
import * as React from "react";

import styles from "./flexible-sider.module.scss";

const FlexibleSider = ({
  needHidden,
  children,
  wrapClassName,
}: {
  needHidden: boolean;
  wrapClassName?: string;
  children: React.ReactNode;
}) => (
  <aside
    className={clsx(
      "relative bg-white dark:text-white",
      { "max-[600px]:hidden": needHidden },
      { "max-[600px]:!max-w-none max-[600px]:!basis-full": !needHidden },
      "rounded-r-[12px] border-r-[1px] border-t-[1px] border-[#EDEDED]",
    )}
  >
    <div
      className={`absolute bottom-0 left-0 right-[1px] top-0 z-10 overflow-hidden rounded-r-[12px] ${
        wrapClassName ?? ""
      }`}
    >
      {children}
    </div>
    <div className={styles.sider_resize}></div>
  </aside>
);

export default FlexibleSider;
