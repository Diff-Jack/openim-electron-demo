import "./index.scss";

import { Input, InputProps } from "antd";

import SearchIcon from "@/assets/images/searchbar/search.png";

const Searchbar = (props: InputProps) => {
  return (
    <Input
      prefix={<img width="20" src={SearchIcon} alt="" />}
      allowClear
      {...props}
      className={`searchbar ${props.className || ""}`}
    />
  );
};

export default Searchbar;
