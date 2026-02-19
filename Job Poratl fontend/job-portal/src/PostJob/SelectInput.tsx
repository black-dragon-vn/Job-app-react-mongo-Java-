import { Combobox, InputBase, ScrollArea, useCombobox } from '@mantine/core';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectInput = (props: any) => {
    useEffect(() => {
      // eslint-disable-next-line react-hooks/immutability
      setData(props.options || []);
      // eslint-disable-next-line react-hooks/immutability
      setSearch(props.form.values[props.name || 'prop'] || '');
      // eslint-disable-next-line react-hooks/immutability
      setValue(props.form.values[props.name || 'prop'] || '');
    }, [props.options, props.form.values, props.name]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [data, setData] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const exactOptionMatch = data.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) => item.toLowerCase().includes(search?.toLowerCase().trim()));

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          setData((current) => [...current, search]);
          setValue(search);
          props.form.setFieldValue(props.name || 'prop', search);
        } else {
          setValue(val);
          setSearch(val);
          props.form.setFieldValue(props.name || 'prop', val);
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase withAsterisk className='[&_input]:bg-mine-shaft-900, [&_input]:text-mine-shaft-100 [&_input]:placeholder:text-mine-shaft-500.[&_input]:border-mine-shaft-700  [&_input]:focus:[&_input]:border-cyan-400'
          {...props.form.getInputProps(props.name || 'prop', {
            type: 'input',
          })}
          label={props.label || "prop"}
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || '');
          }}
          placeholder={props.placeholder || "Search value"}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
        <ScrollArea.Autosize style={{ maxHeight: 200 }} type="scroll">
          {options}
          {!exactOptionMatch && search?.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}
         </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
export default SelectInput;