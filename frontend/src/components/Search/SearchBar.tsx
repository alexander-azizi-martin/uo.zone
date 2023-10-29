import { useState, ChangeEventHandler } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputGroupProps,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

interface SearchBarProps extends InputGroupProps {
  placeholder?: string;
  value: string;
  onChange: (value: any) => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
  ...props
}: SearchBarProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event.target.value);
  };

  return (
    <InputGroup {...props}>
      <InputLeftElement pointerEvents={'none'}>
        <Search2Icon color={'black'} />
      </InputLeftElement>
      <Input
        type={'text'}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        background={'rgba(255,255,255,0.3)'}
        boxShadow={'0px 0px 20px rgba(111, 19, 29, 0.1)'}
        style={{
          borderRadius: '9px',
          border: 'none',
        }}
        _hover={{
          background: 'rgba(255,255,255,0.7)',
          boxShadow: '0px 0px 20px rgba(111, 19, 29, 0.1)',
        }}
        _focus={{
          boxShadow: '0px 0px 20px rgba(111, 19, 29, 0.35)',
          background: 'rgba(255,255,255,0.9)',
        }}
      />
    </InputGroup>
  );
}
