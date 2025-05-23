import React from "react";
import {
  Result,
  ResultContainerProps,
  ResultViewProps
} from "@elastic/react-search-ui-views";
import { useSearch } from "../hooks";

const ResultContainer = ({
  result,
  shouldTrackClickThrough = true,
  clickThroughTags = [],
  view,
  ...rest
}: ResultContainerProps) => {
  const { trackClickThrough } = useSearch();

  const handleClickLink = (id: string) => {
    if (shouldTrackClickThrough) {
      trackClickThrough(id, clickThroughTags);
    }
  };
  const View = view || Result;
  const id = result.id.raw;
  const viewProps: ResultViewProps = {
    result: result,
    key: `result-${id}`,
    onClickLink: () => handleClickLink(id),
    ...rest
  };

  return <View {...viewProps} />;
};

export default ResultContainer;
