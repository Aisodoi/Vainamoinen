// import { Position, getOutgoers } from "reactflow";
//
// export interface RawNodeProps {
//     id: string;
//     childrenIds: string[];
//     typeId: string;
//     label: string;
// }
//
// export function parseNodes(rawData: RawNodeProps[]) {
//
//     const tree = [];
//     const childOf = {};
//     rawData.forEach((item) => {
//
//     });
//
//     const edges = rawData.map((rdr) => {
//         return
//     })
//
//     const nodes = rawData.map((rdr) => {
//         return {
//             id: '1',
//             type: 'recipeNode',
//             data: {
//               label: 'Input Node',
//               variant: "fancy",
//               color: "cool-green"
//             },
//             position: { x: 0, y: 0 },
//             sourcePosition: Position.Right,
//             targetPosition: Position.Left
//         }
//     })
// }
//
//
// const hierarchy = (rawData: RawNodeProps[]) => {
//     const tree = [];
//     const childOf = {};
//     rawData.forEach((item) => {
//         const { Id, Parent } = item;
//         childOf[Id] = childOf[Id] || [];
//         item.children = childOf[Id];
//         Parent ? (childOf[Parent] = childOf[Parent] || []).push(item) : tree.push(item);
//     });
//     return tree;
// };
