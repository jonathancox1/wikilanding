import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import React, { useMemo } from "react";
import { data } from "./searchData";
import { Option } from "./Option";

export const Search = () => {
  const [term, setTerm] = React.useState("");

  function useFindMatch(term: string) {
    return useMemo(
      () =>
        term.trim() === "" || term.trim().length < 3
          ? null
          : data.filter(
              (item) => item.title.includes(term) || item.content.includes(term)
            ),
      [term]
    );
  }

  const results = useFindMatch(term);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTerm(event.target.value);

  return (
    <div>
      <Combobox aria-label="Wiki" onSelect={(value) => alert(value)}>
        <ComboboxInput className="wiki-search-input" onChange={handleChange} />
        {results && (
          <ComboboxPopover className="shadow-popup">
            {results.length > 0 ? (
              <ComboboxList persistSelection>
                {results.slice(0, 10).map((result, index) => (
                  <ComboboxOption
                    key={index}
                    value={`${result.title}, ${result.content}`}
                    onClick={() => (window.location.href = `${result.url}`)}
                  >
                    <Option term={term} />
                    in Title: <b>{result.title}</b>
                    <hr />
                  </ComboboxOption>
                ))}
              </ComboboxList>
            ) : (
              <span style={{ display: "block", margin: 8 }}>
                No results found
              </span>
            )}
          </ComboboxPopover>
        )}
      </Combobox>
    </div>
  );
};
