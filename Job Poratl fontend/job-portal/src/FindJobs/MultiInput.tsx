/* eslint-disable react-hooks/set-state-in-effect */
import { Checkbox, Combobox, Group, Pill, PillsInput, useCombobox } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateFilter } from '../Slices/filtersSlice';
import { updateJobFilter } from '../Slices/jobFiltersSlice';

type Props = {
  title?: string;
  option?: string[];
  options?: string[];
  icon?: React.ElementType;
  filterType?: 'talent' | 'job';
};

const MultiInput = (props: Props) => {
  const dispatch = useDispatch();
  const title = props.title ?? 'Select';
  const Icon = props.icon ?? IconSearch;
  const filterType = props.filterType ?? 'talent';

  const [search, setSearch] = useState('');
  
  // LOẠI BỎ DUPLICATE NGAY TỪ ĐẦU
  const [data, setData] = useState<string[]>(() => {
    const rawData = props.option ?? props.options ?? [];
    return Array.from(new Set(rawData)).filter(Boolean);
  });
  
  const [value, setValue] = useState<string[]>([]);

  // CẬP NHẬT VỚI UNIQUE CHECK
  useEffect(() => {
    const rawData = props.option ?? props.options ?? [];
    const uniqueData = Array.from(new Set(rawData)).filter(Boolean);
    setData(uniqueData);
  }, [props.option, props.options]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const exactOptionMatch = data.some((item) => item.toLowerCase() === search.trim().toLowerCase());

  const handleValueSelect = (val: string) => {
    setSearch('');
    if (val === '$create') {
      const created = search.trim();
      if (!created) return;
      
      //  KIỂM TRA DUPLICATE TRƯỚC KHI THÊM
      if (data.includes(created)) {
        // Nếu đã tồn tại, chỉ add vào value
        const newValue = value.includes(created) ? value : [...value, created];
        setValue(newValue);
        
        if (filterType === 'job') {
          dispatch(updateJobFilter({ [title]: newValue }));
        } else {
          dispatch(updateFilter({ [title]: newValue }));
        }
        return;
      }
      
      setData((current) => [...current, created]);
      setValue((current) => [...current, created]);
      
      if (filterType === 'job') {
        dispatch(updateJobFilter({ [title]: [...value, created] }));
      } else {
        dispatch(updateFilter({ [title]: [...value, created] }));
      }
    } else {
      const newValue = value.includes(val) 
        ? value.filter((v) => v !== val) 
        : [...value, val];
      
      setValue(newValue);
      
      if (filterType === 'job') {
        dispatch(updateJobFilter({ [title]: newValue }));
      } else {
        dispatch(updateFilter({ [title]: newValue }));
      }
    }
  };

  const handleValueRemove = (val: string) => {
    const newValue = value.filter((v) => v !== val);
    setValue(newValue);
    
    if (filterType === 'job') {
      dispatch(updateJobFilter({ [title]: newValue }));
    } else {
      dispatch(updateFilter({ [title]: newValue }));
    }
  };

  const values = value.slice(0, 1).map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  // SỬ DỤNG USEMEMO ĐỂ TỐI ƯU PERFORMANCE
  const options = useMemo(() => {
    return data
      .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
      .map((item) => (
        <Combobox.Option value={item} key={item} active={value.includes(item)}>
          <Group gap="sm">
            <Checkbox
              size="xs"
              color="cyan"
              checked={value.includes(item)}
              onChange={() => {}}
              aria-hidden
              tabIndex={-1}
              style={{ pointerEvents: 'none' }}
            />
            <span className="text-mine-shaft-300">{item}</span>
          </Group>
        </Combobox.Option>
      ));
  }, [data, search, value]);

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput
          variant="unstyled"
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          leftSection={
            <div className="text-cyan-400 p-1 bg-mine-shaft-900 rounded-full">
               {Icon && <Icon size={20} />}
            </div>
          }
        >
          <Pill.Group>
            {value.length > 0 ? (
              <>
                {values}
                {value.length > 1 && <Pill>+{value.length - 1} more</Pill>}
              </>
            ) : (
              <Pill
                classNames={{
                  label: 'text-mine-500 text-xl font-semibold',
                }}
                style={{ border: 'none', background: 'transparent' }}
              >
                {title}
              </Pill>
            )}
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={`Search ${title}`}
        />
        <Combobox.Options>
          {options}

          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}

          {options.length === 0 && search.trim().length === 0 && (
            <Combobox.Empty>No options</Combobox.Empty>
          )}

          {options.length === 0 && search.trim().length > 0 && (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default MultiInput;