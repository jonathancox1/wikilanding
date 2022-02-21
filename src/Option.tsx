import React from "react";

import { useComboboxOptionContext } from "@reach/combobox";

export const Option = ({ term }: any) => {
  const { value } = useComboboxOptionContext();
  const lengthVal = 15;

  const indexOfTerm = value.indexOf(term);

  const justTheTerm = value.slice(indexOfTerm, indexOfTerm + term.length);

  const afterTerm = value.slice(
    indexOfTerm + term.length,
    indexOfTerm + term.length + lengthVal
  );

  return (
    <div>
      <b>{justTheTerm}</b>
      {afterTerm}
      ...
    </div>
  );
};
