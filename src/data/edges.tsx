import { DefaultStepProps, SmoothStepStepProps, BezierEdgeStepProps } from "../components/Step/Step";

// This probably has a types problem, but non breaking (shouldn't be)
export const edges: [DefaultStepProps | SmoothStepStepProps | BezierEdgeStepProps] =  [
  { id: 'e1-2', source: '1', target: '2', type:"stepEdge", variant: "solid", color: "red"},
  { id: 'e2-3', source: '2', target: '3', type:"stepEdge", animated: true, variant: "solid", color: "green" },
];
  