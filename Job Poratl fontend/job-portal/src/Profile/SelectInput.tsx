import { Combobox, InputBase, ScrollArea, useCombobox } from '@mantine/core';
import { useEffect, useState } from 'react';

interface SelectInputProps {
    placeholder: string;
    label: string;
    options?: string[];
    leftSection?: React.ReactNode;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
}

const SelectInput = (props: SelectInputProps) => {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        setData(props.options || []);
    }, [props.options]);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [data, setData] = useState<string[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const exactOptionMatch = data.some((item) => item === search);
    const filteredOptions = exactOptionMatch
        ? data
        : data.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()));

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
                    props.onChange?.(search);
                } else {
                    setValue(val);
                    setSearch(val);
                    props.onChange?.(val);
                }

                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <InputBase withAsterisk className='[&_input]:bg-mine-shaft-900 [&_input]:text-mine-shaft-100 [&_input]:placeholder:text-mine-shaft-500[&_input]:border-mine-shaft-700  [&_input]:focus:[&_input]:border-cyan-400'
                    label={props.label || "prop"}
                    leftSection={props.leftSection} 
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
                        {!exactOptionMatch && search.trim().length > 0 && (
                            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
                        )}
                    </ScrollArea.Autosize>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
export default SelectInput;