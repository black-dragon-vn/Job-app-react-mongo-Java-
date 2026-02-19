import { Combobox, useCombobox } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux'; 
import { updateJobSort, updateTalentSort } from '../Slices/SortSlice';

const jobOptions = ['Relevance', 'Most Recent', 'Salary (Low to High)', 'Salary (High to Low)'];
const talentOptions = ['Relevance', 'Most Recent', 'Experience (Low to High)', 'Experience (High to Low)'];

interface SortProps {
    sort: 'job' | 'talent';
}

const Sort = ({ sort }: SortProps) => {
    const dispatch = useDispatch();
    const selectedItem = useSelector((state: any) => 
        sort === 'job' ? state.sort.jobSort : state.sort.talentSort
    );
    
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const optionsList = sort === 'job' ? jobOptions : talentOptions;
    
    const options = optionsList.map((item) => (
        <Combobox.Option value={item} key={item} className='!text-xs'> 
            {item}
        </Combobox.Option>
    ));

    const handleSelect = (val: string) => {
        if (sort === 'job') {
            dispatch(updateJobSort(val));
        } else {
            dispatch(updateTalentSort(val));
        }
        combobox.closeDropdown();
    };

    return (
        <Combobox
            store={combobox}
            width={180}
            position="bottom-start"
            onOptionSubmit={handleSelect}
        >
            <Combobox.Target>
                <div 
                    onClick={() => combobox.toggleDropdown()} 
                    className='border border-cyan-400 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-cyan-900/10 transition'
                >
                    <span className='text-sm font-medium'>{selectedItem || "Relevance"}</span>
                    <IconAdjustments size={18} className='text-cyan-400'/>
                </div>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

export default Sort;