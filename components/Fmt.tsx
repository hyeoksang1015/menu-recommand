import { Fragment, type ReactNode } from "react";

// fmt()의 React판: "{count}개" 같은 틀에 <strong> 같은 요소를 끼워 넣는다.
export default function Fmt({
  template,
  values,
}: {
  template: string;
  values: Record<string, ReactNode>;
}) {
  return template
    .split(/\{(\w+)\}/)
    .map((part, i) => (
      <Fragment key={i}>{i % 2 ? values[part] : part}</Fragment>
    ));
}
