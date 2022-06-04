/**
 * เรา import useMemo มาช่วยเรื่องการเรียกใช้ซ้ำ
 * ปัญหาของมันมาจาก code-cell component ตรง useEfffect คือตัว createBundle มันจะ
 * เรียกตัวเองใหม่เรื่อย ๆ เพราะทุกครั้งที่มันเรียกมันจะได้ createBundle ตัวใหม่มาเรื่อย ๆ ทำให้
 * ตัว useEffect มันเลยยทำงานวนเรื่อย ๆ ดังนั้นเราจะใช้ตัว useMemo เพื่อมาเก็บ cache ของฟังก์ชันเอาไว้
 * จากนั้นก้เอามันไปเรียกใช้
 */
import { useMemo } from "react";

import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux";

export const useActions = () => {
  const dispatch = useDispatch();

  // ก่อนใช้ useMemo
  // return bindActionCreators(actionCreators, dispatch);

  // ใช้ useMemo
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
