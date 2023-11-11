import { Position } from "reactflow";

export interface RawNodeProps {
    id: string;
    childrenIds: string[];
    typeId: string;
    label: string;
}

export function parseNodes(rawData: RawNodeProps[]) {
    const nodes = rawData.map((rd) => {
        return {
            id: '1',
            type: 'recipeNode',
            data: {
              label: 'Input Node',
              variant: "fancy",
              color: "cool-green"
            },
            position: { x: -250, y: 0 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
        }
    })
}