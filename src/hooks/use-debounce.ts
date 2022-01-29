import {useState, useEffect} from 'react';

let timer: any;

const useDebounce = (setQuery: (value: string) => any) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Debounce input
    clearTimeout(timer);
    timer = setTimeout(() => {
      setValue(value);
      setQuery(value);
    }, 600);
  }, [value]);

  return {
    value: value,
    setValue: setValue,
  };
};

export default useDebounce;
