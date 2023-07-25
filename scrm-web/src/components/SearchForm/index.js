import React, { useState, useEffect, Fragment, useRef, useMemo } from "react";
import { Form, Button, Col, Row, Input, DatePicker, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import cls from "classnames";
import { uniqueId } from "lodash";

import GroupOwnerSelect from "components/GroupOwnerSelect";
import CustomerSelect from "components/CustomerSelect";
import styles from "./index.module.less";

const renderFormItem = (data) => {
  const { formItemProps = {} } = data;
  if (typeof data.render === "function") {
    return data.render(data);
  }
  const renderFormItemChild = () => {
    if (typeof data.renderEle === "function") {
      return data.renderEle(data);
    }
    return data.renderEle;
  };
  return (
    <Form.Item name={data.name} label={data.label} {...formItemProps}>
      {typeof data.renderEle === "undefined"
        ? renderFormItemEle(data)
        : renderFormItemChild()}
    </Form.Item>
  );
};
const disabledDate = (currentDate) => {
  const today = moment();
  return today.isBefore(currentDate);
};

const renderFormItemEle = (data) => {
  const { eleProps } = data;
  if (data.type === "select") {
    return <Select placeholder="全部" allowClear={true} {...eleProps} />;
  }
  if (data.type === "userSelect") {
    return <GroupOwnerSelect {...eleProps} />;
  }
  if (data.type === "customerSelect") {
    return <CustomerSelect {...eleProps} />;
  }
  if (data.type === "rangTime") {
    return (
      <DatePicker.RangePicker
        allowClear={true}
        disabledDate={disabledDate}
        style={{ width: "100%" }}
        {...eleProps}
      />
    );
  }
  if (data.type === "date") {
    const _disabledDate = data.disabledDate ? disabledDate : false;
    return (
      <DatePicker
        placeholder="请选择日期"
        allowClear={true}
        disabledDate={_disabledDate}
        {...eleProps}
      />
    );
  }

  // 默认为input
  return <Input placeholder="请输入" allowClear={true} {...eleProps} />;
};

/**
 *
 * @param {Array<Object>} configList
 * * @param {string} type
 * * @param {function} render 表示自定义整个formItem
 * * @param {function} renderEle 自定义formItem内的元素
 * * @param {object} formItemProps
 * * @param {object} eleProps
 * @param {Boolean} enableEnterQuery 启用回车查询,默认启用
 */
const SearchFormContent = ({
  children,
  configList,
  onSearch,
  onReset,
  wrapStyle,
  enableEnterQuery = true,
  colCount: wrapColCount,
  ...rest
}) => {
  const [hide, setHide] = useState(false);
  const formName = useRef(uniqueId("formname_"));
  const [containerWidth, setContainerWidth] = useState(1000)
  const containerRef = useRef(null);

  const handlePress = (e) => {
    if (
      e.charCode === 13 &&
      typeof onSearch === "function" &&
      enableEnterQuery
    ) {
      onSearch();
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handlePress);
    return () => {
      window.removeEventListener("keypress", handlePress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableEnterQuery]);

  useEffect(() => {
    handleSize()
    window.addEventListener('resize', handleSize)
    return() => {
      window.removeEventListener('resize', handleSize)
    }
  }, [])

  const handleSize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth + 300)
    }
  }

  const onChangeHide = () => {
    setHide((v) => !v);
  };

  const getColByContainerWidth = (containerWidth, wrapColCount) => {
    if (wrapColCount) {
      return wrapColCount;
    }
    let colCount = 3;
    if (containerWidth >= 1600) {
      colCount = 4;
    } else if (containerWidth >= 1200 && containerWidth < 1600) {
      colCount = 3;
    } else if (containerWidth >= 768 && containerWidth < 1200) {
      colCount = 2;
    } else {
      colCount = 1;
    }
    return colCount;
  };

  const { colCount, colSpan } = useMemo(() => {
    const colCount = getColByContainerWidth(containerWidth, wrapColCount)
    return {
      colCount,
      colSpan: 24 / colCount,
    };
  }, [containerWidth, wrapColCount]);

  const childrenCount = useMemo(() => {
    return Array.isArray(children)
      ? children.length
      : Array.isArray(configList)
      ? configList.length
      : 0;
  }, [configList, children]);

  const maxRow = Math.ceil((childrenCount + 1) / colCount);
  const remainColCount = maxRow * colCount - childrenCount - 1;
  const mode = "auto";

  const renderChild = (childItem, childIdx) => {
    const colIdx = childIdx + 1;
    const isLast = childIdx === childrenCount - 1;
    const span = colIdx < colCount ? colSpan : !hide ? 0 : colSpan;
    const shouldFillEmptyItem =
      mode === "right" && isLast && remainColCount > 0;
    return (
      <Fragment key={childIdx}>
        <Col span={span} className={styles["search-col"]}>
          {childItem}
        </Col>
        {shouldFillEmptyItem
          ? new Array(remainColCount)
              .fill(1)
              .map((ele, idx) => (
                <Col
                  span={span}
                  key={idx}
                  className={styles["search-col"]}
                ></Col>
              ))
          : null}
      </Fragment>
    );
  };

  const renderByConfigList = (itemList) => {
    if (Array.isArray(itemList)) {
      return itemList.map((ele, idx) => renderChild(renderFormItem(ele), idx));
    } else {
      return null;
    }
  };

  return (
    <div
      style={wrapStyle}
      className={styles["search-form-container"]}
      ref={(r) => {
        containerRef.current = r;
      }}
    >
      <Form layout="inline" name={formName.current} {...rest}>
        <Row style={{ width: "100%" }}>
          {children
            ? React.Children.map(children, renderChild)
            : renderByConfigList(configList)}
          <Col
            span={colSpan}
            className={cls({
              [styles[`serach-col-mode-${mode}`]]: true,
              [styles["serach-btn-col"]]: true,
              [styles["search-col"]]: true,
            })}
          >
            <Form.Item>
              <Button
                type="primary"
                className={styles.searchBtn}
                onClick={onSearch}
              >
                查询
              </Button>
              <Button className={styles.searchBtn} onClick={onReset}>
                重置
              </Button>
              {maxRow > 1 && (
                <span onClick={onChangeHide} className={styles["hide-text"]}>
                  {hide ? "收起" : "展开"}
                  <DownOutlined
                    className={cls({
                      [styles["hide-arrow"]]: hide,
                    })}
                  />
                </span>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchFormContent;