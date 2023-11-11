import React from "react";
import { Resource } from "../experiments/resources";

type StepContentProps = {
  resource: Resource;
}
export const StepContent: React.FC<StepContentProps> = ({ resource }) => {
  return (
    <span>{resource.kind?.state.name ?? resource.state.kind}</span>
  );
};
