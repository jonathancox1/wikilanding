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
              (item) =>
                item.title.toLowerCase().includes(term) ||
                item.content.toLowerCase().includes(term)
            ),
      [term]
    );
  }

  const results = useFindMatch(term);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTerm(event.target.value.toLowerCase());

  return (
    <div style={{ margin: "auto auto 25px" }}>
      <Combobox aria-label="Wiki">
        <ComboboxInput
          className="wiki-search-input"
          onChange={handleChange}
          placeholder="search..."
          style={{ maxWidth: "500px", minWidth: "200px" }}
        />
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
