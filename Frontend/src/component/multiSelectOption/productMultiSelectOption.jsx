import React from "react";
import { Select } from "antd";
const { Option } = Select;

const MultiSelectOption = ({
  heading,
  values,
  setValues,
  subCategory,
  subCategoryOption,
  showSubCategories,
  subCategoryArray,
  setSubCategoryArray,
}) =>
  showSubCategories && (
    <div>
      <label>{heading}</label>
      <Select
        mode="multiple"
        className="container-fluid bg-secondary text-black"
        placeholder="Please Select"
        value={subCategoryArray ? subCategoryArray : subCategory}
        onChange={(value) =>
          subCategoryArray
            ? setSubCategoryArray(value)
            : setValues({ ...values, subCategory: value })
        }
      >
        {subCategoryOption.length &&
          subCategoryOption.map((el) => (
            <Option key={el._id} value={el._id}>
              {el.name}
            </Option>
          ))}
      </Select>
      {/* {JSON.stringify(subCategoryArray.map(el=>el.name))} */}
    </div>
  );

export default MultiSelectOption;
