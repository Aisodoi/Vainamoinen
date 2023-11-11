import { Position } from "reactflow";
import { RecipeProps } from "../components/Recipe/Recipe";

export const nodes: RecipeProps[] =  [
    {
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
    },
    
    {
      id: '2',
      type: 'recipeNode',
      // you can also pass a React component as a label
      data: { 
        label: "Default Node",
        variant: "solid",
        color: "orange",
      },
      position: { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    },
    {
      id: '3',
      type: 'recipeNode',
      data: {
        label: 'Output Node',
        variant: "fancy",
        color: "cool-green"
      },
      position: { x: 250, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    },
  ];
  