import React, { FC, useEffect, useRef, useState } from "react";

interface IGroupHeaderTabProps {
  tabs: Array<string>;
  onChange?: (index: number) => void;
}

const GroupHeaderTab: FC<IGroupHeaderTabProps> = ({ tabs, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el) {
      setUnderlineStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeIndex]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange?.(index);
  };

  return (
    <div className="relative mb-3.5 w-full border-b-[0.5px] border-[#BDBDBD]">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleClick(index)}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${
              activeIndex === index
                ? "text-[var(--co-link-text)]"
                : "text-[rgba(127,127,127,1)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className="absolute bottom-0 h-[3px] bg-[#A8F4EC] transition-all duration-300"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </div>
  );
};

export default GroupHeaderTab;
