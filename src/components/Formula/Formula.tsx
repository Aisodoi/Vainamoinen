import { Handle, Position } from 'reactflow';
import styles from "./Map.module.css";


interface Props {
  data: any
}

export function Formula(props: Props) {
  const { data } = props;
  
  return (
    <>
      <div className={styles.root}>
        {data.label}
      </div>
 
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}

Formula.displayName = "Formula";

// const getStyle = (scheme: MapProps["variant"] = "info") => {
//   return {
//     info: styles.Map__info,
//     danger: styles.Map__danger,
//     warning: styles.Map__warning,
//     success: styles.Map__success,
//   }[scheme];
// };
